import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PredictionHistory } from '@/types/nfl'
import { Trash2, Clock } from '@phosphor-icons/react'

interface PredictionHistoryProps {
  predictions: PredictionHistory[]
  onClearHistory: () => void
}

export function PredictionHistoryComponent({ 
  predictions, 
  onClearHistory 
}: PredictionHistoryProps) {
  if (predictions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No predictions yet</p>
            <p className="text-sm">Make your first prediction to start tracking your accuracy!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const correctPredictions = predictions.filter(p => {
    if (!p.actualResult) return false
    return (p.homeWinProbability > 50 && p.actualResult === 'home') ||
           (p.awayWinProbability > 50 && p.actualResult === 'away')
  }).length

  const totalWithResults = predictions.filter(p => p.actualResult).length
  const accuracy = totalWithResults > 0 ? Math.round((correctPredictions / totalWithResults) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock />
            Prediction History
          </CardTitle>
          <div className="flex items-center gap-2">
            {totalWithResults > 0 && (
              <Badge variant="outline">
                {accuracy}% Accuracy
              </Badge>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {predictions.map((prediction) => {
            const favoredTeam = prediction.homeWinProbability > prediction.awayWinProbability 
              ? prediction.homeTeam 
              : prediction.awayTeam
            const favoredPercentage = Math.max(
              prediction.homeWinProbability, 
              prediction.awayWinProbability
            )
            
            const wasCorrect = prediction.actualResult && (
              (prediction.homeWinProbability > 50 && prediction.actualResult === 'home') ||
              (prediction.awayWinProbability > 50 && prediction.actualResult === 'away')
            )

            return (
              <div 
                key={prediction.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {prediction.homeTeam.city} vs {prediction.awayTeam.city}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Predicted: {favoredTeam.city} ({favoredPercentage}%)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(prediction.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {prediction.confidence}% confidence
                  </Badge>
                  {prediction.actualResult && (
                    <Badge variant={wasCorrect ? "default" : "destructive"}>
                      {wasCorrect ? "Correct" : "Wrong"}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}