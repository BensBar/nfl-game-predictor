import { WeeklyAccuracy, PredictionOutcome, AccuracyStats, LeaderboardEntry, SeasonLeaderboard } from '@/types/accuracy'
import { getCurrentWeek, getCurrentSeason } from '@/lib/nfl-data'

export class AccuracyTracker {
  private static STORAGE_KEYS = {
    OUTCOMES: 'prediction-outcomes',
    WEEKLY_ACCURACY: 'weekly-accuracy',
    LEADERBOARD: 'season-leaderboard'
  }

  // Record a prediction outcome
  static async recordPredictionOutcome(
    predictionId: string,
    gameId: string,
    homeTeam: string,
    awayTeam: string,
    predictedWinner: string,
    predictedProbability: number,
    confidence: number,
    actualWinner: string | null = null
  ): Promise<void> {
    const currentWeek = getCurrentWeek()
    const currentSeason = getCurrentSeason()
    
    const outcome: PredictionOutcome = {
      predictionId,
      gameId,
      homeTeam,
      awayTeam,
      predictedWinner,
      actualWinner,
      predictedProbability,
      confidence,
      isCorrect: actualWinner ? predictedWinner === actualWinner : null,
      week: currentWeek,
      season: currentSeason,
      isPreseason: currentWeek < 0,
      gameDate: Date.now(),
      resultUpdated: actualWinner ? Date.now() : null
    }

    const outcomes = await this.getPredictionOutcomes()
    const existingIndex = outcomes.findIndex(o => o.predictionId === predictionId)
    
    if (existingIndex >= 0) {
      outcomes[existingIndex] = outcome
    } else {
      outcomes.push(outcome)
    }
    
    await spark.kv.set(this.STORAGE_KEYS.OUTCOMES, outcomes)

    // Update weekly accuracy if we have a result
    if (actualWinner) {
      await this.updateWeeklyAccuracy(currentWeek, currentSeason, currentWeek < 0)
    }
  }

  // Update game result and recalculate accuracy
  static async updateGameResult(gameId: string, actualWinner: string): Promise<void> {
    const outcomes = await this.getPredictionOutcomes()
    const updated = outcomes.map(outcome => {
      if (outcome.gameId === gameId) {
        return {
          ...outcome,
          actualWinner,
          isCorrect: outcome.predictedWinner === actualWinner,
          resultUpdated: Date.now()
        }
      }
      return outcome
    })

    await spark.kv.set(this.STORAGE_KEYS.OUTCOMES, updated)

    // Find the week and season to update
    const gameOutcome = outcomes.find(o => o.gameId === gameId)
    if (gameOutcome) {
      await this.updateWeeklyAccuracy(gameOutcome.week, gameOutcome.season, gameOutcome.isPreseason)
    }
  }

  // Get all prediction outcomes
  static async getPredictionOutcomes(): Promise<PredictionOutcome[]> {
    const outcomes = await spark.kv.get<PredictionOutcome[]>(this.STORAGE_KEYS.OUTCOMES)
    return Array.isArray(outcomes) ? outcomes : []
  }

  // Update weekly accuracy stats
  private static async updateWeeklyAccuracy(week: number, season: number, isPreseason: boolean): Promise<void> {
    const outcomes = await this.getPredictionOutcomes()
    const weekOutcomes = outcomes.filter(o => 
      o.week === week && 
      o.season === season && 
      o.isPreseason === isPreseason &&
      o.isCorrect !== null
    )

    if (weekOutcomes.length === 0) return

    const correctPredictions = weekOutcomes.filter(o => o.isCorrect === true).length
    const totalPredictions = weekOutcomes.length
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0
    const averageConfidence = weekOutcomes.reduce((sum, o) => sum + o.confidence, 0) / totalPredictions

    const highConfidenceOutcomes = weekOutcomes.filter(o => o.confidence >= 80)
    const lowConfidenceOutcomes = weekOutcomes.filter(o => o.confidence < 60)

    const weeklyAccuracy: WeeklyAccuracy = {
      week,
      season,
      isPreseason,
      totalPredictions,
      correctPredictions,
      accuracy,
      averageConfidence,
      highConfidencePredictions: highConfidenceOutcomes.length,
      highConfidenceCorrect: highConfidenceOutcomes.filter(o => o.isCorrect === true).length,
      lowConfidencePredictions: lowConfidenceOutcomes.length,
      lowConfidenceCorrect: lowConfidenceOutcomes.filter(o => o.isCorrect === true).length,
      timestamp: Date.now()
    }

    const weeklyAccuracies = await this.getWeeklyAccuracies()
    const existingIndex = weeklyAccuracies.findIndex(w => 
      w.week === week && w.season === season && w.isPreseason === isPreseason
    )

    if (existingIndex >= 0) {
      weeklyAccuracies[existingIndex] = weeklyAccuracy
    } else {
      weeklyAccuracies.push(weeklyAccuracy)
    }

    await spark.kv.set(this.STORAGE_KEYS.WEEKLY_ACCURACY, weeklyAccuracies)
  }

