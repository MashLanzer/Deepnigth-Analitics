import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  description?: string;
  className?: string;
  delay?: number;
}

export default function MetricCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  description, 
  className,
  delay = 0
}: MetricCardProps) {
  return (
    <div 
      className={cn(
        "group relative bg-card border border-border p-6 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-4">
        <h3 className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{title}</h3>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-mono px-2 py-0.5 border",
            trend === "up" ? "text-primary border-primary/30 bg-primary/5" : 
            trend === "down" ? "text-destructive border-destructive/30 bg-destructive/5" : 
            "text-muted-foreground border-border"
          )}>
            {trend === "up" && <ArrowUpRight className="w-3 h-3" />}
            {trend === "down" && <ArrowDownRight className="w-3 h-3" />}
            {trend === "neutral" && <Minus className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="text-3xl font-bold font-mono text-foreground tracking-tighter group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {/* Background decorative element */}
      <div className="absolute -right-4 -bottom-4 text-[4rem] font-bold text-primary/5 font-mono pointer-events-none select-none">
        {typeof value === 'string' ? value.charAt(0) : '#'}
      </div>
    </div>
  );
}
