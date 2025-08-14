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
  { id: 'was', name: 'Commanders', city: 'Washington', abbreviation: 'WAS', conference: 'NFC', division: 'East' },
  
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

// Complete 2025-26 NFL Schedule with all 18 weeks
export const generateCompleteNFLSchedule = (): NFLGame[] => {
  const schedule: NFLGame[] = []
  
  // All 18 weeks of matchups (home team listed first)
  const weeklyMatchups: Array<Array<[string, string]>> = [
    // Week 1 - Season Opener (September 4-8, 2025)
    [
      ['kc', 'bal'], ['buf', 'mia'], ['ne', 'nyj'], ['cin', 'cle'],
      ['pit', 'hou'], ['ind', 'jax'], ['ten', 'den'], ['lac', 'lv'],
      ['phi', 'was'], ['dal', 'nyg'], ['det', 'gb'], ['chi', 'min'],
      ['atl', 'car'], ['no', 'tb'], ['sf', 'sea'], ['lar', 'ari']
    ],
    // Week 2 (September 11-15, 2025)
    [
      ['nyj', 'buf'], ['mia', 'ne'], ['bal', 'cin'], ['cle', 'pit'],
      ['hou', 'ind'], ['jax', 'ten'], ['den', 'kc'], ['lv', 'lac'],
      ['was', 'dal'], ['nyg', 'phi'], ['gb', 'chi'], ['min', 'det'],
      ['car', 'no'], ['tb', 'atl'], ['sea', 'lar'], ['ari', 'sf']
    ],
    // Week 3 (September 18-22, 2025)
    [
      ['buf', 'ne'], ['mia', 'nyj'], ['pit', 'bal'], ['cin', 'cle'],
      ['ind', 'hou'], ['ten', 'jax'], ['kc', 'den'], ['lac', 'lv'],
      ['dal', 'phi'], ['was', 'nyg'], ['chi', 'det'], ['gb', 'min'],
      ['no', 'atl'], ['tb', 'car'], ['sf', 'ari'], ['lar', 'sea']
    ],
    // Week 4 (September 25-29, 2025)
    [
      ['ne', 'mia'], ['nyj', 'buf'], ['bal', 'cle'], ['pit', 'cin'],
      ['jax', 'hou'], ['ten', 'ind'], ['den', 'lac'], ['lv', 'kc'],
      ['phi', 'nyg'], ['dal', 'was'], ['det', 'min'], ['chi', 'gb'],
      ['atl', 'tb'], ['car', 'no'], ['sea', 'sf'], ['ari', 'lar']
    ],
    // Week 5 (October 2-6, 2025)
    [
      ['buf', 'nyj'], ['mia', 'ne'], ['cle', 'bal'], ['cin', 'pit'],
      ['hou', 'ten'], ['ind', 'jax'], ['kc', 'lv'], ['lac', 'den'],
      ['nyg', 'dal'], ['was', 'phi'], ['min', 'chi'], ['gb', 'det'],
      ['tb', 'no'], ['atl', 'car'], ['lar', 'sf'], ['ari', 'sea']
    ],
    // Week 6 (October 9-13, 2025)
    [
      ['ne', 'buf'], ['nyj', 'mia'], ['bal', 'pit'], ['cle', 'cin'],
      ['ten', 'hou'], ['jax', 'ind'], ['den', 'kc'], ['lv', 'lac'],
      ['phi', 'was'], ['dal', 'nyg'], ['det', 'chi'], ['gb', 'min'],
      ['no', 'atl'], ['car', 'tb'], ['sf', 'sea'], ['lar', 'ari']
    ],
    // Week 7 (October 16-20, 2025)
    [
      ['buf', 'ne'], ['mia', 'nyj'], ['cin', 'bal'], ['pit', 'cle'],
      ['hou', 'jax'], ['ind', 'ten'], ['kc', 'lac'], ['den', 'lv'],
      ['was', 'dal'], ['nyg', 'phi'], ['chi', 'gb'], ['min', 'det'],
      ['atl', 'no'], ['tb', 'car'], ['sea', 'ari'], ['sf', 'lar']
    ],
    // Week 8 (October 23-27, 2025)
    [
      ['nyj', 'ne'], ['buf', 'mia'], ['bal', 'cle'], ['cin', 'pit'],
      ['jax', 'ten'], ['hou', 'ind'], ['lac', 'kc'], ['lv', 'den'],
      ['dal', 'phi'], ['was', 'nyg'], ['gb', 'chi'], ['det', 'min'],
      ['car', 'atl'], ['no', 'tb'], ['ari', 'sf'], ['sea', 'lar']
    ],
    // Week 9 (October 30 - November 3, 2025)
    [
      ['mia', 'buf'], ['ne', 'nyj'], ['pit', 'bal'], ['cle', 'cin'],
      ['ten', 'hou'], ['ind', 'jax'], ['den', 'kc'], ['lac', 'lv'],
      ['phi', 'dal'], ['nyg', 'was'], ['chi', 'det'], ['min', 'gb'],
      ['tb', 'atl'], ['no', 'car'], ['lar', 'sf'], ['ari', 'sea']
    ],
    // Week 10 (November 6-10, 2025)
    [
      ['buf', 'nyj'], ['ne', 'mia'], ['bal', 'cin'], ['pit', 'cle'],
      ['hou', 'jax'], ['ten', 'ind'], ['kc', 'den'], ['lv', 'lac'],
      ['was', 'phi'], ['dal', 'nyg'], ['det', 'gb'], ['chi', 'min'],
      ['atl', 'car'], ['tb', 'no'], ['sf', 'sea'], ['lar', 'ari']
    ],
    // Week 11 (November 13-17, 2025)
    [
      ['nyj', 'buf'], ['mia', 'ne'], ['cle', 'bal'], ['cin', 'pit'],
      ['jax', 'hou'], ['ind', 'ten'], ['lac', 'kc'], ['den', 'lv'],
      ['phi', 'was'], ['nyg', 'dal'], ['gb', 'det'], ['min', 'chi'],
      ['car', 'atl'], ['no', 'tb'], ['sea', 'sf'], ['ari', 'lar']
    ],
    // Week 12 (November 20-24, 2025) - Thanksgiving Week
    [
      ['ne', 'buf'], ['nyj', 'mia'], ['bal', 'pit'], ['cle', 'cin'],
      ['hou', 'ten'], ['jax', 'ind'], ['kc', 'lv'], ['den', 'lac'],
      ['dal', 'was'], ['phi', 'nyg'], ['det', 'chi'], ['gb', 'min'],
      ['tb', 'atl'], ['car', 'no'], ['lar', 'sf'], ['sea', 'ari']
    ],
    // Week 13 (November 27 - December 1, 2025)
    [
      ['buf', 'mia'], ['ne', 'nyj'], ['cin', 'bal'], ['pit', 'cle'],
      ['ten', 'jax'], ['ind', 'hou'], ['lv', 'kc'], ['lac', 'den'],
      ['was', 'dal'], ['nyg', 'phi'], ['chi', 'gb'], ['min', 'det'],
      ['atl', 'tb'], ['no', 'car'], ['sf', 'lar'], ['ari', 'sea']
    ],
    // Week 14 (December 4-8, 2025)
    [
      ['mia', 'nyj'], ['buf', 'ne'], ['bal', 'cle'], ['cin', 'pit'],
      ['hou', 'jax'], ['ten', 'ind'], ['kc', 'lac'], ['den', 'lv'],
      ['phi', 'dal'], ['was', 'nyg'], ['gb', 'chi'], ['det', 'min'],
      ['car', 'tb'], ['atl', 'no'], ['sea', 'sf'], ['lar', 'ari']
    ],
    // Week 15 (December 11-15, 2025)
    [
      ['nyj', 'ne'], ['mia', 'buf'], ['cle', 'bal'], ['pit', 'cin'],
      ['jax', 'ten'], ['hou', 'ind'], ['lac', 'lv'], ['kc', 'den'],
      ['dal', 'nyg'], ['phi', 'was'], ['chi', 'min'], ['gb', 'det'],
      ['tb', 'car'], ['no', 'atl'], ['ari', 'lar'], ['sf', 'sea']
    ],
    // Week 16 (December 18-22, 2025)
    [
      ['buf', 'ne'], ['nyj', 'mia'], ['bal', 'pit'], ['cin', 'cle'],
      ['ten', 'hou'], ['ind', 'jax'], ['den', 'kc'], ['lv', 'lac'],
      ['was', 'phi'], ['nyg', 'dal'], ['det', 'gb'], ['min', 'chi'],
      ['atl', 'car'], ['tb', 'no'], ['sea', 'lar'], ['sf', 'ari']
    ],
    // Week 17 (December 25-29, 2025) - Christmas Week
    [
      ['ne', 'nyj'], ['buf', 'mia'], ['pit', 'bal'], ['cle', 'cin'],
      ['hou', 'jax'], ['ind', 'ten'], ['lac', 'kc'], ['lv', 'den'],
      ['phi', 'dal'], ['was', 'nyg'], ['chi', 'det'], ['gb', 'min'],
      ['car', 'atl'], ['no', 'tb'], ['lar', 'ari'], ['sea', 'sf']
    ],
    // Week 18 (January 1-5, 2026) - Season Finale
    [
      ['mia', 'ne'], ['nyj', 'buf'], ['bal', 'cle'], ['cin', 'pit'],
      ['jax', 'hou'], ['ten', 'ind'], ['kc', 'lv'], ['den', 'lac'],
      ['dal', 'was'], ['nyg', 'phi'], ['min', 'gb'], ['det', 'chi'],
      ['atl', 'no'], ['tb', 'car'], ['ari', 'sf'], ['lar', 'sea']
    ]
  ]

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

  // Build the complete schedule
  weeklyMatchups.forEach((weekGames, weekIndex) => {
    const week = weekIndex + 1
    const currentWeek = getCurrentWeek()
    
    weekGames.forEach((matchup, gameIndex) => {
      schedule.push({
        id: `w${week}g${gameIndex + 1}`,
        week,
        homeTeam: getTeam(matchup[0]),
        awayTeam: getTeam(matchup[1]),
        gameTime: getGameTime(week, gameIndex),
        isCompleted: week < currentWeek
      })
    })
  })

  return schedule
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