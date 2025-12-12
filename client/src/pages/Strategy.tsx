import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, Zap, Clock, Users } from "lucide-react";

export default function Strategy() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono mb-2 glitch-text" data-text="ESTRATEGIA OPERATIVA">ESTRATEGIA OPERATIVA</h1>
        <p className="text-muted-foreground">Plan de acción táctico para los próximos 30 días.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Content Strategy */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-primary/10 border border-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-mono text-lg font-bold">SHORTS BLITZ</h2>
          </div>
          
          <div className="border border-border bg-card p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
            <h3 className="font-bold mb-2 text-primary">Frecuencia Diaria</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Publicar 1 Short cada día a las 18:00 (hora pico de tu audiencia).
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                <span>Usa audios en tendencia (Dark Ambient)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                <span>Gancho visual en el segundo 0:01</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                <span>Loop perfecto (el final conecta con el inicio)</span>
              </li>
            </ul>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="font-bold mb-2">Reciclaje de Contenido</h3>
            <p className="text-sm text-muted-foreground">
              Extrae los momentos más tensos de tus videos largos existentes y conviértelos en 3-4 Shorts cada uno.
            </p>
          </div>
        </div>

        {/* Column 2: Long Form Strategy */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-destructive/10 border border-destructive flex items-center justify-center">
              <Clock className="w-4 h-4 text-destructive" />
            </div>
            <h2 className="font-mono text-lg font-bold text-destructive">RETENCIÓN (LONG FORM)</h2>
          </div>

          <div className="border border-border bg-card p-6 relative overflow-hidden group hover:border-destructive/50 transition-colors">
            <h3 className="font-bold mb-2 text-destructive">Estructura Narrativa</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cambia la estructura de tus videos largos para mejorar la retención.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 items-center p-2 border border-border bg-background/50">
                <span className="font-mono text-xs text-muted-foreground">00:00</span>
                <span className="text-sm font-bold">El Gancho (The Hook)</span>
              </div>
              <div className="flex gap-3 items-center p-2 border border-border bg-background/50">
                <span className="font-mono text-xs text-muted-foreground">01:30</span>
                <span className="text-sm font-bold">El Incidente Incitante</span>
              </div>
              <div className="flex gap-3 items-center p-2 border border-border bg-background/50">
                <span className="font-mono text-xs text-muted-foreground">05:00</span>
                <span className="text-sm font-bold">El Clímax de Tensión</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Community & Growth */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-secondary border border-secondary-foreground flex items-center justify-center">
              <Users className="w-4 h-4 text-secondary-foreground" />
            </div>
            <h2 className="font-mono text-lg font-bold">COMUNIDAD</h2>
          </div>

          <div className="border border-border bg-card p-6">
            <h3 className="font-bold mb-2">Activación de Audiencia</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Convierte espectadores pasivos en miembros activos de "La Noche Profunda".
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>Responder a TODOS los comentarios en la primera hora.</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>Crear encuestas en la pestaña Comunidad sobre próximos temas.</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>Dar "corazón" a los comentarios más creativos.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
