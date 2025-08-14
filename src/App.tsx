import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { NFL_TEAMS, calculatePrediction } from '@/lib/nfl-data'
import { NFLTeam, Prediction, PredictionHistory } from '@/types/nfl'
import { PredictionResult } from '@/components/PredictionResult'
import { TeamComparison } from '@/components/TeamComparison'
import { PredictionHistoryComponent } from '@/components/PredictionHistory'
import { Target, ChartBar, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'

function App() {
  const [homeTeam, setHomeTeam] = useState<NFLTeam | null>(null)
  const [awayTeam, setAwayTeam] = useState<NFLTeam | null>(null)
  const [currentPrediction, setCurrentPrediction] = useState<Prediction | null>(null)
  const [predictions, setPredictions] = useKV<PredictionHistory[]>('prediction-history', [])

  const handlePredict = () => {
    if (!homeTeam || !awayTeam) {
      toast.error('Please select both teams')
      return
    }

    if (homeTeam.id === awayTeam.id) {
      toast.error('Please select different teams')
      return
    }

    const result = calculatePrediction(homeTeam, awayTeam)
    
    const prediction: Prediction = {
      id: Date.now().toString(),
      homeTeam,
      awayTeam,
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

  const availableAwayTeams = NFL_TEAMS.filter(team => team.id !== homeTeam?.id)
  const availableHomeTeams = NFL_TEAMS.filter(team => team.id !== awayTeam?.id)

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">NFL Game Predictor</h1>
          <p className="text-lg text-muted-foreground">
            Advanced analytics to predict NFL game outcomes
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-primary" />
              Select Matchup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Home Team</label>
                <Select 
                  value={homeTeam?.id || ''} 
                  onValueChange={(value) => {
                    const team = NFL_TEAMS.find(t => t.id === value)
                    setHomeTeam(team || null)
                    setCurrentPrediction(null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select home team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableHomeTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.city} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="text-center text-lg font-medium text-muted-foreground">
                vs
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Away Team</label>
                <Select 
                  value={awayTeam?.id || ''} 
                  onValueChange={(value) => {
                    const team = NFL_TEAMS.find(t => t.id === value)
                    setAwayTeam(team || null)
                    setCurrentPrediction(null)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select away team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAwayTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.city} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                onClick={handlePredict}
                disabled={!homeTeam || !awayTeam || homeTeam.id === awayTeam.id}
                size="lg"
                className="min-w-32"
              >
                Generate Prediction
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentPrediction && homeTeam && awayTeam && (
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="prediction" className="flex items-center gap-2">
                  <Target size={16} />
                  Prediction
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <ChartBar size={16} />
                  Team Stats
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock size={16} />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prediction">
                <PredictionResult
                  homeTeam={homeTeam}
                  awayTeam={awayTeam}
                  homeWinProbability={currentPrediction.homeWinProbability}
                  awayWinProbability={currentPrediction.awayWinProbability}
                  confidence={currentPrediction.confidence}
                  factors={currentPrediction.factors}
                />
              </TabsContent>

              <TabsContent value="comparison">
                <TeamComparison 
                  homeTeam={homeTeam} 
                  awayTeam={awayTeam} 
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
          <div className="text-center py-12">
            <Target size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
              Ready to Predict
            </h3>
            <p className="text-muted-foreground">
              Select two teams above to generate your first prediction
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App