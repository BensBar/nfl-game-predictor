import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { getCurrentWeek, getGamesForWeek, calculatePrediction } from '@/lib/nfl-data'
import { NFLGame, Prediction, PredictionHistory } from '@/types/nfl'
import { PredictionResult } from '@/components/PredictionResult'
import { TeamComparison } from '@/components/TeamComparison'
import { PredictionHistoryComponent } from '@/components/PredictionHistory'
import { WeeklySchedule } from '@/components/WeeklySchedule'
import { DataSources } from '@/components/DataSources'
import { LiveDataDashboard } from '@/components/LiveDataDashboard'
import { DataInsights } from '@/components/DataInsights'
import { InjuryAnalysis } from '@/components/InjuryAnalysis'
import { BettingOddsComparison } from '@/components/BettingOddsComparison'
import { Target, ChartBar, Clock, Calendar, Database, Info, Activity, TrendingUp, Heart, DollarSign } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek())
  const [weekGames, setWeekGames] = useState<NFLGame[]>([])
  const [selectedGame, setSelectedGame] = useState<NFLGame | null>(null)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useKV<PredictionHistory[]>('prediction-history', [])

  useEffect(() => {
    const loadGames = async () => {
      try {
        console.log(`Loading games for week ${selectedWeek}...`)
        const games = await getGamesForWeek(selectedWeek)
        console.log(`Loaded ${games?.length || 0} games for week ${selectedWeek}`)
        setWeekGames(Array.isArray(games) ? games : [])
        setSelectedGame(null)
        setCurrentPrediction(null)
      } catch (error) {
        console.error('Error loading games for week:', selectedWeek, error)
        setWeekGames([])
        setSelectedGame(null)
        setCurrentPrediction(null)
        toast.error(`Error loading games for week ${selectedWeek < 0 ? `Preseason ${Math.abs(selectedWeek)}` : selectedWeek}`)
      }
    }
    
    loadGames()
  }, [selectedWeek])

  const handleWeekChange = (week: string) => {
    const weekNum = parseInt(week)
    setSelectedWeek(weekNum)
  }

  const handleGameSelect = (gameId: string) => {
    try {
      const game = Array.isArray(weekGames) ? weekGames.find(g => g.id === gameId) : null
      setSelectedGame(game || null)
      setCurrentPrediction(null)
    } catch (error) {
      console.error('Error selecting game:', gameId, error)
      setSelectedGame(null)
      setCurrentPrediction(null)
    }
  }

  const [isGeneratingPrediction, setIsGeneratingPrediction] = useState(false)
  
  const handlePredict = async () => {
    if (!selectedGame) {
      toast.error('Please select a game')
      return
    }

    if (selectedGame.isCompleted) {
      toast.error('Cannot predict completed games')
      return
    }

    setIsGeneratingPrediction(true)
    
    try {
      toast.success('🔄 Analyzing teams using live API data...')
      
      const result = await calculatePrediction(selectedGame.homeTeam, selectedGame.awayTeam)
      
      const prediction: Prediction = {
        id: Date.now().toString(),
        homeTeam: selectedGame.homeTeam,
        awayTeam: selectedGame.awayTeam,
        homeWinProbability: result.homeWinProbability,
        awayWinProbability: result.awayWinProbability,
        confidence: result.confidence,
        factors: result.factors,
        timestamp: Date.now()
      }

      setCurrentPrediction(prediction)
      toast.success(`🎯 Prediction complete! ${prediction.homeWinProbability > prediction.awayWinProbability ? selectedGame.homeTeam.city : selectedGame.awayTeam.city} favored with ${Math.max(prediction.homeWinProbability, prediction.awayWinProbability)}% probability`)
    } catch (error) {
      console.error('Error generating prediction:', error)
      toast.error('Failed to generate prediction. Please try again.')
    } finally {
      setIsGeneratingPrediction(false)
    }
  }

  const handleSavePrediction = () => {
    if (!currentPrediction) return
    
    try {
      setPredictions((current) => {
        const currentArray = Array.isArray(current) ? current : []
        return [currentPrediction, ...currentArray]
      })
      toast.success('Prediction saved to history!')
    } catch (error) {
      console.error('Error saving prediction:', error)
      toast.error('Failed to save prediction')
    }
  }

  const handleClearHistory = () => {
    setPredictions([])
    toast.success('History cleared')
  }

  const currentWeek = getCurrentWeek()
  const weekOptions = [
    ...Array.from({ length: 3 }, (_, i) => -(3 - i)), // Preseason weeks: -3, -2, -1  
    ...Array.from({ length: 18 }, (_, i) => i + 1)    // Regular season: 1-18
  ]

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">NFL Game Predictor</h1>
          <p className="text-lg text-muted-foreground mb-1">
            Advanced AI-powered predictions using real-time data from ESPN, Weather, Betting Odds & Injury APIs
          </p>
          <p className="text-sm text-muted-foreground/80">
            • Live team statistics • Injury analysis • Weather impact • Multi-sportsbook odds comparison • Home field advantage
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-primary" />
              Select Week & Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">NFL Week</label>
                <Select 
                  value={selectedWeek.toString()} 
                  onValueChange={handleWeekChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekOptions.map((week) => (
                      <SelectItem key={week} value={week.toString()}>
                        {week < 0 
                          ? `Preseason Week ${Math.abs(week)}` 
                          : `Week ${week}`
                        } {week === currentWeek && '(Current)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Game</label>
                <Select 
                  value={selectedGame?.id || ''} 
                  onValueChange={handleGameSelect}
                  disabled={(weekGames?.length || 0) === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {(weekGames || []).map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.awayTeam.city} @ {game.homeTeam.city} ({game.gameTime})
                        {game.isCompleted && ' - Completed'}
                        {game.isPreseason && ' - Preseason'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handlePredict}
                disabled={!selectedGame || selectedGame.isCompleted || isGeneratingPrediction}
                size="lg"
                className="min-w-32"
              >
                {isGeneratingPrediction ? 'Analyzing Teams...' : 'Generate Prediction'}
              </Button>
            </div>
            
            {/* Debug info */}
            <div className="mt-4 space-y-2">
              {weekGames && weekGames.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <strong>Debug:</strong> No games found for week {selectedWeek < 0 ? `Preseason ${Math.abs(selectedWeek)}` : selectedWeek}
                </div>
              )}
              
              {weekGames && weekGames.length > 0 && !selectedGame && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                  <strong>Ready:</strong> {weekGames.length} games available for week {selectedWeek < 0 ? `Preseason ${Math.abs(selectedWeek)}` : selectedWeek}. Select one to generate predictions.
                </div>
              )}
              
              {selectedGame && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  <strong>Selected:</strong> {selectedGame.awayTeam.city} @ {selectedGame.homeTeam.city} ({selectedGame.gameTime})
                  {selectedGame.isPreseason && ' - Preseason Game'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {currentPrediction && selectedGame && (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50/50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {selectedGame?.isPreseason 
                  ? '🎯 Real-time prediction using: ESPN team stats, injury reports, weather data, betting odds & market analysis!'
                  : '🎯 Live prediction using: Current team performance, injury status, weather conditions, betting market insights & historical data!'
                }
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button 
                onClick={handleSavePrediction}
                variant="outline"
                className="mb-4"
              >
                Save to History
              </Button>
            </div>

            <Tabs defaultValue="prediction" className="space-y-6">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="prediction" className="flex items-center gap-2">
                  <Target size={16} />
                  Prediction
                </TabsTrigger>
                <TabsTrigger value="betting" className="flex items-center gap-2">
                  <DollarSign size={16} />
                  Betting Odds
                </TabsTrigger>
                <TabsTrigger value="injuries" className="flex items-center gap-2">
                  <Heart size={16} />
                  Injuries
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  Live Data
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <ChartBar size={16} />
                  Team Stats
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="sources" className="flex items-center gap-2">
                  <Database size={16} />
                  Data Sources
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock size={16} />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prediction">
                <PredictionResult
                  homeTeam={selectedGame.homeTeam}
                  awayTeam={selectedGame.awayTeam}
                  homeWinProbability={currentPrediction.homeWinProbability}
                  awayWinProbability={currentPrediction.awayWinProbability}
                  confidence={currentPrediction.confidence}
                  factors={currentPrediction.factors}
                />
              </TabsContent>

              <TabsContent value="betting">
                <BettingOddsComparison
                  homeTeam={selectedGame.homeTeam}
                  awayTeam={selectedGame.awayTeam}
                  gameId={selectedGame.id}
                />
              </TabsContent>

              <TabsContent value="injuries">
                <InjuryAnalysis
                  homeTeam={selectedGame.homeTeam}
                  awayTeam={selectedGame.awayTeam}
                />
              </TabsContent>

              <TabsContent value="insights">
                <DataInsights
                  homeTeam={selectedGame.homeTeam}
                  awayTeam={selectedGame.awayTeam}
                  gameId={selectedGame.id}
                />
              </TabsContent>

              <TabsContent value="comparison">
                <TeamComparison 
                  homeTeam={selectedGame.homeTeam} 
                  awayTeam={selectedGame.awayTeam} 
                />
              </TabsContent>

              <TabsContent value="schedule">
                <WeeklySchedule 
                  week={selectedWeek}
                  games={Array.isArray(weekGames) ? weekGames : []}
                  selectedGame={selectedGame}
                  onGameSelect={handleGameSelect}
                />
              </TabsContent>

              <TabsContent value="sources">
                <DataSources />
              </TabsContent>

              <TabsContent value="history">
                <PredictionHistoryComponent
                  predictions={Array.isArray(predictions) ? predictions : []}
                  onClearHistory={handleClearHistory}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!currentPrediction && (
          <div className="space-y-8">
            {/* Live Data Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-primary" />
                  Live NFL Data Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LiveDataDashboard />
              </CardContent>
            </Card>

            {Array.isArray(weekGames) && weekGames.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedWeek < 0 
                      ? `Preseason Week ${Math.abs(selectedWeek)} Games` 
                      : `Week ${selectedWeek} Games`
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WeeklySchedule 
                    week={selectedWeek}
                    games={Array.isArray(weekGames) ? weekGames : []}
                    selectedGame={selectedGame}
                    onGameSelect={handleGameSelect}
                  />
                </CardContent>
              </Card>
            )}

            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                Ready to Predict
              </h3>
              <p className="text-muted-foreground">
                {selectedGame 
                  ? 'Click "Generate Prediction" to analyze this matchup'
                  : 'Select a week and game to generate predictions'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App