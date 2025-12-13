import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  videos: any[];
  onFilterChange: (filters: { tag?: string; minViews?: number }) => void;
}

export default function VideoFilters({ videos, onFilterChange }: Props) {
  const tags = useMemo(() => {
    const s = new Set<string>();
    videos.forEach(v =>
      (v.tags || []).forEach((t: string) => {
        const tt = (t || "").toString().trim();
        if (tt) s.add(tt);
      })
    );
    return Array.from(s).slice(0, 20);
  }, [videos]);

  const [tag, setTag] = useState<string>('all');
  const [minViews, setMinViews] = useState<number | ''>('');

  const apply = () => {
    onFilterChange({ tag: tag && tag !== 'all' ? tag : undefined, minViews: minViews === '' ? undefined : Number(minViews) });
  };

  const reset = () => {
    setTag('all'); setMinViews(''); onFilterChange({});
  };

  return (
    <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-3">
      <Select onValueChange={(v)=>setTag(v)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filtrar por etiqueta" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          {tags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>

      <Input placeholder="Min views" value={minViews as any} onChange={(e)=>setMinViews(e.target.value ? Number(e.target.value) : '')} className="w-40" />

      <div className="flex gap-2">
        <Button size="sm" onClick={apply}>Aplicar</Button>
        <Button size="sm" variant="outline" onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}
