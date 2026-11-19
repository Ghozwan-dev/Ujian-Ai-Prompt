Add-Type -AssemblyName System.Drawing

$needlePath = "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png"
$needle = [System.Drawing.Bitmap]::FromFile($needlePath)
$nW = $needle.Width
$nH = $needle.Height

Write-Host "Needle: $nW x $nH"

$refPath = "D:\Kiro Folder\Ujian Ai Prompt\assets\reference.jpg"
if (Test-Path $refPath) {
    $ref = [System.Drawing.Bitmap]::FromFile($refPath)
    Write-Host "Reference: $($ref.Width) x $($ref.Height)"
    
    # Let's search in reference for matching or near-matching area
    $minDiff = [double]::MaxValue
    $bestX = 0
    $bestY = 0
    
    for ($y = 0; $y -le ($ref.Height - $nH); $y++) {
        for ($x = 0; $x -le ($ref.Width - $nW); $x++) {
            $diff = 0
            # Sample 20 points
            for ($sy = 0; $sy -lt $nH; $sy += 4) {
                for ($sx = 0; $sx -lt $nW; $sx += 4) {
                    $p1 = $needle.GetPixel($sx, $sy)
                    $p2 = $ref.GetPixel($x + $sx, $y + $sy)
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
    Write-Host "Best match in reference.jpg at X=$bestX, Y=$bestY with diff=$minDiff"
    $ref.Dispose()
}

$needle.Dispose()
