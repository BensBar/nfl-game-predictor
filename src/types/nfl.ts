export interface NFLTeam {
  id: string
  name: string
  city: string
  abbreviation: string
  conference: 'AFC' | 'NFC'
  division: 'North' | 'South' | 'East' | 'West'
}

export interface TeamStats {
  pointsPerGame: number
  pointsAllowed: number
  totalYards: number
  yardsAllowed: number
  turnoverDiff: number
  strengthOfSchedule: number
}

export interface GameResult {
  opponent: string
  isWin: boolean
  pointsFor: number
  pointsAgainst: number
  week: number
}

export interface Prediction {
  id: string
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  homeWinProbability: number
  awayWinProbability: number
  confidence: number
  factors: string[]
  timestamp: number
}

export interface PredictionHistory extends Prediction {
  actualResult?: 'home' | 'away'
}

export interface NFLGame {
  id: string
  week: number
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  gameTime: string
  isCompleted?: boolean
  isPreseason?: boolean
  isLive?: boolean
  homeScore?: number
  awayScore?: number
}

export interface PlayerInjury {
  id: string
  playerId: string
  playerName: string
  position: string
  team: string
  injuryType: string
  bodyPart: string
  severity: 'Questionable' | 'Doubtful' | 'Out' | 'IR' | 'PUP'
  severityRating: 1 | 2 | 3 | 4 | 5 // 1 = minimal impact, 5 = season-ending
  dateReported: string
  estimatedReturn?: string
  gameStatus: 'Active' | 'Inactive' | 'Limited' | 'TBD'
  impactDescription: string
  lastUpdated: string
}

export interface InjuryImpactAnalysis {
  teamId: string
  totalImpactScore: number
  offensiveImpact: number
  defensiveImpact: number
  specialTeamsImpact: number
  keyPlayerInjuries: PlayerInjury[]
  depthChartAffected: string[]
  predictedPerformanceDrop: number
  riskFactors: string[]
  mitigatingFactors: string[]
}

export interface PositionImpact {
  position: string
  importance: number
  currentInjuries: PlayerInjury[]
  depthQuality: 'Excellent' | 'Good' | 'Average' | 'Poor' | 'Critical'
  overallImpact: number
}