import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { NFLGame } from '@/types/nfl'
import { PredictionService } from '@/lib/prediction-service'
import { PredictionResult } from './PredictionResult'
import { TeamComparison } from './TeamComparison'
import { DataInsights } from './DataInsights'
import { 
  Activity, 
  Target, 
  Clock, 
  TrendUp,
  ArrowClockwise,
  Calendar,
  Lightning,
  Warning
} from '@phosphor-icons/react'

interface LiveGamesGridProps {
  games: NFLGame[]
  currentWeek: number
  onForceRefresh?: () => Promise<void>
  isRefreshing?: boolean
}

export function LiveGamesGrid({ games, currentWeek, onForceRefresh, isRefreshing }: LiveGamesGridProps) {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null)
  
  const predictions = PredictionService.getAllPredictions()
  const timeUntilRefresh = PredictionService.formatTimeUntilRefresh()
  const needsRefresh = PredictionService.needsRefresh(currentWeek)

  const handleGameClick = (game: NFLGame) => {
    const prediction = PredictionService.getPredictionForGame(game.id)
    if (prediction) {
      setSelectedGameId(game.id)
      setSelectedPrediction(prediction)
    }
  }

  const closeModal = () => {
    setSelectedGameId(null)
    setSelectedPrediction(null)
  }

  const selectedGame = games.find(g => g.id === selectedGameId)

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Games Available</h3>
          <p className="text-muted-foreground">
            No games found for {currentWeek < 0 ? `Preseason Week ${Math.abs(currentWeek)}` : `Week ${currentWeek}`}.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="text-primary" />
                {currentWeek < 0 
                  ? `Preseason Week ${Math.abs(currentWeek)} - Live Predictions` 
                  : `Week ${currentWeek} - Live Predictions`
                }
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Click on any game to view detailed prediction analysis
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={needsRefresh ? "destructive" : "outline"} className="text-xs">
                  <Clock size={12} className="mr-1" />
                  {timeUntilRefresh}
                </Badge>
                
                {onForceRefresh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onForceRefresh}
                    disabled={isRefreshing}
                    className="text-xs"
                  >
                    {isRefreshing ? (
                      <ArrowClockwise size={12} className="animate-spin mr-1" />
                    ) : (
                      <ArrowClockwise size={12} className="mr-1" />
                    )}
                    Refresh Now
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {predictions.length} predictions available
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map((game) => {
              const prediction = PredictionService.getPredictionForGame(game.id)
              const hasPrediction = !!prediction
              const isStale = prediction?.isStale
              
              return (
                <GamePredictionCard
                  key={game.id}
                  game={game}
                  prediction={prediction}
                  onClick={() => handleGameClick(game)}
                  hasPrediction={hasPrediction}
                  isStale={isStale}
                />
              )
            })}
          </div>
          
          {predictions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ArrowClockwise size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Generating Predictions</p>
              <p className="text-sm">
                AI predictions are being generated for all games. This may take a few minutes...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Detail Modal */}
      <Dialog open={!!selectedGameId} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="text-primary" />
              {selectedGame && `${selectedGame.awayTeam.city} @ ${selectedGame.homeTeam.city}`}
              {selectedGame?.isPreseason && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  PRESEASON
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPrediction && selectedGame && (
            <div className="space-y-6">
              {/* Prediction Result */}
              <PredictionResult
                homeTeam={selectedPrediction.homeTeam}
                awayTeam={selectedPrediction.awayTeam}
                homeWinProbability={selectedPrediction.homeWinProbability}
                awayWinProbability={selectedPrediction.awayWinProbability}
                confidence={selectedPrediction.confidence}
                factors={selectedPrediction.factors}
              />
              
              {/* Team Comparison */}
              <TeamComparison
                homeTeam={selectedPrediction.homeTeam}
                awayTeam={selectedPrediction.awayTeam}
              />
              
              {/* Data Insights */}
              <DataInsights
                homeTeam={selectedPrediction.homeTeam}
                awayTeam={selectedPrediction.awayTeam}
                gameId={selectedGame.id}
              />
              
              {/* Prediction Metadata */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Generated: {new Date(selectedPrediction.generatedAt).toLocaleString()}</div>
                    <div>Prediction ID: {selectedPrediction.id}</div>
                    {selectedPrediction.isStale && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Warning size={12} />
                        This prediction is older than 12 hours
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

interface GamePredictionCardProps {
  game: NFLGame
  prediction: any
  onClick: () => void
  hasPrediction: boolean
  isStale?: boolean
}

function GamePredictionCard({ game, prediction, onClick, hasPrediction, isStale }: GamePredictionCardProps) {
  const favoredTeam = prediction && prediction.homeWinProbability > prediction.awayWinProbability 
    ? game.homeTeam 
    : game.awayTeam
  
  const favoredProbability = prediction 
    ? Math.max(prediction.homeWinProbability, prediction.awayWinProbability)
    : 0

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-lg ${
        hasPrediction ? 'hover:scale-105' : 'opacity-75'
      } ${isStale ? 'border-yellow-200' : ''}`}
      onClick={hasPrediction ? onClick : undefined}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Game Info */}
          <div className="space-y-1">
            <div className="font-semibold text-sm">
              {game.awayTeam.city} @ {game.homeTeam.city}
            </div>
            <div className="text-xs text-muted-foreground">
              {game.gameTime}
            </div>
          </div>

          {/* Game Status Badges */}
          <div className="flex flex-wrap gap-1">
            {game.isLive && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                <Activity size={10} className="mr-1" />
                LIVE
              </Badge>
            )}
            {game.isCompleted && (
              <Badge variant="outline" className="text-gray-600 border-gray-600 text-xs">
                FINAL
              </Badge>
            )}
            {game.isPreseason && (
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                PRESEASON
              </Badge>
            )}
            {isStale && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                <Warning size={10} className="mr-1" />
                STALE
              </Badge>
            )}
          </div>

          {/* Prediction Info */}
          {hasPrediction ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">AI Prediction</span>
                <Badge variant="secondary" className="text-xs">
                  {prediction.confidence}% confidence
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{favoredTeam.city} favored</span>
                  <span className="font-medium">{favoredProbability}%</span>
                </div>
                <Progress value={favoredProbability} className="h-2" />
              </div>
              
              <div className="text-xs text-muted-foreground">
                Click for detailed analysis
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {game.isCompleted ? (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Game completed - no prediction needed
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                  <ArrowClockwise size={12} className="animate-spin" />
                  Generating prediction...
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}