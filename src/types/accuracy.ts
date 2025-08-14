export interface WeeklyAccuracy {
  week: number
  season: number
  isPreseason: boolean
  totalPredictions: number
  correctPredictions: number
  accuracy: number
  averageConfidence: number
  highConfidencePredictions: number
  highConfidenceCorrect: number
  lowConfidencePredictions: number
  lowConfidenceCorrect: number
  timestamp: number
}

export interface PredictionOutcome {
  predictionId: string
  gameId: string
  homeTeam: string
  awayTeam: string
  predictedWinner: string
  actualWinner: string | null
  predictedProbability: number
  confidence: number
  isCorrect: boolean | null
  week: number
  season: number
  isPreseason: boolean
  gameDate: number
  resultUpdated: number | null
}

export interface AccuracyStats {
  overall: {
    totalPredictions: number
    correctPredictions: number
    accuracy: number
    averageConfidence: number
  }
  byWeek: WeeklyAccuracy[]
  byConfidenceLevel: {
    high: { total: number; correct: number; accuracy: number }
    medium: { total: number; correct: number; accuracy: number }
    low: { total: number; correct: number; accuracy: number }
  }
  streaks: {
    currentStreak: number
    longestStreak: number
    isWinningStreak: boolean
  }
  recentTrend: {
    last5Games: number
    last10Games: number
    lastWeek: number
  }
}

export interface LeaderboardEntry {
  rank: number
  modelName: string
  accuracy: number
  totalPredictions: number
  correctPredictions: number
  averageConfidence: number
  lastPrediction: number
  streak: number
  badge?: string
}

export interface SeasonLeaderboard {
  season: number
  isPreseason: boolean
  updated: number
  entries: LeaderboardEntry[]
}