Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\shield-verified.png')
Write-Host "shield-verified size: $($bmp.Width) x $($bmp.Height)"
# Let's check non-white, non-transparent pixels at the right or bottom of shield-verified.png
for ($y = 0; $y -lt $bmp.Height; $y++) {
    $line = ""
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.A -gt 30 -and ($c.R -lt 100 -or $c.G -lt 100 -or $c.B -lt 100)) {
            $line += "#"
        } else {
            $line += " "
        }
    }
    if ($line.Trim().Length -gt 0) {
        Write-Host ("{0:D2}: {1}" -f $y, $line)
    }
}
$bmp.Dispose()
