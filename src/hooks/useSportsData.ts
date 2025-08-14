import { useState, useEffect, useCallback } from 'react'
import { sportsAPI } from '@/lib/sports-api'
import { NFLGame, TeamStats } from '@/types/nfl'

// Hook for real-time live scores
export function useLiveScores(refreshInterval: number = 30000) {
  const [liveScores, setLiveScores] = useState<NFLGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchScores = useCallback(async () => {
    try {
      setError(null)
      const scores = await sportsAPI.fetchLiveScores()
      setLiveScores(scores)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch live scores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchScores()
    
    const interval = setInterval(fetchScores, refreshInterval)
    
    return () => clearInterval(interval)
  }, [fetchScores, refreshInterval])

  return {
    liveScores,
    loading,
    error,
    lastUpdate,
    refresh: fetchScores
  }
}

// Hook for enhanced team statistics
export function useTeamStats(teamId: string | null) {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!teamId) {
      setStats(null)
      return
    }

    const fetchStats = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const teamStats = await sportsAPI.fetchTeamStats(teamId)
        setStats(teamStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch team stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [teamId])

  return { stats, loading, error }
}

// Hook for injury reports
export function useInjuryReport(teamId: string | null) {
  const [injuries, setInjuries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!teamId) {
      setInjuries([])
      return
    }

    const fetchInjuries = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const injuryData = await sportsAPI.fetchInjuryReport(teamId)
        setInjuries(injuryData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch injury report')
      } finally {
        setLoading(false)
      }
    }

    fetchInjuries()
  }, [teamId])

  return { injuries, loading, error }
}

// Hook for weather data
export function useWeatherData(gameId: string | null) {
  const [weather, setWeather] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      setWeather(null)
      return
    }

    const fetchWeather = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const weatherData = await sportsAPI.fetchWeatherData(gameId)
        setWeather(weatherData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [gameId])

  return { weather, loading, error }
}

// Hook for betting odds
export function useBettingOdds(gameId: string | null) {
  const [odds, setOdds] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!gameId) {
      setOdds(null)
      return
    }

    const fetchOdds = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const oddsData = await sportsAPI.fetchBettingOdds(gameId)
        setOdds(oddsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch betting odds')
      } finally {
        setLoading(false)
      }
    }

    fetchOdds()
  }, [gameId])

  return { odds, loading, error }
}

// Hook for API status monitoring
export function useAPIStatus() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateStatus = () => {
      const apiStatus = sportsAPI.getAPIStatus()
      setStatus(apiStatus)
      setLoading(false)
    }

    updateStatus()
    
    // Update status every minute
    const interval = setInterval(updateStatus, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const clearCache = useCallback(() => {
    sportsAPI.clearCache()
    setStatus(sportsAPI.getAPIStatus())
  }, [])

  return { status, loading, clearCache }
}