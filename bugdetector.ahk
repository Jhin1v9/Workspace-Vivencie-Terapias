; BugDetector AutoHotkey Script
; Pressione Ctrl + Alt + B para copiar o snippet para o clipboard

#Requires AutoHotkey v2.0

^!b::
{
    scriptDir := A_ScriptDir
    snippetPath := scriptDir "\bugdetector-snippet.js"

    if FileExist(snippetPath)
    {
        file := FileOpen(snippetPath, "r")
        content := file.Read()
        file.Close()
        A_Clipboard := content
        TrayTip "BugDetector", "Snippet copiado! Cole no console do navegador (F12 → Ctrl+V).", 16
    }
    else
    {
        MsgBox "Arquivo bugdetector-snippet.js não encontrado.`nCertifique-se de que este .ahk está na mesma pasta do snippet.", "BugDetector", 16
    }
}
