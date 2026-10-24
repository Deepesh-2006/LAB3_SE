import { generateDrawIOXML } from '../data/labData';

/**
 * Exports the SVG diagram element as a high-resolution PNG file using an in-memory canvas
 */
export function exportSVGAsPNG(svgId: string, filename: string = 'Lab3_CoffeeKiosk_ComponentDiagram.png'): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const svg = document.getElementById(svgId) as SVGSVGElement | null;
      if (!svg) {
        console.error('SVG element not found:', svgId);
        resolve(false);
        return;
      }

      // Clone SVG to prevent altering the live DOM
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      clonedSvg.style.transform = 'none';

      // Serialize SVG
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(clonedSvg);

      // Add name spaces if missing
      if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        // High resolution scale factor (2x for crisp print)
        const scale = 2;
        const width = 1100 * scale;
        const height = 680 * scale;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');

        if (!context) {
          URL.revokeObjectURL(blobURL);
          resolve(false);
          return;
        }

        // Fill background
        context.fillStyle = '#0f172a';
        context.fillRect(0, 0, width, height);

        // Draw scaled image
        context.drawImage(image, 0, 0, width, height);

        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(blobURL);
        resolve(true);
      };

      image.onerror = (e) => {
        console.error('Failed to load SVG into image for canvas export', e);
        URL.revokeObjectURL(blobURL);
        resolve(false);
      };

      image.src = blobURL;
    } catch (err) {
      console.error('PNG export failed', err);
      resolve(false);
    }
  });
}

/**
 * Exports the SVG diagram directly as a scalable vector graphic (.svg)
 */
export function exportSVGDirect(svgId: string, filename: string = 'Lab3_CoffeeKiosk_ComponentDiagram.svg') {
  const svg = document.getElementById(svgId) as SVGSVGElement | null;
  if (!svg) return;

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.style.transform = 'none';

  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(clonedSvg);

  if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports a draw.io compliant .drawio XML file
 */
export function exportDrawIO(filename: string = 'Lab3_CoffeeKiosk_ComponentDiagram.drawio') {
  const xml = generateDrawIOXML();
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
