import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Database, Info, Calculator, Calendar } from '@phosphor-icons/react'

export function DataSources() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a demonstration app using simulated data. Predictions are based on algorithmic calculations, not real NFL statistics.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="text-primary" />
            Data Sources & Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="text-accent" size={20} />
                <h3 className="font-semibold">Simulated Team Statistics</h3>
                <Badge variant="outline" className="text-xs">Demo Data</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Team performance metrics are generated using mathematical algorithms that create realistic-looking statistics including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Points per game (16-32 range)</li>
                <li>• Points allowed per game</li>
                <li>• Total yards per game (280-420 range)</li>
                <li>• Yards allowed per game</li>
                <li>• Turnover differential (-15 to +15)</li>
                <li>• Strength of schedule (0.4-0.6)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-accent" size={20} />
                <h3 className="font-semibold">Official 2025-26 NFL Schedule</h3>
                <Badge variant="secondary" className="text-xs">Real Data</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Game schedules, dates, and times are based on the official NFL 2025-26 season schedule including all 18 weeks of regular season games.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Database className="text-accent" size={20} />
                <h3 className="font-semibold">Team Information</h3>
                <Badge variant="secondary" className="text-xs">Static Data</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Team names, cities, conferences, and divisions are current and accurate as of the 2024 NFL season.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Prediction Algorithm</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Predictions are calculated using weighted factors:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                <div>• Offensive efficiency (30% weight)</div>
                <div>• Defensive efficiency (25% weight)</div>
                <div>• Recent form (1.5x multiplier)</div>
                <div>• Turnover differential (0.4x weight)</div>
                <div>• Home field advantage (+3 points)</div>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Important Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This application is for demonstration and entertainment purposes only. All team statistics are algorithmically generated and do not reflect actual NFL team performance. Real sports betting and predictions should rely on current, verified data from official sources.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}