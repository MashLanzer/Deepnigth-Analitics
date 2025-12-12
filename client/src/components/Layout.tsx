import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Ghost, BarChart3, Film, Radio, FileText } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "DASHBOARD", icon: BarChart3 },
    { href: "/content", label: "CONTENIDO", icon: Film },
    { href: "/strategy", label: "ESTRATEGIA", icon: Radio },
    { href: "/report", label: "INFORME", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Scanlines Overlay */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50" />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md h-16">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary flex items-center justify-center">
              <Ghost className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-mono font-bold text-lg tracking-wider text-primary glitch-text" data-text="DEEPNIGHT_ANALYSIS">
                DEEPNIGHT_ANALYSIS
              </h1>
              <span className="text-[10px] text-muted-foreground tracking-[0.2em]">SYSTEM.VER.2.0.25</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a className={cn(
                    "px-4 py-2 font-mono text-sm transition-all duration-200 flex items-center gap-2 border border-transparent hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                    isActive ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,255,65,0.2)]" : "text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-10 min-h-screen relative">
        {/* Decorative Grid Lines */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-border" />
          <div className="absolute right-10 top-0 bottom-0 w-px bg-border" />
        </div>
        
        <div className="container relative z-10 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-background/50 backdrop-blur-sm">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-mono">
          <div>
            SECURE CONNECTION ESTABLISHED // ENCRYPTED
          </div>
          <div className="flex gap-4">
            <span>STATUS: ONLINE</span>
            <span>LATENCY: 12ms</span>
            <span>SERVER: MANUS-CORE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
