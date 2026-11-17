param(
    [string]$Src = "D:\Kiro Folder\Ujian Ai Prompt\assets\reference.jpg",
    [string]$Dst,
    [int]$X,
    [int]$Y,
    [int]$W,
    [int]$H,
    [switch]$MakeTransparent
)

Add-Type -AssemblyName System.Drawing

if (-not $Dst) {
    Write-Error "Dst is required"
    exit 1
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($Src)
$rect = New-Object System.Drawing.Rectangle($X, $Y, $W, $H)
$dstBmp = $srcBmp.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

if ($MakeTransparent) {
    for ($px = 0; $px -lt $dstBmp.Width; $px++) {
        for ($py = 0; $py -lt $dstBmp.Height; $py++) {
            $c = $dstBmp.GetPixel($px, $py)
            if ($c.R -gt 246 -and $c.G -gt 246 -and $c.B -gt 246) {
                $dstBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
            }
        }
    }
}

$dstBmp.Save($Dst, [System.Drawing.Imaging.ImageFormat]::Png)
$dstBmp.Dispose()
$srcBmp.Dispose()
Write-Host "Exported $Dst ($W x $H)"
