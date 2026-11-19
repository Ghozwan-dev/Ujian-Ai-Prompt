Add-Type -AssemblyName System.Drawing

$hero = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png')

Write-Host "Width=$($hero.Width), Height=$($hero.Height)"

# Print a downsampled 40x35 ASCII preview of hero-illustration.png
$stepX = [int]($hero.Width / 40)
$stepY = [int]($hero.Height / 30)

for ($y = 0; $y -lt $hero.Height; $y += $stepY) {
    $row = ""
    for ($x = 0; $x -lt $hero.Width; $x += $stepX) {
        $c = $hero.GetPixel($x, $y)
        if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
            $row += " " # white bg
        } elseif ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
            $row += "@" # black / dark
        } elseif ($c.B -gt 150) {
            $row += "#" # blue
        } elseif ($c.R -gt 180 -and $c.G -gt 150) {
            $row += "*" # skin/yellow/orange
        } else {
            $row += "."
        }
    }
    Write-Host $row
}

$hero.Dispose()
