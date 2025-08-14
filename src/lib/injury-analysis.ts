import { PlayerInjury, InjuryImpactAnalysis, PositionImpact, NFLTeam } from '@/types/nfl'
import { realSportsAPI } from './real-sports-api'

// Position importance weights for impact calculation
const POSITION_WEIGHTS = {
  'QB': 1.0,      // Quarterback - highest impact
  'RB': 0.6,      // Running Back
  'WR': 0.7,      // Wide Receiver
  'TE': 0.5,      // Tight End
  'OL': 0.8,      // Offensive Line
  'DL': 0.7,      // Defensive Line
  'LB': 0.6,      // Linebacker
  'CB': 0.8,      // Cornerback
  'S': 0.6,       // Safety
  'K': 0.3,       // Kicker
  'P': 0.2,       // Punter
  'LS': 0.1,      // Long Snapper
}

// Get team injuries from real API
export async function getTeamInjuries(teamAbbreviation: string): Promise<PlayerInjury[]> {
  try {
    const injuries = await realSportsAPI.fetchInjuryReport(teamAbbreviation.toLowerCase())
    
    // Transform API response to our PlayerInjury format
    return injuries.map((injury: any, index: number) => ({
      id: `${teamAbbreviation}-${index}`,
      playerId: `player-${index}`,
      playerName: injury.player,
      position: injury.position,
      team: teamAbbreviation,
      injuryType: injury.injury,
      bodyPart: injury.injury,
      severity: injury.status,
      severityRating: injury.severityRating || getSeverityRating(injury.status),
      dateReported: injury.lastUpdate || new Date().toISOString().split('T')[0],
      gameStatus: mapStatusToGameStatus(injury.status),
      impactDescription: `${injury.position} injury - ${injury.status.toLowerCase()}`,
      lastUpdated: injury.lastUpdate || new Date().toISOString()
    }))
  } catch (error) {
    console.error('Error fetching team injuries:', error)
    return []
  }
}

// Helper function to convert status to severity rating
function getSeverityRating(status: string): number {
  switch (status.toLowerCase()) {
    case 'out': return 5
    case 'doubtful': return 4
    case 'questionable': return 2
    case 'probable': return 1
    default: return 1
  }
}

// Helper function to map status to game status
function mapStatusToGameStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'out': return 'Inactive'
    case 'doubtful': return 'Limited'
    case 'questionable': return 'Limited'
    case 'probable': return 'Active'
    default: return 'Active'
  }
}

export async function getAllActiveInjuries(): Promise<PlayerInjury[]> {
  // In a real implementation, this would fetch from all teams
  // For now, return empty array as it's not used in current features
  return []
}

export function calculatePositionImpact(injuries: PlayerInjury[], position: string): PositionImpact {
  const positionInjuries = injuries.filter(inj => inj.position === position)
  const totalSeverity = positionInjuries.reduce((sum, inj) => sum + inj.severityRating, 0)
  const avgSeverity = positionInjuries.length > 0 ? totalSeverity / positionInjuries.length : 0
  
  // Determine depth quality based on number and severity of injuries
  let depthQuality: PositionImpact['depthQuality'] = 'Excellent'
  if (positionInjuries.length >= 3 || avgSeverity >= 4) {
    depthQuality = 'Critical'
  } else if (positionInjuries.length >= 2 || avgSeverity >= 3) {
    depthQuality = 'Poor'
  } else if (positionInjuries.length >= 1 || avgSeverity >= 2) {
    depthQuality = 'Average'
  } else if (avgSeverity >= 1) {
    depthQuality = 'Good'
  }

  const positionWeight = POSITION_WEIGHTS[position as keyof typeof POSITION_WEIGHTS] || 0.5
  const overallImpact = avgSeverity * positionWeight * positionInjuries.length

  return {
    position,
    importance: positionWeight,
    currentInjuries: positionInjuries,
    depthQuality,
    overallImpact
  }
}

