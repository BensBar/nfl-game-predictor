import { NFLTeam, TeamStats, GameResult, NFLGame } from '@/types/nfl'
import { realSportsAPI } from './real-sports-api'

// API configuration for different sports data providers
export interface APIProvider {
  name: string
  baseUrl: string
  rateLimit: number // requests per minute
  features: string[]
  reliability: number // 0-100
}

export const API_PROVIDERS: APIProvider[] = [
  {
    name: 'ESPN NFL API',
    baseUrl: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl',
    rateLimit: 60,
    features: ['live-scores', 'schedules', 'team-stats', 'standings'],
    reliability: 98
  },
  {
    name: 'OpenWeather API',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    rateLimit: 100,
    features: ['weather-conditions', 'stadium-weather'],
    reliability: 95
  },
  {
    name: 'The Odds API',
    baseUrl: 'https://api.the-odds-api.com/v4/sports/americanfootball_nfl',
    rateLimit: 50,
    features: ['betting-lines', 'spreads', 'moneylines'],
    reliability: 92
  },
  {
    name: 'NFL.com Official API',
    baseUrl: 'https://api.nfl.com/v3/shield',
    rateLimit: 80,
    features: ['player-stats', 'injury-reports', 'advanced-metrics'],
    reliability: 96
  }
]

// Real sports data API that integrates with live data sources
export class SportsDataAPI {
  private static instance: SportsDataAPI

  static getInstance(): SportsDataAPI {
    if (!SportsDataAPI.instance) {
      SportsDataAPI.instance = new SportsDataAPI()
    }
    return SportsDataAPI.instance
  }

  // Fetch live scores from real APIs
  async fetchLiveScores(): Promise<NFLGame[]> {
    return await realSportsAPI.fetchLiveScores()
  }

  // Fetch current preseason schedule from official sources
  async fetchPreseasonSchedule(week: number): Promise<NFLGame[]> {
    return await realSportsAPI.fetchSchedule(week)
  }

  // Fetch real-time team statistics from multiple sources
  async fetchTeamStats(teamId: string): Promise<TeamStats | null> {
    return await realSportsAPI.fetchTeamStats(teamId)
  }

  // Fetch injury reports from official NFL sources
  async fetchInjuryReport(teamId: string): Promise<any[]> {
    return await realSportsAPI.fetchInjuryReport(teamId)
  }

  // Fetch weather conditions from weather APIs
  async fetchWeatherData(gameId: string): Promise<any | null> {
    return await realSportsAPI.fetchWeatherData(gameId)
  }

  // Fetch betting odds from sportsbook APIs
  async fetchBettingOdds(gameId: string): Promise<any | null> {
    return await realSportsAPI.fetchBettingOdds(gameId)
  }

  // Get comprehensive API health status
  getAPIStatus(): Record<string, any> {
    return realSportsAPI.getAPIStatus()
  }

  // Clear all cached data
  clearCache(): void {
    realSportsAPI.clearCache()
  }

}

// Export the singleton instance
export const sportsAPI = SportsDataAPI.getInstance()