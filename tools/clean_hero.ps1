Add-Type -AssemblyName System.Drawing

$srcPath = "D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.png"
$backupPath = "D:\Kiro Folder\Ujian Ai Prompt\assets\hero-illustration.backup.png"
Copy-Item $srcPath $backupPath -Force

$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# 1. Clean the exclamation mark artifact at X < 12, Y in 40..60
for ($y = 40; $y -le 60; $y++) {
    for ($x = 0; $x -lt 12; $x++) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    }
}

# 2. Clean the "rcaya" text artifact at X < 28, Y in 105..118
for ($y = 105; $y -le 118; $y++) {
    for ($x = 0; $x -lt 28; $x++) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
    }
}

# 3. Make transparent: all white pixels (R > 248, G > 248, B > 248)
$cleanBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 246 -and $c.G -gt 246 -and $c.B -gt 246) {
            $cleanBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } else {
            $cleanBmp.SetPixel($x, $y, $c)
        }
    }
}

$bmp.Dispose()
$cleanBmp.Save($srcPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cleanBmp.Dispose()

Write-Host "hero-illustration.png cleaned successfully!"