  // Get weekly accuracy data
  static async getWeeklyAccuracies(): Promise<WeeklyAccuracy[]> {
    const accuracies = await spark.kv.get<WeeklyAccuracy[]>(this.STORAGE_KEYS.WEEKLY_ACCURACY)
    return Array.isArray(accuracies) ? accuracies : []
  }

  // Calculate comprehensive accuracy stats
  static async getAccuracyStats(): Promise<AccuracyStats> {
    const outcomes = await this.getPredictionOutcomes()
    const completedOutcomes = outcomes.filter(o => o.isCorrect !== null)

    // Overall stats
    const totalPredictions = completedOutcomes.length
    const correctPredictions = completedOutcomes.filter(o => o.isCorrect === true).length
    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0
    const averageConfidence = totalPredictions > 0 ? 
      completedOutcomes.reduce((sum, o) => sum + o.confidence, 0) / totalPredictions : 0

    // By confidence level
    const highConfidenceOutcomes = completedOutcomes.filter(o => o.confidence >= 80)
    const mediumConfidenceOutcomes = completedOutcomes.filter(o => o.confidence >= 60 && o.confidence < 80)
    const lowConfidenceOutcomes = completedOutcomes.filter(o => o.confidence < 60)

    // Streaks
    const sortedOutcomes = completedOutcomes.sort((a, b) => b.gameDate - a.gameDate)
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let isWinningStreak = true

    for (let i = 0; i < sortedOutcomes.length; i++) {
      const isCorrect = sortedOutcomes[i].isCorrect === true
      
      if (i === 0) {
        currentStreak = isCorrect ? 1 : -1
        isWinningStreak = isCorrect
        tempStreak = Math.abs(currentStreak)
      } else {
        if ((isCorrect && currentStreak > 0) || (!isCorrect && currentStreak < 0)) {
          currentStreak += isCorrect ? 1 : -1
          tempStreak = Math.abs(currentStreak)
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          currentStreak = isCorrect ? 1 : -1
          tempStreak = 1
          isWinningStreak = isCorrect
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    // Recent trends
    const last5 = sortedOutcomes.slice(0, 5)
    const last10 = sortedOutcomes.slice(0, 10)
    const lastWeekOutcomes = sortedOutcomes.filter(o => Date.now() - o.gameDate < 7 * 24 * 60 * 60 * 1000)

    const weeklyAccuracies = await this.getWeeklyAccuracies()

    return {
      overall: {
        totalPredictions,
        correctPredictions,
        accuracy,
        averageConfidence
      },
      byWeek: weeklyAccuracies.sort((a, b) => b.week - a.week),
      byConfidenceLevel: {
        high: {
          total: highConfidenceOutcomes.length,
          correct: highConfidenceOutcomes.filter(o => o.isCorrect === true).length,
          accuracy: highConfidenceOutcomes.length > 0 ? 
            (highConfidenceOutcomes.filter(o => o.isCorrect === true).length / highConfidenceOutcomes.length) * 100 : 0
        },
        medium: {
          total: mediumConfidenceOutcomes.length,
          correct: mediumConfidenceOutcomes.filter(o => o.isCorrect === true).length,
          accuracy: mediumConfidenceOutcomes.length > 0 ? 
            (mediumConfidenceOutcomes.filter(o => o.isCorrect === true).length / mediumConfidenceOutcomes.length) * 100 : 0
        },
        low: {
          total: lowConfidenceOutcomes.length,
          correct: lowConfidenceOutcomes.filter(o => o.isCorrect === true).length,
          accuracy: lowConfidenceOutcomes.length > 0 ? 
            (lowConfidenceOutcomes.filter(o => o.isCorrect === true).length / lowConfidenceOutcomes.length) * 100 : 0
        }
      },
      streaks: {
        currentStreak: Math.abs(currentStreak),
        longestStreak,
        isWinningStreak
      },
      recentTrend: {
        last5Games: last5.length > 0 ? (last5.filter(o => o.isCorrect === true).length / last5.length) * 100 : 0,
        last10Games: last10.length > 0 ? (last10.filter(o => o.isCorrect === true).length / last10.length) * 100 : 0,
        lastWeek: lastWeekOutcomes.length > 0 ? (lastWeekOutcomes.filter(o => o.isCorrect === true).length / lastWeekOutcomes.length) * 100 : 0
      }
    }
  }

  // Get season leaderboard
  static async getSeasonLeaderboard(season: number = getCurrentSeason(), isPreseason: boolean = getCurrentWeek() < 0): Promise<LeaderboardEntry[]> {
    const leaderboards = await spark.kv.get<SeasonLeaderboard[]>(this.STORAGE_KEYS.LEADERBOARD)
    const seasonBoard = Array.isArray(leaderboards) ? 
      leaderboards.find(l => l.season === season && l.isPreseason === isPreseason) : null

    if (seasonBoard) {
      return seasonBoard.entries
    }

    // Create initial leaderboard entry for this user
    const stats = await this.getAccuracyStats()
    const entry: LeaderboardEntry = {
      rank: 1,
      modelName: 'Your AI Model',
      accuracy: stats.overall.accuracy,
      totalPredictions: stats.overall.totalPredictions,
      correctPredictions: stats.overall.correctPredictions,
      averageConfidence: stats.overall.averageConfidence,
      lastPrediction: Date.now(),
      streak: stats.streaks.currentStreak,
      badge: this.getBadge(stats.overall.accuracy, stats.overall.totalPredictions, stats.streaks.longestStreak)
    }

    const newLeaderboard: SeasonLeaderboard = {
      season,
      isPreseason,
      updated: Date.now(),
      entries: [entry]
    }

    const allLeaderboards = Array.isArray(leaderboards) ? leaderboards : []
    allLeaderboards.push(newLeaderboard)
    await spark.kv.set(this.STORAGE_KEYS.LEADERBOARD, allLeaderboards)

    return [entry]
  }

  // Update leaderboard
  static async updateLeaderboard(): Promise<void> {
    const season = getCurrentSeason()
    const isPreseason = getCurrentWeek() < 0
    const stats = await this.getAccuracyStats()

    const leaderboards = await spark.kv.get<SeasonLeaderboard[]>(this.STORAGE_KEYS.LEADERBOARD)
    const allLeaderboards = Array.isArray(leaderboards) ? leaderboards : []
    
    const boardIndex = allLeaderboards.findIndex(l => l.season === season && l.isPreseason === isPreseason)
    
    const userEntry: LeaderboardEntry = {
      rank: 1,
      modelName: 'Your AI Model',
      accuracy: stats.overall.accuracy,
      totalPredictions: stats.overall.totalPredictions,
      correctPredictions: stats.overall.correctPredictions,
      averageConfidence: stats.overall.averageConfidence,
      lastPrediction: Date.now(),
      streak: stats.streaks.currentStreak,
      badge: this.getBadge(stats.overall.accuracy, stats.overall.totalPredictions, stats.streaks.longestStreak)
    }

    if (boardIndex >= 0) {
      allLeaderboards[boardIndex].entries = [userEntry]
      allLeaderboards[boardIndex].updated = Date.now()
    } else {
      allLeaderboards.push({
        season,
        isPreseason,
        updated: Date.now(),
        entries: [userEntry]
      })
    }

    await spark.kv.set(this.STORAGE_KEYS.LEADERBOARD, allLeaderboards)
  }

  // Get achievement badge
  private static getBadge(accuracy: number, totalPredictions: number, longestStreak: number): string | undefined {
    if (totalPredictions >= 50 && accuracy >= 80) return '🏆 Elite Predictor'
    if (totalPredictions >= 25 && accuracy >= 75) return '🥇 Gold Analyst'
    if (totalPredictions >= 10 && accuracy >= 70) return '🥈 Silver Sage'
    if (longestStreak >= 10) return '🔥 Hot Streak'
    if (longestStreak >= 5) return '⚡ Streak Master'
    if (totalPredictions >= 20) return '📊 Data Veteran'
    if (totalPredictions >= 5) return '🌟 Rising Star'
    return undefined
  }

  // Clear all accuracy data
  static async clearAllData(): Promise<void> {
    await spark.kv.delete(this.STORAGE_KEYS.OUTCOMES)
    await spark.kv.delete(this.STORAGE_KEYS.WEEKLY_ACCURACY)
    await spark.kv.delete(this.STORAGE_KEYS.LEADERBOARD)
  }
}