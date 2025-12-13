import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Props { targetId: string; filename?: string }

// Simple SVG -> PNG exporter: grabs the first <svg> inside target element and serializes it
export default function ChartExportButton({ targetId, filename = 'chart.png' }: Props) {
  const downloadSvgAsPng = async () => {
    const container = document.getElementById(targetId);
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    // Add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+xmlns:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const img = new Image();
    const svgBlob = new Blob([source], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    const bbox = svg.getBBox();
    canvas.width = Math.max(800, Math.ceil(bbox.width));
    canvas.height = Math.max(400, Math.ceil(bbox.height));
    const ctx = canvas.getContext('2d');
    if(!ctx){ URL.revokeObjectURL(url); return; }

    img.onload = () => {
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background') || '#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if(!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      });
    };
    img.onerror = () => { URL.revokeObjectURL(url); };
    img.src = url;
  };

  return (
    <Button size="sm" className="gap-2" onClick={downloadSvgAsPng}>
      <Download className="w-3 h-3" />
      Exportar PNG
    </Button>
  );
}
