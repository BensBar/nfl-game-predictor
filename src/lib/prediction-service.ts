import { NFLGame, Prediction } from '@/types/nfl'
import { calculatePrediction } from './nfl-data'
import { AccuracyTracker } from './accuracy-tracker'

interface StoredPrediction extends Prediction {
  gameId: string
  generatedAt: number
  isStale?: boolean
}

interface PredictionCache {
  predictions: StoredPrediction[]
  lastGenerated: number
  week: number
}

export class PredictionService {
  private static STORAGE_KEY = 'nfl-predictions-cache'
  private static TWELVE_HOURS_MS = 12 * 60 * 60 * 1000
  private static timerId: number | null = null
  private static isGenerating = false

  // Initialize the service - start background generation
  static initialize(currentWeekGames: NFLGame[], currentWeek: number): void {
    console.log('🤖 Initializing Prediction Service...')
    this.startBackgroundGeneration(currentWeekGames, currentWeek)
    
    // Check if we need to generate predictions immediately
    const cache = this.getCache()
    const now = Date.now()
    
    if (!cache || 
        cache.week !== currentWeek || 
        cache.predictions.length === 0 ||
        (now - cache.lastGenerated) > this.TWELVE_HOURS_MS) {
      console.log('🎯 Initial prediction generation needed')
      this.generatePredictionsForAllGames(currentWeekGames, currentWeek)
    } else {
      console.log('✅ Using cached predictions from', new Date(cache.lastGenerated).toLocaleString())
    }
  }

  // Start the background timer for 12-hour generation
  static startBackgroundGeneration(currentWeekGames: NFLGame[], currentWeek: number): void {
    // Clear any existing timer
    if (this.timerId) {
      clearInterval(this.timerId)
    }

    // Set up 12-hour interval
    this.timerId = window.setInterval(() => {
      console.log('⏰ 12-hour timer triggered - generating fresh predictions')
      this.generatePredictionsForAllGames(currentWeekGames, currentWeek)
    }, this.TWELVE_HOURS_MS)

    console.log('⏰ Background prediction service started (12-hour intervals)')
  }

  // Stop background generation
  static stopBackgroundGeneration(): void {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
      console.log('⏹️ Background prediction service stopped')
    }
  }

  // Generate predictions for all games in the current week
  static async generatePredictionsForAllGames(games: NFLGame[], currentWeek: number): Promise<void> {
    if (this.isGenerating) {
      console.log('⚠️ Prediction generation already in progress, skipping...')
      return
    }

    this.isGenerating = true
    console.log(`🎯 Generating predictions for ${games.length} games in week ${currentWeek}...`)

    try {
      const predictions: StoredPrediction[] = []
      
      for (const game of games) {
        // Skip completed games
        if (game.isCompleted) {
          console.log(`⏭️ Skipping completed game: ${game.awayTeam.city} @ ${game.homeTeam.city}`)
          continue
        }

        try {
          console.log(`🔮 Predicting: ${game.awayTeam.city} @ ${game.homeTeam.city}...`)
          
          const result = await calculatePrediction(game.homeTeam, game.awayTeam)
          
          const prediction: StoredPrediction = {
            id: `${game.id}-${Date.now()}`,
            gameId: game.id,
            homeTeam: game.homeTeam,
            awayTeam: game.awayTeam,
            homeWinProbability: result.homeWinProbability,
            awayWinProbability: result.awayWinProbability,
            confidence: result.confidence,
            factors: result.factors,
            timestamp: Date.now(),
            generatedAt: Date.now()
          }

          predictions.push(prediction)

          // Record for accuracy tracking
          const predictedWinner = prediction.homeWinProbability > prediction.awayWinProbability 
            ? game.homeTeam.city 
            : game.awayTeam.city
          
          await AccuracyTracker.recordPredictionOutcome(
            prediction.id,
            game.id,
            game.homeTeam.city,
            game.awayTeam.city,
            predictedWinner,
            Math.max(prediction.homeWinProbability, prediction.awayWinProbability),
            prediction.confidence
          )

          console.log(`✅ Prediction complete: ${predictedWinner} favored with ${Math.max(prediction.homeWinProbability, prediction.awayWinProbability)}% probability`)
          
          // Small delay between predictions to avoid overwhelming APIs
          await new Promise(resolve => setTimeout(resolve, 1000))
          
        } catch (error) {
          console.error(`❌ Failed to predict ${game.awayTeam.city} @ ${game.homeTeam.city}:`, error)
        }
      }

      // Save to cache
      const cache: PredictionCache = {
        predictions,
        lastGenerated: Date.now(),
        week: currentWeek
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache))
      
      // Update leaderboard
      await AccuracyTracker.updateLeaderboard()
      
      console.log(`🎉 Generated ${predictions.length} predictions successfully`)
      
    } catch (error) {
      console.error('❌ Error during batch prediction generation:', error)
    } finally {
      this.isGenerating = false
    }
  }

  // Get cached predictions
  static getCache(): PredictionCache | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY)
      if (!cached) return null
      
      const cache = JSON.parse(cached) as PredictionCache
      
      // Mark stale predictions (older than 12 hours)
      const now = Date.now()
      cache.predictions = cache.predictions.map(p => ({
        ...p,
        isStale: (now - p.generatedAt) > this.TWELVE_HOURS_MS
      }))
      
      return cache
      
    } catch (error) {
      console.error('Error reading prediction cache:', error)
      return null
    }
  }

  // Get prediction for a specific game
  static getPredictionForGame(gameId: string): StoredPrediction | null {
    const cache = this.getCache()
    if (!cache) return null
    
    return cache.predictions.find(p => p.gameId === gameId) || null
  }

  // Get all current predictions
  static getAllPredictions(): StoredPrediction[] {
    const cache = this.getCache()
    return cache?.predictions || []
  }

  // Check if predictions need refresh
  static needsRefresh(currentWeek: number): boolean {
    const cache = this.getCache()
    if (!cache) return true
    
    const now = Date.now()
    return cache.week !== currentWeek || 
           cache.predictions.length === 0 ||
           (now - cache.lastGenerated) > this.TWELVE_HOURS_MS
  }

  // Get time until next refresh
  static getTimeUntilNextRefresh(): number {
    const cache = this.getCache()
    if (!cache) return 0
    
    const nextRefresh = cache.lastGenerated + this.TWELVE_HOURS_MS
    return Math.max(0, nextRefresh - Date.now())
  }

  // Format time until next refresh
  static formatTimeUntilRefresh(): string {
    const ms = this.getTimeUntilNextRefresh()
    if (ms === 0) return 'Refreshing soon...'
    
    const hours = Math.floor(ms / (60 * 60 * 1000))
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m until refresh`
    } else {
      return `${minutes}m until refresh`
    }
  }

  // Force refresh predictions
  static async forceRefresh(games: NFLGame[], currentWeek: number): Promise<void> {
    console.log('🔄 Force refreshing predictions...')
    await this.generatePredictionsForAllGames(games, currentWeek)
  }
}