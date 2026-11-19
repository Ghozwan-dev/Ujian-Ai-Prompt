Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')
Write-Host "Width=$($hero.Width), Height=$($hero.Height)"

$hasTransparent = $false
for ($y = 0; $y -lt $hero.Height; $y += 5) {
    for ($x = 0; $x -lt $hero.Width; $x += 5) {
        if ($hero.GetPixel($x, $y).A -lt 255) {
            $hasTransparent = $true
            break
        }
    }
}
Write-Host "hasTransparent: $hasTransparent"
$hero.Dispose()
