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
  
  // Offensive efficiency
  const homeOffense = homeStats.pointsPerGame + homeStats.totalYards / 25
  const awayOffense = awayStats.pointsPerGame + awayStats.totalYards / 25
  if (homeOffense > awayOffense) {
    homeScore += (homeOffense - awayOffense) * 0.3
    factors.push(`${homeTeam.city} has stronger offense`)
  } else {
    awayScore += (awayOffense - homeOffense) * 0.3
    factors.push(`${awayTeam.city} has stronger offense`)
  }
  
  // Defensive efficiency
  const homeDefense = (450 - homeStats.yardsAllowed) + (35 - homeStats.pointsAllowed)
  const awayDefense = (450 - awayStats.yardsAllowed) + (35 - awayStats.pointsAllowed)
  if (homeDefense > awayDefense) {
    homeScore += (homeDefense - awayDefense) * 0.25
    factors.push(`${homeTeam.city} has better defense`)
  } else {
    awayScore += (awayDefense - homeDefense) * 0.25
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
  factors.push(`${homeTeam.city} gets home field advantage`)
  
  const totalScore = homeScore + awayScore
  const homeWinProbability = Math.round((homeScore / totalScore) * 100)
  const awayWinProbability = 100 - homeWinProbability
  
  const confidence = Math.round(Math.abs(homeWinProbability - 50) * 2)
  
  return {
    homeWinProbability,
    awayWinProbability,
    confidence: Math.min(confidence, 95),
    factors: factors.slice(0, 4)
  }
}



// Helper function to get team by id
const getTeam = (id: string): NFLTeam => {
  const team = NFL_TEAMS.find(t => t.id === id)
  if (!team) throw new Error(`Team not found: ${id}`)
  return team
}

