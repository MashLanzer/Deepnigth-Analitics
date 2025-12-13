import Sparkline from './Sparkline';
import { formatNumber } from '@/lib/utils';

interface Item { label: string; value: number; data: {x:string;y:number}[] }

export default function KPIsSparkline({ items }: { items: Item[] }){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {items.map(it => (
        <div key={it.label} className="bg-card border border-border p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-mono text-muted-foreground">{it.label}</div>
            <div className="text-sm font-mono font-semibold">{formatNumber(it.value)}</div>
          </div>
          <Sparkline data={it.data} />
        </div>
      ))}
    </div>
  );
}
