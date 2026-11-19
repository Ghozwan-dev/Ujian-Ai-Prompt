Add-Type -AssemblyName System.Drawing

$ref = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\reference.jpg')

Write-Host "reference size: $($ref.Width) x $($ref.Height)"

# Let's inspect the area around X=120..220, Y=160..210
# Check text lines in that area
for ($y = 160; $y -lt 210; $y += 2) {
    $line = ""
    for ($x = 100; $x -lt 220; $x += 2) {
        $c = $ref.GetPixel($x, $y)
        if ($c.R -lt 100 -and $c.G -lt 100 -and $c.B -lt 100) {
            $line += "#"
        } elseif ($c.B -gt 150) {
            $line += "~"
        } else {
            $line += " "
        }
    }
    if ($line.Trim().Length -gt 0) {
        Write-Host ("Y={0}: {1}" -f $y, $line)
    }
}

$ref.Dispose()
