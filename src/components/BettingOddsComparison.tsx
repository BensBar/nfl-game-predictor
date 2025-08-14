import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { BettingComparison, BettingOdds, NFLTeam } from '@/types/nfl'
import { getBettingOddsComparison } from '@/lib/betting-api'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  Clock, 
  Users,
  Target,
  Info,
  ExternalLink
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BettingOddsComparisonProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  gameId: string
}

export function BettingOddsComparison({ homeTeam, awayTeam, gameId }: BettingOddsComparisonProps) {
  const [bettingData, setBettingData] = useState<BettingComparison | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSportsbook, setSelectedSportsbook] = useState<string>('best')

  useEffect(() => {
    loadBettingData()
  }, [gameId, homeTeam.id, awayTeam.id])

  const loadBettingData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getBettingOddsComparison(gameId, homeTeam.abbreviation, awayTeam.abbreviation)
      setBettingData(data)
    } catch (err) {
      console.error('Error loading betting data:', err)
      setError('Failed to load betting odds data')
      toast.error('Unable to fetch betting odds')
    } finally {
      setIsLoading(false)
    }
  }

  const formatOdds = (odds: number): string => {
    return odds > 0 ? `+${odds}` : `${odds}`
  }

  const formatSpread = (spread: number): string => {
    return spread > 0 ? `+${spread}` : `${spread}`
  }

  const getSpreadTrend = (current: number, previous?: number) => {
    if (!previous) return <Minus className="w-4 h-4 text-muted-foreground" />
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getBestValueBadge = (odds: BettingOdds, type: 'home' | 'away' | 'over' | 'under') => {
    return (
      <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
        Best Value
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="text-primary" />
            Betting Odds Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Spinner className="w-8 h-8 mx-auto mb-4" />
              <p className="text-muted-foreground">Loading odds from multiple sportsbooks...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !bettingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="text-primary" />
            Betting Odds Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {error || 'Betting odds temporarily unavailable. Using historical data for predictions.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="text-primary" />
            Betting Odds Comparison
            <Badge variant="secondary" className="ml-auto">
              Live Odds
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="spreads" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="spreads">Point Spreads</TabsTrigger>
              <TabsTrigger value="moneylines">Moneylines</TabsTrigger>
              <TabsTrigger value="totals">Over/Under</TabsTrigger>
              <TabsTrigger value="consensus">Consensus</TabsTrigger>
            </TabsList>

            <TabsContent value="spreads" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {awayTeam.city} {awayTeam.name}
                      <span className="text-sm font-normal text-muted-foreground">@ Away</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Spread:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatSpread(bettingData.bestAwaySpread.awaySpread)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({formatOdds(bettingData.bestAwaySpread.awaySpreadOdds)})
                          </span>
                          {getBestValueBadge(bettingData.bestAwaySpread, 'away')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestAwaySpread.sportsbook}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {homeTeam.city} {homeTeam.name}
                      <span className="text-sm font-normal text-muted-foreground">Home</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Spread:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatSpread(bettingData.bestHomeSpread.homeSpread)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({formatOdds(bettingData.bestHomeSpread.homeSpreadOdds)})
                          </span>
                          {getBestValueBadge(bettingData.bestHomeSpread, 'home')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestHomeSpread.sportsbook}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Market Average:</span>
                  <span className="text-lg font-bold">
                    {formatSpread(bettingData.averageSpread)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {bettingData.oddsMovement.length} sportsbooks
                </div>
              </div>
            </TabsContent>

            <TabsContent value="moneylines" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {awayTeam.city} {awayTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Odds:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatOdds(bettingData.bestAwayMoneyline.awayMoneyline)}
                          </span>
                          {getBestValueBadge(bettingData.bestAwayMoneyline, 'away')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestAwayMoneyline.sportsbook}
                      </div>
                      <div className="text-sm">
                        Implied Probability: {(100 / (Math.abs(bettingData.bestAwayMoneyline.awayMoneyline) / 100 + 1)).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {homeTeam.city} {homeTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Odds:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatOdds(bettingData.bestHomeMoneyline.homeMoneyline)}
                          </span>
                          {getBestValueBadge(bettingData.bestHomeMoneyline, 'home')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestHomeMoneyline.sportsbook}
                      </div>
                      <div className="text-sm">
                        Implied Probability: {(100 / (Math.abs(bettingData.bestHomeMoneyline.homeMoneyline) / 100 + 1)).toFixed(1)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="totals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-orange-200 bg-orange-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Over {bettingData.averageTotal}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Odds:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatOdds(bettingData.bestOver.overOdds)}
                          </span>
                          {getBestValueBadge(bettingData.bestOver, 'over')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestOver.sportsbook}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingDown className="w-5 h-5" />
                      Under {bettingData.averageTotal}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Best Odds:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            {formatOdds(bettingData.bestUnder.underOdds)}
                          </span>
                          {getBestValueBadge(bettingData.bestUnder, 'under')}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        via {bettingData.bestUnder.sportsbook}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Market Average Total:</span>
                  <span className="text-lg font-bold">{bettingData.averageTotal}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="consensus" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-primary" />
                    Public Betting Consensus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Point Spread Bets</span>
                        <span className="text-sm text-muted-foreground">
                          {bettingData.consensus.homeSpreadPercent + bettingData.consensus.awaySpreadPercent}% of bets tracked
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{awayTeam.abbreviation} {formatSpread(bettingData.averageSpread)}</span>
                          <span className="text-sm font-medium">{bettingData.consensus.awaySpreadPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">{homeTeam.abbreviation} {formatSpread(-bettingData.averageSpread)}</span>
                          <span className="text-sm font-medium">{bettingData.consensus.homeSpreadPercent}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={bettingData.consensus.awaySpreadPercent} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Over/Under Bets</span>
                        <span className="text-sm text-muted-foreground">
                          Total: {bettingData.averageTotal}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Over {bettingData.averageTotal}</span>
                          <span className="text-sm font-medium">{bettingData.consensus.overPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Under {bettingData.averageTotal}</span>
                          <span className="text-sm font-medium">{bettingData.consensus.underPercent}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={bettingData.consensus.overPercent} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <Target className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Sharp vs Public:</strong> When public heavily favors one side, 
                      consider the contrarian play as sharp money often goes the other way.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {bettingData.oddsMovement.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="text-primary" />
                  Recent Odds Movement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bettingData.oddsMovement.slice(0, 5).map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{movement.sportsbook}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(movement.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span>Spread: {formatSpread(movement.homeSpread)}</span>
                          {getSpreadTrend(movement.homeSpread)}
                        </div>
                        <div>
                          O/U: {movement.overUnder}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm">Data Sources</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• Odds data from 10+ major sportsbooks including DraftKings, FanDuel, BetMGM</div>
              <div>• Real-time updates every 5 minutes during business hours</div>
              <div>• Consensus data from Vegas Insider and Action Network</div>
              <div>• Last updated: {new Date(bettingData.bestHomeSpread.lastUpdated).toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}