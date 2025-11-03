# Venture Assessment Platform - Project Documentation

## Executive Summary

**The Challenge:** NobleReach Foundation needed to scale venture selection from 5 to 85+ ventures per week. Manual due diligence required 40 hours per venture—an unsustainable bottleneck that prevented program growth and limited access to high-potential opportunities.

**The Solution:** The Venture Assessment Platform uses AI-powered APIs to automate comprehensive due diligence research, reducing analysis time from 1 week to 20 minutes—a **100x improvement**—while maintaining or improving quality and consistency.

**How It Works:**
1. Enter a company website URL
2. AI runs sequential analyses (Company → Competitive → Market)
3. Platform generates scores and detailed reports for each dimension
4. SCAs review evidence and provide their own scores with justifications
5. Export comprehensive PDF reports combining AI and human assessment

**Current Impact:**
- 98% time reduction (40 hours → 20 minutes)
- 17x capacity increase (5 → 85+ ventures/week)
- ~78% cost reduction in due diligence
- Consistent 6-dimension analysis for every venture

**Status:** Active development. Currently supports Company, Competitive Risk, and Market Opportunity assessments. Expanding to 8+ dimensions including Team, Funding, IP, and more.

---

## Project Overview

**Project Name:** Venture Assessment Platform  
**Organization:** NobleReach Foundation  
**Status:** Active Development  
**Purpose:** Enable Senior Commercialization Advisors (SCAs) and program managers to assess early-stage ventures through automated analysis of company websites and competitive landscapes.

## Background: Problems We're Solving

### The Core Challenge
Before this platform existed, NobleReach faced a significant bottleneck in their venture selection process:

**Manual Due Diligence Was Unsustainable:**
- **Time Required:** 1 week (40 hours) per venture for comprehensive due diligence research
- **Scalability Issue:** At 5 ventures per week maximum, the program couldn't grow
- **Consistency Problem:** Manual research led to variable quality and coverage
- **Cost Impact:** High opportunity cost preventing evaluation of promising ventures

### The Transformation
The Venture Assessment Platform was built to achieve **100x faster due diligence**:

**Before (Manual Process):**
- 40 hours → 1 comprehensive due diligence report
- 5 ventures per week maximum
- Inconsistent coverage across ventures
- Heavy manual research burden on SCAs

**After (AI-Powered Platform):**
- 20 minutes → 1 comprehensive assessment report
- 85+ ventures per week possible
- Consistent analysis across all ventures
- SCAs focus on judgment and decision-making

### Key Objectives

1. **Scale Venture Selection**
   - Enable evaluation of significantly more ventures
   - Reduce time from 1 week to under 30 minutes per venture
   - Maintain or improve analysis quality

2. **Improve Decision Quality**
   - Provide consistent, comprehensive analysis across all dimensions
   - Reduce human bias through objective AI-driven research
   - Enable data-driven comparison across multiple ventures

3. **Optimize SCA Time**
   - Shift SCA role from research to evaluation and judgment
   - Focus expert time on scoring and strategic decisions
   - Eliminate repetitive research tasks

4. **Support Portfolio Growth**
   - Increase deal flow capacity without proportional staff increases
   - Enable faster response to time-sensitive opportunities
   - Build competitive advantage in identifying high-potential ventures

### Success Metrics

- **Time Reduction:** 98% reduction in due diligence time (40 hours → 20 minutes)
- **Capacity Increase:** 17x more ventures evaluated per week (5 → 85+)
- **Cost Efficiency:** ~78% reduction in due diligence costs
- **Quality:** Comprehensive 6-dimension analysis vs. variable manual coverage

## What This Tool Does

The Venture Assessment Platform is a web-based application that:
1. Accepts a company website URL as input
2. Runs three sequential AI-powered analyses via Stack-AI APIs:
   - **Company Analysis** (~8 minutes) - Extracts comprehensive company information
   - **Competitive Analysis** (~4 minutes) - Evaluates competitive landscape and risk
   - **Market Analysis** (~8 minutes) - Assesses market opportunity and growth potential
3. Presents AI-generated scores (1-9 scale) with detailed justifications
4. Allows SCAs to review evidence and provide their own scores with justifications
5. Exports comprehensive PDF reports with both AI and human assessments

