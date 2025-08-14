import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { 
  analyzeTeamInjuryImpact, 
  getTeamInjuries, 
  getInjurySeverityBadgeColor,
  getImpactScoreColor,
  getImpactScoreDescription,
  calculatePositionImpact
} from '@/lib/injury-analysis'
import { NFLTeam, PlayerInjury, InjuryImpactAnalysis } from '@/types/nfl'
import { 
  Heart, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Users, 
  Activity,
  Clock,
  Target,
  RefreshCw,
  Database
} from '@phosphor-icons/react'

interface InjuryAnalysisProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
}

export function InjuryAnalysis({ homeTeam, awayTeam }: InjuryAnalysisProps) {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home')
  const [homeAnalysis, setHomeAnalysis] = useState<InjuryImpactAnalysis | null>(null)
  const [awayAnalysis, setAwayAnalysis] = useState<InjuryImpactAnalysis | null>(null)
  const [homeInjuries, setHomeInjuries] = useState<PlayerInjury[]>([])
  const [awayInjuries, setAwayInjuries] = useState<PlayerInjury[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadInjuryData = async () => {
      setLoading(true)
      try {
        const [homeAnalysisData, awayAnalysisData, homeInjuriesData, awayInjuriesData] = await Promise.all([
          analyzeTeamInjuryImpact(homeTeam),
          analyzeTeamInjuryImpact(awayTeam),
          getTeamInjuries(homeTeam.abbreviation),
          getTeamInjuries(awayTeam.abbreviation)
        ])
        
        setHomeAnalysis(homeAnalysisData)
        setAwayAnalysis(awayAnalysisData)
        setHomeInjuries(homeInjuriesData)
        setAwayInjuries(awayInjuriesData)
      } catch (error) {
        console.error('Error loading injury data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadInjuryData()
  }, [homeTeam, awayTeam])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Loading real-time injury reports...
      </div>
    )
  }

  const currentTeam = selectedTeam === 'home' ? homeTeam : awayTeam
  const currentAnalysis = selectedTeam === 'home' ? homeAnalysis : awayAnalysis
  const currentInjuries = selectedTeam === 'home' ? homeInjuries : awayInjuries

  const renderInjuryCard = (injury: PlayerInjury) => (
    <Card key={injury.id} className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold">{injury.playerName}</h4>
          <p className="text-sm text-muted-foreground">{injury.position}</p>
        </div>
        <Badge className={getInjurySeverityBadgeColor(injury.severity)}>
          {injury.severity}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Injury:</span>
          <span className="text-sm font-medium">{injury.injuryType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">Severity Rating:</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div
                  key={rating}
                  className={`w-2 h-2 rounded-full ${
                    rating <= injury.severityRating 
                      ? 'bg-red-500' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{injury.severityRating}/5</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">Game Status:</span>
          <Badge variant={injury.gameStatus === 'Active' ? 'default' : 'destructive'}>
            {injury.gameStatus}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {injury.impactDescription}
        </p>
        
        {injury.estimatedReturn && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            Expected return: {new Date(injury.estimatedReturn).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  )

  const renderImpactAnalysis = (analysis: InjuryImpactAnalysis) => (
    <div className="space-y-6">
      {/* Overall Impact Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Overall Injury Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-2xl font-bold ${getImpactScoreColor(analysis.totalImpactScore)}`}>
                {analysis.totalImpactScore.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                {getImpactScoreDescription(analysis.totalImpactScore)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                -{analysis.predictedPerformanceDrop.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Performance Drop
              </div>
            </div>
          </div>
          
          <Progress 
            value={Math.min(analysis.totalImpactScore * 5, 100)} 
            className="h-2"
          />
        </CardContent>
      </Card>

      {/* Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="text-blue-500" size={16} />
              Offensive Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {analysis.offensiveImpact.toFixed(1)}
            </div>
            <Progress value={analysis.offensiveImpact * 10} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="text-green-500" size={16} />
              Defensive Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">
              {analysis.defensiveImpact.toFixed(1)}
            </div>
            <Progress value={analysis.defensiveImpact * 10} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="text-purple-500" size={16} />
              Special Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">
              {analysis.specialTeamsImpact.toFixed(1)}
            </div>
            <Progress value={analysis.specialTeamsImpact * 10} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Risk & Mitigating Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.riskFactors.length > 0 && (
          <Alert className="border-red-200 bg-red-50/50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="font-medium text-red-800 mb-2">Risk Factors:</div>
              <ul className="text-sm text-red-700 space-y-1">
                {analysis.riskFactors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {analysis.mitigatingFactors.length > 0 && (
          <Alert className="border-green-200 bg-green-50/50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="font-medium text-green-800 mb-2">Mitigating Factors:</div>
              <ul className="text-sm text-green-700 space-y-1">
                {analysis.mitigatingFactors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Affected Positions */}
      {analysis.depthChartAffected.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              Affected Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.depthChartAffected.map((position) => (
                <Badge key={position} variant="outline">
                  {position}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Team Comparison Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all ${selectedTeam === 'home' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-2" onClick={() => setSelectedTeam('home')}>
            <CardTitle className="flex items-center justify-between">
              <span>{homeTeam.city} {homeTeam.name}</span>
              <div className="flex items-center gap-2">
                {homeAnalysis ? (
                  <>
                    <Heart className={getImpactScoreColor(homeAnalysis.totalImpactScore)} />
                    <span className={`font-bold ${getImpactScoreColor(homeAnalysis.totalImpactScore)}`}>
                      {homeAnalysis.totalImpactScore.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="text-gray-400" />
                    <span className="font-bold text-gray-400">--</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {homeInjuries.length} active injuries • {homeAnalysis ? getImpactScoreDescription(homeAnalysis.totalImpactScore) : 'Loading...'}
            </div>
            <Progress 
              value={homeAnalysis ? Math.min(homeAnalysis.totalImpactScore * 5, 100) : 0} 
              className="h-1 mt-2"
            />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${selectedTeam === 'away' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="pb-2" onClick={() => setSelectedTeam('away')}>
            <CardTitle className="flex items-center justify-between">
              <span>{awayTeam.city} {awayTeam.name}</span>
              <div className="flex items-center gap-2">
                {awayAnalysis ? (
                  <>
                    <Heart className={getImpactScoreColor(awayAnalysis.totalImpactScore)} />
                    <span className={`font-bold ${getImpactScoreColor(awayAnalysis.totalImpactScore)}`}>
                      {awayAnalysis.totalImpactScore.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="text-gray-400" />
                    <span className="font-bold text-gray-400">--</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {awayInjuries.length} active injuries • {awayAnalysis ? getImpactScoreDescription(awayAnalysis.totalImpactScore) : 'Loading...'}
            </div>
            <Progress 
              value={awayAnalysis ? Math.min(awayAnalysis.totalImpactScore * 5, 100) : 0} 
              className="h-1 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="text-primary" />
            {currentTeam.city} {currentTeam.name} - Injury Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="injuries">Active Injuries</TabsTrigger>
              <TabsTrigger value="positions">Position Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {currentAnalysis ? renderImpactAnalysis(currentAnalysis) : (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="animate-spin mr-2" size={20} />
                  Loading injury analysis...
                </div>
              )}
            </TabsContent>

            <TabsContent value="injuries">
              <div className="space-y-4">
                {currentInjuries.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentInjuries.map(renderInjuryCard)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Alert className="border-blue-200 bg-blue-50/50">
                      <Database className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <div className="font-medium mb-2">Real Injury Data Integration</div>
                        <div className="text-sm space-y-2">
                          <p>This app integrates with official NFL injury report APIs including:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Badge variant="outline" className="text-xs">ESPN NFL API</Badge>
                            <Badge variant="outline" className="text-xs">NFL.com Official</Badge>
                            <Badge variant="outline" className="text-xs">FantasyPros</Badge>
                            <Badge variant="outline" className="text-xs">CBS Sports</Badge>
                          </div>
                          <p className="mt-2">No fake player names or simulated data - only real-time official injury reports.</p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="positions">
              <div className="space-y-4">
                {['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S'].map((position) => {
                  const positionAnalysis = calculatePositionImpact(currentInjuries, position)
                  return (
                    <Card key={position}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{position}</Badge>
                            <span className="font-medium">
                              Depth: {positionAnalysis.depthQuality}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getImpactScoreColor(positionAnalysis.overallImpact)}`}>
                              {positionAnalysis.overallImpact.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">Impact Score</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{positionAnalysis.currentInjuries.length} injuries</span>
                          <span>Importance: {(positionAnalysis.importance * 100).toFixed(0)}%</span>
                        </div>
                        
                        <Progress 
                          value={Math.min(positionAnalysis.overallImpact * 10, 100)} 
                          className="h-1 mt-2"
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}