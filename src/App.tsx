import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { getCurrentWeek, getGamesForWeek, calculatePrediction } from '@/lib/nfl-data'
import { AccuracyTracker } from '@/lib/accuracy-tracker'
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
import { AccuracyDashboard } from '@/components/AccuracyDashboard'
import { GameResultTracker } from '@/components/GameResultTracker'
import { Target, ChartBar, Clock, Calendar, Database, Info, Activity, TrendingUp, Heart, DollarSign, Trophy, RefreshCw } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const currentWeek = getCurrentWeek()
  const [weekGames, setWeekGames] = useState<NFLGame[]>([])
  const [selectedGame, setSelectedGame] = useState<NFLGame | null>(null)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useKV<PredictionHistory[]>('prediction-history', [])

  useEffect(() => {
    const loadCurrentWeekGames = async () => {
      try {
        console.log(`Loading games for current week ${currentWeek}...`)
        const games = await getGamesForWeek(currentWeek)
        console.log(`Loaded ${games?.length || 0} games for current week ${currentWeek}`)
        
        // Validate all games have proper team data
        const validGames = Array.isArray(games) ? games.filter(game => {
          const isValid = game?.homeTeam?.city && game?.awayTeam?.city && 
                         game?.homeTeam?.id && game?.awayTeam?.id
          if (!isValid) {
            console.warn('Filtering out invalid game:', game)
          }
          return isValid
        }) : []
        
        console.log(`✅ ${validGames.length} valid games ready for predictions`)
        setWeekGames(validGames)
        setSelectedGame(null)
        setCurrentPrediction(null)
      } catch (error) {
        console.error('Error loading current week games:', currentWeek, error)
        setWeekGames([])
        setSelectedGame(null)
        setCurrentPrediction(null)
        toast.error(`Error loading current week games`)
      }
    }
    
    loadCurrentWeekGames()
  }, [])

  const handleWeekChange = (week: string) => {
    // Week changing is now disabled - only current week supported
    console.log('Week changing disabled - only current week predictions supported')
  }

  const handleGameSelect = (game: NFLGame) => {
    try {
      // Validate game data before setting
      if (game && game.homeTeam && game.awayTeam && 
          game.homeTeam.city && game.awayTeam.city) {
        setSelectedGame(game)
        setCurrentPrediction(null)
        console.log(`✅ Selected game: ${game.awayTeam.city} @ ${game.homeTeam.city}`)
      } else {
        console.error('Invalid game data:', game)
        setSelectedGame(null)
        setCurrentPrediction(null)
        toast.error('Unable to select game - invalid team data')
      }
    } catch (error) {
      console.error('Error selecting game:', error)
      setSelectedGame(null)
      setCurrentPrediction(null)
      toast.error('Error selecting game')
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

    // Validate that teams have proper data
    if (!selectedGame.homeTeam || !selectedGame.awayTeam || 
        !selectedGame.homeTeam.city || !selectedGame.awayTeam.city) {
      toast.error('Invalid game data - missing team information')
      console.error('Game validation failed:', selectedGame)
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
      
      // Record the prediction for accuracy tracking
      const predictedWinner = prediction.homeWinProbability > prediction.awayWinProbability 
        ? selectedGame.homeTeam.city 
        : selectedGame.awayTeam.city
      
      await AccuracyTracker.recordPredictionOutcome(
        prediction.id,
        selectedGame.id,
        selectedGame.homeTeam.city,
        selectedGame.awayTeam.city,
        predictedWinner,
        Math.max(prediction.homeWinProbability, prediction.awayWinProbability),
        prediction.confidence
      )
      
      // Update leaderboard
      await AccuracyTracker.updateLeaderboard()
      
      toast.success(`🎯 Prediction complete! ${predictedWinner} favored with ${Math.max(prediction.homeWinProbability, prediction.awayWinProbability)}% probability`)
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

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">NFL Game Predictor</h1>
          <p className="text-lg text-muted-foreground mb-1">
            Advanced AI-powered predictions with real-time accuracy tracking using ESPN, Weather, Betting Odds & Injury APIs
          </p>
          <p className="text-sm text-muted-foreground/80">
            • Live team statistics • Injury analysis • Weather impact • Multi-sportsbook odds • Weekly accuracy tracking • Performance leaderboards
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              🏈 Currently predicting: {currentWeek < 0 ? `Preseason Week ${Math.abs(currentWeek)}` : `Week ${currentWeek}`} games only
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Focus on current week for maximum accuracy with real-time data • Track performance with weekly leaderboards
            </p>
          </div>
        </div>

        {/* Enhanced Live Data Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-primary" />
              Live NFL Data & Current Week Predictions
              <Badge variant="secondary" className="ml-auto">
                Accuracy Tracking Enabled
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveDataDashboard 
              currentWeekGames={weekGames}
              selectedGame={selectedGame}
              onGameSelect={handleGameSelect}
              onPredict={handlePredict}
              isGeneratingPrediction={isGeneratingPrediction}
              currentWeek={currentWeek}
            />
          </CardContent>
        </Card>

        {currentPrediction && selectedGame && (
          <div className="space-y-6">
            <Alert className="border-green-200 bg-green-50/50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {selectedGame?.isPreseason 
                  ? '🎯 Real-time prediction with accuracy tracking using: ESPN team stats, injury reports, weather data, betting odds & market analysis!'
                  : '🎯 Live prediction with performance tracking using: Current team performance, injury status, weather conditions, betting market insights & historical data!'
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
              <TabsList className="grid w-full grid-cols-10">
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
                <TabsTrigger value="accuracy" className="flex items-center gap-2">
                  <Trophy size={16} />
                  Accuracy
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Results
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
                  week={currentWeek}
                  games={Array.isArray(weekGames) ? weekGames : []}
                  selectedGame={selectedGame}
                  onGameSelect={handleGameSelect}
                />
              </TabsContent>

              <TabsContent value="sources">
                <DataSources />
              </TabsContent>

              <TabsContent value="accuracy">
                <AccuracyDashboard />
              </TabsContent>

              <TabsContent value="results">
                <GameResultTracker />
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
          <div className="text-center py-12">
            <Calendar size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
              Ready to Predict
            </h3>
            <p className="text-muted-foreground">
              {selectedGame 
                ? 'Use the "Generate Prediction" button in the Live Data Dashboard above'
                : 'Select a game from the Live Data Dashboard to generate predictions'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App