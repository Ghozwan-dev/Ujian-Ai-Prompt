Add-Type -AssemblyName System.Drawing

$needlePath = "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png"
$img4Path = "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1794892716622_763cdb9c.png"

$needle = [System.Drawing.Bitmap]::FromFile($needlePath)
$img4 = [System.Drawing.Bitmap]::FromFile($img4Path)

Write-Host "Needle: $($needle.Width) x $($needle.Height)"
Write-Host "Img4: $($img4.Width) x $($img4.Height)"

$minDiff = [double]::MaxValue
$bestX = 0
$bestY = 0

for ($y = 0; $y -le ($img4.Height - $needle.Height); $y++) {
    for ($x = 0; $x -le ($img4.Width - $needle.Width); $x++) {
        $diff = 0
        for ($sy = 0; $sy -lt $needle.Height; $sy += 3) {
            for ($sx = 0; $sx -lt $needle.Width; $sx += 3) {
                $p1 = $needle.GetPixel($sx, $sy)
                $p2 = $img4.GetPixel($x + $sx, $y + $sy)
                $diff += [Math]::Abs($p1.R - $p2.R) + [Math]::Abs($p1.G - $p2.G) + [Math]::Abs($p1.B - $p2.B)
            }
        }
        if ($diff -lt $minDiff) {
            $minDiff = $diff
            $bestX = $x
            $bestY = $y
        }
    }
}

Write-Host "Best match in img4 at X=$bestX, Y=$bestY with diff=$minDiff"

$needle.Dispose()
$img4.Dispose()
