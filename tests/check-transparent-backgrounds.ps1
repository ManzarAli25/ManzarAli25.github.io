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

Write-Output "transparent background contract passed for $($targets.Count) generated assets"
