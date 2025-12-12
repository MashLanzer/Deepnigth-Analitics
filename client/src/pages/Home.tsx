import Layout from "@/components/Layout";
import MetricCard from "@/components/MetricCard";
import ChannelSearch from "@/components/ChannelSearch";
import VideoGrid from "@/components/VideoGrid";
import VideoTable from "@/components/VideoTable";
import DateRangePicker from "@/components/DateRangePicker";
import VideoComparison from "@/components/VideoComparison";
import TrendChart from "@/components/TrendChart";
import EngagementChart from "@/components/EngagementChart";
import VideoSearch from "@/components/VideoSearch";
import TopVideos from "@/components/TopVideos";
import ChannelHealth from "@/components/ChannelHealth";
import ChannelComparison from "@/components/ChannelComparison";
import DayOfWeekAnalytics from "@/components/DayOfWeekAnalytics";
import AudienceDemographics from "@/components/AudienceDemographics";
import ContentCalendar from "@/components/ContentCalendar";
import GrowthAnalytics from "@/components/GrowthAnalytics";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Play, Users, Eye, Activity, Loader, Download } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useYouTubeChannel } from "@/hooks/useYouTube";
import { formatNumber } from "@/lib/utils";
import React, { useState, lazy, Suspense } from "react";
import { filterVideosByDateRange, getVideoComparison, calculateChannelMetrics, exportVideosToCSV, exportChannelMetricsToCSV, VideoMetrics } from "@/lib/analytics";
import KPIPanel from '@/components/KPIPanel';
import VideoDetailModal from '@/components/VideoDetailModal';
import VideoFilters from '@/components/VideoFilters';
import TrafficSourcesChart from '@/components/TrafficSourcesChart';
import RetentionHeatmap from '@/components/RetentionHeatmap';
import KPIsSparkline from '@/components/KPIsSparkline';

// Lazy-load heavy components to reduce initial bundle size
const ChannelComparison = lazy(() => import("@/components/ChannelComparison"));
const DayOfWeekAnalytics = lazy(() => import("@/components/DayOfWeekAnalytics"));
const AudienceDemographics = lazy(() => import("@/components/AudienceDemographics"));
const ContentCalendar = lazy(() => import("@/components/ContentCalendar"));
const GrowthAnalytics = lazy(() => import("@/components/GrowthAnalytics"));
const ThemeToggle = lazy(() => import("@/components/ThemeToggle"));
const SubscriberGrowthChart = lazy(() => import("@/components/SubscriberGrowthChart"));
const EngagementOverTime = lazy(() => import("@/components/EngagementOverTime"));
const WatchTimeByVideo = lazy(() => import("@/components/WatchTimeByVideo"));
const ChartExportButton = lazy(() => import("@/components/ChartExportButton"));

// Tu canal de YouTube
const DEFAULT_CHANNEL_ID = "UCIlucAowvh8GUqsysgbpeMg";

