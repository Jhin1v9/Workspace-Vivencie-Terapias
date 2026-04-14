/**
 * 🔍 Element Inspector Utils
 * Funções para inspecionar elementos DOM
 */

import type { InspectedElement, ParentInfo, ComputedStylesSnapshot } from '../types/bugTracker.types';

/** Gera seletor CSS único para um elemento */
export function generateUniqueSelector(element: Element): string {
  // Tentar ID primeiro
  if (element.id) {
    return `#${element.id}`;
  }

  // Tentar combinação de classes
  if (element.className && typeof element.className === 'string') {
    const classes = element.className
      .split(' ')
      .filter(c => c.trim() && !c.includes(':')) // Ignorar pseudo-classes
      .slice(0, 3) // Limitar a 3 classes
      .join('.');
    
    if (classes) {
      const selector = `.${classes}`;
      // Verificar se é único
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }

  // Seletor com tag e nth-child
  const tag = element.tagName.toLowerCase();
  const parent = element.parentElement;
  
  if (!parent) {
    return tag;
  }

  // Encontrar índice do elemento entre irmãos do mesmo tipo
  const siblings = Array.from(parent.children).filter(
    child => child.tagName === element.tagName
  );
  
  const index = siblings.indexOf(element) + 1;
  
  if (siblings.length === 1) {
    // Se é o único do tipo, não precisa de nth-child
    const parentSelector = generateUniqueSelector(parent);
    return `${parentSelector} > ${tag}`;
  }
  
  const parentSelector = generateUniqueSelector(parent);
  return `${parentSelector} > ${tag}:nth-child(${index})`;
}

/** Gera XPath absoluto de um elemento */
export function generateXPath(element: Element): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body) {
    const tag = current.tagName.toLowerCase();
    const parentEl: Element | null = current.parentElement;
    
    if (!parentEl) break;

    // Contar posição entre irmãos do mesmo tipo
    const siblings = Array.from(parentEl.children).filter(
      (child): child is Element => (child as Element).tagName === current!.tagName
    );
    
    const index = siblings.indexOf(current) + 1;
    
    if (siblings.length > 1) {
      parts.unshift(`${tag}[${index}]`);
    } else {
      parts.unshift(tag);
    }
    
    current = parentEl;
  }

  parts.unshift('body');
  return '/' + parts.join('/');
}

/** Extrai cadeia de elementos pais */
export function getParentChain(element: Element, maxDepth: number = 5): ParentInfo[] {
  const chain: ParentInfo[] = [];
  let current: Element | null = element.parentElement;
  let depth = 0;

  while (current && depth < maxDepth) {
    chain.push({
      tag: current.tagName.toLowerCase(),
      id: current.id || null,
      className: current.className && typeof current.className === 'string' 
        ? current.className.split(' ').slice(0, 3).join(' ')
        : '',
      selector: generateUniqueSelector(current),
    });
    
    current = current.parentElement;
    depth++;
  }

  return chain;
}

/** Extrai atributos data-* de um elemento */
export function getDataAttributes(element: Element): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-')) {
      attributes[attr.name] = attr.value;
    }
  }
  
  return attributes;
}

/** Tenta identificar nome do componente React */
export function detectReactComponentName(element: Element): string | undefined {
  // Propriedade __reactFiber$ é adicionada pelo React
  const fiberKey = Object.keys(element).find(key => 
    key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')
  );
  
  if (fiberKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fiber = (element as any)[fiberKey];
    
    // Navegar na árvore de fibers para encontrar o nome
    let current = fiber;
    while (current) {
      if (current.type?.displayName) {
        return current.type.displayName;
      }
      if (current.type?.name) {
        return current.type.name;
      }
      if (typeof current.type === 'string') {
        // Componente DOM nativo, não React
        return undefined;
      }
      current = current.return;
    }
  }
  
  return undefined;
}

/** Captura estilos computados essenciais */
export function getComputedStylesSnapshot(element: Element): ComputedStylesSnapshot {
  const styles = window.getComputedStyle(element);
  return {
    margin: styles.margin,
    padding: styles.padding,
    display: styles.display,
    position: styles.position,
    fontSize: styles.fontSize,
    color: styles.color,
    backgroundColor: styles.backgroundColor,
    width: styles.width,
    height: styles.height,
    zIndex: styles.zIndex,
    borderRadius: styles.borderRadius,
  };
}

/** Inspeciona um elemento completamente */
export function inspectElement(element: Element): InspectedElement {
  const rect = element.getBoundingClientRect();
  
  return {
    tag: element.tagName.toLowerCase(),
    id: element.id || null,
    className: element.className && typeof element.className === 'string'
      ? element.className
      : '',
    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    },
    selector: generateUniqueSelector(element),
    xpath: generateXPath(element),
    componentName: detectReactComponentName(element),
    parentChain: getParentChain(element),
    dataAttributes: getDataAttributes(element),
    textContent: element.textContent?.slice(0, 100) || '',
    computedStyles: getComputedStylesSnapshot(element),
  };
}

/** Formata a cadeia de pais para exibição */
export function formatParentChain(chain: ParentInfo[]): string {
  return chain
    .map(p => {
      let str = p.tag;
      if (p.id) str += `#${p.id}`;
      if (p.className) str += `.${p.className.split(' ').join('.')}`;
      return str;
    })
    .join(' > ');
}

/** Verifica se elemento é interativo (clicável) */
export function isInteractiveElement(element: Element): boolean {
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea', 'label'];
  const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'];
  
  if (interactiveTags.includes(element.tagName.toLowerCase())) {
    return true;
  }
  
  const role = element.getAttribute('role');
  if (role && interactiveRoles.includes(role)) {
    return true;
  }
  
  const clickable = element.getAttribute('data-clickable');
  if (clickable === 'true') {
    return true;
  }
  
  // Verificar se tem evento de clique (heurística)
  const style = window.getComputedStyle(element);
  if (style.cursor === 'pointer') {
    return true;
  }
  
  return false;
}

/** Encontra elemento mais específico em uma posição */
export function findElementAtPosition(x: number, y: number): Element | null {
  // Usar elementFromPoint para encontrar elemento na posição
  const element = document.elementFromPoint(x, y);
  
  if (!element) {
    return null;
  }
  
  // Se for o body ou html, retornar null
  if (element.tagName === 'BODY' || element.tagName === 'HTML') {
    return null;
  }
  
  return element;
}
