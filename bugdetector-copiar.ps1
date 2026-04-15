# Copia o conteúdo do bugdetector-snippet.js para o clipboard do Windows
$snippetPath = Join-Path $PSScriptRoot "bugdetector-snippet.js"

if (Test-Path $snippetPath) {
    Get-Content $snippetPath -Raw | Set-Clipboard
    Write-Host "✅ Snippet do BugDetector copiado para a área de transferência!" -ForegroundColor Green
    Write-Host "   Agora é só ir no console do navegador (F12 → Console) e colar (Ctrl+V)." -ForegroundColor Cyan
} else {
    Write-Host "❌ Arquivo bugdetector-snippet.js não encontrado em: $snippetPath" -ForegroundColor Red
    Write-Host "   Certifique-se de que este script está na mesma pasta do snippet." -ForegroundColor Yellow
}
