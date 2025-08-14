import { NFLTeam, TeamStats, GameResult, NFLGame } from '@/types/nfl'

export const NFL_TEAMS: NFLTeam[] = [
  // AFC East
  { id: 'buf', name: 'Bills', city: 'Buffalo', abbreviation: 'BUF', conference: 'AFC', division: 'East' },
  { id: 'mia', name: 'Dolphins', city: 'Miami', abbreviation: 'MIA', conference: 'AFC', division: 'East' },
  { id: 'ne', name: 'Patriots', city: 'New England', abbreviation: 'NE', conference: 'AFC', division: 'East' },
  { id: 'nyj', name: 'Jets', city: 'New York', abbreviation: 'NYJ', conference: 'AFC', division: 'East' },
  
  // AFC North
  { id: 'bal', name: 'Ravens', city: 'Baltimore', abbreviation: 'BAL', conference: 'AFC', division: 'North' },
  { id: 'cin', name: 'Bengals', city: 'Cincinnati', abbreviation: 'CIN', conference: 'AFC', division: 'North' },
  { id: 'cle', name: 'Browns', city: 'Cleveland', abbreviation: 'CLE', conference: 'AFC', division: 'North' },
  { id: 'pit', name: 'Steelers', city: 'Pittsburgh', abbreviation: 'PIT', conference: 'AFC', division: 'North' },
  
  // AFC South
  { id: 'hou', name: 'Texans', city: 'Houston', abbreviation: 'HOU', conference: 'AFC', division: 'South' },
  { id: 'ind', name: 'Colts', city: 'Indianapolis', abbreviation: 'IND', conference: 'AFC', division: 'South' },
  { id: 'jax', name: 'Jaguars', city: 'Jacksonville', abbreviation: 'JAX', conference: 'AFC', division: 'South' },
  { id: 'ten', name: 'Titans', city: 'Tennessee', abbreviation: 'TEN', conference: 'AFC', division: 'South' },
  
  // AFC West
  { id: 'den', name: 'Broncos', city: 'Denver', abbreviation: 'DEN', conference: 'AFC', division: 'West' },
  { id: 'kc', name: 'Chiefs', city: 'Kansas City', abbreviation: 'KC', conference: 'AFC', division: 'West' },
  { id: 'lv', name: 'Raiders', city: 'Las Vegas', abbreviation: 'LV', conference: 'AFC', division: 'West' },
  { id: 'lac', name: 'Chargers', city: 'Los Angeles', abbreviation: 'LAC', conference: 'AFC', division: 'West' },
  
  // NFC East
  { id: 'dal', name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL', conference: 'NFC', division: 'East' },
  { id: 'nyg', name: 'Giants', city: 'New York', abbreviation: 'NYG', conference: 'NFC', division: 'East' },
  { id: 'phi', name: 'Eagles', city: 'Philadelphia', abbreviation: 'PHI', conference: 'NFC', division: 'East' },
  { id: 'wsh', name: 'Commanders', city: 'Washington', abbreviation: 'WSH', conference: 'NFC', division: 'East' },
  
  // NFC North
  { id: 'chi', name: 'Bears', city: 'Chicago', abbreviation: 'CHI', conference: 'NFC', division: 'North' },
  { id: 'det', name: 'Lions', city: 'Detroit', abbreviation: 'DET', conference: 'NFC', division: 'North' },
  { id: 'gb', name: 'Packers', city: 'Green Bay', abbreviation: 'GB', conference: 'NFC', division: 'North' },
  { id: 'min', name: 'Vikings', city: 'Minnesota', abbreviation: 'MIN', conference: 'NFC', division: 'North' },
  
  // NFC South
  { id: 'atl', name: 'Falcons', city: 'Atlanta', abbreviation: 'ATL', conference: 'NFC', division: 'South' },
  { id: 'car', name: 'Panthers', city: 'Carolina', abbreviation: 'CAR', conference: 'NFC', division: 'South' },
  { id: 'no', name: 'Saints', city: 'New Orleans', abbreviation: 'NO', conference: 'NFC', division: 'South' },
  { id: 'tb', name: 'Buccaneers', city: 'Tampa Bay', abbreviation: 'TB', conference: 'NFC', division: 'South' },
  
  // NFC West
  { id: 'ari', name: 'Cardinals', city: 'Arizona', abbreviation: 'ARI', conference: 'NFC', division: 'West' },
  { id: 'lar', name: 'Rams', city: 'Los Angeles', abbreviation: 'LAR', conference: 'NFC', division: 'West' },
  { id: 'sf', name: '49ers', city: 'San Francisco', abbreviation: 'SF', conference: 'NFC', division: 'West' },
  { id: 'sea', name: 'Seahawks', city: 'Seattle', abbreviation: 'SEA', conference: 'NFC', division: 'West' }
]

const generateTeamStats = (teamId: string): TeamStats => {
  const seed = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const random = (min: number, max: number) => {
    const x = Math.sin(seed + min) * 10000
    return min + (x - Math.floor(x)) * (max - min)
  }
  
  return {
    pointsPerGame: Math.round(random(16, 32) * 10) / 10,
    pointsAllowed: Math.round(random(16, 32) * 10) / 10,
    totalYards: Math.round(random(280, 420)),
    yardsAllowed: Math.round(random(280, 420)),
    turnoverDiff: Math.round(random(-15, 15)),
    strengthOfSchedule: Math.round(random(0.4, 0.6) * 100) / 100
  }
}

const generateRecentGames = (teamId: string): GameResult[] => {
  const seed = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const games: GameResult[] = []
  
  for (let i = 0; i < 5; i++) {
    const x = Math.sin(seed + i) * 10000
    const random = x - Math.floor(x)
    
    const pointsFor = Math.floor(14 + random * 21)
    const pointsAgainst = Math.floor(14 + (random * 0.7) * 21)
    
    games.push({
      opponent: NFL_TEAMS[Math.floor(random * NFL_TEAMS.length)].abbreviation,
      isWin: pointsFor > pointsAgainst,
      pointsFor,
      pointsAgainst,
      week: 18 - i
    })
  }
  
  return games.reverse()
}

export const getTeamStats = (teamId: string): TeamStats => {
  return generateTeamStats(teamId)
}

export const getRecentGames = (teamId: string): GameResult[] => {
  return generateRecentGames(teamId)
}

export const calculatePrediction = (homeTeam: NFLTeam, awayTeam: NFLTeam) => {
  const homeStats = getTeamStats(homeTeam.id)
  const awayStats = getTeamStats(awayTeam.id)
  const homeGames = getRecentGames(homeTeam.id)
  const awayGames = getRecentGames(awayTeam.id)
  
  const homeWins = homeGames.filter(g => g.isWin).length
  const awayWins = awayGames.filter(g => g.isWin).length
  
  let homeAdvantage = 3
  
  let homeScore = 0
  let awayScore = 0
  
  const factors: string[] = []
  
  // Import injury analysis dynamically to avoid circular dependency
  let homeInjuryAnalysis: any = { totalImpactScore: 0, offensiveImpact: 0, defensiveImpact: 0, keyPlayerInjuries: [] }
  let awayInjuryAnalysis: any = { totalImpactScore: 0, offensiveImpact: 0, defensiveImpact: 0, keyPlayerInjuries: [] }
  
  try {
    const { analyzeTeamInjuryImpact } = require('./injury-analysis')
    homeInjuryAnalysis = analyzeTeamInjuryImpact(homeTeam)
    awayInjuryAnalysis = analyzeTeamInjuryImpact(awayTeam)
  } catch (error) {
    console.warn('Injury analysis not available:', error)
  }
  
  // Apply injury impact (negative impact reduces team performance)
  const homeInjuryPenalty = homeInjuryAnalysis.totalImpactScore * 0.5
  const awayInjuryPenalty = awayInjuryAnalysis.totalImpactScore * 0.5
  
  homeScore -= homeInjuryPenalty
  awayScore -= awayInjuryPenalty
  
  // Add injury factors if significant
  if (homeInjuryAnalysis.totalImpactScore > awayInjuryAnalysis.totalImpactScore + 2) {
    factors.push(`${homeTeam.city} dealing with more injury issues`)
  } else if (awayInjuryAnalysis.totalImpactScore > homeInjuryAnalysis.totalImpactScore + 2) {
    factors.push(`${awayTeam.city} dealing with more injury issues`)
  }
  
  // Key player injury impact
  if (homeInjuryAnalysis.keyPlayerInjuries && homeInjuryAnalysis.keyPlayerInjuries.length > 0) {
    const keyInjuryImpact = homeInjuryAnalysis.keyPlayerInjuries.reduce((sum: number, inj: any) => sum + inj.severityRating, 0)
    homeScore -= keyInjuryImpact * 0.3
    if (homeInjuryAnalysis.keyPlayerInjuries.some((inj: any) => inj.position === 'QB')) {
      factors.push(`${homeTeam.city} QB injury concern`)
    }
  }
  
  if (awayInjuryAnalysis.keyPlayerInjuries && awayInjuryAnalysis.keyPlayerInjuries.length > 0) {
    const keyInjuryImpact = awayInjuryAnalysis.keyPlayerInjuries.reduce((sum: number, inj: any) => sum + inj.severityRating, 0)
    awayScore -= keyInjuryImpact * 0.3
    if (awayInjuryAnalysis.keyPlayerInjuries.some((inj: any) => inj.position === 'QB')) {
      factors.push(`${awayTeam.city} QB injury concern`)
    }
  }
  
  // Offensive efficiency
  const homeOffense = homeStats.pointsPerGame + homeStats.totalYards / 25
  const awayOffense = awayStats.pointsPerGame + awayStats.totalYards / 25
  
  // Apply offensive injury impact
  const homeOffenseAdjusted = homeOffense - (homeInjuryAnalysis.offensiveImpact * 0.8)
  const awayOffenseAdjusted = awayOffense - (awayInjuryAnalysis.offensiveImpact * 0.8)
  
  if (homeOffenseAdjusted > awayOffenseAdjusted) {
    homeScore += (homeOffenseAdjusted - awayOffenseAdjusted) * 0.3
    factors.push(`${homeTeam.city} has stronger offense`)
  } else {
    awayScore += (awayOffenseAdjusted - homeOffenseAdjusted) * 0.3
    factors.push(`${awayTeam.city} has stronger offense`)
  }
  
  // Defensive efficiency
  const homeDefense = (450 - homeStats.yardsAllowed) + (35 - homeStats.pointsAllowed)
  const awayDefense = (450 - awayStats.yardsAllowed) + (35 - awayStats.pointsAllowed)
  
  // Apply defensive injury impact
  const homeDefenseAdjusted = homeDefense - (homeInjuryAnalysis.defensiveImpact * 0.8)
  const awayDefenseAdjusted = awayDefense - (awayInjuryAnalysis.defensiveImpact * 0.8)
  
  if (homeDefenseAdjusted > awayDefenseAdjusted) {
    homeScore += (homeDefenseAdjusted - awayDefenseAdjusted) * 0.25
    factors.push(`${homeTeam.city} has better defense`)
  } else {
    awayScore += (awayDefenseAdjusted - homeDefenseAdjusted) * 0.25
    factors.push(`${awayTeam.city} has better defense`)
  }
  
  // Recent form
  if (homeWins > awayWins) {
    homeScore += (homeWins - awayWins) * 1.5
    factors.push(`${homeTeam.city} has better recent form`)
  } else if (awayWins > homeWins) {
    awayScore += (awayWins - homeWins) * 1.5
    factors.push(`${awayTeam.city} has better recent form`)
  }
  
  // Turnover differential
  if (homeStats.turnoverDiff > awayStats.turnoverDiff) {
    homeScore += (homeStats.turnoverDiff - awayStats.turnoverDiff) * 0.4
    factors.push(`${homeTeam.city} creates more turnovers`)
  } else if (awayStats.turnoverDiff > homeStats.turnoverDiff) {
    awayScore += (awayStats.turnoverDiff - homeStats.turnoverDiff) * 0.4
    factors.push(`${awayTeam.city} creates more turnovers`)
  }
  
  // Add home field advantage
  homeScore += homeAdvantage
  if (!factors.some(f => f.includes('injury'))) {
    factors.push(`${homeTeam.city} gets home field advantage`)
  }
  
  // Ensure minimum scores to avoid division by zero
  homeScore = Math.max(homeScore, 1)
  awayScore = Math.max(awayScore, 1)
  
  const totalScore = homeScore + awayScore
  const homeWinProbability = Math.round((homeScore / totalScore) * 100)
  const awayWinProbability = 100 - homeWinProbability
  
  const confidence = Math.round(Math.abs(homeWinProbability - 50) * 2)
  
  return {
    homeWinProbability,
    awayWinProbability,
    confidence: Math.min(confidence, 95),
    factors: factors.slice(0, 5)
  }
}



// Helper function to get team by id
const getTeam = (id: string): NFLTeam => {
  // Handle team abbreviation mapping
  const teamMap: Record<string, string> = {
    'wsh': 'wsh', // Washington Commanders
    'lac': 'lac', // Los Angeles Chargers
    'lar': 'lar', // Los Angeles Rams
    'sf': 'sf',   // San Francisco 49ers
    'ne': 'ne',   // New England Patriots
    'no': 'no',   // New Orleans Saints
    'nyg': 'nyg', // New York Giants
    'nyj': 'nyj', // New York Jets
    'lv': 'lv',   // Las Vegas Raiders
    'kc': 'kc',   // Kansas City Chiefs
    'gb': 'gb',   // Green Bay Packers
    'tb': 'tb'    // Tampa Bay Buccaneers
  }
  
  const mappedId = teamMap[id] || id
  const team = NFL_TEAMS.find(t => t.id === mappedId)
  if (!team) {
    console.error(`Team not found: ${id} (mapped to: ${mappedId})`)
    // Return a fallback team to prevent crashes
    return { 
      id: mappedId, 
      name: 'Unknown', 
      city: id.toUpperCase(), 
      abbreviation: id.toUpperCase(), 
      conference: 'AFC', 
      division: 'East' 
    }
  }
  return team
}

// Official 2025-26 NFL Schedule including preseason and regular season
export const generateCompleteNFLSchedule = (): NFLGame[] => {
  const schedule: NFLGame[] = []
  
  // Preseason games (weeks -3 to 0)
  const preseasonGames = [
    // Preseason Week 1 (Week -3)
    [
      { away: 'dal', home: 'lar', time: 'Sat 10:00 PM ET' },
      { away: 'buf', home: 'chi', time: 'Thu 8:00 PM ET' },
      { away: 'ne', home: 'car', time: 'Thu 7:00 PM ET' },
      { away: 'nyj', home: 'det', time: 'Thu 7:00 PM ET' },
      { away: 'mia', home: 'atl', time: 'Fri 7:00 PM ET' },
      { away: 'pit', home: 'hou', time: 'Fri 8:00 PM ET' },
      { away: 'lac', home: 'sea', time: 'Sat 10:00 PM ET' },
      { away: 'sf', home: 'no', time: 'Sun 8:00 PM ET' },
      { away: 'kc', home: 'jax', time: 'Sat 7:00 PM ET' },
      { away: 'cle', home: 'gb', time: 'Sat 8:00 PM ET' },
      { away: 'cin', home: 'tb', time: 'Sat 7:30 PM ET' },
      { away: 'bal', home: 'phi', time: 'Fri 7:30 PM ET' },
      { away: 'wsh', home: 'nyg', time: 'Thu 7:00 PM ET' },
      { away: 'ten', home: 'sf', time: 'Sat 9:00 PM ET' },
      { away: 'ind', home: 'den', time: 'Sun 9:00 PM ET' },
      { away: 'lv', home: 'min', time: 'Sat 4:00 PM ET' }
    ],
    // Preseason Week 2 (Week -2)
    [
      { away: 'atl', home: 'mia', time: 'Fri 7:00 PM ET' },
      { away: 'car', home: 'nyj', time: 'Sat 1:00 PM ET' },
      { away: 'chi', home: 'cin', time: 'Sat 7:00 PM ET' },
      { away: 'det', home: 'pit', time: 'Sat 7:00 PM ET' },
      { away: 'gb', home: 'den', time: 'Sun 8:00 PM ET' },
      { away: 'hou', home: 'nyg', time: 'Sat 7:00 PM ET' },
      { away: 'jax', home: 'tb', time: 'Sat 7:30 PM ET' },
      { away: 'min', home: 'cle', time: 'Sat 4:30 PM ET' },
      { away: 'no', home: 'lac', time: 'Sat 10:00 PM ET' },
      { away: 'phi', home: 'ne', time: 'Thu 7:00 PM ET' },
      { away: 'sea', home: 'ten', time: 'Sat 7:00 PM ET' },
      { away: 'sf', home: 'lv', time: 'Fri 10:30 PM ET' },
      { away: 'lar', home: 'lac', time: 'Sat 10:00 PM ET' },
      { away: 'kc', home: 'ari', time: 'Fri 10:00 PM ET' },
      { away: 'buf', home: 'bal', time: 'Wed 7:30 PM ET' },
      { away: 'wsh', home: 'dal', time: 'Sat 8:00 PM ET' }
    ],
    // Preseason Week 3 (Week -1)
    [
      { away: 'ari', home: 'den', time: 'Sun 9:00 PM ET' },
      { away: 'bal', home: 'gb', time: 'Sat 1:00 PM ET' },
      { away: 'cin', home: 'ind', time: 'Thu 8:00 PM ET' },
      { away: 'cle', home: 'sea', time: 'Sat 10:00 PM ET' },
      { away: 'dal', home: 'lac', time: 'Sat 10:00 PM ET' },
      { away: 'lv', home: 'sf', time: 'Fri 10:30 PM ET' },
      { away: 'mia', home: 'min', time: 'Sat 1:00 PM ET' },
      { away: 'ne', home: 'wsh', time: 'Sun 8:00 PM ET' },
      { away: 'nyg', home: 'nyj', time: 'Sat 7:30 PM ET' },
      { away: 'no', home: 'ten', time: 'Sun 2:00 PM ET' },
      { away: 'phi', home: 'car', time: 'Thu 8:00 PM ET' },
      { away: 'pit', home: 'det', time: 'Sat 1:00 PM ET' },
      { away: 'tb', home: 'mia', time: 'Fri 7:30 PM ET' },
      { away: 'hou', home: 'lar', time: 'Sat 10:00 PM ET' },
      { away: 'jax', home: 'atl', time: 'Fri 7:00 PM ET' },
      { away: 'buf', home: 'chi', time: 'Sat 1:00 PM ET' }
    ]
  ]
  
  // Add preseason games with negative week numbers
  preseasonGames.forEach((weekGames, weekIndex) => {
    const week = weekIndex - 3 // -3, -2, -1
    
    weekGames.forEach((gameData) => {
      try {
        const gameId = `ps${Math.abs(week)}g${gameData.away}${gameData.home}`
        const homeTeam = getTeam(gameData.home)
        const awayTeam = getTeam(gameData.away)
        
        schedule.push({
          id: gameId,
          week,
          homeTeam,
          awayTeam,
          gameTime: gameData.time,
          isCompleted: false, // All preseason games are available for prediction
          isPreseason: true
        })
      } catch (error) {
        console.error(`Error creating preseason game: ${gameData.away} @ ${gameData.home} (week ${week})`, error)
      }
    })
  })

  // Define the exact regular season schedule data from the provided source
  const weeklyGames = [
    // Week 1
    [
      { away: 'dal', home: 'phi', time: 'Thu 8:20 PM ET' },
      { away: 'kc', home: 'lac', time: 'Fri 8:00 PM ET' },
      { away: 'ari', home: 'no', time: 'Sun 1:00 PM ET' },
      { away: 'car', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'cin', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'lv', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'mia', home: 'ind', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'wsh', time: 'Sun 1:00 PM ET' },
      { away: 'pit', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'atl', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'sea', time: 'Sun 4:05 PM ET' },
      { away: 'ten', home: 'den', time: 'Sun 4:05 PM ET' },
      { away: 'det', home: 'gb', time: 'Sun 4:25 PM ET' },
      { away: 'hou', home: 'lar', time: 'Sun 4:25 PM ET' },
      { away: 'bal', home: 'buf', time: 'Sun 8:20 PM ET' },
      { away: 'min', home: 'chi', time: 'Mon 8:15 PM ET' }
    ],
    // Week 2
    [
      { away: 'wsh', home: 'gb', time: 'Thu 8:15 PM ET' },
      { away: 'buf', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'chi', home: 'det', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'jax', home: 'cin', time: 'Sun 1:00 PM ET' },
      { away: 'lar', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'mia', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'dal', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'no', time: 'Sun 1:00 PM ET' },
      { away: 'sea', home: 'pit', time: 'Sun 1:00 PM ET' },
      { away: 'car', home: 'ari', time: 'Sun 4:05 PM ET' },
      { away: 'den', home: 'ind', time: 'Sun 4:05 PM ET' },
      { away: 'phi', home: 'kc', time: 'Sun 4:25 PM ET' },
      { away: 'atl', home: 'min', time: 'Sun 8:20 PM ET' },
      { away: 'tb', home: 'hou', time: 'Mon 7:00 PM ET' },
      { away: 'lac', home: 'lv', time: 'Mon 10:00 PM ET' }
    ],
    // Week 3
    [
      { away: 'mia', home: 'buf', time: 'Thu 8:15 PM ET' },
      { away: 'atl', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'cin', home: 'min', time: 'Sun 1:00 PM ET' },
      { away: 'gb', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'hou', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'ind', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'lv', home: 'wsh', time: 'Sun 1:00 PM ET' },
      { away: 'lar', home: 'phi', time: 'Sun 1:00 PM ET' },
      { away: 'nyj', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'pit', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'den', home: 'lac', time: 'Sun 4:05 PM ET' },
      { away: 'no', home: 'sea', time: 'Sun 4:05 PM ET' },
      { away: 'ari', home: 'sf', time: 'Sun 4:25 PM ET' },
      { away: 'dal', home: 'chi', time: 'Sun 4:25 PM ET' },
      { away: 'kc', home: 'nyg', time: 'Sun 8:20 PM ET' },
      { away: 'det', home: 'bal', time: 'Mon 8:15 PM ET' }
    ],
    // Week 4
    [
      { away: 'sea', home: 'ari', time: 'Thu 8:15 PM ET' },
      { away: 'min', home: 'pit', time: 'Sun 9:30 AM ET' },
      { away: 'car', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'det', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'nyg', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'buf', time: 'Sun 1:00 PM ET' },
      { away: 'phi', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'ten', home: 'hou', time: 'Sun 1:00 PM ET' },
      { away: 'wsh', home: 'atl', time: 'Sun 1:00 PM ET' },
      { away: 'ind', home: 'lar', time: 'Sun 4:05 PM ET' },
      { away: 'jax', home: 'sf', time: 'Sun 4:05 PM ET' },
      { away: 'bal', home: 'kc', time: 'Sun 4:25 PM ET' },
      { away: 'chi', home: 'lv', time: 'Sun 4:25 PM ET' },
      { away: 'gb', home: 'dal', time: 'Sun 8:20 PM ET' },
      { away: 'nyj', home: 'mia', time: 'Mon 7:15 PM ET' },
      { away: 'cin', home: 'den', time: 'Mon 8:15 PM ET' }
    ],
    // Week 5
    [
      { away: 'sf', home: 'lar', time: 'Thu 8:15 PM ET' },
      { away: 'min', home: 'cle', time: 'Sun 9:30 AM ET' },
      { away: 'dal', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'den', home: 'phi', time: 'Sun 1:00 PM ET' },
      { away: 'hou', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'lv', home: 'ind', time: 'Sun 1:00 PM ET' },
      { away: 'mia', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'no', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'sea', time: 'Sun 4:05 PM ET' },
      { away: 'ten', home: 'ari', time: 'Sun 4:05 PM ET' },
      { away: 'det', home: 'cin', time: 'Sun 4:25 PM ET' },
      { away: 'wsh', home: 'lac', time: 'Sun 4:25 PM ET' },
      { away: 'ne', home: 'buf', time: 'Sun 8:20 PM ET' },
      { away: 'kc', home: 'jax', time: 'Mon 8:15 PM ET' }
    ],
    // Week 6
    [
      { away: 'phi', home: 'nyg', time: 'Thu 8:15 PM ET' },
      { away: 'den', home: 'nyj', time: 'Sun 9:30 AM ET' },
      { away: 'ari', home: 'ind', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'pit', time: 'Sun 1:00 PM ET' },
      { away: 'dal', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'mia', time: 'Sun 1:00 PM ET' },
      { away: 'lar', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'sea', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'ten', home: 'lv', time: 'Sun 4:05 PM ET' },
      { away: 'cin', home: 'gb', time: 'Sun 4:25 PM ET' },
      { away: 'ne', home: 'no', time: 'Sun 4:25 PM ET' },
      { away: 'det', home: 'kc', time: 'Sun 8:20 PM ET' },
      { away: 'buf', home: 'atl', time: 'Mon 7:15 PM ET' },
      { away: 'chi', home: 'wsh', time: 'Mon 8:15 PM ET' }
    ],
    // Week 7
    [
      { away: 'pit', home: 'cin', time: 'Thu 8:15 PM ET' },
      { away: 'lar', home: 'jax', time: 'Sun 9:30 AM ET' },
      { away: 'car', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'lv', home: 'kc', time: 'Sun 1:00 PM ET' },
      { away: 'mia', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'chi', time: 'Sun 1:00 PM ET' },
      { away: 'phi', home: 'min', time: 'Sun 1:00 PM ET' },
      { away: 'ind', home: 'lac', time: 'Sun 4:05 PM ET' },
      { away: 'nyg', home: 'den', time: 'Sun 4:05 PM ET' },
      { away: 'gb', home: 'ari', time: 'Sun 4:25 PM ET' },
      { away: 'wsh', home: 'dal', time: 'Sun 4:25 PM ET' },
      { away: 'atl', home: 'sf', time: 'Sun 8:20 PM ET' },
      { away: 'tb', home: 'det', time: 'Mon 7:00 PM ET' },
      { away: 'hou', home: 'sea', time: 'Mon 10:00 PM ET' }
    ],
    // Week 8
    [
      { away: 'min', home: 'lac', time: 'Thu 8:15 PM ET' },
      { away: 'buf', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'chi', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'mia', home: 'atl', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'phi', time: 'Sun 1:00 PM ET' },
      { away: 'nyj', home: 'cin', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'hou', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'no', time: 'Sun 4:05 PM ET' },
      { away: 'dal', home: 'den', time: 'Sun 4:25 PM ET' },
      { away: 'ten', home: 'ind', time: 'Sun 4:25 PM ET' },
      { away: 'gb', home: 'pit', time: 'Sun 8:20 PM ET' },
      { away: 'wsh', home: 'kc', time: 'Mon 8:15 PM ET' }
    ],
    // Week 9
    [
      { away: 'bal', home: 'mia', time: 'Thu 8:15 PM ET' },
      { away: 'atl', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'car', home: 'gb', time: 'Sun 1:00 PM ET' },
      { away: 'chi', home: 'cin', time: 'Sun 1:00 PM ET' },
      { away: 'den', home: 'hou', time: 'Sun 1:00 PM ET' },
      { away: 'ind', home: 'pit', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'min', home: 'det', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'nyg', time: 'Sun 1:00 PM ET' },
      { away: 'jax', home: 'lv', time: 'Sun 4:05 PM ET' },
      { away: 'no', home: 'lar', time: 'Sun 4:05 PM ET' },
      { away: 'kc', home: 'buf', time: 'Sun 4:25 PM ET' },
      { away: 'sea', home: 'wsh', time: 'Sun 8:20 PM ET' },
      { away: 'ari', home: 'dal', time: 'Mon 8:15 PM ET' }
    ],
    // Week 10
    [
      { away: 'lv', home: 'den', time: 'Thu 8:15 PM ET' },
      { away: 'atl', home: 'ind', time: 'Sun 9:30 AM ET' },
      { away: 'bal', home: 'min', time: 'Sun 1:00 PM ET' },
      { away: 'buf', home: 'mia', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'jax', home: 'hou', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'chi', time: 'Sun 1:00 PM ET' },
      { away: 'ari', home: 'sea', time: 'Sun 4:05 PM ET' },
      { away: 'det', home: 'wsh', time: 'Sun 4:25 PM ET' },
      { away: 'lar', home: 'sf', time: 'Sun 4:25 PM ET' },
      { away: 'pit', home: 'lac', time: 'Sun 8:20 PM ET' },
      { away: 'phi', home: 'gb', time: 'Mon 8:15 PM ET' }
    ],
    // Week 11
    [
      { away: 'nyj', home: 'ne', time: 'Thu 8:15 PM ET' },
      { away: 'wsh', home: 'mia', time: 'Sun 9:30 AM ET' },
      { away: 'car', home: 'atl', time: 'Sun 1:00 PM ET' },
      { away: 'chi', home: 'min', time: 'Sun 1:00 PM ET' },
      { away: 'cin', home: 'pit', time: 'Sun 1:00 PM ET' },
      { away: 'gb', home: 'nyg', time: 'Sun 1:00 PM ET' },
      { away: 'hou', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'buf', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'ari', time: 'Sun 4:05 PM ET' },
      { away: 'sea', home: 'lar', time: 'Sun 4:05 PM ET' },
      { away: 'bal', home: 'cle', time: 'Sun 4:25 PM ET' },
      { away: 'kc', home: 'den', time: 'Sun 4:25 PM ET' },
      { away: 'det', home: 'phi', time: 'Sun 8:20 PM ET' },
      { away: 'dal', home: 'lv', time: 'Mon 8:15 PM ET' }
    ],
    // Week 12
    [
      { away: 'buf', home: 'hou', time: 'Thu 8:15 PM ET' },
      { away: 'ind', home: 'kc', time: 'Sun 1:00 PM ET' },
      { away: 'min', home: 'gb', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'cin', time: 'Sun 1:00 PM ET' },
      { away: 'nyg', home: 'det', time: 'Sun 1:00 PM ET' },
      { away: 'nyj', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'pit', home: 'chi', time: 'Sun 1:00 PM ET' },
      { away: 'sea', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'lv', time: 'Sun 4:05 PM ET' },
      { away: 'jax', home: 'ari', time: 'Sun 4:05 PM ET' },
      { away: 'atl', home: 'no', time: 'Sun 4:25 PM ET' },
      { away: 'phi', home: 'dal', time: 'Sun 4:25 PM ET' },
      { away: 'tb', home: 'lar', time: 'Sun 8:20 PM ET' },
      { away: 'car', home: 'sf', time: 'Mon 8:15 PM ET' }
    ],
    // Week 13
    [
      { away: 'gb', home: 'det', time: 'Thu 1:00 PM ET' },
      { away: 'kc', home: 'dal', time: 'Thu 4:30 PM ET' },
      { away: 'cin', home: 'bal', time: 'Thu 8:20 PM ET' },
      { away: 'chi', home: 'phi', time: 'Fri 3:00 PM ET' },
      { away: 'ari', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'atl', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'hou', home: 'ind', time: 'Sun 1:00 PM ET' },
      { away: 'jax', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'lar', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'mia', time: 'Sun 1:00 PM ET' },
      { away: 'sf', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'min', home: 'sea', time: 'Sun 4:05 PM ET' },
      { away: 'buf', home: 'pit', time: 'Sun 4:25 PM ET' },
      { away: 'lv', home: 'lac', time: 'Sun 4:25 PM ET' },
      { away: 'den', home: 'wsh', time: 'Sun 8:20 PM ET' },
      { away: 'nyg', home: 'ne', time: 'Mon 8:15 PM ET' }
    ],
    // Week 14
    [
      { away: 'dal', home: 'det', time: 'Thu 8:15 PM ET' },
      { away: 'chi', home: 'gb', time: 'Sun 1:00 PM ET' },
      { away: 'ind', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'mia', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'tb', time: 'Sun 1:00 PM ET' },
      { away: 'pit', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'sea', home: 'atl', time: 'Sun 1:00 PM ET' },
      { away: 'ten', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'wsh', home: 'min', time: 'Sun 1:00 PM ET' },
      { away: 'den', home: 'lv', time: 'Sun 4:05 PM ET' },
      { away: 'cin', home: 'buf', time: 'Sun 4:25 PM ET' },
      { away: 'lar', home: 'ari', time: 'Sun 4:25 PM ET' },
      { away: 'hou', home: 'kc', time: 'Sun 8:20 PM ET' },
      { away: 'phi', home: 'lac', time: 'Mon 8:15 PM ET' }
    ],
    // Week 15
    [
      { away: 'atl', home: 'tb', time: 'Thu 8:15 PM ET' },
      { away: 'ari', home: 'hou', time: 'Sun 1:00 PM ET' },
      { away: 'bal', home: 'cin', time: 'Sun 1:00 PM ET' },
      { away: 'buf', home: 'ne', time: 'Sun 1:00 PM ET' },
      { away: 'cle', home: 'chi', time: 'Sun 1:00 PM ET' },
      { away: 'lv', home: 'phi', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'kc', time: 'Sun 1:00 PM ET' },
      { away: 'nyj', home: 'jax', time: 'Sun 1:00 PM ET' },
      { away: 'wsh', home: 'nyg', time: 'Sun 1:00 PM ET' },
      { away: 'car', home: 'no', time: 'Sun 4:25 PM ET' },
      { away: 'det', home: 'lar', time: 'Sun 4:25 PM ET' },
      { away: 'gb', home: 'den', time: 'Sun 4:25 PM ET' },
      { away: 'ind', home: 'sea', time: 'Sun 4:25 PM ET' },
      { away: 'ten', home: 'sf', time: 'Sun 4:25 PM ET' },
      { away: 'min', home: 'dal', time: 'Sun 8:20 PM ET' },
      { away: 'mia', home: 'pit', time: 'Mon 8:15 PM ET' }
    ],
    // Week 16
    [
      { away: 'lar', home: 'sea', time: 'Thu 8:15 PM ET' },
      { away: 'gb', home: 'chi', time: 'Sat 1:00 PM ET' },
      { away: 'phi', home: 'wsh', time: 'Sat 1:00 PM ET' },
      { away: 'buf', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'kc', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'lac', home: 'dal', time: 'Sun 1:00 PM ET' },
      { away: 'min', home: 'nyg', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'bal', time: 'Sun 1:00 PM ET' },
      { away: 'nyj', home: 'no', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'car', time: 'Sun 1:00 PM ET' },
      { away: 'atl', home: 'ari', time: 'Sun 4:05 PM ET' },
      { away: 'jax', home: 'den', time: 'Sun 4:05 PM ET' },
      { away: 'lv', home: 'hou', time: 'Sun 4:25 PM ET' },
      { away: 'pit', home: 'det', time: 'Sun 4:25 PM ET' },
      { away: 'cin', home: 'mia', time: 'Sun 8:20 PM ET' },
      { away: 'sf', home: 'ind', time: 'Mon 8:15 PM ET' }
    ],
    // Week 17
    [
      { away: 'dal', home: 'wsh', time: 'Thu 1:00 PM ET' },
      { away: 'det', home: 'min', time: 'Thu 4:30 PM ET' },
      { away: 'den', home: 'kc', time: 'Thu 8:15 PM ET' },
      { away: 'ari', home: 'cin', time: 'Sat 1:00 PM ET' },
      { away: 'bal', home: 'gb', time: 'Sat 1:00 PM ET' },
      { away: 'hou', home: 'lac', time: 'Sat 1:00 PM ET' },
      { away: 'nyg', home: 'lv', time: 'Sat 1:00 PM ET' },
      { away: 'sea', home: 'car', time: 'Sat 1:00 PM ET' },
      { away: 'jax', home: 'ind', time: 'Sun 1:00 PM ET' },
      { away: 'ne', home: 'nyj', time: 'Sun 1:00 PM ET' },
      { away: 'no', home: 'ten', time: 'Sun 1:00 PM ET' },
      { away: 'pit', home: 'cle', time: 'Sun 1:00 PM ET' },
      { away: 'tb', home: 'mia', time: 'Sun 1:00 PM ET' },
      { away: 'phi', home: 'buf', time: 'Sun 4:25 PM ET' },
      { away: 'chi', home: 'sf', time: 'Sun 8:20 PM ET' },
      { away: 'lar', home: 'atl', time: 'Mon 8:15 PM ET' }
    ],
    // Week 18
    [
      { away: 'ari', home: 'lar', time: 'Sat 1:00 PM ET' },
      { away: 'bal', home: 'pit', time: 'Sat 1:00 PM ET' },
      { away: 'car', home: 'tb', time: 'Sat 1:00 PM ET' },
      { away: 'cle', home: 'cin', time: 'Sat 1:00 PM ET' },
      { away: 'dal', home: 'nyg', time: 'Sat 1:00 PM ET' },
      { away: 'det', home: 'chi', time: 'Sat 1:00 PM ET' },
      { away: 'gb', home: 'min', time: 'Sat 1:00 PM ET' },
      { away: 'ind', home: 'hou', time: 'Sat 1:00 PM ET' },
      { away: 'kc', home: 'lv', time: 'Sat 1:00 PM ET' },
      { away: 'lac', home: 'den', time: 'Sat 1:00 PM ET' },
      { away: 'mia', home: 'ne', time: 'Sat 1:00 PM ET' },
      { away: 'no', home: 'atl', time: 'Sat 1:00 PM ET' },
      { away: 'nyj', home: 'buf', time: 'Sat 1:00 PM ET' },
      { away: 'sea', home: 'sf', time: 'Sat 1:00 PM ET' },
      { away: 'ten', home: 'jax', time: 'Sat 1:00 PM ET' },
      { away: 'wsh', home: 'phi', time: 'Sat 1:00 PM ET' }
    ]
  ]

  // Convert the regular season schedule data to game objects
  weeklyGames.forEach((weekGames, weekIndex) => {
    const week = weekIndex + 1
    
    weekGames.forEach((gameData) => {
      try {
        const gameId = `w${week}g${gameData.away}${gameData.home}`
        const homeTeam = getTeam(gameData.home)
        const awayTeam = getTeam(gameData.away)
        
        schedule.push({
          id: gameId,
          week,
          homeTeam,
          awayTeam,
          gameTime: gameData.time,
          isCompleted: week < getCurrentWeek(),
          isPreseason: false
        })
      } catch (error) {
        console.error(`Error creating game: ${gameData.away} @ ${gameData.home} (week ${week})`, error)
      }
    })
  })

  console.log(`Generated ${schedule.length} games total (including preseason)`)
  return schedule
}

// Update the main function to use the complete schedule
export const generateNFLSchedule = (): NFLGame[] => {
  try {
    return generateCompleteNFLSchedule()
  } catch (error) {
    console.error('Error generating NFL schedule:', error)
    return []
  }
}

export const getCurrentWeek = (): number => {
  // Return preseason week 3 (-1) for testing with tonight's games
  return -1
  
  // For production, use the actual date calculation:
  /*
  // Calculate current week based on 2025 NFL season start date
  const seasonStart = new Date('2025-09-04') // Thursday Night Football opener
  const preseasonStart = new Date('2025-08-08') // Start of preseason week 1
  const now = new Date()
  
  // If before preseason starts, return preseason week 1
  if (now < preseasonStart) {
    return -3
  }
  
  // If in preseason period
  if (now < seasonStart) {
    const diffTime = now.getTime() - preseasonStart.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const preseasonWeek = Math.ceil(diffDays / 7)
    return -4 + preseasonWeek // Returns -3, -2, or -1
  }
  
  // If in regular season
  // Calculate weeks elapsed since season start
  const diffTime = now.getTime() - seasonStart.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const week = Math.ceil(diffDays / 7)
  
  // Cap at week 18 (regular season end)
  return Math.min(week, 18)
  */
}

export const getGamesForWeek = (week: number): NFLGame[] => {
  const schedule = generateNFLSchedule()
  if (!schedule || !Array.isArray(schedule)) {
    return []
  }
  return schedule.filter(game => game.week === week)
}