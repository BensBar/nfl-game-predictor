import { PlayerInjury, InjuryImpactAnalysis, PositionImpact, NFLTeam } from '@/types/nfl'

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

// Simulated injury data for demonstration
const MOCK_INJURIES: PlayerInjury[] = [
  {
    id: 'inj1',
    playerId: 'p1',
    playerName: 'Josh Allen',
    position: 'QB',
    team: 'BUF',
    injuryType: 'Shoulder Strain',
    bodyPart: 'Shoulder',
    severity: 'Questionable',
    severityRating: 2,
    dateReported: '2024-01-15',
    estimatedReturn: '2024-01-22',
    gameStatus: 'Limited',
    impactDescription: 'Minor shoulder strain affecting throwing velocity slightly',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'inj2',
    playerId: 'p2',
    playerName: 'Christian McCaffrey',
    position: 'RB',
    team: 'SF',
    injuryType: 'Calf Strain',
    bodyPart: 'Calf',
    severity: 'Doubtful',
    severityRating: 3,
    dateReported: '2024-01-14',
    estimatedReturn: '2024-01-28',
    gameStatus: 'Inactive',
    impactDescription: 'Significant calf strain limiting mobility and cutting ability',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'inj3',
    playerId: 'p3',
    playerName: 'Aaron Donald',
    position: 'DL',
    team: 'LAR',
    injuryType: 'Ankle Sprain',
    bodyPart: 'Ankle',
    severity: 'Questionable',
    severityRating: 2,
    dateReported: '2024-01-13',
    gameStatus: 'TBD',
    impactDescription: 'Mild ankle sprain, expected to play with limited snap count',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'inj4',
    playerId: 'p4',
    playerName: 'Davante Adams',
    position: 'WR',
    team: 'LV',
    injuryType: 'Hamstring Pull',
    bodyPart: 'Hamstring',
    severity: 'Out',
    severityRating: 4,
    dateReported: '2024-01-12',
    estimatedReturn: '2024-02-05',
    gameStatus: 'Inactive',
    impactDescription: 'Grade 2 hamstring pull, significant offensive impact expected',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'inj5',
    playerId: 'p5',
    playerName: 'T.J. Watt',
    position: 'LB',
    team: 'PIT',
    injuryType: 'Knee Contusion',
    bodyPart: 'Knee',
    severity: 'Questionable',
    severityRating: 1,
    dateReported: '2024-01-15',
    gameStatus: 'Limited',
    impactDescription: 'Minor knee bruising, expected to play with full effectiveness',
    lastUpdated: '2024-01-16'
  }
]

export function getTeamInjuries(teamAbbreviation: string): PlayerInjury[] {
  return MOCK_INJURIES.filter(injury => injury.team === teamAbbreviation)
}

export function getAllActiveInjuries(): PlayerInjury[] {
  return MOCK_INJURIES.filter(injury => 
    injury.severity !== 'IR' && 
    injury.gameStatus !== 'Active'
  )
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

export function analyzeTeamInjuryImpact(team: NFLTeam): InjuryImpactAnalysis {
  const teamInjuries = getTeamInjuries(team.abbreviation)
  
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