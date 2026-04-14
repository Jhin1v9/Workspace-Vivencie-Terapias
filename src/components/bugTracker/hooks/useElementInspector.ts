/**
 * 🔍 useElementInspector Hook
 * Hook para inspecionar elementos DOM ao passar o mouse
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { InspectedElement } from '../types/bugTracker.types';
import { inspectElement, findElementAtPosition } from '../utils/elementInspector';

interface UseElementInspectorOptions {
  isActive: boolean;
  onElementHover?: (element: InspectedElement | null) => void;
  onElementClick?: (element: InspectedElement) => void;
}

interface UseElementInspectorReturn {
  /** Elemento atualmente sob o mouse */
  hoveredElement: InspectedElement | null;
  /** Posição do mouse */
  mousePosition: { x: number; y: number };
  /** Se está inspecionando */
  isInspecting: boolean;
  /** Elemento DOM atual */
  hoveredDomElement: Element | null;
}

export function useElementInspector({
  isActive,
  onElementHover,
  onElementClick,
}: UseElementInspectorOptions): UseElementInspectorReturn {
  const [hoveredElement, setHoveredElement] = useState<InspectedElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredDomElement, setHoveredDomElement] = useState<Element | null>(null);

  // Refs para controle de throttle
  const lastInspectTime = useRef(0);
  const throttleDelay = 50; // ms

  // Handler de movimento do mouse
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isActive) return;

      setMousePosition({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      if (now - lastInspectTime.current < throttleDelay) {
        return;
      }
      lastInspectTime.current = now;

      const element = findElementAtPosition(e.clientX, e.clientY);

      if (element) {
        if (element.tagName === 'BODY' || element.tagName === 'HTML') {
          setHoveredElement(null);
          setHoveredDomElement(null);
          onElementHover?.(null);
          return;
        }

        if (element.closest('[data-bug-tracker="true"]')) {
          return;
        }

        const inspected = inspectElement(element);
        setHoveredElement(inspected);
        setHoveredDomElement(element);
        onElementHover?.(inspected);
      } else {
        setHoveredElement(null);
        setHoveredDomElement(null);
        onElementHover?.(null);
      }
    },
    [isActive, onElementHover]
  );

  // Handler de clique (capture phase para interceptar antes dos elementos interativos)
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!isActive || !hoveredElement) return;

      e.preventDefault();
      e.stopPropagation();

      onElementClick?.(hoveredElement);
    },
    [isActive, hoveredElement, onElementClick]
  );

  // Handler para tecla ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.key === 'Escape') {
        if (hoveredElement) {
          setHoveredElement(null);
          setHoveredDomElement(null);
          onElementHover?.(null);
        }
      }
    },
    [isActive, hoveredElement, onElementHover]
  );

  // Registrar event listeners
  useEffect(() => {
    if (!isActive) {
      setHoveredElement(null);
      setHoveredDomElement(null);
      return;
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);

    // Desabilitar seleção de texto e mudar cursor
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'crosshair';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);

      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseMove, handleClick, handleKeyDown]);

  return {
    hoveredElement,
    mousePosition,
    isInspecting: isActive && !!hoveredElement,
    hoveredDomElement,
  };
}
