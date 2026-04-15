/**
 * 🐛 BugDetector Bookmarklet
 *
 * Como usar:
 * 1. Substitua a URL abaixo pela URL onde você hospedou o arquivo
 *    `bug-detector.iife.js` (ex: GitHub Pages, seu servidor, CDN).
 * 2. Copie TODO o conteúdo entre as aspas (incluindo "javascript:").
 * 3. Crie um novo favorito no navegador e cole no campo "URL".
 * 4. Ao clicar em qualquer site, o BugDetector será injetado.
 */

// === COPIE A LINHA ABAIXO E SALVE COMO FAVORITO ===
/*
javascript:(function(){var s=document.createElement('script');s.src='https://SEU-DOMINIO-AQUI.com/bug-detector.iife.js';s.onload=function(){BugDetector.autoInit({shortcut:'ctrl+shift+d',trigger:'floating-button',persistTo:'localStorage'});console.log('🐛 BugDetector ativado!');};s.onerror=function(){alert('Não foi possível carregar o BugDetector. Verifique a URL do script.');};document.head.appendChild(s);})();
*/

// === Explicação ===
// Esse bookmarklet cria dinamicamente uma tag <script> na página
// e carrega o build IIFE do BugDetector. Depois de carregado,
// chama BugDetector.autoInit() automaticamente.
