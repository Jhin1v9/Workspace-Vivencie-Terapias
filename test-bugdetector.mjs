import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false, args: ['--window-size=1280,800', '--disable-cache'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173?nocache=1');
  await page.evaluate(() => { localStorage.clear(); location.reload(); });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'bugdetector-test-01-inicial.png' });

  await page.getByRole('button', { name: 'Ativar Debug' }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'bugdetector-test-02-ativo.png' });

  await page.hover('text=Prontuários');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'bugdetector-test-03-hover.png' });

  await page.click('text=Prontuários');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'bugdetector-test-04-modal.png' });

  // Anotar screenshot
  await page.getByRole('button', { name: 'Anotar Screenshot' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'bugdetector-test-04b-annotation-canvas.png' });

  // Desenhar um retângulo no canvas (do meio para baixo-direita)
  const canvas = await page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.3);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6);
    await page.mouse.up();
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'bugdetector-test-04c-annotation-drawn.png' });

  await page.getByRole('button', { name: 'Aplicar Anotações' }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'bugdetector-test-04d-modal-annotated.png' });

  // Mock getDisplayMedia para testar screen recording sem picker do SO
  await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    const stream = canvas.captureStream(30);
    navigator.mediaDevices.getDisplayMedia = async () => stream;
  });

  // Iniciar gravação de tela
  await page.getByRole('button', { name: 'Gravar Tela (10s)' }).click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'bugdetector-test-04e-recording.png' });

  // Parar gravação
  await page.getByRole('button', { name: 'Parar' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'bugdetector-test-04f-video-preview.png' });

  const textareas = await page.locator('textarea').all();
  await textareas[0].fill('Teste automático do bug-detector: o ícone de Prontuários está desalinhado na taskbar.');
  await textareas[1].fill('O ícone deveria estar centralizado verticalmente.');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'bugdetector-test-05-preenchido.png' });

  await page.getByRole('button', { name: 'Enviar Report' }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'bugdetector-test-06-enviado.png' });

  await page.getByRole('button', { name: '📋' }).click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'bugdetector-test-07-painel.png' });

  await browser.close();
  console.log('OK');
})();
