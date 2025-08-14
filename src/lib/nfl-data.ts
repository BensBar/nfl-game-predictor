import { NFLTeam, TeamStats, GameResult, NFLGame, PredictionFactor } from '@/types/nfl'
import { realSportsAPI } from './real-sports-api'

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

// Get team statistics from real API data
export const getTeamStats = async (teamId: string): Promise<TeamStats> => {
  const stats = await realSportsAPI.fetchTeamStats(teamId)
  return stats
}

// Get recent games from real API data
export const getRecentGames = async (teamId: string): Promise<GameResult[]> => {
  // In a real implementation, this would fetch actual recent games from APIs
  // For now, return basic structure while APIs are being integrated
  return []
}

export const calculatePrediction = async (homeTeam: NFLTeam, awayTeam: NFLTeam) => {
  console.log(`🎯 Generating prediction for ${awayTeam.city} @ ${homeTeam.city}...`)
  
  // Fetch real-time data from APIs
  const [homeStats, awayStats, homeInjuries, awayInjuries] = await Promise.all([
    getTeamStats(homeTeam.id),
    getTeamStats(awayTeam.id),
    realSportsAPI.fetchInjuryReport(homeTeam.id),
    realSportsAPI.fetchInjuryReport(awayTeam.id)
  ])
  
  console.log(`📊 Retrieved stats: ${homeTeam.city} (${homeStats.pointsPerGame} PPG), ${awayTeam.city} (${awayStats.pointsPerGame} PPG)`)
  
  let homeScore = 50 // Start with equal baseline
  let awayScore = 50
  const factors: PredictionFactor[] = []
  
  // === OFFENSE vs DEFENSE MATCHUP ===
  const homeOffensePower = homeStats.pointsPerGame + (homeStats.totalYards / 25)
  const awayOffensePower = awayStats.pointsPerGame + (awayStats.totalYards / 25)
  const homeDefensePower = (450 - homeStats.yardsAllowed) / 10 + (35 - homeStats.pointsAllowed)
  const awayDefensePower = (450 - awayStats.yardsAllowed) / 10 + (35 - awayStats.pointsAllowed)
  
  // Home offense vs Away defense
  const homeOffVsAwayDef = homeOffensePower - (awayDefensePower * 0.8)
  // Away offense vs Home defense  
  const awayOffVsHomeDef = awayOffensePower - (homeDefensePower * 0.8)
  
  if (homeOffVsAwayDef > awayOffVsHomeDef) {
    const advantage = (homeOffVsAwayDef - awayOffVsHomeDef) * 1.2
    homeScore += advantage
    factors.push({
      text: `${homeTeam.city} offense has favorable matchup vs ${awayTeam.city} defense`,
      source: 'ESPN',
      sourceUrl: 'https://www.espn.com/nfl/teams'
    })
  } else {
    const advantage = (awayOffVsHomeDef - homeOffVsAwayDef) * 1.2
    awayScore += advantage  
    factors.push({
      text: `${awayTeam.city} offense has favorable matchup vs ${homeTeam.city} defense`,
      source: 'ESPN',
      sourceUrl: 'https://www.espn.com/nfl/teams'
    })
  }
  
  // === STATISTICAL ADVANTAGES ===
  // Turnover differential impact
  const turnoverAdvantage = homeStats.turnoverDiff - awayStats.turnoverDiff
  if (Math.abs(turnoverAdvantage) > 3) {
    if (turnoverAdvantage > 0) {
      homeScore += turnoverAdvantage * 0.8
      factors.push({
        text: `${homeTeam.city} creates ${Math.abs(turnoverAdvantage)} more turnovers per game`,
        source: 'ESPN',
        sourceUrl: 'https://www.espn.com/nfl/stats/team'
      })
    } else {
      awayScore += Math.abs(turnoverAdvantage) * 0.8
      factors.push({
        text: `${awayTeam.city} creates ${Math.abs(turnoverAdvantage)} more turnovers per game`,
        source: 'ESPN',
        sourceUrl: 'https://www.espn.com/nfl/stats/team'
      })
    }
  }
  
  // === INJURY IMPACT ANALYSIS ===
  const homeInjuryImpact = calculateInjuryImpact(homeInjuries)
  const awayInjuryImpact = calculateInjuryImpact(awayInjuries)
  
  homeScore -= homeInjuryImpact.totalPenalty
  awayScore -= awayInjuryImpact.totalPenalty
  
  if (homeInjuryImpact.hasQBInjury) {
    factors.push({
      text: `${homeTeam.city} QB injury concerns`,
      source: 'Injuries',
      sourceUrl: 'https://www.espn.com/nfl/injuries'
    })
  }
  if (awayInjuryImpact.hasQBInjury) {
    factors.push({
      text: `${awayTeam.city} QB injury concerns`,
      source: 'Injuries',
      sourceUrl: 'https://www.espn.com/nfl/injuries'
    })
  }
  
  if (homeInjuryImpact.totalPenalty > awayInjuryImpact.totalPenalty + 3) {
    factors.push({
      text: `${homeTeam.city} dealing with more significant injuries`,
      source: 'Injuries',
      sourceUrl: 'https://www.espn.com/nfl/injuries'
    })
  } else if (awayInjuryImpact.totalPenalty > homeInjuryImpact.totalPenalty + 3) {
    factors.push({
      text: `${awayTeam.city} dealing with more significant injuries`,
      source: 'Injuries',
      sourceUrl: 'https://www.espn.com/nfl/injuries'
    })
  }
  
  // === HOME FIELD ADVANTAGE ===
  const homeAdvantage = 4.2 // NFL average home field advantage
  homeScore += homeAdvantage
  factors.push({
    text: `${homeTeam.city} gets significant home field advantage`,
    source: 'Home Field',
    sourceUrl: 'https://www.espn.com/nfl/standings'
  })
  
  // === TEAM QUALITY DIFFERENTIAL ===
  const qualityDiff = (homeStats.pointsPerGame - homeStats.pointsAllowed) - (awayStats.pointsPerGame - awayStats.pointsAllowed)
  if (Math.abs(qualityDiff) > 2) {
    if (qualityDiff > 0) {
      homeScore += qualityDiff * 0.6
      factors.push({
        text: `${homeTeam.city} has superior point differential (+${qualityDiff.toFixed(1)})`,
        source: 'ESPN',
        sourceUrl: 'https://www.espn.com/nfl/standings'
      })
    } else {
      awayScore += Math.abs(qualityDiff) * 0.6
      factors.push({
        text: `${awayTeam.city} has superior point differential (+${Math.abs(qualityDiff).toFixed(1)})`,
        source: 'ESPN',
        sourceUrl: 'https://www.espn.com/nfl/standings'
      })
    }
  }
  
  // === STRENGTH OF SCHEDULE ===
  if (homeStats.strengthOfSchedule && awayStats.strengthOfSchedule) {
    const scheduleAdj = (awayStats.strengthOfSchedule - homeStats.strengthOfSchedule) * 15
    if (Math.abs(scheduleAdj) > 2) {
      if (scheduleAdj > 0) {
        homeScore += scheduleAdj
        factors.push({
          text: `${homeTeam.city} has faced tougher competition`,
          source: 'Historical',
          sourceUrl: 'https://www.pro-football-reference.com'
        })
      } else {
        awayScore += Math.abs(scheduleAdj)
        factors.push({
          text: `${awayTeam.city} has faced tougher competition`,
          source: 'Historical',
          sourceUrl: 'https://www.pro-football-reference.com'
        })
      }
    }
  }
  
  // Ensure scores stay positive
  homeScore = Math.max(homeScore, 15)
  awayScore = Math.max(awayScore, 15)
  
  // Calculate final probabilities
  const totalScore = homeScore + awayScore
  const homeWinProbability = Math.round((homeScore / totalScore) * 100)
  const awayWinProbability = 100 - homeWinProbability
  
  // Calculate confidence based on score differential
  const scoreDiff = Math.abs(homeScore - awayScore)
  const confidence = Math.min(Math.round(45 + (scoreDiff * 3)), 92)
  
  console.log(`🏆 Prediction complete: ${homeTeam.city} ${homeWinProbability}% vs ${awayTeam.city} ${awayWinProbability}% (${confidence}% confidence)`)
  
  return {
    homeWinProbability,
    awayWinProbability,
    confidence,
    factors: factors.slice(0, 6)
  }
}

