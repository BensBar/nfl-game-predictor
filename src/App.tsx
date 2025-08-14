import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { getCurrentWeek, getGamesForWeek } from '@/lib/nfl-data'
import { PredictionService } from '@/lib/prediction-service'
import { NFLGame, PredictionHistory } from '@/types/nfl'
import { PredictionHistoryComponent } from '@/components/PredictionHistory'
import { WeeklySchedule } from '@/components/WeeklySchedule'
import { DataSources } from '@/components/DataSources'
import { LiveDataDashboard } from '@/components/LiveDataDashboard'
import { AccuracyDashboard } from '@/components/AccuracyDashboard'
import { GameResultTracker } from '@/components/GameResultTracker'
import { Target, ChartBar, Clock, Calendar, Database, Info, Activity, TrendingUp, Heart, DollarSign, Trophy, RefreshCw } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const currentWeek = getCurrentWeek()
  const [weekGames, setWeekGames] = useState<NFLGame[]>([])
  const [predictions, setPredictions] = useKV<PredictionHistory[]>('prediction-history', [])
  const [isRefreshing, setIsRefreshing] = useState(false)

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
        
        // Initialize prediction service with current week games
        PredictionService.initialize(validGames, currentWeek)
        
      } catch (error) {
        console.error('Error loading current week games:', currentWeek, error)
        setWeekGames([])
        toast.error(`Error loading current week games`)
      }
    }
    
    loadCurrentWeekGames()
    
    // Cleanup on unmount
    return () => {
      PredictionService.stopBackgroundGeneration()
    }
  }, [currentWeek])

  const handleForceRefresh = async () => {
    setIsRefreshing(true)
    try {
      toast.success('🔄 Refreshing predictions for all games...')
      await PredictionService.forceRefresh(weekGames, currentWeek)
      toast.success('✅ All predictions refreshed successfully!')
    } catch (error) {
      console.error('Error during force refresh:', error)
      toast.error('❌ Failed to refresh predictions')
    } finally {
      setIsRefreshing(false)
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
              Live NFL Data & Automated Predictions
              <Badge variant="secondary" className="ml-auto">
                Auto-refreshes every 12 hours
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveDataDashboard 
              currentWeekGames={weekGames}
              currentWeek={currentWeek}
              onForceRefresh={handleForceRefresh}
              isRefreshing={isRefreshing}
            />
          </CardContent>
        </Card>

        {/* Additional Tools and Information */}
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
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

          <TabsContent value="schedule">
            <WeeklySchedule 
              week={currentWeek}
              games={Array.isArray(weekGames) ? weekGames : []}
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
    </div>
  )
}

export default App