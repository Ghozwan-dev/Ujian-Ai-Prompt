Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

# Top 10 rows
Write-Host "Top 10 rows:"
for ($y = 0; $y -lt 10; $y++) {
    for ($x = 0; $x -lt $hero.Width; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            Write-Host "Top non-white at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
        }
    }
}

# Bottom 10 rows
Write-Host "Bottom 10 rows (Y=118..127):"
for ($y = 118; $y -lt $hero.Height; $y++) {
    for ($x = 0; $x -lt $hero.Width; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            Write-Host "Bottom non-white at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
        }
    }
}

# Right 10 cols
Write-Host "Right 10 cols (X=135..144):"
for ($x = 135; $x -lt $hero.Width; $x++) {
    for ($y = 0; $y -lt $hero.Height; $y++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            # Just check if any text
            if ($c.R -lt 80 -and $c.G -lt 80 -and $c.B -lt 80) {
                Write-Host "Right dark pixel at ($x, $y)"
            }
        }
    }
}

$hero.Dispose()
