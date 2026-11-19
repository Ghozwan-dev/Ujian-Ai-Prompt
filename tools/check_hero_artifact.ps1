Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')
Write-Host "hero-illustration size: $($hero.Width) x $($hero.Height)"

# Inspect bottom-left of hero-illustration.png: X=0..50, Y=90..127
for ($y = 90; $y -lt $hero.Height; $y++) {
    $line = ""
    for ($x = 0; $x -lt 55; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
            $line += "#"
        } elseif ($c.B -gt 150) {
            $line += "~"
        } else {
            $line += " "
        }
    }
    if ($line.Trim().Length -gt 0) {
        Write-Host ("Y={0:D3}: {1}" -f $y, $line)
    }
}

$hero.Dispose()