export async function analyzeTeamInjuryImpact(team: NFLTeam): Promise<InjuryImpactAnalysis> {
  const teamInjuries = await getTeamInjuries(team.abbreviation)
  
  // Calculate offensive impact (QB, RB, WR, TE, OL)
  const offensivePositions = ['QB', 'RB', 'WR', 'TE', 'OL']
  const offensiveInjuries = teamInjuries.filter(inj => offensivePositions.includes(inj.position))
  const offensiveImpact = offensiveInjuries.reduce((sum, inj) => {
    const weight = POSITION_WEIGHTS[inj.position as keyof typeof POSITION_WEIGHTS] || 0.5
    return sum + (inj.severityRating * weight)
  }, 0)

  // Calculate defensive impact (DL, LB, CB, S)
  const defensivePositions = ['DL', 'LB', 'CB', 'S']
  const defensiveInjuries = teamInjuries.filter(inj => defensivePositions.includes(inj.position))
  const defensiveImpact = defensiveInjuries.reduce((sum, inj) => {
    const weight = POSITION_WEIGHTS[inj.position as keyof typeof POSITION_WEIGHTS] || 0.5
    return sum + (inj.severityRating * weight)
  }, 0)

  // Calculate special teams impact (K, P, LS)
  const specialTeamsPositions = ['K', 'P', 'LS']
  const specialTeamsInjuries = teamInjuries.filter(inj => specialTeamsPositions.includes(inj.position))
  const specialTeamsImpact = specialTeamsInjuries.reduce((sum, inj) => {
    const weight = POSITION_WEIGHTS[inj.position as keyof typeof POSITION_WEIGHTS] || 0.5
    return sum + (inj.severityRating * weight)
  }, 0)

  // Total impact score
  const totalImpactScore = offensiveImpact + defensiveImpact + specialTeamsImpact

  // Key player injuries (severity 3+)
  const keyPlayerInjuries = teamInjuries.filter(inj => inj.severityRating >= 3)

  // Depth chart affected
  const affectedPositions = [...new Set(teamInjuries.map(inj => inj.position))]
  
  // Predicted performance drop (0-100%)
  const predictedPerformanceDrop = Math.min(totalImpactScore * 10, 100)

  // Risk factors
  const riskFactors: string[] = []
  if (offensiveInjuries.some(inj => inj.position === 'QB' && inj.severityRating >= 3)) {
    riskFactors.push('Starting quarterback health concerns')
  }
  if (offensiveInjuries.filter(inj => inj.position === 'OL').length >= 2) {
    riskFactors.push('Multiple offensive line injuries')
  }
  if (defensiveInjuries.filter(inj => inj.position === 'CB').length >= 2) {
    riskFactors.push('Secondary depth issues')
  }
  if (totalImpactScore >= 10) {
    riskFactors.push('High overall injury burden')
  }

  // Mitigating factors
  const mitigatingFactors: string[] = []
  if (teamInjuries.filter(inj => inj.severityRating <= 2).length >= teamInjuries.length * 0.7) {
    mitigatingFactors.push('Most injuries are minor')
  }
  if (!teamInjuries.some(inj => inj.position === 'QB')) {
    mitigatingFactors.push('Starting quarterback healthy')
  }
  if (keyPlayerInjuries.length === 0) {
    mitigatingFactors.push('No critical player injuries')
  }

  return {
    teamId: team.id,
    totalImpactScore,
    offensiveImpact,
    defensiveImpact,
    specialTeamsImpact,
    keyPlayerInjuries,
    depthChartAffected: affectedPositions,
    predictedPerformanceDrop,
    riskFactors,
    mitigatingFactors
  }
}

export function getInjurySeverityColor(severity: PlayerInjury['severity']): string {
  switch (severity) {
    case 'Questionable':
      return 'text-yellow-600'
    case 'Doubtful':
      return 'text-orange-600'
    case 'Out':
      return 'text-red-600'
    case 'IR':
      return 'text-red-800'
    case 'PUP':
      return 'text-red-800'
    default:
      return 'text-gray-600'
  }
}

export function getInjurySeverityBadgeColor(severity: PlayerInjury['severity']): string {
  switch (severity) {
    case 'Questionable':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'Doubtful':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'Out':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'IR':
      return 'bg-red-200 text-red-900 border-red-400'
    case 'PUP':
      return 'bg-red-200 text-red-900 border-red-400'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

export function getImpactScoreColor(score: number): string {
  if (score >= 15) return 'text-red-600'
  if (score >= 10) return 'text-orange-600'
  if (score >= 5) return 'text-yellow-600'
  return 'text-green-600'
}

export function getImpactScoreDescription(score: number): string {
  if (score >= 15) return 'Severe Impact'
  if (score >= 10) return 'High Impact'
  if (score >= 5) return 'Moderate Impact'
  if (score >= 2) return 'Low Impact'
  return 'Minimal Impact'
}