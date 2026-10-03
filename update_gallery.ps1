$galleryDir = "images\gallery"
$outputFile = "data\gallery.json"

$images = @()

if (Test-Path $galleryDir) {
    $files = Get-ChildItem -Path $galleryDir -File | Where-Object { $_.Extension -match "\.(jpg|jpeg|png|gif|webp)$" } | Sort-Object Name
    foreach ($file in $files) {
        $images += @{
            src = "images/gallery/$($file.Name)"
            alt = $file.BaseName
        }
    }
}

$data = @{
    images = $images
}

# Convert to JSON and save
$json = $data | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText((Join-Path (Get-Location) $outputFile), $json)

Write-Host "Updated $outputFile with $($images.Count) images from $galleryDir"
