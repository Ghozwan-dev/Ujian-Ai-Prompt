Add-Type -AssemblyName System.Drawing
$needle = [System.Drawing.Bitmap]::FromFile('C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png')

for ($y = 0; $y -lt 10; $y += 2) {
    for ($x = 0; $x -lt $needle.Width; $x += 4) {
        $c = $needle.GetPixel($x, $y)
        Write-Host ("($x,$y): R={0} G={1} B={2} A={3}" -f $c.R, $c.G, $c.B, $c.A)
    }
}
$needle.Dispose()
