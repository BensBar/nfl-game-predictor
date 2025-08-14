import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAPIStatus } from '@/hooks/useSportsData'
import { 
  Database, 
  Info, 
  Calculator, 
  Calendar, 
  WifiHigh, 
  Activity, 
  Cloud,
  CurrencyDollar,
  Gauge,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'

export function DataSources() {
  const { status, loading } = useAPIStatus()

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 95) return 'text-green-600'
    if (reliability >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <Alert className="border-green-200 bg-green-50/50">
        <Activity className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>✅ Real API Integration Active:</strong> Now using live ESPN NFL API, OpenWeather API, and The Odds API for authentic data. No more fake data generation!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiHigh className="text-primary" />
              Live Data APIs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {status?.providers?.map((provider: any) => (
                  <div key={provider.name} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{provider.name}</div>
                      <Badge variant={provider.status === 'available' ? 'default' : 'secondary'}>
                        {provider.status === 'available' ? 'Active' : 'Limited'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Reliability</span>
                      <span className={`font-medium ${getReliabilityColor(provider.reliability)}`}>
                        {provider.reliability}%
                      </span>
                    </div>
                    <Progress value={provider.reliability} className="h-1 mt-1" />
                  </div>
                )) || []}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="text-primary" />
              Data Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Activity className="text-green-600" size={20} />
                <div>
                  <div className="font-medium">Live ESPN NFL API</div>
                  <div className="text-sm text-muted-foreground">Real-time scores, schedules & game status</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Gauge className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Official NFL Statistics</div>
                  <div className="text-sm text-muted-foreground">Team stats via multiple verified sources</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Warning className="text-orange-600" size={20} />
                <div>
                  <div className="font-medium">Live Injury Reports</div>
                  <div className="text-sm text-muted-foreground">Real-time player status with impact analysis</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Cloud className="text-cyan-600" size={20} />
                <div>
                  <div className="font-medium">OpenWeather API</div>
                  <div className="text-sm text-muted-foreground">Live weather conditions for outdoor stadiums</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CurrencyDollar className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium">The Odds API</div>
                  <div className="text-sm text-muted-foreground">Real sportsbook lines and market data</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="text-primary" />
            Enhanced Prediction Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="text-green-600" size={20} />
                <h3 className="font-semibold">Real-Time Factors</h3>
                <Badge variant="default" className="text-xs">Live Data</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Live player injury status from official NFL sources</li>
                <li>• Real-time position-specific impact analysis</li>
                <li>• Depth chart quality from verified team data</li>
                <li>• Weather conditions from OpenWeather API</li>
                <li>• Actual performance trends from ESPN API</li>
                <li>• Home field advantage calculations</li>
                <li>• Market consensus from live sportsbook data</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="text-blue-600" size={20} />
                <h3 className="font-semibold">Historical Analytics</h3>
                <Badge variant="secondary" className="text-xs">API Data</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Live season statistics from ESPN & NFL APIs</li>
                <li>• Real head-to-head matchup data</li>
                <li>• Advanced metrics from verified sources</li>
                <li>• Authentic strength of schedule data</li>
                <li>• Current division and conference standings</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="text-purple-600" size={20} />
                <h3 className="font-semibold">Machine Learning Components</h3>
                <Badge variant="outline" className="text-xs">Enhanced</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Multi-API data validation and cross-referencing</li>
                <li>• Real-time model updates based on live data</li>
                <li>• Dynamic weighting based on data source reliability</li>
                <li>• Continuous accuracy improvement from real outcomes</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Prediction Accuracy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-green-600">Live</div>
                <div className="text-sm text-muted-foreground">Real-Time Data</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-blue-600">4 APIs</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-purple-600">30s</div>
                <div className="text-sm text-muted-foreground">Refresh Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={16} />
              Data Quality Assurance
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All predictions now use live data from ESPN NFL API, OpenWeather API, The Odds API, and official NFL sources. 
              Data is refreshed in real-time with rate limiting and caching for optimal performance. This represents a significant 
              upgrade from simulated data to authentic sports analytics. Use for entertainment and educational purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}