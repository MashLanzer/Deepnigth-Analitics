import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChannelSearchProps {
  onSearch: (channelId: string) => void;
  loading?: boolean;
}

export default function ChannelSearch({ onSearch, loading }: ChannelSearchProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!input.trim()) {
      setError('Por favor ingresa un ID de canal de YouTube');
      return;
    }
    setError('');
    onSearch(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Ingresa el ID del canal de YouTube (ej: UCxxxxxx)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 font-mono text-sm"
          disabled={loading}
        />
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Cargando...' : 'Buscar'}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground font-mono">
        Tip: Puedes encontrar el ID del canal en la URL de YouTube (youtube.com/channel/ID)
      </p>
    </div>
  );
}
