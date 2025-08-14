import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NFLTeam, TeamStats, GameResult } from '@/types/nfl'
import { getTeamStats, getRecentGames } from '@/lib/nfl-data'
import { TrendUp, TrendDown, RefreshCw } from '@phosphor-icons/react'

interface TeamComparisonProps {
  homeTeam: NFLTeam
  awayTeam: NFLTeam
}

export function TeamComparison({ homeTeam, awayTeam }: TeamComparisonProps) {
  // Validate team data
  if (!homeTeam?.city || !awayTeam?.city || !homeTeam?.id || !awayTeam?.id) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <div className="text-red-600">Error: Invalid team data for comparison</div>
        </CardContent>
      </Card>
    )
  }

  const [homeStats, setHomeStats] = useState<TeamStats | null>(null)
  const [awayStats, setAwayStats] = useState<TeamStats | null>(null)
  const [homeGames, setHomeGames] = useState<GameResult[]>([])
  const [awayGames, setAwayGames] = useState<GameResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [homeStatsData, awayStatsData, homeGamesData, awayGamesData] = await Promise.all([
          getTeamStats(homeTeam.id),
          getTeamStats(awayTeam.id),
          getRecentGames(homeTeam.id),
          getRecentGames(awayTeam.id)
        ])
        
        setHomeStats(homeStatsData)
        setAwayStats(awayStatsData)
        setHomeGames(homeGamesData)
        setAwayGames(awayGamesData)
      } catch (error) {
        console.error('Error loading team comparison data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [homeTeam.id, awayTeam.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="animate-spin mr-2" size={20} />
        Loading real-time team statistics...
      </div>
    )
  }

  if (!homeStats || !awayStats) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load team statistics from API
      </div>
    )
  }

  const StatRow = ({ 
    label, 
    homeValue, 
    awayValue, 
    higherIsBetter = true 
  }: { 
    label: string
    homeValue: number
    awayValue: number
    higherIsBetter?: boolean
  }) => {
    const homeIsBetter = higherIsBetter ? homeValue > awayValue : homeValue < awayValue
    const awayIsBetter = higherIsBetter ? awayValue > homeValue : awayValue < homeValue

    return (
      <div className="flex justify-between items-center py-2">
        <div className={`flex-1 text-right ${homeIsBetter ? 'font-semibold text-primary' : ''}`}>
          {homeValue}
        </div>
        <div className="flex-1 text-center text-sm text-muted-foreground px-4">
          {label}
        </div>
        <div className={`flex-1 text-left ${awayIsBetter ? 'font-semibold text-primary' : ''}`}>
          {awayValue}
        </div>
      </div>
    )
  }

  const RecentForm = ({ team, games }: { team: NFLTeam, games: GameResult[] }) => {
    const wins = games.filter(g => g.isWin).length
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{team.city}</h4>
          <Badge variant={wins >= 3 ? "default" : "secondary"}>
            {wins}-{5 - wins}
          </Badge>
        </div>
        <div className="flex gap-1">
          {games.map((game, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                game.isWin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {game.isWin ? 'W' : 'L'}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Team Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="font-semibold text-primary">{homeTeam.city}</div>
              <div className="text-muted-foreground">vs</div>
              <div className="font-semibold text-primary">{awayTeam.city}</div>
            </div>
            
            <StatRow 
              label="Points Per Game" 
              homeValue={homeStats.pointsPerGame} 
              awayValue={awayStats.pointsPerGame} 
            />
            <StatRow 
              label="Points Allowed" 
              homeValue={homeStats.pointsAllowed} 
              awayValue={awayStats.pointsAllowed}
              higherIsBetter={false}
            />
            <StatRow 
              label="Total Yards" 
              homeValue={homeStats.totalYards} 
              awayValue={awayStats.totalYards} 
            />
            <StatRow 
              label="Yards Allowed" 
              homeValue={homeStats.yardsAllowed} 
              awayValue={awayStats.yardsAllowed}
              higherIsBetter={false}
            />
            <StatRow 
              label="Turnover Diff" 
              homeValue={homeStats.turnoverDiff} 
              awayValue={awayStats.turnoverDiff} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Form (Last 5 Games)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentForm team={homeTeam} games={homeGames} />
            <RecentForm team={awayTeam} games={awayGames} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}