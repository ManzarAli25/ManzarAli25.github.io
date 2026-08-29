$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$targets = Get-ChildItem "$PSScriptRoot\..\assets\wojak-*.png" |
    Where-Object Name -ne 'wojak-hero.png'

foreach ($target in $targets) {
    $bitmap = [System.Drawing.Bitmap]::FromFile($target.FullName)
    try {
        $corners = @(
            $bitmap.GetPixel(0, 0).A,
            $bitmap.GetPixel($bitmap.Width - 1, 0).A,
            $bitmap.GetPixel(0, $bitmap.Height - 1).A,
            $bitmap.GetPixel($bitmap.Width - 1, $bitmap.Height - 1).A
        )
        if ($corners | Where-Object { $_ -ne 0 }) {
            throw "$($target.Name) still has an opaque background: corner alpha = $($corners -join ', ')"
        }
        if ($bitmap.GetPixel([int]($bitmap.Width / 2), [int]($bitmap.Height / 2)).A -eq 0) {
            throw "$($target.Name) lost its foreground subject"
        }
    }
    finally {
        $bitmap.Dispose()
    }
}

$projectTargets = @(
    'legalease-corner.png', 'watch-corner.png', 'elenchus-corner.png',
    'lalascore-corner.png', 'trnsit-corner.png', 'agentred-corner.png',
    'dialogsum-corner.png'
)
foreach ($name in $projectTargets) {
    $path = Join-Path "$PSScriptRoot\..\assets\projects" $name
    if (-not (Test-Path -LiteralPath $path)) { throw "missing project art: $name" }
    $bitmap = [System.Drawing.Bitmap]::FromFile($path)
    try {
        $corners = @($bitmap.GetPixel(0,0).A,$bitmap.GetPixel($bitmap.Width-1,0).A,$bitmap.GetPixel(0,$bitmap.Height-1).A,$bitmap.GetPixel($bitmap.Width-1,$bitmap.Height-1).A)
        if ($corners | Where-Object { $_ -ne 0 }) { throw "$name has opaque corners" }
        $opaqueFound = $false
        for ($y = 0; $y -lt $bitmap.Height -and -not $opaqueFound; $y += 24) {
            for ($x = 0; $x -lt $bitmap.Width; $x += 24) {
                if ($bitmap.GetPixel($x,$y).A -gt 200) { $opaqueFound = $true; break }
            }
        }
        if (-not $opaqueFound) { throw "$name has no opaque foreground" }
    } finally { $bitmap.Dispose() }
}

Write-Output "transparent background contract passed for $($targets.Count) supporting assets and $($projectTargets.Count) project assets"
