; BugDetector AutoHotkey v1.1 Script
; Pressione Ctrl + Alt + B para copiar o snippet para o clipboard

^!b::
    snippetPath := A_ScriptDir . "\bugdetector-snippet.js"
    
    if (FileExist(snippetPath))
    {
        FileRead, content, %snippetPath%
        Clipboard := content
        TrayTip, BugDetector, Snippet copiado! Cole no console do navegador (F12 → Ctrl+V)., , 16
    }
    else
    {
        MsgBox, 16, BugDetector, Arquivo bugdetector-snippet.js não encontrado.`nCertifique-se de que este .ahk está na mesma pasta do snippet.
    }
return
