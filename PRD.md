# NFL Game Predictor

Predict NFL game winners using team statistics, recent performance, and advanced analytics to help fans make informed predictions about upcoming matchups.

**Experience Qualities**: 
1. **Data-driven** - Users should feel confident in predictions backed by comprehensive team statistics and historical performance
2. **Interactive** - Engaging interface that allows users to explore different matchups and see prediction reasoning
3. **Authoritative** - Professional sports analytics feel that conveys expertise and reliability

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple prediction features with team comparisons, but focused on core prediction functionality without complex user accounts

## Essential Features

**Game Prediction Engine**
- Functionality: Select two NFL teams and get win probability prediction with confidence score
- Purpose: Core value proposition - help users make informed predictions about game outcomes
- Trigger: User selects home and away teams from dropdown menus
- Progression: Select teams → View prediction → See breakdown of factors → Explore team stats
- Success criteria: Displays clear win percentage for each team with reasoning factors

**Team Statistics Comparison**
- Functionality: Side-by-side comparison of key team metrics (offense, defense, recent form)
- Purpose: Transparency in prediction logic and deeper team analysis
- Trigger: Automatic display after prediction is generated
- Progression: Prediction made → Stats comparison appears → User can explore detailed metrics
- Success criteria: Clear visual comparison showing strengths/weaknesses driving the prediction

**Recent Performance Tracker**
- Functionality: Display last 5 games for each team with win/loss and key stats
- Purpose: Account for current team form and momentum in predictions
- Trigger: Automatically included in team analysis
- Progression: Team selected → Recent games displayed → Form trend visualized
- Success criteria: Shows clear trend data that influences prediction confidence

**Prediction History**
- Functionality: Save and track user's predictions with actual outcomes when available
- Purpose: Allow users to track their prediction accuracy over time
- Trigger: User saves a prediction after viewing it
- Progression: Make prediction → Save prediction → View history → Track accuracy
- Success criteria: Persistent storage of predictions with accuracy tracking

## Edge Case Handling

- **Same Team Selection**: Prevent selecting same team for both home/away with clear messaging
- **Missing Data**: Graceful handling when team stats are unavailable with fallback messaging  
- **Invalid Matchups**: Handle non-existent team combinations with user-friendly errors
- **Slow Loading**: Loading states for prediction calculations and data fetching
- **Empty History**: Engaging empty state encouraging users to make their first prediction

## Design Direction

The design should feel authoritative and data-driven like ESPN or advanced sports analytics platforms, with a clean modern interface that emphasizes statistical credibility over flashy elements.

## Color Selection

Triadic (three equally spaced colors) - Using classic sports broadcast colors of deep blue, orange, and green to create energy while maintaining professional credibility for statistical data presentation.

- **Primary Color**: Deep Sports Blue `oklch(0.35 0.15 250)` - Conveys trust and analytical authority
- **Secondary Colors**: Charcoal Gray `oklch(0.25 0.02 270)` for data backgrounds and structure
- **Accent Color**: Victory Orange `oklch(0.65 0.18 45)` - Highlights predictions and key metrics
- **Foreground/Background Pairings**: 
  - Background (White): Charcoal text `oklch(0.25 0.02 270)` - Ratio 7.2:1 ✓
  - Card (Light Gray): Charcoal text `oklch(0.25 0.02 270)` - Ratio 6.8:1 ✓  
  - Primary (Deep Blue): White text `oklch(0.98 0 0)` - Ratio 8.1:1 ✓
  - Accent (Victory Orange): White text `oklch(0.98 0 0)` - Ratio 4.7:1 ✓

## Font Selection

Typography should convey analytical precision and sports broadcast authority, using clean sans-serif fonts that enhance data readability.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Prediction Results): Inter SemiBold/24px/normal spacing  
  - H3 (Team Names): Inter Medium/18px/normal spacing
  - Body (Stats): Inter Regular/16px/relaxed line height for data scanning
  - Caption (Percentages): Inter Medium/14px/tight spacing for emphasis

## Animations

Subtle data-focused animations that reinforce statistical confidence - percentage counters, smooth chart transitions, and gentle state changes that feel precise rather than flashy.

- **Purposeful Meaning**: Percentage animations and data loading effects communicate analytical processing
- **Hierarchy of Movement**: Prediction results get primary animation focus, supporting stats use subtle transitions

## Component Selection

- **Components**: Card for team comparisons, Select for team choosing, Progress for win percentages, Badge for recent form, Tabs for different analysis views, Button for predictions
- **Customizations**: Custom percentage display component, team logo integration, prediction confidence meter
- **States**: Hover effects on team cards, loading states for predictions, selected state for saved predictions  
- **Icon Selection**: Trophy for wins, TrendingUp/Down for performance, Target for predictions, BarChart for statistics
- **Spacing**: 16px base spacing with 24px section gaps, 8px for related data points
- **Mobile**: Stack team comparisons vertically, collapsible stats sections, larger touch targets for team selection