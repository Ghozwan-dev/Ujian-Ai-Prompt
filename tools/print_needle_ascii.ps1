Add-Type -AssemblyName System.Drawing
$needle = [System.Drawing.Bitmap]::FromFile('C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png')
Write-Host "Needle: $($needle.Width)x$($needle.Height)"

for ($y = 0; $y -lt $needle.Height; $y++) {
    $line = ""
    for ($x = 0; $x -lt $needle.Width; $x++) {
        $c = $needle.GetPixel($x, $y)
        if ($c.R -lt 80 -and $c.G -lt 80 -and $c.B -lt 80) {
            $line += "#" # black/dark (text)
        } elseif ($c.B -gt 150 -and $c.B -gt ($c.R + 40)) {
            $line += "~" # blue
        } elseif ($c.R -gt 200 -and $c.G -gt 200 -and $c.B -gt 200) {
            $line += " " # white/light background
        } else {
            $line += "." # gray/other
        }
    }
    Write-Host ("{0:D2}: {1}" -f $y, $line)
}
$needle.Dispose()