## How This Differs from NobleReach Readiness Tool

**Venture Assessment Platform (this tool):**
- Focuses on market analysis and competitive positioning
- Automated online research and AI analysis
- Used for initial screening and market validation
- Does not require direct team interaction

**NobleReach Readiness Assessment Tool (separate tool):**
- Focuses on venture maturity and team capability
- Based on interviews and direct assessment
- Evaluates 8-9 readiness dimensions (IP, Technology, Market, Product, Team, Go-to-Market, Business, Funding, Regulatory)
- Used for deeper engagement with ventures already in the program

## Technical Architecture

### Design Philosophy & Visual Identity

**Color Scheme:**
The platform uses a purple gradient theme that aligns with NobleReach Foundation branding:

**Primary Colors:**
- **Primary Purple:** `#667eea` - Used for primary actions, headers, and key elements
- **Primary Dark:** `#764ba2` - Used for gradients and hover states
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - Signature gradient applied to headers and CTAs

**Status Colors:**
- **Success Green:** `#48bb78` - High scores, completed states, positive indicators
- **Warning Orange:** `#ed8936` - Moderate scores, caution states
- **Danger Red:** `#f56565` - Low scores, risk indicators, errors
- **Info Blue:** `#4299e1` - Informational elements

**Neutral Palette:**
- Gray scale from `#f9fafb` (lightest) to `#111827` (darkest)
- Used for backgrounds, text, borders, and subtle UI elements

**Design Rationale:**
- **Professional yet Approachable:** Purple conveys innovation and trust without being too corporate
- **High Contrast:** Strong gradients and color differentiation ensure readability
- **Score Visualization:** Color-coded scoring (red = risk, green = opportunity) provides instant visual feedback
- **Accessibility:** Sufficient contrast ratios meet WCAG 2.0 standards
- **Brand Consistency:** Aligns with NobleReach Foundation's visual identity

**Key Design Principles:**
1. **Progressive Disclosure:** Information revealed as needed to avoid overwhelming users
2. **Clear Visual Hierarchy:** Important information stands out through size, color, and position
3. **Consistent Patterns:** Reusable components and patterns across all assessment types
4. **Responsive Design:** Works seamlessly on desktop, tablet, and mobile
5. **Performance:** Smooth transitions and animations enhance rather than distract

### Frontend Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Component-based architecture
- LocalStorage for state persistence
- jsPDF for report generation

### API Integration
All APIs use Stack-AI platform with Bearer token authentication:
- **Authorization:** `Bearer e80f3814-a651-4de7-a7ba-8478b7a9047b`
- **Content-Type:** `application/json`

#### Current APIs

**1. Company Analysis API**
- URL: `https://api.stack-ai.com/inference/v0/run/f913a8b8-144d-47e0-b327-8daa341b575d/68bf33a8aedc162026050675`
- Input: `in-0` (company website URL)
- Output: `out-6` (company data JSON)
- Timeout: 600 seconds (10 minutes)
- Returns: Structured JSON with company_overview, technology, products_and_applications, market_context, funding_and_investors, team

**2. Competitive Analysis API**
- URL: `https://api.stack-ai.com/inference/v0/run/f913a8b8-144d-47e0-b327-8daa341b575d/68b9fba290798977e2d5ffe6`
- Input: `in-0` (technology description extracted from company data)
- Outputs: 
  - `out-6` (competitive analysis JSON)
  - `out-7` (graded assessment with score 1-9)
- Timeout: 480 seconds (8 minutes)
- Returns: Competitor list, market analysis, and AI score with justification

**3. Market Opportunity API**
- URL: `https://api.stack-ai.com/inference/v0/run/f913a8b8-144d-47e0-b327-8daa341b575d/68a8bc5d5f2ffcec5ada4422`
- Input: 
  - `in-1` (technology description)
  - `in-2` (competitive analysis output from previous API)
- Outputs:
  - `out-2` (market analysis JSON)
  - `out-3` (market scoring with score 1-9)
- Timeout: 700 seconds (10+ minutes)
- Returns: Market data, TAM/CAGR analysis, and AI score with justification

### Sequential Pipeline Flow

