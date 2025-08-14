import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { getCurrentWeek, getGamesForWeek, calculatePrediction } from '@/lib/nfl-data'
import { NFLGame, Prediction, PredictionHistory } from '@/types/nfl'
import { PredictionResult } from '@/components/PredictionResult'
import { TeamComparison } from '@/components/TeamComparison'
import { PredictionHistoryComponent } from '@/components/PredictionHistory'
import { WeeklySchedule } from '@/components/WeeklySchedule'
import { Target, ChartBar, Clock, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek())
  const [weekGames, setWeekGames] = useState<NFLGame[]>([])
  const [selectedGame, setSelectedGame] = useState<NFLGame | null>(null)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useKV<PredictionHistory[]>('prediction-history', [])

  useEffect(() => {
    const games = getGamesForWeek(selectedWeek)
    setWeekGames(games)
    setSelectedGame(null)
    setCurrentPrediction(null)
  }, [selectedWeek])

  const handleWeekChange = (week: string) => {
    const weekNum = parseInt(week)
    setSelectedWeek(weekNum)
  }

  const handleGameSelect = (gameId: string) => {
    const game = weekGames.find(g => g.id === gameId)
    setSelectedGame(game || null)
    setCurrentPrediction(null)
  }

  const handlePredict = () => {
    if (!selectedGame) {
      toast.error('Please select a game')
      return
    }

    if (selectedGame.isCompleted) {
      toast.error('Cannot predict completed games')
      return
    }

    const result = calculatePrediction(selectedGame.homeTeam, selectedGame.awayTeam)
    
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
    toast.success('Prediction generated!')
  }

  const handleSavePrediction = () => {
    if (!currentPrediction) return
    
    setPredictions((current) => [currentPrediction, ...current])
    toast.success('Prediction saved to history!')
  }

  const handleClearHistory = () => {
    setPredictions([])
    toast.success('History cleared')
  }

  const currentWeek = getCurrentWeek()
  const weekOptions = Array.from({ length: 18 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">NFL Weekly Game Predictor</h1>
          <p className="text-lg text-muted-foreground">
            Advanced analytics for real NFL weekly matchups
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
                        Week {week} {week === currentWeek && '(Current)'}
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
                  disabled={weekGames.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekGames.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.awayTeam.city} @ {game.homeTeam.city} ({game.gameTime})
                        {game.isCompleted && ' - Completed'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handlePredict}
                disabled={!selectedGame || selectedGame.isCompleted}
                size="lg"
                className="min-w-32"
              >
                Generate Prediction
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentPrediction && selectedGame && (
          <div className="space-y-6">
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prediction" className="flex items-center gap-2">
                  <Target size={16} />
                  Prediction
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <ChartBar size={16} />
                  Team Stats
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex items-center gap-2">
                  <Calendar size={16} />
                  Schedule
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

              <TabsContent value="comparison">
                <TeamComparison 
                  homeTeam={selectedGame.homeTeam} 
                  awayTeam={selectedGame.awayTeam} 
                />
              </TabsContent>

              <TabsContent value="schedule">
                <WeeklySchedule 
                  week={selectedWeek}
                  games={weekGames}
                  selectedGame={selectedGame}
                  onGameSelect={handleGameSelect}
                />
              </TabsContent>

              <TabsContent value="history">
                <PredictionHistoryComponent
                  predictions={predictions}
                  onClearHistory={handleClearHistory}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}

        {!currentPrediction && (
          <div className="space-y-8">
            {weekGames.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Week {selectedWeek} Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <WeeklySchedule 
                    week={selectedWeek}
                    games={weekGames}
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