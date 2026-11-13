export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxBytes?: number;
  initialQuality?: number;
}

/**
 * Compresses an uploaded image File into a crisp, lightweight base64 data URL
 * so storage never hits browser QuotaExceededError.
 */
export async function compressImageFileToDataUrl(
  file: File,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    maxBytes = 280 * 1024, // ~280 KB target per image
    initialQuality = 0.84,
  } = options;

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('फ़ोटो पढ़ने में समस्या आई।'));
    reader.readAsDataURL(file);
  });

  if (!rawDataUrl.startsWith('data:image/')) {
    return rawDataUrl;
  }

  // If already lightweight (e.g. < 180KB), keep crisp original
  if (rawDataUrl.length * 0.75 <= 180 * 1024) {
    return rawDataUrl;
  }

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mime = 'image/jpeg';
        let quality = initialQuality;
        let result = canvas.toDataURL(mime, quality);

        while (result.length * 0.75 > maxBytes && quality > 0.35) {
          quality = Math.max(0.32, quality - 0.12);
          result = canvas.toDataURL(mime, quality);
        }

        // If still larger than maxBytes, downscale dimensions 75%
        if (result.length * 0.75 > maxBytes && width > 640) {
          const smallerW = Math.round(width * 0.75);
          const smallerH = Math.round(height * 0.75);
          canvas.width = smallerW;
          canvas.height = smallerH;
          ctx.drawImage(img, 0, 0, smallerW, smallerH);
          result = canvas.toDataURL(mime, 0.72);
        }

        resolve(result.length < rawDataUrl.length ? result : rawDataUrl);
      } catch {
        resolve(rawDataUrl);
      }
    };
    img.onerror = () => resolve(rawDataUrl);
    img.src = rawDataUrl;
  });
}
