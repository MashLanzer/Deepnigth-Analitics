import Layout from "@/components/Layout";
import MetricCard from "@/components/MetricCard";
import ChannelSearch from "@/components/ChannelSearch";
import VideoGrid from "@/components/VideoGrid";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Play, Users, Eye, Activity, Loader } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useYouTubeChannel } from "@/hooks/useYouTube";
import { formatNumber } from "@/lib/utils";
import { useState } from "react";

// Tu canal de YouTube
const DEFAULT_CHANNEL_ID = "UCIlucAowvh8GUqsysgbpeMg";

export default function Home() {
  const [channelId, setChannelId] = useState<string | null>(DEFAULT_CHANNEL_ID);
  const { stats, loading, error } = useYouTubeChannel(channelId);

  const handleChannelSearch = (id: string) => {
    setChannelId(id);
  };

  // Usar datos reales si están disponibles, sino usar datos de demostración
  const defaultData = [
    { name: 'Lun', views: 400 },
    { name: 'Mar', views: 300 },
    { name: 'Mie', views: 600 },
    { name: 'Jue', views: 800 },
    { name: 'Vie', views: 500 },
    { name: 'Sab', views: 900 },
    { name: 'Dom', views: 1200 },
  ];

  const chartData = stats?.dailyViews || defaultData;
  const channel = stats?.channelInfo;
  const videos = stats?.videoPerformance || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative mb-12 p-8 border border-border bg-card overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-background.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 border border-primary/30 bg-primary/5 text-primary text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {loading ? 'CARGANDO DATOS...' : stats ? 'ANÁLISIS COMPLETADO' : 'DISPONIBLE'}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter glitch-text" data-text="DEEPNIGHT_ANALYSIS">
            DEEPNIGHT ANALYTICS
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
            {channelId 
              ? 'Tu dashboard personal de YouTube. Analítica completa del canal con datos en tiempo real.'
              : 'Ingresa el ID de tu canal de YouTube para obtener un análisis detallado del rendimiento.'}
          </p>
          {!channelId && (
            <div className="flex gap-4">
              <Link href="/strategy">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none border border-transparent hover:border-primary/50">
                  VER ESTRATEGIA <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/report">
                <Button variant="outline" size="lg" className="font-mono rounded-none border-border hover:border-primary hover:text-primary bg-transparent">
                  LEER INFORME COMPLETO
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Channel Search Section */}
      {!stats && !loading && (
        <div className="mb-12 p-6 border border-border bg-card">
          <h2 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary" />
            BUSCAR OTRO CANAL
          </h2>
          <ChannelSearch onSearch={handleChannelSearch} loading={loading} />
          
          {error && (
            <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 rounded">
              <p className="text-sm text-destructive">
                Error: {error.message}. Verifica que el ID del canal sea correcto y que tengas acceso a internet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Metrics Grid */}
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <MetricCard 
              title="Suscriptores" 
              value={formatNumber(channel?.subscribers || 0)} 
              trend="neutral" 
              trendValue={`${Math.round((channel?.subscribers || 0) / 1000)}K`} 
              description="Base de suscriptores actual del canal."
              delay={100}
            />
            <MetricCard 
              title="Videos Publicados" 
              value={channel?.videoCount || 0} 
              trend="up" 
              trendValue="Total" 
              description="Cantidad total de videos en el canal."
              delay={200}
            />
            <MetricCard 
              title="Visualizaciones Totales" 
              value={formatNumber(channel?.viewCount || 0)} 
              trend="up" 
              trendValue="Todo tiempo" 
              description="Vistas acumuladas del canal."
              delay={300}
            />
            <MetricCard 
              title="Videos en Análisis" 
              value={videos.length} 
              trend="down" 
              trendValue="Últimos" 
              description="Videos más recientes analizados."
              delay={400}
            />
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 border border-border bg-card p-6 relative group">
              <div className="absolute top-0 right-0 p-2">
                <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary" />
                PROYECCIÓN DE CRECIMIENTO
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00FF41" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00FF41" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666" 
                      tick={{fill: '#666', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#666" 
                      tick={{fill: '#666', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#e0e0e0' }}
                      itemStyle={{ color: '#00FF41' }}
                      cursor={{ stroke: '#00FF41', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#00FF41" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="border border-border bg-card p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/shorts-section-bg.png')] bg-cover bg-center opacity-10" />
              
              <div>
                <h3 className="font-mono text-sm text-muted-foreground mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-destructive" />
                  INFORMACIÓN DEL CANAL
                </h3>
                <p className="text-2xl font-bold mb-2">{channel?.title}</p>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {channel?.description || 'Sin descripción disponible'}
                </p>
              </div>
              
              <div className="mt-8 p-4 border border-primary/20 bg-primary/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-primary">ESTADO</span>
                  <span className="text-xs font-mono text-primary animate-pulse">ACTIVO</span>
                </div>
                <p className="text-sm font-medium">
                  Canal analizado correctamente
                </p>
              </div>
            </div>
          </div>

          {/* Videos Section */}
          {videos.length > 0 && (
            <div className="mb-12">
              <h2 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary" />
                VIDEOS CON MEJOR RENDIMIENTO
              </h2>
              <VideoGrid videos={videos} />
            </div>
          )}
        </>
      )}

      {!stats && !loading && !error && (
        <div className="text-center py-12 border border-border bg-card/50 p-8">
          <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-mono">
            No hay datos disponibles. Intenta con otro canal.
          </p>
        </div>
      )}

      {loading && !stats && (
        <div className="text-center py-12 border border-border bg-card/50 p-8">
          <Loader className="w-12 h-12 mx-auto text-primary mb-4 animate-spin" />
          <p className="text-muted-foreground font-mono">
            Cargando datos de tu canal...
          </p>
        </div>
      )}
    </Layout>
  );
}
