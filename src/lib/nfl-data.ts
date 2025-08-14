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

// Generate a realistic NFL schedule for the current season
export const generateNFLSchedule = (): NFLGame[] => {
  const games: NFLGame[] = []
  let gameId = 1

  // Define some common game times
  const gameTimes = [
    '1:00 PM ET',
    '4:25 PM ET', 
    '8:20 PM ET',
    '8:15 PM ET' // Thursday/Monday night
  ]

  // Week 1-18 regular season
  for (let week = 1; week <= 18; week++) {
    const weekGames: NFLGame[] = []
    const teamsUsed = new Set<string>()
    
    // Create a shuffled copy of teams for this week
    const shuffledTeams = [...NFL_TEAMS].sort(() => Math.random() - 0.5)
    
    // Generate 16 games per week (32 teams = 16 matchups)
    for (let i = 0; i < shuffledTeams.length && i < 32; i += 2) {
      if (i + 1 < shuffledTeams.length) {
        const homeTeam = shuffledTeams[i]
        const awayTeam = shuffledTeams[i + 1]
        
        // Skip if teams already used (shouldn't happen with proper pairing)
        if (teamsUsed.has(homeTeam.id) || teamsUsed.has(awayTeam.id)) {
          continue
        }
        
        teamsUsed.add(homeTeam.id)
        teamsUsed.add(awayTeam.id)
        
        // Assign game times (most games Sunday 1PM and 4PM)
        let gameTime = gameTimes[0] // Default to 1PM
        if (weekGames.length < 6) {
          gameTime = gameTimes[0] // 1:00 PM ET
        } else if (weekGames.length < 10) {
          gameTime = gameTimes[1] // 4:25 PM ET  
        } else if (weekGames.length === 10) {
          gameTime = gameTimes[2] // 8:20 PM ET (Sunday night)
        } else if (weekGames.length === 11) {
          gameTime = gameTimes[3] // 8:15 PM ET (Monday night)
        } else {
          gameTime = gameTimes[Math.floor(Math.random() * 2)] // Random early games
        }
        
        weekGames.push({
          id: `game-${gameId++}`,
          week,
          homeTeam,
          awayTeam,
          gameTime,
          isCompleted: week < getCurrentWeek()
        })
      }
    }
    
    games.push(...weekGames)
  }
  
  return games
}

export const getCurrentWeek = (): number => {
  // For demo purposes, return a fixed week during season
  // In a real app, this would calculate based on current date
  return 15 // Mid-season week
}

export const getGamesForWeek = (week: number): NFLGame[] => {
  const schedule = generateNFLSchedule()
  return schedule.filter(game => game.week === week)
}