Add-Type -AssemblyName System.Drawing

$ref = [System.Drawing.Bitmap]::FromFile('D:\Kiro Folder\Ujian Ai Prompt\assets\reference.jpg')

# Check where the hero illustration is in reference.jpg
# The hero illustration is the 3D character with glasses / megaphone on the right side of the hero card
# Let's crop a clean version of hero-illustration.png without any left-side text!
# Where does the character/illustration start horizontally?
# Let's check non-white pixels from X=150 to 295, Y=80 to 200

for ($x = 150; $x -lt 295; $x += 5) {
    $hasColor = $false
    for ($y = 80; $y -lt 200; $y += 5) {
        $c = $ref.GetPixel($x, $y)
        if ($c.R -lt 240 -or $c.G -lt 240 -or $c.B -lt 240) {
            $hasColor = $true
        }
    }
    Write-Host "X=$x hasColor=$hasColor"
}

$ref.Dispose()
