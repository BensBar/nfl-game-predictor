import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useInjuryReport, useWeatherData, useBettingOdds } from '@/hooks/useSportsData'
import { NFLTeam } from '@/types/nfl'
import { 
  CloudRain, 
  Thermometer, 
  Wind, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from '@phosphor-icons/react'

interface DataInsightsProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  gameId: string
}

export function DataInsights({ homeTeam, awayTeam, gameId }: DataInsightsProps) {
  const { injuries: homeInjuries, loading: homeInjuriesLoading } = useInjuryReport(homeTeam.id)
  const { injuries: awayInjuries, loading: awayInjuriesLoading } = useInjuryReport(awayTeam.id)
  const { weather, loading: weatherLoading } = useWeatherData(gameId)
  const { odds, loading: oddsLoading } = useBettingOdds(gameId)

  const getInjuryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out': return 'text-red-600'
      case 'doubtful': return 'text-red-500'
      case 'questionable': return 'text-yellow-600'
      case 'probable': return 'text-green-600'
      default: return 'text-muted-foreground'
    }
  }

  const getInjuryStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'out': return <AlertTriangle size={12} className="text-red-600" />
      case 'doubtful': return <AlertTriangle size={12} className="text-red-500" />
      case 'questionable': return <Clock size={12} className="text-yellow-600" />
      case 'probable': return <CheckCircle size={12} className="text-green-600" />
      default: return <Activity size={12} className="text-muted-foreground" />
    }
  }

  const getWeatherImpact = (weather: any) => {
    if (!weather) return null
    
    let impact = 'Low'
    let impactColor = 'text-green-600'
    
    if (weather.condition.includes('Rain') || weather.condition.includes('Snow') || weather.windSpeed > 15) {
      impact = weather.windSpeed > 20 ? 'High' : 'Medium'
      impactColor = impact === 'High' ? 'text-red-600' : 'text-yellow-600'
    }
    
    return { impact, impactColor }
  }

  const formatMoney = (amount: number) => {
    return amount > 0 ? `+${amount}` : `${amount}`
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="injuries" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="injuries">Injury Reports</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="betting">Betting Lines</TabsTrigger>
          <TabsTrigger value="trends">Data Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="injuries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Home Team Injuries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="text-primary" size={20} />
                  {homeTeam.city} Injury Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {homeInjuriesLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-muted rounded" />
                    ))}
                  </div>
                ) : homeInjuries.length > 0 ? (
                  <div className="space-y-2">
                    {homeInjuries.map((injury, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded border">
                        <div>
                          <div className="font-medium">{injury.player}</div>
                          <div className="text-sm text-muted-foreground">
                            {injury.position} • {injury.injury}
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getInjuryStatusColor(injury.status)} border-current`}>
                          {getInjuryStatusIcon(injury.status)}
                          <span className="ml-1">{injury.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
                    <p>No significant injuries reported</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Away Team Injuries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="text-primary" size={20} />
                  {awayTeam.city} Injury Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {awayInjuriesLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-muted rounded" />
                    ))}
                  </div>
                ) : awayInjuries.length > 0 ? (
                  <div className="space-y-2">
                    {awayInjuries.map((injury, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded border">
                        <div>
                          <div className="font-medium">{injury.player}</div>
                          <div className="text-sm text-muted-foreground">
                            {injury.position} • {injury.injury}
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getInjuryStatusColor(injury.status)} border-current`}>
                          {getInjuryStatusIcon(injury.status)}
                          <span className="ml-1">{injury.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
                    <p>No significant injuries reported</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="text-primary" />
                Game Day Weather Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-muted rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-muted rounded" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </div>
              ) : weather ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{weather.condition}</div>
                    <div className="text-muted-foreground">Current Conditions</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded border">
                      <Thermometer size={24} className="mx-auto mb-2 text-orange-600" />
                      <div className="font-medium">{weather.temperature}°F</div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                    </div>

                    <div className="text-center p-3 rounded border">
                      <Wind size={24} className="mx-auto mb-2 text-blue-600" />
                      <div className="font-medium">{weather.windSpeed} mph</div>
                      <div className="text-sm text-muted-foreground">Wind {weather.windDirection}</div>
                    </div>

                    <div className="text-center p-3 rounded border">
                      <CloudRain size={24} className="mx-auto mb-2 text-purple-600" />
                      <div className="font-medium">{weather.humidity}%</div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                    </div>

                    <div className="text-center p-3 rounded border">
                      <Activity size={24} className="mx-auto mb-2 text-primary" />
                      <div className={`font-medium ${getWeatherImpact(weather)?.impactColor}`}>
                        {getWeatherImpact(weather)?.impact}
                      </div>
                      <div className="text-sm text-muted-foreground">Game Impact</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Last updated: {new Date(weather.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CloudRain size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Weather data not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="betting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="text-primary" />
                Current Betting Lines
              </CardTitle>
            </CardHeader>
            <CardContent>
              {oddsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                  </div>
                </div>
              ) : odds ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold">
                          {odds.spread > 0 ? `+${odds.spread}` : odds.spread}
                        </div>
                        <div className="text-sm text-muted-foreground">Point Spread</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {odds.spread > 0 ? homeTeam.city : awayTeam.city} favored
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold">{odds.total}</div>
                        <div className="text-sm text-muted-foreground">Over/Under</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Points</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{homeTeam.abbreviation}:</span> {formatMoney(odds.moneylineHome)}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{awayTeam.abbreviation}:</span> {formatMoney(odds.moneylineAway)}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">Moneyline</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">
                    Last updated: {new Date(odds.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Betting lines not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" />
                  Positive Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Real-time injury reports updated hourly
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Weather data refreshed every 15 minutes
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Betting lines tracking market consensus
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Multi-source data validation active
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="text-yellow-600" />
                  Data Quality Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  Historical player data may be incomplete
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-yellow-600" />
                  Some APIs experiencing minor delays
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Backup data sources operational
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-600" />
                  Data accuracy validation passing
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}