// Accurate 2025-26 NFL Schedule based on official data
export const generateCompleteNFLSchedule = (): NFLGame[] => {
  const schedule: NFLGame[] = []
  
  // Official 2025-26 NFL Schedule - mapping team abbreviations to their schedule
  const teamSchedules: Record<string, string[]> = {
    'ari': ['@no', 'car', '@sf', 'sea', 'ten', '@ind', 'gb', 'bye', '@dal', '@sea', 'sf', 'jax', '@tb', 'lar', '@hou', 'atl', '@cin', '@lar'],
    'atl': ['tb', '@min', '@car', 'wsh', 'bye', 'buf', '@sf', 'mia', '@ne', '@ind', 'car', '@no', '@nyj', 'sea', '@tb', '@ari', 'lar', 'no'],
    'bal': ['@buf', 'cle', 'det', '@kc', 'hou', 'lar', 'bye', 'chi', '@mia', '@min', '@cle', 'nyj', 'cin', 'pit', '@cin', 'ne', '@gb', '@pit'],
    'buf': ['bal', '@nyj', 'mia', 'no', 'ne', '@atl', 'bye', '@car', 'kc', '@mia', 'tb', '@hou', '@pit', 'cin', '@ne', '@cle', 'phi', 'nyj'],
    'car': ['@jax', '@ari', 'atl', '@ne', 'mia', 'dal', '@nyj', 'buf', '@gb', 'no', '@atl', '@sf', 'lar', 'bye', '@no', 'tb', 'sea', '@tb'],
    'chi': ['min', '@det', 'dal', '@lv', 'bye', '@wsh', 'no', '@bal', '@cin', 'nyg', '@min', 'pit', '@phi', '@gb', 'cle', 'gb', '@sf', 'det'],
    'cin': ['@cle', 'jax', '@min', '@den', 'det', '@gb', 'pit', 'nyj', 'chi', 'bye', '@pit', 'ne', '@bal', '@buf', 'bal', '@mia', 'ari', 'cle'],
    'cle': ['cin', '@bal', 'gb', '@det', 'min', '@pit', 'mia', '@ne', 'bye', '@nyj', 'bal', '@lv', 'sf', 'ten', '@chi', 'buf', 'pit', '@cin'],
    'dal': ['@phi', 'nyg', '@chi', 'gb', '@nyj', '@car', 'wsh', '@den', 'ari', 'bye', '@lv', 'phi', 'kc', '@det', 'min', 'lac', '@wsh', '@nyg'],
    'den': ['ten', '@ind', '@lac', 'cin', '@phi', '@nyj', 'nyg', 'dal', '@hou', 'lv', 'kc', 'bye', '@wsh', '@lv', 'gb', 'jax', '@kc', 'lac'],
    'det': ['@gb', 'chi', '@bal', 'cle', '@cin', '@kc', 'tb', 'bye', 'min', '@wsh', '@phi', 'nyg', 'gb', 'dal', '@lar', 'pit', '@min', '@chi'],
    'gb': ['det', 'wsh', '@cle', '@dal', 'bye', 'cin', '@ari', '@pit', 'car', 'phi', '@nyg', 'min', '@det', 'chi', '@den', '@chi', 'bal', '@min'],
    'hou': ['@lar', 'tb', '@jax', 'ten', '@bal', 'bye', '@sea', 'sf', 'den', 'jax', '@ten', 'buf', '@ind', '@kc', 'ari', 'lv', '@lac', 'ind'],
    'ind': ['mia', 'den', '@ten', '@lar', 'lv', 'ari', '@lac', 'ten', '@pit', 'atl', 'bye', '@kc', 'hou', '@jax', '@sea', 'sf', 'jax', '@hou'],
    'jax': ['car', '@cin', 'hou', '@sf', 'kc', 'sea', 'lar', 'bye', '@lv', '@hou', 'lac', '@ari', '@ten', 'ind', 'nyj', '@den', '@ind', 'ten'],
    'kc': ['@lac', 'phi', '@nyg', 'bal', '@jax', 'det', 'lv', 'wsh', '@buf', 'bye', '@den', 'ind', '@dal', 'hou', 'lac', '@ten', 'den', '@lv'],
    'lv': ['@ne', 'lac', '@wsh', 'chi', '@ind', 'ten', '@kc', 'bye', 'jax', '@den', 'dal', 'cle', '@lac', 'den', '@phi', '@hou', 'nyg', 'kc'],
    'lar': ['hou', '@ten', '@phi', 'ind', 'sf', '@bal', '@jax', 'bye', 'no', '@sf', 'sea', 'tb', '@car', '@ari', 'det', '@sea', '@atl', 'ari'],
    'lac': ['kc', '@lv', 'den', '@nyg', 'wsh', '@mia', 'ind', 'min', '@ten', 'pit', '@jax', 'bye', 'lv', 'phi', '@kc', '@dal', 'hou', '@den'],
    'mia': ['@ind', 'ne', '@buf', 'nyj', '@car', 'lac', '@cle', '@atl', 'bal', 'buf', 'wsh', 'bye', 'no', '@nyj', '@pit', 'cin', 'tb', '@ne'],
    'min': ['@chi', 'atl', 'cin', '@pit', '@cle', 'bye', 'phi', '@lac', '@det', 'bal', 'chi', '@gb', '@sea', 'wsh', '@dal', '@nyg', 'det', 'gb'],
    'ne': ['lv', '@mia', 'pit', 'car', '@buf', '@no', '@ten', 'cle', 'atl', '@tb', 'nyj', '@cin', 'nyg', 'bye', 'buf', '@bal', '@nyj', 'mia'],
    'no': ['ari', 'sf', '@sea', '@buf', 'nyg', 'ne', '@chi', 'tb', '@lar', '@car', 'bye', 'atl', '@mia', '@tb', 'car', 'nyj', '@ten', '@atl'],
    'nyg': ['@wsh', '@dal', 'kc', 'lac', '@no', 'phi', '@den', '@phi', 'sf', '@chi', 'gb', '@det', '@ne', 'bye', 'wsh', 'min', '@lv', 'dal'],
    'nyj': ['pit', 'buf', '@tb', '@mia', 'dal', 'den', 'car', '@cin', 'bye', 'cle', '@ne', '@bal', 'atl', 'mia', '@jax', '@no', 'ne', '@buf'],
    'phi': ['dal', '@kc', 'lar', '@tb', 'den', '@nyg', '@min', 'nyg', 'bye', '@gb', 'det', '@dal', 'chi', '@lac', 'lv', '@wsh', '@buf', 'wsh'],
    'pit': ['@nyj', 'sea', '@ne', 'min', 'bye', 'cle', '@cin', 'gb', 'ind', '@lac', 'cin', '@chi', 'buf', '@bal', 'mia', '@det', '@cle', 'bal'],
    'sf': ['@sea', '@no', 'ari', 'jax', '@lar', '@tb', 'atl', '@hou', '@nyg', 'lar', '@ari', 'car', '@cle', 'bye', 'ten', '@ind', 'chi', 'sea'],
    'sea': ['sf', '@pit', 'no', '@ari', 'tb', '@jax', 'hou', 'bye', '@wsh', 'ari', '@lar', '@ten', 'min', '@atl', 'ind', 'lar', '@car', '@sf'],
    'tb': ['@atl', '@hou', 'nyj', 'phi', '@sea', 'sf', '@det', '@no', 'bye', 'ne', '@buf', '@lar', 'ari', 'no', 'atl', '@car', '@mia', 'car'],
    'ten': ['@den', 'lar', 'ind', '@hou', '@ari', '@lv', 'ne', '@ind', 'lac', 'bye', 'hou', 'sea', 'jax', '@cle', '@sf', 'kc', 'no', '@jax'],
    'wsh': ['nyg', '@gb', 'lv', '@atl', '@lac', 'chi', '@dal', '@kc', 'sea', 'det', '@mia', 'bye', 'den', '@min', '@nyg', 'phi', 'dal', '@phi']
  }

  // Game time assignments by slot
  const getGameTime = (weekNum: number, gameIndex: number): string => {
    // Thursday Night Football (first game of most weeks)
    if (gameIndex === 0 && weekNum > 1) return 'Thu 8:15 PM ET'
    // Week 1 Thursday opener
    if (weekNum === 1 && gameIndex === 0) return 'Thu 8:20 PM ET'
    
    // Sunday games
    if (gameIndex < 7) return 'Sun 1:00 PM ET'
    if (gameIndex < 11) return 'Sun 4:25 PM ET'
    if (gameIndex === 11) return 'Sun 8:20 PM ET' // Sunday Night Football
    if (gameIndex === 12) return 'Mon 8:15 PM ET' // Monday Night Football
    
    // Additional games get various times
    return gameIndex < 15 ? 'Sun 1:00 PM ET' : 'Sun 4:25 PM ET'
  }

  // Convert team schedules to game objects
  Object.entries(teamSchedules).forEach(([teamId, games]) => {
    games.forEach((opponent, weekIndex) => {
      const week = weekIndex + 1
      
      // Skip bye weeks
      if (opponent === 'bye') return
      
      // Determine home/away and opponent ID
      const isAway = opponent.startsWith('@')
      const opponentId = isAway ? opponent.slice(1) : opponent
      
      // Only add game once (when processing home team to avoid duplicates)
      if (!isAway) {
        const gameId = `w${week}g${teamId}${opponentId}`
        const homeTeam = getTeam(teamId)
        const awayTeam = getTeam(opponentId)
        
        schedule.push({
          id: gameId,
          week,
          homeTeam,
          awayTeam,
          gameTime: getGameTime(week, schedule.filter(g => g.week === week).length),
          isCompleted: week < getCurrentWeek()
        })
      }
    })
  })

}

// Update the main function to use the complete schedule
export const generateNFLSchedule = (): NFLGame[] => {
  return generateCompleteNFLSchedule()
}

export const getCurrentWeek = (): number => {
  // Calculate current week based on 2025 NFL season start date
  const seasonStart = new Date('2025-09-04') // Thursday Night Football opener
  const now = new Date()
  
  // If before season starts, return week 1
  if (now < seasonStart) {
    return 1
  }
  
  // Calculate weeks elapsed since season start
  const diffTime = now.getTime() - seasonStart.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const week = Math.ceil(diffDays / 7)
  
  // Cap at week 18 (regular season end)
  return Math.min(week, 18)
}

export const getGamesForWeek = (week: number): NFLGame[] => {
  const schedule = generateNFLSchedule()
  return schedule.filter(game => game.week === week)
}