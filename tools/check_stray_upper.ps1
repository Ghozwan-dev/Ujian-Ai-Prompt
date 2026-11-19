Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

for ($y = 0; $y -lt 90; $y++) {
    for ($x = 0; $x -lt 25; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -lt 150 -and $c.G -lt 150 -and $c.B -lt 150) {
            Write-Host "Stray pixel at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
        }
    }
}

$hero.Dispose()
