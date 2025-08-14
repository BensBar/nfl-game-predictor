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
  homeScore?: number
  awayScore?: number
}