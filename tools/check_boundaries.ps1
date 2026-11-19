Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

# 1. Check Region 1: X=0..15, Y=40..70
Write-Host "--- Region 1: X=0..15, Y=40..70 ---"
for ($y = 42; $y -le 65; $y++) {
    $line = "Y={0:D2}: " -f $y
    for ($x = 0; $x -le 16; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) { $line += " " }
        elseif ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) { $line += "#" }
        else { $line += "." }
    }
    Write-Host $line
}

# 2. Check Region 2: X=0..38, Y=100..127
Write-Host "--- Region 2: X=0..38, Y=100..127 ---"
for ($y = 105; $y -lt 128; $y++) {
    $line = "Y={0:D3}: " -f $y
    for ($x = 0; $x -le 38; $x++) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -gt 245 -and $c.G -gt 245 -and $c.B -gt 245) { $line += " " }
        elseif ($c.R -lt 120 -and $c.G -lt 120 -and $c.B -lt 120) { $line += "#" }
        elseif ($c.B -gt 150) { $line += "B" }
        else { $line += "." }
    }
    Write-Host $line
}

$hero.Dispose()
