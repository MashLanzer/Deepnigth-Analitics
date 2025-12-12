import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateRangePickerProps {
  onRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  onPresetSelect?: (preset: string) => void;
}

export default function DateRangePicker({ onRangeChange, onPresetSelect }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handlePreset = (days: number | null, preset: string) => {
    const end = new Date();
    const start = new Date();

    if (days) {
      start.setDate(start.getDate() - days);
    } else {
      start.setFullYear(1);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    setSelectedPreset(preset);
    onRangeChange(days ? start : null, end);
    onPresetSelect?.(preset);
  };

  const handleCustom = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    setSelectedPreset('');
    onRangeChange(start, end);
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setSelectedPreset('');
    onRangeChange(null, null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-border rounded bg-card hover:bg-muted transition-colors font-mono text-sm text-muted-foreground hover:text-foreground"
      >
        <Calendar className="w-4 h-4" />
        {selectedPreset || 'Seleccionar período'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 p-4 border border-border bg-card rounded-lg shadow-lg z-50 w-80">
          <div className="space-y-4">
            {/* Presets */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">PERÍODOS RÁPIDOS</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePreset(7, 'Últimos 7 días')}
                  className={`px-3 py-2 text-xs border rounded font-mono transition-colors ${
                    selectedPreset === 'Últimos 7 días'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  7 días
                </button>
                <button
                  onClick={() => handlePreset(30, 'Últimos 30 días')}
                  className={`px-3 py-2 text-xs border rounded font-mono transition-colors ${
                    selectedPreset === 'Últimos 30 días'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  30 días
                </button>
                <button
                  onClick={() => handlePreset(90, 'Últimos 90 días')}
                  className={`px-3 py-2 text-xs border rounded font-mono transition-colors ${
                    selectedPreset === 'Últimos 90 días'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  90 días
                </button>
                <button
                  onClick={() => handlePreset(365, 'Último año')}
                  className={`px-3 py-2 text-xs border rounded font-mono transition-colors ${
                    selectedPreset === 'Último año'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  1 año
                </button>
              </div>
            </div>

            {/* Custom dates */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-2">RANGO PERSONALIZADO</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-mono">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-background text-foreground text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1 font-mono">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded bg-background text-foreground text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                onClick={handleCustom}
                size="sm"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none border-none"
              >
                Aplicar
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="flex-1 font-mono rounded-none"
              >
                Limpiar
              </Button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
