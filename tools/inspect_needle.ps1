Add-Type -AssemblyName System.Drawing

$needlePath = "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png"
$needle = [System.Drawing.Bitmap]::FromFile($needlePath)
Write-Host "Needle size: $($needle.Width) x $($needle.Height)"

# Inspect all assets
$assetFiles = Get-ChildItem "D:\Kiro Folder\Ujian Ai Prompt\assets\*.png"
foreach ($f in $assetFiles) {
    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
    Write-Host "$($f.Name): $($bmp.Width) x $($bmp.Height)"
    $bmp.Dispose()
}

$needle.Dispose()
