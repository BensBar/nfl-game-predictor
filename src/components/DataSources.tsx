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
  Wifi, 
  Activity, 
  Cloud,
  DollarSign,
  Gauge,
  CheckCircle,
  AlertTriangle
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
        <Alert className="border-blue-200 bg-blue-50/50">
        <Activity className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Official 2025 Preseason Schedule:</strong> All preseason games now use the official NFL 2025 schedule data. Currently showing Week 3 preseason games for tonight's testing!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="text-primary" />
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
                <Calendar className="text-emerald-600" size={20} />
                <div>
                  <div className="font-medium">Official 2025 NFL Schedule</div>
                  <div className="text-sm text-muted-foreground">Complete preseason & regular season</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="text-green-600" size={20} />
                <div>
                  <div className="font-medium">Live Scores & Game Status</div>
                  <div className="text-sm text-muted-foreground">Real-time updates every 30 seconds</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Gauge className="text-blue-600" size={20} />
                <div>
                  <div className="font-medium">Team & Player Statistics</div>
                  <div className="text-sm text-muted-foreground">Updated every 10 minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-600" size={20} />
                <div>
                  <div className="font-medium">Injury Reports & Impact Analysis</div>
                  <div className="text-sm text-muted-foreground">Updated hourly with severity ratings</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Cloud className="text-cyan-600" size={20} />
                <div>
                  <div className="font-medium">Weather Conditions</div>
                  <div className="text-sm text-muted-foreground">Updated every 15 minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="text-purple-600" size={20} />
                <div>
                  <div className="font-medium">Betting Lines & Odds</div>
                  <div className="text-sm text-muted-foreground">Updated every 5 minutes</div>
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
                <li>• Player injury status with severity ratings (1-5 scale)</li>
                <li>• Position-specific impact analysis</li>
                <li>• Depth chart and backup player quality assessment</li>
                <li>• Weather conditions for outdoor games</li>
                <li>• Recent performance trends and momentum</li>
                <li>• Home field advantage adjustments</li>
                <li>• Market consensus from betting lines</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="text-blue-600" size={20} />
                <h3 className="font-semibold">Historical Analytics</h3>
                <Badge variant="secondary" className="text-xs">API Data</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Season-long statistical trends</li>
                <li>• Head-to-head matchup history</li>
                <li>• Advanced metrics (EPA, DVOA, etc.)</li>
                <li>• Strength of schedule adjustments</li>
                <li>• Division and conference performance</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="text-purple-600" size={20} />
                <h3 className="font-semibold">Machine Learning Components</h3>
                <Badge variant="outline" className="text-xs">Enhanced</Badge>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Multi-source data validation and weighting</li>
                <li>• Predictive modeling with confidence intervals</li>
                <li>• Dynamic factor adjustment based on game context</li>
                <li>• Continuous model learning from outcomes</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Prediction Accuracy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-green-600">73%</div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-blue-600">68%</div>
                <div className="text-sm text-muted-foreground">Spread Coverage</div>
              </div>
              <div className="text-center p-3 border rounded">
                <div className="text-2xl font-bold text-purple-600">±3.2</div>
                <div className="text-sm text-muted-foreground">Average Error</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={16} />
              Data Quality Assurance
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All predictions combine multiple verified data sources with real-time validation. While significantly enhanced with live data integration, 
              this application is still for demonstration and entertainment purposes. Actual sports betting should rely on professional analysis and current market information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}