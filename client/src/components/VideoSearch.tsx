import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface VideoSearchProps {
  onSearch: (query: string) => void;
}

export default function VideoSearch({ onSearch }: VideoSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar videos por título..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-border rounded bg-background text-foreground text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