```
User Input (Website URL)
    ↓
Company Analysis API (8 min)
    ↓ (extracts tech description)
Competitive Analysis API (4 min)
    ↓ (passes competitive data)
Market Analysis API (8 min)
    ↓
Results Display + User Scoring
    ↓
PDF Export
```

## File Structure

```
project/
├── index.html                    # Main HTML structure
├── styles.css                    # Global styles and layout
│
├── js/
│   ├── core/
│   │   ├── app.js               # Main application controller
│   │   └── pipeline.js          # Sequential analysis pipeline manager
│   │
│   ├── api/
│   │   ├── company.js           # Company analysis API wrapper
│   │   ├── competitive.js       # Competitive analysis API wrapper
│   │   └── market.js            # Market opportunity API wrapper
│   │
│   ├── components/
│   │   ├── assessment-view.js   # Assessment panel orchestration
│   │   ├── progress-view.js     # Progress tracking UI
│   │   └── summary-view.js      # Summary display component
│   │
│   ├── utils/
│   │   ├── export.js            # PDF export functionality
│   │   ├── formatters.js        # Data formatting utilities
│   │   └── validators.js        # Input/output validation
│
└── README.md                     # This file
```

## Scoring Rubrics

### Competitive Landscape Risk (1-9 scale)
**Higher score = Lower risk (less competition)**

- **1:** Dominant established players AND little tech OR business differentiation
- **2:** Established players AND little tech OR business differentiation
- **3:** Established players AND some tech OR business differentiation
- **4:** Established players AND significant tech differentiation
- **5:** Established players AND significant tech AND business differentiation
- **6:** Existing players AND significant tech OR business differentiation
- **7:** Existing players AND significant tech AND business differentiation
- **8:** Few existing players AND significant tech AND business differentiation
- **9:** No existing players in the market

### Market Opportunity (1-9 scale)
**Based on TAM (Total Addressable Market) and CAGR (Compound Annual Growth Rate)**

TAM Categories:
- Under $500M
- $500M to $5B
- Over $5B

CAGR Categories:
- Under 10%
- 10% to 35%
- Over 35%

Score Matrix:
- **1:** TAM <$500M AND CAGR <10%
- **2:** TAM <$500M AND CAGR 10-35%
- **3:** TAM <$500M AND CAGR >35%
- **4:** TAM $500M-$5B AND CAGR <10%
- **5:** TAM $500M-$5B AND CAGR 10-35%
- **6:** TAM $500M-$5B AND CAGR >35%
- **7:** TAM >$5B AND CAGR <10%
- **8:** TAM >$5B AND CAGR 10-35%
- **9:** TAM >$5B AND CAGR >35%

## Key Features

### Current Features
1. **Company Analysis**
   - Automated website scraping and analysis
   - Extraction of company overview, technology, products, market context, team, funding
   - Technology description synthesis for subsequent analyses

2. **Competitive Risk Assessment**
   - Identification of competitors (large companies, mid-size, startups)
   - Market intensity analysis
   - Technology and business differentiation evaluation
   - AI scoring with rubric-based justification
   - User override capability with justification requirement

3. **Market Opportunity Assessment**
   - Multiple market identification and ranking
   - TAM and CAGR calculation
   - Primary market selection with rationale
   - Category-based scoring
   - Confidence metrics and data quality indicators
   - User override capability with justification requirement

4. **Progress Tracking**
   - Real-time phase indicators
   - Estimated completion times
   - Elapsed/remaining time display
   - Cancellation capability

5. **Browser Notifications**
   - Desktop notifications when analysis completes
   - Audio notification (optional)
   - Tab title flash
   - Minimization-friendly (users can multitask)

6. **Export Functionality**
   - Comprehensive PDF reports
   - Includes company overview, AI scores, user scores, justifications
   - Detailed evidence and analysis
   - Professional formatting

7. **Assessment UI**
   - Tabbed interface (Company Overview, Competitive Risk, Market Opportunity)
   - Multiple view modes (Summary, Detailed, Sources)
   - Score selection with rubric display
   - Deviation warnings (when user score differs from AI by >2 points)
   - Required justification fields

### Data Validation

