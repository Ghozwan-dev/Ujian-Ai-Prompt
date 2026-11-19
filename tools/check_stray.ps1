Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

Write-Host "hero size: $($hero.Width)x$($hero.Height)"
$cTopLeft = $hero.GetPixel(0, 0)
Write-Host "TopLeft: R=$($cTopLeft.R) G=$($cTopLeft.G) B=$($cTopLeft.B) A=$($cTopLeft.A)"

# Find all stray pixels in the left margin (X < 35, Y > 90)
for ($y = 90; $y -lt $hero.Height; $y++) {
    for ($x = 0; $x -lt 45; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) {
            Write-Host "Stray text pixel at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
        }
    }
}

$hero.Dispose()
