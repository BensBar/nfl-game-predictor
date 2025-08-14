import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccuracyTracker } from '@/lib/accuracy-tracker'
import { AccuracyStats, WeeklyAccuracy, LeaderboardEntry } from '@/types/accuracy'
import { Target, TrendingUp, TrendingDown, Award, Calendar, BarChart3, Trophy, Medal, Star, Zap, Fire } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AccuracyDashboardProps {
  onClearData?: () => void
}

export function AccuracyDashboard({ onClearData }: AccuracyDashboardProps) {
  const [stats, setStats] = useState<AccuracyStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccuracyData()
  }, [])

  const loadAccuracyData = async () => {
    try {
      setLoading(true)
      const [accuracyStats, leaderboardData] = await Promise.all([
        AccuracyTracker.getAccuracyStats(),
        AccuracyTracker.getSeasonLeaderboard()
      ])
      setStats(accuracyStats)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error loading accuracy data:', error)
      toast.error('Failed to load accuracy data')
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = async () => {
    try {
      await AccuracyTracker.clearAllData()
      await loadAccuracyData()
      onClearData?.()
      toast.success('All accuracy data cleared')
    } catch (error) {
      console.error('Error clearing data:', error)
      toast.error('Failed to clear data')
    }
  }

  const formatAccuracy = (accuracy: number): string => {
    return `${accuracy.toFixed(1)}%`
  }

  const getStreakIcon = (streak: number, isWinning: boolean) => {
    if (streak >= 10) return isWinning ? <Fire className="text-orange-500" /> : <TrendingDown className="text-red-500" />
    if (streak >= 5) return isWinning ? <Zap className="text-yellow-500" /> : <TrendingDown className="text-red-500" />
    return isWinning ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />
  }

  const getBadgeIcon = (badge: string) => {
    if (badge.includes('🏆')) return <Trophy className="text-yellow-500" />
    if (badge.includes('🥇')) return <Medal className="text-yellow-500" />
    if (badge.includes('🥈')) return <Medal className="text-gray-400" />
    if (badge.includes('🔥')) return <Fire className="text-orange-500" />
    if (badge.includes('⚡')) return <Zap className="text-yellow-500" />
    return <Star className="text-blue-500" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Loading Accuracy Dashboard...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats || stats.overall.totalPredictions === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Prediction Accuracy Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              No predictions recorded yet. Make some predictions to start tracking your accuracy!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Prediction Accuracy Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatAccuracy(stats.overall.accuracy)}
                      </div>
                      <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stats.overall.correctPredictions}/{stats.overall.totalPredictions} correct
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {stats.overall.totalPredictions}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Predictions</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatAccuracy(stats.overall.averageConfidence)} avg confidence
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        {stats.streaks.currentStreak}
                        {getStreakIcon(stats.streaks.currentStreak, stats.streaks.isWinningStreak)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Current {stats.streaks.isWinningStreak ? 'Win' : 'Loss'} Streak
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Best: {stats.streaks.longestStreak}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatAccuracy(stats.recentTrend.last5Games)}
                      </div>
                      <div className="text-sm text-muted-foreground">Last 5 Games</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatAccuracy(stats.recentTrend.last10Games)} last 10
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Confidence Level Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance by Confidence Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">High Confidence (80%+)</span>
                        <Badge variant="secondary">
                          {formatAccuracy(stats.byConfidenceLevel.high.accuracy)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.byConfidenceLevel.high.correct}/{stats.byConfidenceLevel.high.total} predictions
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Medium Confidence (60-79%)</span>
                        <Badge variant="secondary">
                          {formatAccuracy(stats.byConfidenceLevel.medium.accuracy)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.byConfidenceLevel.medium.correct}/{stats.byConfidenceLevel.medium.total} predictions
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Low Confidence (<60%)</span>
                        <Badge variant="secondary">
                          {formatAccuracy(stats.byConfidenceLevel.low.accuracy)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.byConfidenceLevel.low.correct}/{stats.byConfidenceLevel.low.total} predictions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-primary" />
                    Weekly Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.byWeek.length > 0 ? (
                    <div className="space-y-4">
                      {stats.byWeek.slice(0, 8).map((week) => (
                        <div key={`${week.season}-${week.week}-${week.isPreseason}`} 
                             className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {week.isPreseason ? `Preseason Week ${Math.abs(week.week)}` : `Week ${week.week}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {week.correctPredictions}/{week.totalPredictions} correct • 
                              {formatAccuracy(week.averageConfidence)} avg confidence
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {formatAccuracy(week.accuracy)}
                            </div>
                            {week.highConfidencePredictions > 0 && (
                              <div className="text-xs text-muted-foreground">
                                High: {week.highConfidenceCorrect}/{week.highConfidencePredictions}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        Weekly trends will appear once you complete predictions for multiple weeks.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="text-primary" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Performance Insights</h4>
                      
                      {stats.byConfidenceLevel.high.accuracy > stats.overall.accuracy + 5 && (
                        <Alert className="border-green-200 bg-green-50/50">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Strong high-confidence performance! Your most confident predictions are {formatAccuracy(stats.byConfidenceLevel.high.accuracy)} accurate.
                          </AlertDescription>
                        </Alert>
                      )}

                      {stats.recentTrend.last5Games > stats.overall.accuracy + 10 && (
                        <Alert className="border-blue-200 bg-blue-50/50">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Hot streak! Your last 5 predictions are {formatAccuracy(stats.recentTrend.last5Games)} accurate, well above your overall average.
                          </AlertDescription>
                        </Alert>
                      )}

                      {stats.streaks.currentStreak >= 5 && stats.streaks.isWinningStreak && (
                        <Alert className="border-orange-200 bg-orange-50/50">
                          <Fire className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800">
                            On fire! You're on a {stats.streaks.currentStreak}-game winning streak.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Improvement Areas</h4>
                      
                      {stats.byConfidenceLevel.low.total > 5 && stats.byConfidenceLevel.low.accuracy < 50 && (
                        <Alert className="border-yellow-200 bg-yellow-50/50">
                          <AlertDescription className="text-yellow-800">
                            Consider being more selective with low-confidence predictions ({formatAccuracy(stats.byConfidenceLevel.low.accuracy)} accuracy).
                          </AlertDescription>
                        </Alert>
                      )}

                      {stats.recentTrend.last5Games < stats.overall.accuracy - 10 && (
                        <Alert className="border-red-200 bg-red-50/50">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            Recent dip in performance. Last 5 games: {formatAccuracy(stats.recentTrend.last5Games)} vs overall {formatAccuracy(stats.overall.accuracy)}.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  {/* Confidence Calibration */}
                  <div>
                    <h4 className="font-semibold mb-4">Confidence Calibration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>High confidence predictions should be most accurate</span>
                        <span className={
                          stats.byConfidenceLevel.high.accuracy > stats.byConfidenceLevel.medium.accuracy ? 
                          "text-green-600" : "text-red-600"
                        }>
                          {stats.byConfidenceLevel.high.accuracy > stats.byConfidenceLevel.medium.accuracy ? "✓ Well calibrated" : "⚠ Needs adjustment"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        High: {formatAccuracy(stats.byConfidenceLevel.high.accuracy)} • 
                        Medium: {formatAccuracy(stats.byConfidenceLevel.medium.accuracy)} • 
                        Low: {formatAccuracy(stats.byConfidenceLevel.low.accuracy)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="text-primary" />
                    Season Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-4">
                      {leaderboard.map((entry, index) => (
                        <div key={entry.modelName} 
                             className={`flex items-center justify-between p-4 border rounded-lg ${
                               index === 0 ? 'border-yellow-300 bg-yellow-50/50' : ''
                             }`}>
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold">#{entry.rank}</div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {entry.modelName}
                                {entry.badge && (
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    {getBadgeIcon(entry.badge)}
                                    {entry.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {entry.correctPredictions}/{entry.totalPredictions} predictions • 
                                {formatAccuracy(entry.averageConfidence)} avg confidence
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {formatAccuracy(entry.accuracy)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.streak > 0 && `${entry.streak} streak`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Award className="h-4 w-4" />
                      <AlertDescription>
                        Leaderboard will populate as you make predictions throughout the season.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              onClick={handleClearData}
              className="text-red-600 hover:text-red-700"
            >
              Clear All Accuracy Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}