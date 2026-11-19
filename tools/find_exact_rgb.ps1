Add-Type -AssemblyName System.Drawing

$folders = @("D:\Kiro Folder\Ujian Ai Prompt\assets", "C:\Users\WINDOWS 11\.gemini\antigravity\brain\99f6bf2b-c006-431d-a18b-d4644b44e2c7\.user_uploaded")

foreach ($folder in $folders) {
    Get-ChildItem -Path $folder -Include *.png,*.jpg -Recurse | ForEach-Object {
        try {
            $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
            for ($y = 0; $y -lt $bmp.Height; $y += 2) {
                for ($x = 0; $x -lt $bmp.Width; $x += 2) {
                    $c = $bmp.GetPixel($x, $y)
                    if ($c.R -le 10 -and $c.G -ge 15 -and $c.G -le 30 -and $c.B -ge 95 -and $c.B -le 120) {
                        Write-Host "MATCH IN $($_.Name) at ($x, $y): R=$($c.R) G=$($c.G) B=$($c.B)"
                        break
                    }
                }
            }
            $bmp.Dispose()
        } catch {}
    }
}
