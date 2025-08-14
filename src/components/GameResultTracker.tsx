import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AccuracyTracker } from '@/lib/accuracy-tracker'
import { PredictionOutcome } from '@/types/accuracy'
import { Check, X, Clock, ArrowClockwise, Warning, Calendar } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface GameResultTrackerProps {
  gameId?: string
  homeTeam?: string
  awayTeam?: string
}

export function GameResultTracker({ gameId, homeTeam, awayTeam }: GameResultTrackerProps) {
  const [outcomes, setOutcomes] = useState<PredictionOutcome[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingResult, setUpdatingResult] = useState<string | null>(null)

  useEffect(() => {
    loadPredictionOutcomes()
  }, [])

  const loadPredictionOutcomes = async () => {
    try {
      setLoading(true)
      const allOutcomes = await AccuracyTracker.getPredictionOutcomes()
      
      // Filter to pending results (games without outcomes)
      const pendingOutcomes = allOutcomes.filter(outcome => 
        outcome.actualWinner === null || outcome.isCorrect === null
      )
      
      // Sort by game date (most recent first)
      pendingOutcomes.sort((a, b) => b.gameDate - a.gameDate)
      
      setOutcomes(pendingOutcomes)
    } catch (error) {
      console.error('Error loading prediction outcomes:', error)
      toast.error('Failed to load prediction outcomes')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateResult = async (gameId: string, actualWinner: string) => {
    try {
      setUpdatingResult(gameId)
      await AccuracyTracker.updateGameResult(gameId, actualWinner)
      await loadPredictionOutcomes() // Refresh the list
      toast.success(`Game result updated: ${actualWinner} won!`)
    } catch (error) {
      console.error('Error updating game result:', error)
      toast.error('Failed to update game result')
    } finally {
      setUpdatingResult(null)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getWeekDisplay = (week: number, isPreseason: boolean) => {
    if (isPreseason) {
      return `Preseason Week ${Math.abs(week)}`
    }
    return `Week ${week}`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowClockwise className="text-primary animate-spin" size={20} />
            Loading Game Results...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (outcomes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="text-green-600" />
            Game Result Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Check size={48} className="mx-auto mb-4 text-green-600 opacity-50" />
            <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
              All Results Updated
            </h3>
            <p className="text-muted-foreground">
              No pending game results to track. All predictions have been resolved!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="text-primary" />
          Game Result Tracker
          <Badge variant="secondary" className="ml-auto">
            {outcomes.length} pending
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Update game results to track prediction accuracy
        </div>

        {outcomes.map((outcome) => (
          <div key={outcome.predictionId} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {outcome.awayTeam} @ {outcome.homeTeam}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar size={14} />
                  {getWeekDisplay(outcome.week, outcome.isPreseason)} • 
                  {formatDate(outcome.gameDate)}
                </div>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Warning size={12} />
                Pending Result
              </Badge>
            </div>

            <div className="text-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Prediction:</span>
                <Badge variant="secondary">
                  {outcome.predictedWinner} ({outcome.predictedProbability.toFixed(0)}%)
                </Badge>
                <Badge variant="outline">
                  {outcome.confidence.toFixed(0)}% confidence
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Actual Winner:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={updatingResult === outcome.gameId ? "outline" : "default"}
                  disabled={updatingResult === outcome.gameId}
                  onClick={() => handleUpdateResult(outcome.gameId, outcome.homeTeam)}
                  className="flex items-center gap-1"
                >
                  {updatingResult === outcome.gameId ? (
                    <ArrowClockwise size={14} className="animate-spin" />
                  ) : null}
                  {outcome.homeTeam}
                </Button>
                <Button
                  size="sm"
                  variant={updatingResult === outcome.gameId ? "outline" : "default"}
                  disabled={updatingResult === outcome.gameId}
                  onClick={() => handleUpdateResult(outcome.gameId, outcome.awayTeam)}
                  className="flex items-center gap-1"
                >
                  {updatingResult === outcome.gameId ? (
                    <ArrowClockwise size={14} className="animate-spin" />
                  ) : null}
                  {outcome.awayTeam}
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={loadPredictionOutcomes}
            className="flex items-center gap-2"
          >
            <ArrowClockwise size={16} />
            Refresh Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}