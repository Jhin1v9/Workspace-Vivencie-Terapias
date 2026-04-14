/**
 * 📸 useScreenshot Hook
 * Hook para capturar screenshots da tela
 */

import { useState, useCallback, useRef } from 'react';

interface UseScreenshotOptions {
  quality?: number;
  type?: 'image/png' | 'image/jpeg';
}

interface UseScreenshotReturn {
  /** URL da screenshot capturada */
  screenshotUrl: string | null;
  /** Se está capturando */
  isCapturing: boolean;
  /** Erro se houver */
  error: Error | null;
  /** Função para capturar */
  capture: (element?: HTMLElement) => Promise<string | null>;
  /** Função para limpar */
  clear: () => void;
  /** Função para download */
  download: (filename?: string) => void;
}

export function useScreenshot({
  quality = 0.9,
  type = 'image/png',
}: UseScreenshotOptions = {}): UseScreenshotReturn {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Ref para evitar capturas simultâneas
  const isCapturingRef = useRef(false);

  /**
   * Captura screenshot da tela ou de um elemento específico
   */
  const capture = useCallback(async (
    element?: HTMLElement
  ): Promise<string | null> => {
    // Evitar capturas simultâneas
    if (isCapturingRef.current) {
      console.warn('Captura já em andamento');
      return null;
    }

    isCapturingRef.current = true;
    setIsCapturing(true);
    setError(null);

    try {
      // Verificar se html2canvas está disponível
      // Se não estiver, usar API nativa de captura
      const target = element || document.body;
      
      // Tentar usar API de Media Devices (compartilhamento de tela)
      // Fallback para html2canvas se disponível
      const dataUrl = await captureWithNativeAPI(target, quality, type);
      
      setScreenshotUrl(dataUrl);
      return dataUrl;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao capturar screenshot');
      setError(error);
      console.error('Erro na captura:', error);
      return null;
    } finally {
      setIsCapturing(false);
      isCapturingRef.current = false;
    }
  }, [quality, type]);

  /**
   * Limpa a screenshot atual
   */
  const clear = useCallback(() => {
    if (screenshotUrl) {
      URL.revokeObjectURL(screenshotUrl);
    }
    setScreenshotUrl(null);
    setError(null);
  }, [screenshotUrl]);

  /**
   * Faz download da screenshot
   */
  const download = useCallback((filename?: string) => {
    if (!screenshotUrl) return;

    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = filename || `screenshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [screenshotUrl]);

  return {
    screenshotUrl,
    isCapturing,
    error,
    capture,
    clear,
    download,
  };
}

/**
 * Captura usando APIs nativas (experimental)
 * Fallback para html2canvas
 */
async function captureWithNativeAPI(
  target: HTMLElement,
  quality: number,
  type: string
): Promise<string> {
  // Primeiro, tentar usar html2canvas se disponível
  // @ts-expect-error - html2canvas pode não estar instalado
  if (window.html2canvas) {
    try {
      // @ts-expect-error
      const canvas = await window.html2canvas(target, {
        scale: window.devicePixelRatio,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      
      return canvas.toDataURL(type, quality);
    } catch {
      console.warn('html2canvas falhou, usando fallback');
    }
  }

  // Fallback: usar API de Media Devices (captura de tela)
  try {
    if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Esperar um frame
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Não foi possível obter contexto 2D');
      
      ctx.drawImage(video, 0, 0);
      
      // Parar stream
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stream.getTracks().forEach((track: any) => track.stop());
      
      return canvas.toDataURL(type, quality);
    }
  } catch {
    console.warn('getDisplayMedia falhou');
  }

  // Último fallback: capturar apenas o elemento usando DOM
  return captureElementSimple(target, quality, type);
}

/**
 * Captura simples de elemento usando canvas
 */
function captureElementSimple(
  element: HTMLElement,
  quality: number,
  type: string
): string {
  const rect = element.getBoundingClientRect();
  
  const canvas = document.createElement('canvas');
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível obter contexto 2D');
  
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  
  // Preencher com cor de fundo do elemento
  const styles = window.getComputedStyle(element);
  ctx.fillStyle = styles.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);
  
  // Adicionar borda se houver
  if (styles.borderWidth && styles.borderWidth !== '0px') {
    ctx.strokeStyle = styles.borderColor;
    ctx.lineWidth = parseInt(styles.borderWidth);
    ctx.strokeRect(0, 0, rect.width, rect.height);
  }
  
  // Adicionar texto
  if (element.textContent) {
    ctx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    ctx.fillStyle = styles.color;
    ctx.textBaseline = 'top';
    
    const padding = parseInt(styles.padding) || 8;
    const lines = element.textContent.split('\n').slice(0, 10);
    
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), padding, padding + (i * 20));
    });
  }
  
  return canvas.toDataURL(type, quality);
}

/**
 * Converte data URL para Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
}

/**
 * Salva screenshot em arquivo
 */
export function saveScreenshot(dataUrl: string, filename: string): void {
  const blob = dataUrlToBlob(dataUrl);
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
