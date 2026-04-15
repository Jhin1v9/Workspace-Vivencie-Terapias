// ==UserScript==
// @name         BugDetector Pro
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Injetar BugDetector em qualquer site
// @author       Você
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 🚨 SUBSTITUA ESTA URL pela URL onde você hospedou o arquivo bug-detector.iife.js
    const BUGDETECTOR_URL = 'https://SEU-DOMINIO-AQUI.com/bug-detector.iife.js';

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadScript(BUGDETECTOR_URL)
        .then(() => {
            if (typeof BugDetector !== 'undefined') {
                BugDetector.autoInit({
                    shortcut: 'ctrl+shift+d',
                    trigger: 'floating-button',
                    persistTo: 'localStorage',
                });
                console.log('🐛 BugDetector ativado via Tampermonkey! Pressione Ctrl+Shift+D.');
            } else {
                console.error('BugDetector não encontrado após carregar o script.');
            }
        })
        .catch((err) => {
            console.error('Falha ao carregar BugDetector:', err);
        });
})();
