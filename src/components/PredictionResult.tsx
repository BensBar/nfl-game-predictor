import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { NFLTeam } from '@/types/nfl'
import { Trophy, Target } from '@phosphor-icons/react'

interface PredictionResultProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  homeWinProbability: number
  awayWinProbability: number
  confidence: number
  factors: string[]
}

export function PredictionResult({
  homeTeam,
  awayTeam,
  homeWinProbability,
  awayWinProbability,
  confidence,
  factors
}: PredictionResultProps) {
  const favoredTeam = homeWinProbability > awayWinProbability ? homeTeam : awayTeam
  const favoredPercentage = Math.max(homeWinProbability, awayWinProbability)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="text-primary" />
          Prediction Result
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="text-accent" size={24} />
            <span className="text-2xl font-bold text-primary">
              {favoredTeam.city} {favoredTeam.name}
            </span>
          </div>
          <div className="text-lg text-muted-foreground">
            Predicted to win with {favoredPercentage}% probability
          </div>
          <Badge variant="outline" className="text-sm">
            {confidence}% Confidence
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{homeTeam.city} (Home)</span>
              <span className="font-bold">{homeWinProbability}%</span>
            </div>
            <Progress 
              value={homeWinProbability} 
              className="h-3"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{awayTeam.city} (Away)</span>
              <span className="font-bold">{awayWinProbability}%</span>
            </div>
            <Progress 
              value={awayWinProbability} 
              className="h-3"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Key Factors
          </h4>
          <div className="space-y-2">
            {factors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 text-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}