**URL Validation:**
- Automatic protocol addition (https://)
- Domain name validation
- Empty input prevention

**Score Validation:**
- Must be 1-9 integer
- Justification required (20-2000 characters)
- Deviation warnings for significant differences

**API Response Validation:**
- Schema validation for all API outputs
- Required field checking
- Data type validation
- Error handling with retry capability

## State Management

**LocalStorage Schema:**
```javascript
{
  url: "https://example.com",
  company: { /* full company data */ },
  competitive: {
    analysis: { /* competitive analysis */ },
    assessment: { /* AI scoring */ },
    userScore: 7,
    userJustification: "...",
    analysisText: "..." // for market API input
  },
  market: {
    analysis: { /* market analysis */ },
    scoring: { /* AI scoring */ },
    userScore: 8,
    userJustification: "..."
  },
  techDescription: "...",
  timestamp: "2025-01-15T10:30:00Z"
}
```

## User Workflow

### Visual Feedback & Color-Coded Guidance

The platform uses color strategically to guide users through the assessment process:

**Score-Based Color Coding:**

*Competitive Risk Assessment (lower score = higher risk):*
- **Scores 1-3:** Red background - High risk, dominant competition
- **Scores 4-5:** Orange background - Moderate risk, established players
- **Scores 6-7:** Purple background - Low risk, differentiated positioning
- **Scores 8-9:** Green background - Minimal risk, blue ocean opportunity

*Market Opportunity Assessment (lower score = smaller opportunity):*
- **Scores 1-3:** Red background - Weak market fundamentals
- **Scores 4-5:** Orange background - Moderate market potential
- **Scores 6-7:** Purple background - Good market opportunity
- **Scores 8-9:** Green background - Exceptional market conditions

**UI States & Indicators:**
- **Active Phase:** Purple border and subtle glow effect
- **Completed Phase:** Green checkmark, subdued appearance
- **Error State:** Red border, alert icon
- **Loading State:** Animated purple gradient progress bar
- **Deviation Warning:** Yellow background when user score differs significantly from AI

**Interactive Elements:**
- **Hover States:** Slight elevation and color shift
- **Selected Items:** Purple highlight
- **Disabled States:** Reduced opacity (50%)
- **Required Fields:** Red asterisk indicator

This color system ensures users can quickly assess risk levels, understand their progress, and identify areas requiring attention without reading detailed text.

## User Workflow

### Detailed Process Flow

1. **Input Phase**
   - User enters company website URL
   - Clicks "Analyze Company"
   - (Optional) Grants notification permission

2. **Analysis Phase** (~20 minutes total)
   - Progress bar shows current phase
   - Estimated completion time displayed
   - User can cancel or minimize window
   - Desktop notification when complete

3. **Review Phase**
   - Company Overview tab shows extracted information
   - Competitive Risk tab shows AI score and evidence
   - Market Opportunity tab shows AI score and evidence
   - User can switch between Summary/Detailed/Sources views

4. **Scoring Phase**
   - User selects their own scores (1-9) for each dimension
   - Rubric displayed inline with score selection
   - Justification required for each score
   - Deviation warnings if score differs significantly from AI

5. **Export Phase**
   - Click "Export PDF Report"
   - PDF generates with all data
   - Includes both AI and user assessments
   - Downloads automatically

## Known Issues & Limitations

1. **API Performance**
   - APIs can take longer than estimated (especially company analysis)
   - No retry logic for individual phases (all-or-nothing approach)
   - Network issues can cause complete failure

2. **Browser Compatibility**
   - Desktop notifications require permission
   - Some browsers may block notification requests
   - LocalStorage has size limits (~5-10MB)

3. **Data Quality**
   - Dependent on website content quality
   - AI extraction may miss information
   - Competitor analysis limited to public data

4. **UI Limitations**
   - Some long text doesn't wrap properly in PDF export
   - "Show all competitors" button doesn't expand properly
   - Products list sometimes shows "[object Object]"

5. **No Backend**
   - All data stored in browser localStorage
   - No user accounts or authentication
   - No data sharing between users
   - No historical tracking across sessions

## Future Roadmap

### Immediate Priorities (Coming Soon)

1. **Additional API Integrations**
   - Team Analysis API (assessing founder/team capabilities)
   - Funding Analysis API (funding history, investor quality)
   - IP Analysis API (patent landscape, freedom to operate)
   - Modified Competitive API (enhanced analysis)

2. **Expanded Scoring Dimensions**
   - Currently: 2 dimensions (Competitive Risk, Market Opportunity)
   - Goal: 8+ dimensions covering all venture fundamentals
   - New scoring interfaces needed for each dimension

3. **Enhanced Front-End**
   - New assessment tabs for each dimension
   - Consistent scoring UI across all dimensions
   - Aggregate scoring/weighting system
   - Summary dashboard showing all scores

### Future Enhancements (Potential)

1. **Research Tool Integration**
   - Links to Dimensions.ai for academic research
   - GlobalData for market intelligence
   - Diffbot for web data extraction
   - Elman for IP analysis
   - Hunter.io for contact discovery
   - LinkedIn for team research
   - Google Patents for patent search
   - Contextual suggestions for when to use each tool

2. **Backend Development**
   - User authentication and accounts
   - Cloud database storage
   - Assessment history tracking
   - Team collaboration features
   - API key management

3. **Advanced Features**
   - Batch processing of multiple companies
   - Comparison views across ventures
   - Trend analysis over time
   - Automated follow-up analysis
   - Integration with NobleReach Readiness Tool

## Development Guidelines

### Adding New APIs

When integrating new API components:

1. **Create API Wrapper** (`js/api/[name].js`)
   - Follow existing pattern in company.js, competitive.js, market.js
   - Include timeout configuration
   - Implement abort signal handling
   - Add response validation
   - Process and format output

2. **Update Pipeline** (`js/core/pipeline.js`)
   - Add new phase to phases array
   - Set realistic duration estimate
   - Implement runPhase method
   - Handle data dependencies
   - Update progress calculation

3. **Create Assessment View** (`js/components/[name]-view.js`)
   - Display AI-generated scores
   - Show evidence and supporting data
   - Implement multiple view modes
   - Enable user scoring interface

4. **Add Validation** (`js/utils/validators.js`)
   - Schema validation for API responses
   - Score validation for user input
   - Required field checking

5. **Update Export** (`js/utils/export.js`)
   - Add section to PDF report
   - Format scores and justifications
   - Include supporting evidence

### Code Style Conventions

- Use ES6+ JavaScript features
- Component-based architecture
- Event-driven communication
- Clear separation of concerns
- Comprehensive error handling
- Inline documentation for complex logic

### Testing Approach

Currently manual testing. When testing:
- Test with various company types (B2B, B2C, deep tech, consumer)
- Verify API timeout handling
- Check localStorage persistence
- Test notification permissions
- Validate PDF export formatting
- Test with slow/flaky network

## Environment Variables & Configuration

**API Configuration (hardcoded in API files):**
- Authorization token: `e80f3814-a651-4de7-a7ba-8478b7a9047b`
- Base URL: `https://api.stack-ai.com/inference/v0/run/f913a8b8-144d-47e0-b327-8daa341b575d/`

**Timeout Settings:**
- Company API: 600000ms (10 min)
- Competitive API: 480000ms (8 min)
- Market API: 700000ms (11.6 min)

**UI Settings:**
- Progress update interval: 500ms
- Notification auto-close: 30 seconds
- Max deviation warning threshold: 2 points

## Common Development Tasks

### Adding a New Scoring Dimension

1. Create new API wrapper in `js/api/`
2. Add phase to pipeline in `pipeline.js`
3. Create view component in `js/components/`
4. Add rubric definitions to HTML
5. Update state management in relevant files
6. Add export section in `export.js`
7. Update validation in `validators.js`

### Modifying Existing API

1. Update configuration in API wrapper file
2. Adjust timeout if needed
3. Update response processing if schema changes
4. Modify validation rules in `validators.js`
5. Update display components if data structure changes
6. Test full pipeline to ensure data flow

### Fixing UI Issues

1. Identify affected component file
2. Check event listeners and state updates
3. Verify data formatting in `formatters.js`
4. Test across different data scenarios
5. Check browser console for errors
6. Validate against multiple browsers

## Support & Resources

**Key Technologies:**
- Vanilla JavaScript (ES6+)
- Stack-AI Platform (API provider)
- jsPDF (PDF generation)
- LocalStorage API (data persistence)
- Notifications API (desktop alerts)

**External Services:**
- Stack-AI: https://stack-ai.com/
- Research Tools: Dimensions, GlobalData, Diffbot, Elman, Hunter.io

**Related Documentation:**
- NobleReach Readiness Tool (separate project)
- Business Fundamentals Definitions
- Qualification Metrics Documentation
- Scoring Rubrics Reference

## Contact & Support

**Users:**
- Senior Commercialization Advisors (SCAs)
- Program Managers
- NobleReach Foundation team

**Permissions:**
- All users are administrators
- No user authentication currently
- All features available to all users

---

**Last Updated:** October 2025  
**Version:** Active Development  
**Maintained By:** NobleReach Foundation

## Quick Reference for Claude

When working on this project in future conversations:

1. **Always check** the sequential nature of APIs (Company → Competitive → Market)
2. **Remember** the 1-9 scoring scale and rubric definitions
3. **Consider** timeout issues - APIs can be slow
4. **Validate** all API responses against expected schemas
5. **Test** with localStorage for state persistence
6. **Follow** the component-based architecture pattern
7. **Anticipate** expansion to 8+ scoring dimensions
8. **Keep** user workflow in mind (analyze → review → score → export)

## Design Impact on User Experience

The visual design directly supports the platform's core mission of 100x faster due diligence:

**Speed Through Visual Hierarchy:**
- Purple gradient headers immediately orient users
- Color-coded scores enable instant risk assessment without reading details
- Progress indicators show exactly where users are in the 20-minute workflow

**Consistency Through Patterns:**
- Reusable rubric display across all assessment types
- Consistent tab navigation reduces cognitive load
- Unified scoring interface enables faster evaluation

**Trust Through Professionalism:**
- Purple/gradient theme conveys innovation and expertise
- Clean, modern aesthetic reflects the platform's cutting-edge AI capabilities
- Comprehensive data presentation demonstrates thoroughness

**Efficiency Through Color:**
- Green = opportunity, Red = risk (universal understanding)
- Visual deviation warnings prevent scoring errors
- Status indicators eliminate need to read progress text

**Result:** Users can complete comprehensive 6-dimension assessments in 20 minutes because the interface makes information instantly scannable, decisions clearly guided, and progress always visible.

## Appendix: Complete API Schemas

### Company Analysis Output Schema (`out-6`)
```json
{
  "company_overview": {
    "name": "string",
    "website": "string",
    "mission_statement": "string",
    "company_description": "string",
    "founded_year": "number",
    "company_stage": "string",
    "employee_count": "number",
    "headquarters": "string"
  },
  "technology": {
    "core_technology": "string",
    "technology_category": "string",
    "technical_approach": "string",
    "key_innovations": ["string"]
  },
  "products_and_applications": {
    "primary_application": "string",
    "products": ["object"],
    "use_cases": ["string"],
    "target_industries": ["string"]
  },
  "market_context": {
    "industry": "string",
    "problem_addressed": "string",
    "value_proposition": "string",
    "business_model": "string"
  },
  "funding_and_investors": {
    "total_funding": "number",
    "funding_rounds": ["object"]
  },
  "team": {
    "founders": ["object"],
    "key_team_members": ["object"]
  }
}
```

### Competitive Analysis Output Schema (`out-7`)
```json
{
  "score": "number (1-9)",
  "score_justification": "string",
  "rubric_match_explanation": "string",
  "competitor_count": {
    "total": "number",
    "large_companies": "number",
    "mid_size_companies": "number",
    "startups": "number"
  },
  "market_leaders": ["string"],
  "competitive_intensity": "string",
  "key_risk_factors": ["string"],
  "differentiation_opportunities": ["string"]
}
```

### Market Opportunity Output Schema (`out-3`)
```json
{
  "score": "number (1-9)",
  "confidence": "number (0-1)",
  "justification": {
    "summary": "string",
    "strengths_considered": ["string"],
    "limitations_considered": ["string"],
    "key_risks": ["string"]
  },
  "rubric_application": {
    "tam_value": "number",
    "tam_category": "string",
    "cagr_value": "number",
    "cagr_category": "string",
    "base_score": "number",
    "adjustment": "number",
    "adjustment_rationale": "string"
  },
  "data_quality": {
    "data_recency": "string",
    "data_concerns": ["string"]
  }
}
```
