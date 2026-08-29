param(
    [string]$AssetsPath = (Join-Path $PSScriptRoot '..\assets'),
    [string]$Target = 'wojak-*.png'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if (-not ('CheckerboardRemover' -as [type])) {
    Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class CheckerboardRemover
{
    private static bool IsBackground(byte b, byte g, byte r)
    {
        int max = Math.Max(r, Math.Max(g, b));
        int min = Math.Min(r, Math.Min(g, b));
        return min >= 218 && max - min <= 12;
    }

    public static void Process(string path)
    {
        int removed = 0;
        string temp = path + ".transparent.tmp.png";
        if (File.Exists(temp)) File.Delete(temp);
        using (var source = new Bitmap(path))
        using (var image = new Bitmap(source.Width, source.Height, PixelFormat.Format32bppArgb))
        {
            using (var graphics = Graphics.FromImage(image))
                graphics.DrawImageUnscaled(source, 0, 0);

            int width = image.Width, height = image.Height;
            var rect = new Rectangle(0, 0, width, height);
            var data = image.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
            int stride = Math.Abs(data.Stride);
            var pixels = new byte[stride * height];
            Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);

            var visited = new bool[width * height];
            var queue = new Queue<int>();
            Action<int, int> seed = (x, y) => {
                int id = y * width + x;
                int offset = y * stride + x * 4;
                if (!visited[id] && IsBackground(pixels[offset], pixels[offset + 1], pixels[offset + 2])) {
                    visited[id] = true;
                    queue.Enqueue(id);
                }
            };

            for (int x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
            for (int y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

            while (queue.Count > 0) {
                int id = queue.Dequeue();
                int x = id % width, y = id / width;
                int offset = y * stride + x * 4;
                pixels[offset + 3] = 0;
                removed++;
                if (x > 0) seed(x - 1, y);
                if (x + 1 < width) seed(x + 1, y);
                if (y > 0) seed(x, y - 1);
                if (y + 1 < height) seed(x, y + 1);
            }

            Marshal.Copy(pixels, 0, data.Scan0, pixels.Length);
            image.UnlockBits(data);
            image.Save(temp, ImageFormat.Png);
        }
        File.Copy(temp, path, true);
        File.Delete(temp);
    }
}
'@
}

$targets = Get-ChildItem (Join-Path $AssetsPath $Target) |
    Where-Object Name -ne 'wojak-hero.png'

foreach ($assetFile in $targets) {
    $absolutePath = [System.IO.Path]::GetFullPath($assetFile.FullName)
    [CheckerboardRemover]::Process($absolutePath)
    Write-Output "$($assetFile.Name): background processed"
}
