import { BettingComparison, BettingOdds, OddsMovement } from '@/types/nfl'

// Simulated sportsbooks for demo - replace with real API integration
const SPORTSBOOKS = [
  'DraftKings', 'FanDuel', 'BetMGM', 'Caesars', 'PointsBet',
  'WynnBET', 'Barstool', 'FOX Bet', 'TwinSpires', 'BetRivers'
]

/**
 * Fetches betting odds comparison data from multiple sportsbooks
 * In production, this would integrate with real odds APIs like:
 * - The Odds API (https://the-odds-api.com/)
 * - SportsBetting API 
 * - DraftKings API
 * - FanDuel API
 */
export async function getBettingOddsComparison(
  gameId: string,
  homeTeam: string,
  awayTeam: string
): Promise<BettingComparison> {
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

  // Generate realistic odds for demonstration
  const baseSpread = (Math.random() - 0.5) * 14 // -7 to +7 point spread
  const baseTotal = 40 + Math.random() * 20 // 40-60 total points
  
  // Generate odds from multiple sportsbooks
  const sportsbooks: BettingOdds[] = SPORTSBOOKS.map(book => {
    const spreadVariation = (Math.random() - 0.5) * 1 // ±0.5 variation
    const totalVariation = (Math.random() - 0.5) * 2 // ±1 variation
    const oddsVariation = Math.floor((Math.random() - 0.5) * 20) // ±10 odds variation
    
    const homeSpread = parseFloat((baseSpread + spreadVariation).toFixed(1))
    const awaySpread = -homeSpread
    const total = parseFloat((baseTotal + totalVariation).toFixed(1))
    
    // Calculate moneyline based on spread
    const homeMoneyline = homeSpread > 0 
      ? Math.floor(100 + (homeSpread * 20)) + oddsVariation
      : Math.floor(-120 - (Math.abs(homeSpread) * 15)) + oddsVariation
    
    const awayMoneyline = homeSpread < 0
      ? Math.floor(100 + (Math.abs(homeSpread) * 20)) + oddsVariation  
      : Math.floor(-120 - (homeSpread * 15)) + oddsVariation

    return {
      sportsbook: book,
      homeSpread: homeSpread,
      awaySpread: awaySpread,
      homeSpreadOdds: -110 + Math.floor((Math.random() - 0.5) * 20),
      awaySpreadOdds: -110 + Math.floor((Math.random() - 0.5) * 20),
      homeMoneyline: homeMoneyline,
      awayMoneyline: awayMoneyline,
      overUnder: total,
      overOdds: -110 + Math.floor((Math.random() - 0.5) * 20),
      underOdds: -110 + Math.floor((Math.random() - 0.5) * 20),
      lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }
  })

  // Find best odds for each bet type
  const bestHomeSpread = sportsbooks.reduce((best, current) => 
    current.homeSpread > best.homeSpread ? current : best
  )
  
  const bestAwaySpread = sportsbooks.reduce((best, current) => 
    current.awaySpread > best.awaySpread ? current : best
  )
  
  const bestHomeMoneyline = sportsbooks.reduce((best, current) => 
    current.homeMoneyline > best.homeMoneyline ? current : best
  )
  
  const bestAwayMoneyline = sportsbooks.reduce((best, current) => 
    current.awayMoneyline > best.awayMoneyline ? current : best
  )
  
  const bestOver = sportsbooks.reduce((best, current) => 
    current.overOdds > best.overOdds ? current : best
  )
  
  const bestUnder = sportsbooks.reduce((best, current) => 
    current.underOdds > best.underOdds ? current : best
  )

  // Calculate averages
  const averageSpread = parseFloat((sportsbooks.reduce((sum, book) => sum + book.homeSpread, 0) / sportsbooks.length).toFixed(1))
  const averageTotal = parseFloat((sportsbooks.reduce((sum, book) => sum + book.overUnder, 0) / sportsbooks.length).toFixed(1))

  // Generate odds movement history
  const oddsMovement: OddsMovement[] = Array.from({ length: 8 }, (_, i) => {
    const timestamp = new Date(Date.now() - (i + 1) * 3600000 * 2).toISOString() // Every 2 hours
    const historicalSpread = baseSpread + (Math.random() - 0.5) * 2
    
    return {
      sportsbook: SPORTSBOOKS[Math.floor(Math.random() * SPORTSBOOKS.length)],
      timestamp,
      homeSpread: parseFloat(historicalSpread.toFixed(1)),
      awaySpread: parseFloat((-historicalSpread).toFixed(1)),
      homeMoneyline: historicalSpread > 0 ? Math.floor(100 + (historicalSpread * 20)) : Math.floor(-120 - (Math.abs(historicalSpread) * 15)),
      awayMoneyline: historicalSpread < 0 ? Math.floor(100 + (Math.abs(historicalSpread) * 20)) : Math.floor(-120 - (historicalSpread * 15)),
      overUnder: parseFloat((baseTotal + (Math.random() - 0.5) * 3).toFixed(1))
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Generate consensus data (public betting percentages)
  const homeSpreadPercent = Math.floor(30 + Math.random() * 40) // 30-70%
  const awaySpreadPercent = 100 - homeSpreadPercent
  const overPercent = Math.floor(35 + Math.random() * 30) // 35-65%
  const underPercent = 100 - overPercent

  return {
    gameId,
    homeTeam,
    awayTeam,
    bestHomeSpread,
    bestAwaySpread,
    bestHomeMoneyline,
    bestAwayMoneyline,
    bestOver,
    bestUnder,
    averageSpread,
    averageTotal,
    oddsMovement,
    consensus: {
      homeSpreadPercent,
      awaySpreadPercent,
      overPercent,
      underPercent
    }
  }
}

/**
 * Analyzes betting market sentiment and line movement
 */
export function analyzeBettingMarket(comparison: BettingComparison) {
  const analysis = {
    marketSentiment: '',
    valueOpportunities: [] as string[],
    lineMovement: '',
    publicConsensus: '',
    recommendations: [] as string[]
  }

  // Analyze line movement
  if (comparison.oddsMovement.length >= 2) {
    const latestSpread = comparison.oddsMovement[0].homeSpread
    const earliestSpread = comparison.oddsMovement[comparison.oddsMovement.length - 1].homeSpread
    const movement = latestSpread - earliestSpread
    
    if (Math.abs(movement) > 1) {
      analysis.lineMovement = movement > 0 
        ? `Line has moved ${movement.toFixed(1)} points toward ${comparison.homeTeam}`
        : `Line has moved ${Math.abs(movement).toFixed(1)} points toward ${comparison.awayTeam}`
    } else {
      analysis.lineMovement = 'Line has remained relatively stable'
    }
  }

  // Analyze public consensus
  if (comparison.consensus.homeSpreadPercent > 70) {
    analysis.publicConsensus = `Heavy public backing (${comparison.consensus.homeSpreadPercent}%) on ${comparison.homeTeam}`
    analysis.recommendations.push(`Consider contrarian play on ${comparison.awayTeam}`)
  } else if (comparison.consensus.awaySpreadPercent > 70) {
    analysis.publicConsensus = `Heavy public backing (${comparison.consensus.awaySpreadPercent}%) on ${comparison.awayTeam}`
    analysis.recommendations.push(`Consider contrarian play on ${comparison.homeTeam}`)
  } else {
    analysis.publicConsensus = 'Relatively balanced public betting'
  }

  // Identify value opportunities
  const spreadRange = Math.max(...comparison.oddsMovement.map(m => m.homeSpread)) - 
                     Math.min(...comparison.oddsMovement.map(m => m.homeSpread))
  
  if (spreadRange > 1.5) {
    analysis.valueOpportunities.push('Significant spread variation across books - shop for best line')
  }

  // Over/Under analysis
  if (comparison.consensus.overPercent > 65) {
    analysis.recommendations.push('Consider Under bet - heavy public Over action')
  } else if (comparison.consensus.underPercent > 65) {
    analysis.recommendations.push('Consider Over bet - heavy public Under action')
  }

  return analysis
}

/**
 * Gets betting odds factors for prediction analysis
 */
export function getBettingFactors(comparison: BettingComparison): string[] {
  const factors: string[] = []
  
  // Spread analysis
  if (Math.abs(comparison.averageSpread) > 7) {
    const favorite = comparison.averageSpread > 0 ? comparison.homeTeam : comparison.awayTeam
    factors.push(`${favorite} heavily favored by ${Math.abs(comparison.averageSpread)} points`)
  } else if (Math.abs(comparison.averageSpread) < 3) {
    factors.push('Pick\'em game - very close spread indicates even matchup')
  }

  // Line movement
  if (comparison.oddsMovement.length >= 2) {
    const movement = comparison.oddsMovement[0].homeSpread - comparison.oddsMovement[comparison.oddsMovement.length - 1].homeSpread
    if (Math.abs(movement) > 1) {
      factors.push(`Sharp money moving line ${Math.abs(movement).toFixed(1)} points`)
    }
  }

  // Total analysis
  if (comparison.averageTotal > 50) {
    factors.push('High-scoring game expected based on betting total')
  } else if (comparison.averageTotal < 40) {
    factors.push('Low-scoring defensive battle expected')
  }

  // Public consensus
  const maxConsensus = Math.max(
    comparison.consensus.homeSpreadPercent, 
    comparison.consensus.awaySpreadPercent
  )
  if (maxConsensus > 75) {
    factors.push('Heavy public consensus - consider contrarian value')
  }

  return factors
}