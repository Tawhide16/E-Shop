/**
 * High-efficiency image compression utility.
 * Compresses images client-side to lightweight JPEG/WebP (~50KB - 120KB)
 * to prevent browser LocalStorage QuotaExceededError and keep website blazing fast.
 */
export async function fileToOptimizedDataUrl(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.72
): Promise<string> {
  // SVG vectors can be preserved directly
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down to max dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);

        // Always convert photos/raster images to JPEG with moderate quality to save 90% space
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // If still larger than 250KB, compress further to 800px max
        if (dataUrl.length > 250000) {
          const smallCanvas = document.createElement('canvas');
          const scale = Math.min(800 / width, 800 / height, 1);
          smallCanvas.width = Math.round(width * scale);
          smallCanvas.height = Math.round(height * scale);
          const smallCtx = smallCanvas.getContext('2d');
          if (smallCtx) {
            smallCtx.imageSmoothingEnabled = true;
            smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
            dataUrl = smallCanvas.toDataURL('image/jpeg', 0.65);
          }
        }

        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
