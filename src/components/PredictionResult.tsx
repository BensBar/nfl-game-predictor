import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NFLTeam, PredictionFactor } from '@/types/nfl'
import { Trophy, Target, LinkSimple, Database, CloudRain, FirstAid, TrendingUp, House, ChartLine } from '@phosphor-icons/react'

interface PredictionResultProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  homeWinProbability: number
  awayWinProbability: number
  confidence: number
  factors: PredictionFactor[]
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

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'ESPN':
        return <Database size={14} className="text-blue-600" />
      case 'Weather':
        return <CloudRain size={14} className="text-gray-600" />
      case 'Injuries':
        return <FirstAid size={14} className="text-red-600" />
      case 'Betting':
        return <ChartLine size={14} className="text-green-600" />
      case 'Odds':
        return <ChartLine size={14} className="text-yellow-600" />
      case 'Historical':
        return <TrendingUp size={14} className="text-purple-600" />
      case 'Home Field':
        return <House size={14} className="text-orange-600" />
      default:
        return <Database size={14} className="text-gray-600" />
    }
  }

  const getSourceUrl = (source: string) => {
    switch (source) {
      case 'ESPN':
        return 'https://www.espn.com/nfl/teams'
      case 'Weather':
        return 'https://weather.com'
      case 'Injuries':
        return 'https://www.espn.com/nfl/injuries'
      case 'Betting':
        return 'https://www.espn.com/nfl/lines'
      case 'Odds':
        return 'https://sportsbook.draftkings.com'
      case 'Historical':
        return 'https://www.pro-football-reference.com'
      case 'Home Field':
        return 'https://www.espn.com/nfl/standings'
      default:
        return '#'
    }
  }

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
            Key Factors & Sources
          </h4>
          <div className="space-y-3">
            {factors.map((factor, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 text-sm p-3 rounded-lg bg-muted/30 border border-muted"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-foreground">{factor.text}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-background rounded-md border">
                    {getSourceIcon(factor.source)}
                    <span className="text-xs font-medium text-muted-foreground">
                      {factor.source}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => window.open(factor.sourceUrl || getSourceUrl(factor.source), '_blank')}
                    title={`View ${factor.source} source`}
                  >
                    <LinkSimple size={12} className="text-muted-foreground hover:text-primary" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Database size={12} className="text-blue-600" />
              <span>ESPN</span>
            </div>
            <div className="flex items-center gap-1">
              <CloudRain size={12} className="text-gray-600" />
              <span>Weather</span>
            </div>
            <div className="flex items-center gap-1">
              <FirstAid size={12} className="text-red-600" />
              <span>Injuries</span>
            </div>
            <div className="flex items-center gap-1">
              <ChartLine size={12} className="text-green-600" />
              <span>Betting</span>
            </div>
            <div className="flex items-center gap-1">
              <ChartLine size={12} className="text-yellow-600" />
              <span>Odds</span>
            </div>
            <div className="flex items-center gap-1">
              <House size={12} className="text-orange-600" />
              <span>Home Field</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}