export default function Home() {
  const [channelId, setChannelId] = useState<string | null>(DEFAULT_CHANNEL_ID);
  const { stats, loading, error } = useYouTubeChannel(channelId);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleChannelSearch = (id: string) => {
    setChannelId(id);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  const handleVideoSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
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
  const allVideos = (stats?.videoPerformance || []) as VideoMetrics[];
  
  // Filter videos by date range
  let filteredVideos = filterVideosByDateRange(allVideos, dateRange.start, dateRange.end);
  
  // Filter videos by search query
  if (searchQuery) {
    filteredVideos = filteredVideos.filter((v) => v.title.toLowerCase().includes(searchQuery));
  }
  
  // Get best/worst performing videos
  const { best, worst } = getVideoComparison(filteredVideos);
  
  // Calculate metrics for filtered videos
  const metrics = calculateChannelMetrics(filteredVideos, channel?.subscribers || 0, channel?.viewCount || 0);

  const handleExportVideos = () => {
    if (filteredVideos.length > 0) {
      exportVideosToCSV(filteredVideos, `videos-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const handleExportMetrics = () => {
    if (channel) {
      exportChannelMetricsToCSV(metrics, channel.title, `metrics-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  // Video detail modal state
  const [selectedVideo, setSelectedVideo] = useState<VideoMetrics | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const onVideoSelect = (video: VideoMetrics) => {
    setSelectedVideo(video);
    setVideoModalOpen(true);
  };

  // Filters state
  const [filters, setFilters] = useState<{ tag?: string; minViews?: number }>({});
  if (filters.tag) {
    filteredVideos = filteredVideos.filter(v => (v.tags || []).includes(filters.tag!));
  }
  if (filters.minViews) {
    filteredVideos = filteredVideos.filter(v => (v.views || 0) >= filters.minViews!);
  }

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

        <div className="absolute top-4 right-4 z-20">
          <Suspense fallback={<div className="p-1 bg-card/50 rounded">...</div>}>
            <ThemeToggle />
          </Suspense>
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

      {/* Filters */}
      {stats && (
        <div className="mb-6">
          <VideoFilters videos={allVideos} onFilterChange={(f)=>setFilters(f)} />
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
              value={metrics.videoCount} 
              trend="up" 
              trendValue="Total" 
              description={`${filteredVideos.length} en el período seleccionado`}
              delay={200}
            />
            <MetricCard 
              title="Visualizaciones Totales" 
              value={formatNumber(channel?.viewCount || 0)} 
              trend="up" 
              trendValue="Todo tiempo" 
              description={`${formatNumber(metrics.avgViewsPerVideo)} vistas promedio/video`}
              delay={300}
            />
            <MetricCard 
              title="Engagement Promedio" 
              value={metrics.avgEngagementRate.toFixed(2) + '%'} 
              trend={metrics.avgEngagementRate > 5 ? "up" : "down"} 
              trendValue={metrics.avgEngagementRate > 5 ? "Excelente" : "Mejorable"} 
              description="Tasa de engagement del canal"
              delay={400}
            />
          </div>

          {/* KPI Panel */}
          <KPIPanel videos={filteredVideos} channelTitle={channel?.title} />

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="border border-border bg-card p-4 rounded">
              <p className="text-xs text-muted-foreground font-mono mb-2">VISTAS PROMEDIO</p>
              <p className="text-2xl font-bold font-mono text-primary">{formatNumber(metrics.avgViewsPerVideo)}</p>
              <p className="text-xs text-muted-foreground mt-1">Por video en período</p>
            </div>
            <div className="border border-border bg-card p-4 rounded">
              <p className="text-xs text-muted-foreground font-mono mb-2">LIKES PROMEDIO</p>
              <p className="text-2xl font-bold font-mono text-primary">{formatNumber(metrics.avgLikesPerVideo)}</p>
              <p className="text-xs text-muted-foreground mt-1">Por video en período</p>
            </div>
            <div className="border border-border bg-card p-4 rounded">
              <p className="text-xs text-muted-foreground font-mono mb-2">FILTROS ACTIVOS</p>
              <div className="flex items-center gap-2 mt-2">
                <DateRangePicker 
                  onRangeChange={handleDateRangeChange}
                />
              </div>
            </div>
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
              
              <div className="mt-8 p-4 border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-primary">ESTADO</span>
                  <span className="text-xs font-mono text-primary animate-pulse">ACTIVO</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportMetrics}
                    size="sm"
                    className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 font-mono rounded-none border border-primary/30 text-xs gap-1"
                  >
                    <Download className="w-3 h-3" />
                    EXPORTAR
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <TrendChart videos={filteredVideos} period="weekly" />
            </div>
          )}

          {/* Video Comparison */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <h2 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary" />
                ANÁLISIS COMPARATIVO DE VIDEOS
              </h2>
              <VideoComparison best={best} worst={worst} />
            </div>
          )}

          {/* Videos Table */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary" />
                  TODOS LOS VIDEOS - DETALLES COMPLETOS ({filteredVideos.length})
                </h2>
                <Button
                  onClick={handleExportVideos}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-none border border-primary text-xs gap-1"
                >
                  <Download className="w-3 h-3" />
                  EXPORTAR CSV
                </Button>
              </div>
              <VideoTable videos={filteredVideos} onVideoSelect={onVideoSelect} />
            </div>
          )}

          {/* Engagement Chart */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <EngagementChart videos={filteredVideos} />
            </div>
          )}

          {/* Channel Health Report */}
          {filteredVideos.length > 0 && channel && (
            <div className="mb-12">
              <ChannelHealth metrics={metrics} videos={filteredVideos} />
            </div>
          )}

          {/* Top Videos */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <TopVideos videos={filteredVideos} limit={5} />
            </div>
          )}

          {/* Videos Grid */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-mono text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary" />
                  BÚSQUEDA DE VIDEOS
                </h2>
              </div>
              <div className="mb-6">
                <VideoSearch onSearch={handleVideoSearch} />
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <h2 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-primary" />
                VIDEOS CON MEJOR RENDIMIENTO
              </h2>
              <VideoGrid videos={filteredVideos} />
            </div>
          )}

          {/* Video detail modal */}
          <VideoDetailModal video={selectedVideo} open={videoModalOpen} onClose={() => setVideoModalOpen(false)} />

          {/* Day of Week Analytics */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando análisis por día...</div>}>
                <DayOfWeekAnalytics videos={filteredVideos} />
              </Suspense>
            </div>
          )}

          {/* Growth Analytics */}
          {channel && (
            <div className="mb-12">
              <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando métricas de crecimiento...</div>}>
                <GrowthAnalytics channelTitle={channel.title} />
              </Suspense>
            </div>
          )}

          {/* Visual Tools: Subscriber Growth + Engagement + Watch Time */}
          {filteredVideos.length > 0 && (
            <div className="mb-12 grid gap-6 lg:grid-cols-3">
              <div id="subs-chart" className="col-span-1">
                <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando gráfico...</div>}>
                  <SubscriberGrowthChart videos={filteredVideos} />
                  <div className="mt-2 flex gap-2">
                    <Suspense>
                      <ChartExportButton targetId="subs-chart" filename={`subs-${new Date().toISOString().split('T')[0]}.png`} />
                    </Suspense>
                  </div>
                </Suspense>
              </div>

              <div id="engagement-chart" className="col-span-1">
                <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando gráfico...</div>}>
                  <EngagementOverTime videos={filteredVideos} />
                  <div className="mt-2">
                    <ChartExportButton targetId="engagement-chart" filename={`engagement-${new Date().toISOString().split('T')[0]}.png`} />
                  </div>
                </Suspense>
              </div>

              <div id="watchtime-chart" className="col-span-1">
                <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando gráfico...</div>}>
                  <WatchTimeByVideo videos={filteredVideos} />
                  <div className="mt-2">
                    <ChartExportButton targetId="watchtime-chart" filename={`watchtime-${new Date().toISOString().split('T')[0]}.png`} />
                  </div>
                </Suspense>
              </div>
            </div>
          )}

          {/* Audience Demographics */}
          {channel && (
            <div className="mb-12">
              <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando demografía...</div>}>
                <AudienceDemographics channelTitle={channel.title} />
              </Suspense>
            </div>
          )}

          {/* Content Calendar */}
          {filteredVideos.length > 0 && (
            <div className="mb-12">
              <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando calendario...</div>}>
                <ContentCalendar videos={filteredVideos} />
              </Suspense>
            </div>
          )}

          {/* Channel Comparison */}
          <div className="mb-12">
            <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando comparación...</div>}>
              <ChannelComparison />
            </Suspense>
          </div>
          
          {/* Traffic Sources & Retention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando fuentes...</div>}>
              <TrafficSourcesChart />
            </Suspense>
            <Suspense fallback={<div className="p-4 border border-border rounded bg-card">Cargando retención...</div>}>
              <RetentionHeatmap videos={filteredVideos} />
            </Suspense>
          </div>
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