// Helper function to calculate injury impact
function calculateInjuryImpact(injuries: any[]) {
  let totalPenalty = 0
  let hasQBInjury = false
  
  injuries.forEach(injury => {
    let penalty = 0
    
    // Position-based impact
    switch (injury.position) {
      case 'QB':
        penalty = injury.severityRating * 3.0
        hasQBInjury = true
        break
      case 'RB':
      case 'WR':
        penalty = injury.severityRating * 1.5
        break
      case 'TE':
      case 'OL':
        penalty = injury.severityRating * 1.2
        break
      case 'DL':
      case 'LB':
        penalty = injury.severityRating * 1.1
        break
      default:
        penalty = injury.severityRating * 0.8
    }
    
    // Status-based multiplier
    switch (injury.status) {
      case 'Out':
        penalty *= 1.0
        break
      case 'Doubtful':
        penalty *= 0.7
        break
      case 'Questionable':
        penalty *= 0.4
        break
      default:
        penalty *= 0.2
    }
    
    totalPenalty += penalty
  })
  
  return { totalPenalty, hasQBInjury }
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
export const generateCompleteNFLSchedule = async (): Promise<NFLGame[]> => {
  const schedule: NFLGame[] = []

  try {
    // 2025 Preseason Schedule - Fixed correct week ordering
    const preseasonGames = [
      // Preseason Week 1 (Week -3) - August 7-10, 2025
      [
        { away: 'ind', home: 'bal', time: 'Thu 7:00 PM ET' },
        { away: 'cin', home: 'phi', time: 'Thu 7:30 PM ET' },
        { away: 'lv', home: 'sea', time: 'Thu 10:00 PM ET' },
        { away: 'det', home: 'atl', time: 'Fri 7:00 PM ET' },
        { away: 'cle', home: 'car', time: 'Fri 7:00 PM ET' },
        { away: 'wsh', home: 'ne', time: 'Fri 7:30 PM ET' },
        { away: 'nyg', home: 'buf', time: 'Sat 1:00 PM ET' },
        { away: 'hou', home: 'min', time: 'Sat 4:00 PM ET' },
        { away: 'pit', home: 'jax', time: 'Sat 7:00 PM ET' },
        { away: 'dal', home: 'lar', time: 'Sat 7:00 PM ET' },
        { away: 'ten', home: 'tb', time: 'Sat 7:30 PM ET' },
        { away: 'kc', home: 'ari', time: 'Sat 8:00 PM ET' },
        { away: 'nyj', home: 'gb', time: 'Sat 8:00 PM ET' },
        { away: 'den', home: 'sf', time: 'Sat 8:30 PM ET' },
        { away: 'mia', home: 'chi', time: 'Sun 1:00 PM ET' },
        { away: 'no', home: 'lac', time: 'Sun 4:05 PM ET' }
      ],
      // Preseason Week 2 (Week -2) - August 15-18, 2025
      [
        { away: 'ten', home: 'atl', time: 'Fri 7:00 PM ET' },
        { away: 'kc', home: 'sea', time: 'Fri 10:00 PM ET' },
        { away: 'mia', home: 'det', time: 'Sat 1:00 PM ET' },
        { away: 'car', home: 'hou', time: 'Sat 1:00 PM ET' },
        { away: 'gb', home: 'ind', time: 'Sat 1:00 PM ET' },
        { away: 'ne', home: 'min', time: 'Sat 1:00 PM ET' },
        { away: 'cle', home: 'phi', time: 'Sat 1:00 PM ET' },
        { away: 'sf', home: 'lv', time: 'Sat 4:00 PM ET' },
        { away: 'bal', home: 'dal', time: 'Sat 7:00 PM ET' },
        { away: 'lac', home: 'lar', time: 'Sat 7:00 PM ET' },
        { away: 'nyj', home: 'nyg', time: 'Sat 7:00 PM ET' },
        { away: 'tb', home: 'pit', time: 'Sat 7:00 PM ET' },
        { away: 'ari', home: 'den', time: 'Sat 9:30 PM ET' },
        { away: 'jax', home: 'no', time: 'Sun 1:00 PM ET' },
        { away: 'buf', home: 'chi', time: 'Sun 8:00 PM ET' },
        { away: 'cin', home: 'wsh', time: 'Mon 8:00 PM ET' }
      ],
      // Preseason Week 3 (Week -1) - August 21-23, 2025
      [
        { away: 'pit', home: 'car', time: 'Thu 7:00 PM ET' },
        { away: 'ne', home: 'nyg', time: 'Thu 8:00 PM ET' },
        { away: 'phi', home: 'nyj', time: 'Fri 7:30 PM ET' },
        { away: 'atl', home: 'dal', time: 'Fri 8:00 PM ET' },
        { away: 'min', home: 'ten', time: 'Fri 8:00 PM ET' },
        { away: 'chi', home: 'kc', time: 'Fri 8:20 PM ET' },
        { away: 'bal', home: 'wsh', time: 'Sat 12:00 PM ET' },
        { away: 'ind', home: 'cin', time: 'Sat 1:00 PM ET' },
        { away: 'lar', home: 'cle', time: 'Sat 1:00 PM ET' },
        { away: 'hou', home: 'det', time: 'Sat 1:00 PM ET' },
        { away: 'den', home: 'no', time: 'Sat 1:00 PM ET' },
        { away: 'sea', home: 'gb', time: 'Sat 4:00 PM ET' },
        { away: 'jax', home: 'mia', time: 'Sat 7:00 PM ET' },
        { away: 'buf', home: 'tb', time: 'Sat 7:30 PM ET' },
        { away: 'lac', home: 'sf', time: 'Sat 8:30 PM ET' },
        { away: 'lv', home: 'ari', time: 'Sat 10:00 PM ET' }
      ]
    ]
    
    // Add preseason weeks (Week -3, -2, -1)
    preseasonGames.forEach((weekGames, weekIndex) => {
      const week = -3 + weekIndex // -3, -2, -1
      
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
            isCompleted: false,
            isPreseason: true
          })
        } catch (error) {
          console.error(`Error creating preseason game: ${gameData.away} @ ${gameData.home} (week ${week})`, error)
        }
      })
    })

  } catch (error) {
    console.error('Error adding preseason games:', error)
  }

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

// Update the main function to use real API data
export const generateNFLSchedule = async (): Promise<NFLGame[]> => {
  try {
    return await generateCompleteNFLSchedule()
  } catch (error) {
    console.error('Error generating NFL schedule:', error)
    return []
  }
}

export const getCurrentWeek = (): number => {
  // Return preseason week 2 (-2) for testing with tonight's games
  return -2
}

export const getGamesForWeek = async (week: number): Promise<NFLGame[]> => {
  try {
    console.log(`🔍 Fetching games for week ${week}...`)
    const games = await realSportsAPI.fetchSchedule(week)
    console.log(`✅ Retrieved ${games?.length || 0} games for week ${week}`)
    return games || []
  } catch (error) {
    console.error(`❌ Error fetching games for week ${week}:`, error)
    return []
  }
}