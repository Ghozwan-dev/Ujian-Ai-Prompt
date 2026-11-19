Add-Type -AssemblyName System.Drawing

$needlePath = "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded\media_1795087637850_b3002a7c.png"
$needle = [System.Drawing.Bitmap]::FromFile($needlePath)
$nW = $needle.Width
$nH = $needle.Height

Write-Host "Needle: $nW x $nH"

$folders = @("D:\Kiro Folder\Ujian Ai Prompt\assets", "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded")

foreach ($folder in $folders) {
    Get-ChildItem -Path $folder -Include *.png,*.jpg -Recurse | ForEach-Object {
        if ($_.FullName -eq $needlePath) { return }
        try {
            $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
            if ($bmp.Width -ge $nW -and $bmp.Height -ge $nH) {
                # Fast check: sample center pixel of needle
                $cx = [int]($nW / 2)
                $cy = [int]($nH / 2)
                $targetC = $needle.GetPixel($cx, $cy)
                
                # Check corners
                $c00 = $needle.GetPixel(0, 0)
                $cW0 = $needle.GetPixel($nW - 1, 0)
                $c0H = $needle.GetPixel(0, $nH - 1)
                $cWH = $needle.GetPixel($nW - 1, $nH - 1)

                for ($y = 0; $y -le ($bmp.Height - $nH); $y++) {
                    for ($x = 0; $x -le ($bmp.Width - $nW); $x++) {
                        $p = $bmp.GetPixel($x + $cx, $y + $cy)
                        if ([Math]::Abs($p.R - $targetC.R) -lt 15 -and [Math]::Abs($p.G - $targetC.G) -lt 15 -and [Math]::Abs($p.B - $targetC.B) -lt 15) {
                            # Check diff
                            $diff = 0
                            for ($sy = 0; $sy -lt $nH; $sy += 2) {
                                for ($sx = 0; $sx -lt $nW; $sx += 2) {
                                    $p1 = $needle.GetPixel($sx, $sy)
                                    $p2 = $bmp.GetPixel($x + $sx, $y + $sy)
                                    $diff += [Math]::Abs($p1.R - $p2.R) + [Math]::Abs($p1.G - $p2.G) + [Math]::Abs($p1.B - $p2.B)
                                }
                            }
                            if ($diff -lt 500) {
                                Write-Host "FOUND EXACT MATCH in $($_.Name) at X=$x, Y=$y (diff=$diff)!"
                            }
                        }
                    }
                }
            }
            $bmp.Dispose()
        } catch {}
    }
}

$needle.Dispose()
