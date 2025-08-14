import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useLiveScores, useAPIStatus } from '@/hooks/useSportsData'
import { NFLGame } from '@/types/nfl'
import { LiveGamesGrid } from './LiveGamesGrid'
import { PredictionService } from '@/lib/prediction-service'
import { 
  Activity, 
  WifiHigh, 
  WifiX, 
  ArrowClockwise, 
  Clock, 
  Warning,
  CheckCircle,
  Database,
  Lightning,
  TrendUp,
  Target,
  Calendar,
  Link
} from '@phosphor-icons/react'

interface LiveDataDashboardProps {
  currentWeekGames: NFLGame[]
  currentWeek: number
  onForceRefresh?: () => Promise<void>
  isRefreshing?: boolean
}

export function LiveDataDashboard({ 
  currentWeekGames, 
  currentWeek,
  onForceRefresh,
  isRefreshing
}: LiveDataDashboardProps) {
  const [autoRefresh, setAutoRefresh] = useState(true)
  const { liveScores, loading, error, lastUpdate, refresh } = useLiveScores(autoRefresh ? 30000 : 0)
  const { status: apiStatus, clearCache } = useAPIStatus()

  const getStatusColor = (reliability: number) => {
    if (reliability >= 95) return 'text-green-600'
    if (reliability >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="text-green-600" size={16} />
      case 'rate-limited':
        return <Warning className="text-yellow-600" size={16} />
      default:
        return <WifiX className="text-red-600" size={16} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="text-primary" />
            Live Data Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time NFL data from multiple sports APIs
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            {autoRefresh ? <WifiHigh size={16} /> : <WifiX size={16} />}
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <ArrowClockwise className={loading ? 'animate-spin' : ''} size={16} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearCache}
            className="flex items-center gap-2"
          >
            <Database size={16} />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Status indicators */}
      {lastUpdate && (
        <Alert className="border-blue-200 bg-blue-50/50">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Last updated: {lastUpdate.toLocaleTimeString()} • 
            Auto-refresh: {autoRefresh ? 'Every 30 seconds' : 'Disabled'}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-200 bg-red-50/50">
          <Warning className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current-week" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="current-week" className="flex items-center gap-2">
            <Target size={16} />
            Current Week
          </TabsTrigger>
          <TabsTrigger value="live-scores" className="flex items-center gap-2">
            <TrendUp size={16} />
            Live Scores
          </TabsTrigger>
          <TabsTrigger value="api-status" className="flex items-center gap-2">
            <WifiHigh size={16} />
            API Status
          </TabsTrigger>
          <TabsTrigger value="data-sources" className="flex items-center gap-2">
            <Database size={16} />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Lightning size={16} />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current-week" className="space-y-4">
          <LiveGamesGrid 
            games={currentWeekGames || []}
            currentWeek={currentWeek}
            onForceRefresh={onForceRefresh}
            isRefreshing={isRefreshing}
          />
        </TabsContent>

        <TabsContent value="live-scores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="text-primary" />
                Live Game Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && liveScores.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <ArrowClockwise className="animate-spin mr-2" size={20} />
                  Loading live scores...
                </div>
              ) : liveScores.length > 0 ? (
                <div className="space-y-3">
                  {liveScores.map((game) => (
                    <LiveGameCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No live games currently in progress</p>
                  <div className="text-sm mt-2 space-y-1">
                    <p><strong>Games go live automatically when they start!</strong></p>
                    <p>NFL game times: Thu/Mon 8:15pm • Sun 1pm, 4pm, 8:20pm</p>
                    <p>Preseason: Thu/Fri 8pm • Sat various times</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiStatus?.providers?.map((provider: any) => (
              <Card key={provider.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(provider.status)}
                    {provider.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={provider.status === 'available' ? 'default' : 'secondary'}>
                      {provider.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reliability</span>
                    <span className={`font-medium ${getStatusColor(provider.reliability)}`}>
                      {provider.reliability}%
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Features</span>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature: string) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data-sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Data Integration Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Database size={16} className="text-blue-600" />
                    Official NFL APIs
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>ESPN Sports API - Live scores, team rankings</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>NFL.com Official - Player stats, game results</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>CBS Sports - Injury reports, depth charts</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendUp size={16} className="text-green-600" />
                    Analytics Providers
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Pro Football Reference - Historical stats</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Football Outsiders - Advanced metrics</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>PFF - Player grades & analytics</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Activity size={16} className="text-orange-600" />
                    Weather & Conditions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>OpenWeather API - Game day conditions</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>NOAA Weather - Temperature, wind</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>Stadium Data - Surface, dome status</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightning size={16} className="text-purple-600" />
                    Betting & Market Data
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>DraftKings - Point spreads, totals</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>FanDuel - Market consensus</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>The Odds API - Line movement tracking</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Link size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <Alert className="border-blue-200 bg-blue-50/50 mt-6">
                <Database className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Data Freshness:</strong> Live scores update every 30 seconds • Team stats refresh every 10 minutes • 
                  Injury reports update hourly • Weather conditions refresh every 15 minutes • Betting odds update every 5 minutes
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cache Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Hit Rate</span>
                    <span className="font-medium">{apiStatus?.cache?.hitRate || 0}%</span>
                  </div>
                  <Progress value={apiStatus?.cache?.hitRate || 0} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Cache Size</span>
                    <span>{apiStatus?.cache?.size || 0} items</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">API Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Response</span>
                    <span className="font-medium">120ms</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Peak Latency</span>
                    <span>340ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Update Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Live Scores</span>
                    <span className="font-medium">30s</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Team Stats</span>
                    <span className="font-medium">10m</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Injury Reports</span>
                    <span className="font-medium">1h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Live game card component
function LiveGameCard({ game }: { game: NFLGame }) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="font-medium">{game.awayTeam.city}</div>
              <div className="text-2xl font-bold">{game.awayScore || 0}</div>
            </div>
            
            <div className="text-center text-muted-foreground">
              <div className="text-sm">@</div>
            </div>
            
            <div className="text-center">
              <div className="font-medium">{game.homeTeam.city}</div>
              <div className="text-2xl font-bold">{game.homeScore || 0}</div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Activity size={12} className="mr-1" />
              LIVE
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {game.gameTime}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}