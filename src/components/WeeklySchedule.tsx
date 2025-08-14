import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NFLGame } from '@/types/nfl'
import { Clock, CheckCircle } from '@phosphor-icons/react'

interface WeeklyScheduleProps {
  week: number
  games: NFLGame[]
  selectedGame?: NFLGame | null
  onGameSelect?: (game: NFLGame) => void
}

export function WeeklySchedule({ week, games, selectedGame, onGameSelect }: WeeklyScheduleProps) {
  if (games.length === 0) {
    const weekDisplay = week < 0 ? `Preseason Week ${Math.abs(week)}` : `Week ${week}`
    return (
      <div className="text-center py-8">
        <Clock size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">No games scheduled for {weekDisplay}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.filter(game => game?.homeTeam?.city && game?.awayTeam?.city).map((game) => (
          <Card 
            key={game.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedGame?.id === game.id ? 'ring-2 ring-primary' : ''
            } ${game.isCompleted ? 'opacity-75' : ''}`}
            onClick={() => onGameSelect?.(game)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={game.isCompleted ? "secondary" : "default"}>
                    {game.isCompleted ? 'Final' : game.gameTime}
                  </Badge>
                  {game.isPreseason && (
                    <Badge variant="outline" className="text-xs">
                      Preseason
                    </Badge>
                  )}
                  {game.isCompleted && (
                    <CheckCircle size={16} className="text-green-600" />
                  )}
                </div>
                {selectedGame?.id === game.id && (
                  <Badge variant="outline" className="bg-primary/10">
                    Selected
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">@</div>
                    <div className="font-medium">
                      {game.awayTeam.city} {game.awayTeam.name}
                    </div>
                  </div>
                  {game.isCompleted && game.awayScore !== undefined && (
                    <div className="font-bold text-lg">{game.awayScore}</div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground">vs</div>
                    <div className="font-medium">
                      {game.homeTeam.city} {game.homeTeam.name}
                    </div>
                  </div>
                  {game.isCompleted && game.homeScore !== undefined && (
                    <div className="font-bold text-lg">{game.homeScore}</div>
                  )}
                </div>
              </div>

              {!game.isCompleted && selectedGame?.id === game.id && (
                <div className="mt-3 pt-3 border-t">
                  <Button size="sm" className="w-full">
                    Generate Prediction
                  </Button>
                </div>
              )}

              {game.isCompleted && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Game completed - predictions not available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {games.filter(g => !g.isCompleted).length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          All games for {week < 0 ? `Preseason Week ${Math.abs(week)}` : `Week ${week}`} have been completed
        </div>
      )}
    </div>
  )
}