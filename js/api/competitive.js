// js/api/competitive.js - Competitive analysis API

const CompetitiveAPI = {
  config: {
    url: 'https://api.stack-ai.com/inference/v0/run/f913a8b8-144d-47e0-b327-8daa341b575d/686d72045c56d3a93d5f7b68',
    headers: {
      'Authorization': 'Bearer e80f3814-a651-4de7-a7ba-8478b7a9047b',
      'Content-Type': 'application/json'
    },
    timeout: 480000 // 8 minutes
  },

  /**
   * Analyze competitive landscape
   */
  async analyze(techDescription, abortSignal = null) {
    if (!techDescription || typeof techDescription !== 'string') {
      throw new Error('Technology description is required');
    }

    const trimmed = techDescription.trim();
    if (trimmed.length < 20) {
      throw new Error('Technology description too short');
    }

    const payload = {
      'user_id': `competitive_${Date.now()}`,
      'in-0': trimmed
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(this.config.url, {
        method: 'POST',
        headers: this.config.headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Competitive API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return this.processResponse(data);

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Competitive analysis timeout or cancelled');
      }
      
      throw error;
    }
  },

  /**
   * Process API response with dual outputs
   */
  processResponse(data) {
    const outputs = data?.outputs || {};

    const analysisKey = this.resolveOutputKey(outputs, ['out-3']);
    const assessmentKey = this.resolveOutputKey(outputs, ['out-4']);

    if (!analysisKey || !assessmentKey) {
      throw new Error('Competitive API response missing required outputs');
    }

    // Validate response structure
    const validation = Validators.validateApiResponse(data, [analysisKey, assessmentKey]);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Parse the structured competitive analysis
    let analysis;
    try {
      const analysisRaw = outputs[analysisKey];
      if (typeof analysisRaw === 'string') {
        analysis = JSON.parse(analysisRaw);
      } else {
        analysis = analysisRaw;
      }
    } catch (error) {
      console.error('Failed to parse competitive analysis:', error);
      throw new Error('Invalid competitive analysis format');
    }

    // Parse the graded assessment
    let assessment;
    try {
      const assessmentRaw = outputs[assessmentKey];
      if (typeof assessmentRaw === 'string') {
        assessment = JSON.parse(assessmentRaw);
      } else {
        assessment = assessmentRaw;
      }
    } catch (error) {
      console.error('Failed to parse competitive assessment:', error);
      throw new Error('Invalid competitive assessment format');
    }

    // Validate assessment score
    const score = Number.parseInt(assessment.score, 10);
    if (!score || score < 1 || score > 9) {
      throw new Error(`Invalid competitive score: ${assessment.score}`);
    }
    assessment.score = score;

    // Ensure required fields
    this.ensureRequiredFields(analysis, assessment);

    // Return structured response
    return {
      analysis,
      assessment,
      analysisText: JSON.stringify(analysis), // For market analysis input
      formatted: this.formatForDisplay(analysis, assessment)
    };
  },

  /**
   * Ensure required fields exist
   */
  ensureRequiredFields(analysis, assessment) {
    // Ensure analysis structure
    if (!analysis.market_overview) analysis.market_overview = {};
    if (!analysis.competitors) analysis.competitors = [];
    if (!analysis.competitive_analysis) analysis.competitive_analysis = {};
    if (!analysis.data_quality) {
      analysis.data_quality = {};
    } else {
      const confidence =
        analysis.data_quality.overall_confidence ??
        analysis.data_quality.confidence ??
        analysis.data_quality.confidence_level;
      if (confidence !== undefined) {
        analysis.data_quality.overall_confidence = Number(confidence);
      }
    }

    // Ensure assessment structure
    if (!assessment.competitor_count) {
      assessment.competitor_count = {
        total: 0,
        large_companies: 0,
        mid_size_companies: 0,
        startups: 0
      };
    } else {
      const counts = assessment.competitor_count;
      counts.large_companies = Number(counts.large_companies ?? 0);
      counts.mid_size_companies = Number(counts.mid_size_companies ?? 0);
      counts.startups = Number(counts.startups ?? 0);

      if (counts.total === undefined || counts.total === null) {
        counts.total = counts.large_companies + counts.mid_size_companies + counts.startups;
      } else {
        counts.total = Number(counts.total);
        if (Number.isNaN(counts.total)) {
          counts.total = counts.large_companies + counts.mid_size_companies + counts.startups;
        }
      }
    }
    if (!assessment.market_leaders) assessment.market_leaders = [];
    if (!assessment.competitive_intensity) assessment.competitive_intensity = 'unknown';
    if (!assessment.key_risk_factors) assessment.key_risk_factors = [];
    if (!assessment.differentiation_opportunities) assessment.differentiation_opportunities = [];
  },

  /**
   * Format data for display
   */
  formatForDisplay(analysis, assessment) {
    // Extract competitor details
    const competitors = (analysis.competitors || []).map(comp => ({
      name: comp.company_name || 'Unknown',
      size: comp.size_category || 'Unknown',
      product: comp.product_name || '',
      description: comp.product_description || '',
      strengths: comp.strengths || [],
      weaknesses: comp.weaknesses || [],
      revenue: comp.revenue || 'Unknown',
      funding: comp.funding_raised || 'N/A',
      position: comp.market_position || 'Unknown'
    }));

    // Build formatted response
    return {
      // Score and justification
      score: assessment.score,
      justification: assessment.score_justification || '',
      rubricMatch: assessment.rubric_match_explanation || '',
      
      // Competitor metrics
      competitorCount: assessment.competitor_count,
      totalCompetitors: assessment.competitor_count.total,
      competitors: competitors.slice(0, 10), // Top 10
      
      // Market analysis
      marketLeaders: assessment.market_leaders || [],
      competitiveIntensity: assessment.competitive_intensity,
      
      // Risk and opportunities
      keyRisks: assessment.key_risk_factors || [],
      opportunities: assessment.differentiation_opportunities || [],
      
      // Additional insights
      dominantPlayers: analysis.competitive_analysis?.dominant_players || [],
      emergingThreats: analysis.competitive_analysis?.emerging_threats || [],
      technologyTrends: analysis.competitive_analysis?.technology_trends || [],
      marketGaps: analysis.competitive_analysis?.market_gaps || [],
      
      // Data quality
      confidence:
        analysis.data_quality?.overall_confidence ??
        analysis.data_quality?.confidence ??
        analysis.data_quality?.confidence_level ??
        0.7,
      dataDate: analysis.data_quality?.data_date || new Date().toISOString(),
      sources: analysis.data_quality?.sources_used || []
    };
  },

  /**
   * Resolve the first output key present in the response
   */
  resolveOutputKey(outputs, candidates) {
    if (!outputs || typeof outputs !== 'object') {
      return null;
    }

    return candidates.find(key => key in outputs) || null;
  },

  /**
   * Get rubric description for a score
   */
  getRubricDescription(score) {
    const rubrics = {
      1: "Dominant established players AND little tech OR business differentiation",
      2: "Established players AND little tech OR business differentiation",
      3: "Established players AND some tech OR business differentiation",
      4: "Established players AND significant tech differentiation",
      5: "Established players AND significant tech AND business differentiation",
      6: "Existing players AND significant tech OR business differentiation",
      7: "Existing players AND significant tech AND business differentiation",
      8: "Few existing players AND significant tech AND business differentiation",
      9: "No existing players in the market"
    };
    
    return rubrics[score] || "Invalid score";
  }
};

// Make available globally
window.CompetitiveAPI = CompetitiveAPI;
