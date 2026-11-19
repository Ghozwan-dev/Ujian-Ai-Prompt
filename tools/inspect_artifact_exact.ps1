Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

# Let's inspect rows Y=100 to 127 from X=0 to 60
for ($y = 100; $y -lt 128; $y++) {
    $rowInfo = "Y={0:D3}: " -f $y
    for ($x = 0; $x -lt 60; $x++) {
        $c = $hero.GetPixel($x, $y)
        # Check if it's the blue megaphone/character or the white background or the text
        if ($c.A -lt 10) {
            $rowInfo += "T" # transparent
        } elseif ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $rowInfo += "_" # white background
        } elseif ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) {
            $rowInfo += "#" # dark text artifact
        } elseif ($c.B -gt 150) {
            $rowInfo += "B" # Blue illustration
        } else {
            $rowInfo += "."
        }
    }
    Write-Host $rowInfo
}

$hero.Dispose()
