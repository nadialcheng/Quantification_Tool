// js/utils/validators.js - Schema validation utilities

const Validators = {
  /**
   * Validate company data against venture-extraction-schema
   */
  validateCompany(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid company data structure' };
    }

    // Check required top-level fields
    const requiredFields = [
      'company_overview',
      'technology',
      'products_and_applications',
      'market_context'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate company_overview
    const overview = data.company_overview;
    if (!overview.name || !overview.website) {
      return { valid: false, error: 'Company must have name and website' };
    }

    // Validate website URL format
    try {
      new URL(overview.website);
    } catch {
      return { valid: false, error: 'Invalid company website URL' };
    }

    // Validate technology
    if (!data.technology.core_technology) {
      return { valid: false, error: 'Missing core technology description' };
    }

    return { valid: true };
  },

  /**
   * Validate competitive analysis response
   */
  validateCompetitive(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid competitive data structure' };
    }

    // Check for both analysis and assessment
    if (!data.analysis || !data.assessment) {
      return { valid: false, error: 'Missing competitive analysis or assessment' };
    }

    const analysis = data.analysis;
    const assessment = data.assessment;

    // Validate analysis structure
    if (!analysis.market_overview || !analysis.competitors || !analysis.competitive_analysis) {
      return { valid: false, error: 'Invalid competitive analysis structure' };
    }

    // Validate assessment score
    if (!Number.isInteger(assessment.score) || assessment.score < 1 || assessment.score > 9) {
      return { valid: false, error: `Invalid competitive score: ${assessment.score}` };
    }

    // Validate competitor count
    if (!assessment.competitor_count || typeof assessment.competitor_count !== 'object') {
      return { valid: false, error: 'Missing competitor count data' };
    }

    return { valid: true };
  },

  /**
   * Validate market analysis response
   */
  validateMarket(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid market data structure' };
    }

    // Check for both analysis and scoring
    if (!data.analysis || !data.scoring) {
      return { valid: false, error: 'Missing market analysis or scoring' };
    }

    const analysis = data.analysis;
    const scoring = data.scoring;

    // Validate analysis structure
    if (!analysis.markets || !analysis.primary_market) {
      return { valid: false, error: 'Invalid market analysis structure' };
    }

    // Validate primary market has TAM and CAGR
    if (analysis.primary_market.tam_usd === undefined || analysis.primary_market.cagr_percent === undefined) {
      return { valid: false, error: 'Primary market missing TAM or CAGR' };
    }

    // Validate scoring
    if (!Number.isInteger(scoring.score) || scoring.score < 1 || scoring.score > 9) {
      return { valid: false, error: `Invalid market score: ${scoring.score}` };
    }

    // Validate confidence
    if (typeof scoring.confidence !== 'number' || scoring.confidence < 0 || scoring.confidence > 1) {
      return { valid: false, error: 'Invalid confidence value' };
    }

    return { valid: true };
  },

  /**
   * Validate team analysis response
   */
  validateTeam(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid team data structure' };
    }

    if (!data.team || !Array.isArray(data.team.team_members)) {
      return { valid: false, error: 'Missing team roster' };
    }

    if (!data.scoring || typeof data.scoring !== 'object') {
      return { valid: false, error: 'Missing team scoring details' };
    }

    if (!Number.isInteger(data.score) || data.score < 1 || data.score > 9) {
      return { valid: false, error: `Invalid team score: ${data.score}` };
    }

    return { valid: true };
  },

  /**
   * Validate funding analysis response
   */
  validateFunding(data) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Invalid funding data structure' };
    }

    if (!data.analysis || typeof data.analysis !== 'object') {
      return { valid: false, error: 'Missing funding analysis payload' };
    }

    if (!data.assessment || typeof data.assessment !== 'object') {
      return { valid: false, error: 'Missing funding assessment payload' };
    }

    if (!Number.isInteger(data.score) || data.score < 1 || data.score > 9) {
      return { valid: false, error: `Invalid funding score: ${data.score}` };
    }

    const analysis = data.analysis;

    if (!analysis.venture_funding || typeof analysis.venture_funding !== 'object') {
      return { valid: false, error: 'Funding analysis missing venture_funding data' };
    }

    if (!Array.isArray(analysis.venture_funding.funding_rounds)) {
      return { valid: false, error: 'Funding rounds must be an array' };
    }

    if (!Array.isArray(analysis.market_deals)) {
      return { valid: false, error: 'Market deals must be an array' };
    }

    return { valid: true };
  },

  /**
   * Validate URL format
   */
  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'URL is required' };
    }

    const trimmed = url.trim();
    
    // Check if empty
    if (!trimmed) {
      return { valid: false, error: 'URL cannot be empty' };
    }

    // Add protocol if missing
    let validUrl = trimmed;
    if (!validUrl.match(/^https?:\/\//i)) {
      validUrl = 'https://' + validUrl;
    }

    // Validate URL format
    try {
      const urlObj = new URL(validUrl);
      
      // Check for valid hostname
      if (!urlObj.hostname || urlObj.hostname.indexOf('.') === -1) {
        return { valid: false, error: 'Invalid domain name' };
      }

      return { valid: true, url: validUrl };
    } catch {
      return { valid: false, error: 'Invalid URL format' };
    }
  },

  /**
   * Validate user assessment input
   */
  validateAssessment(score, justification) {
    const errors = [];

    // Validate score
    if (!Number.isInteger(score) || score < 1 || score > 9) {
      errors.push('Score must be between 1 and 9');
    }

    // Validate justification
    if (!justification || typeof justification !== 'string') {
      errors.push('Justification is required');
    } else {
      const trimmed = justification.trim();
      if (trimmed.length < 20) {
        errors.push('Justification must be at least 20 characters');
      }
      if (trimmed.length > 2000) {
        errors.push('Justification must be less than 2000 characters');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Sanitize text input to prevent XSS
   */
  sanitizeText(text) {
    if (!text) return '';
    
    return String(text)
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  /**
   * Validate API response structure
   */
  validateApiResponse(response, expectedOutputs = []) {
    if (!response || typeof response !== 'object') {
      return { valid: false, error: 'Invalid API response structure' };
    }

    // Check for outputs object
    if (!response.outputs || typeof response.outputs !== 'object') {
      return { valid: false, error: 'Missing outputs in API response' };
    }

    // Check for expected output keys
    for (const key of expectedOutputs) {
      if (!(key in response.outputs)) {
        return { valid: false, error: `Missing expected output: ${key}` };
      }
    }

    return { valid: true };
  },

  /**
   * Check for deviation between AI and user scores
   */
  checkScoreDeviation(aiScore, userScore) {
    if (aiScore === null || userScore === null) {
      return { hasDeviation: false };
    }

    const deviation = Math.abs(aiScore - userScore);
    
    return {
      hasDeviation: deviation > 2,
      deviation,
      message: deviation > 2 
        ? `Your score differs by ${deviation} points from the AI assessment (${aiScore}). Consider reviewing the analysis before submitting.`
        : null
    };
  },

  /**
   * Validate export data completeness
   */
  validateExportData(state) {
    const errors = [];

    if (!state.company) {
      errors.push('Company data is missing');
    }

    if (!state.team || state.team.score === undefined) {
      errors.push('Team assessment is incomplete');
    }

    if (!state.competitive || !state.competitive.assessment) {
      errors.push('Competitive assessment is incomplete');
    }

      if (!state.market || !state.market.scoring) {
        errors.push('Market assessment is incomplete');
      }

      if (!state.iprisk || state.iprisk.score === undefined) {
        errors.push('IP risk assessment is incomplete');
      }
  
      if (!state.team?.userScore) {
        errors.push('User team score is missing');
      }

      if (!state.competitive?.userScore) {
        errors.push('User competitive score is missing');
      }
  
      if (!state.market?.userScore) {
        errors.push('User market score is missing');
      }

    if (state.funding?.userScore === undefined || state.funding?.userScore === null) {
      errors.push('User funding score is missing');
    }

    if (state.iprisk?.userScore === undefined || state.iprisk?.userScore === null) {
      errors.push('User IP risk score is missing');
    }
  
      return {
        valid: errors.length === 0,
        errors
      };
  },

  /**
   * Clean and validate numbers
   */
  parseNumber(value, defaultValue = 0) {
    if (value === null || value === undefined) {
      return defaultValue;
    }

    const num = parseFloat(value);
    return isNaN(num) ? defaultValue : num;
  },

  /**
   * Validate array of strings
   */
  validateStringArray(arr, fieldName) {
    if (!Array.isArray(arr)) {
      return { valid: false, error: `${fieldName} must be an array` };
    }

    const invalidItems = arr.filter(item => typeof item !== 'string');
    if (invalidItems.length > 0) {
      return { valid: false, error: `${fieldName} contains non-string items` };
    }

    return { valid: true, data: arr.filter(item => item.trim()) };
  }
};

// Make available globally
window.Validators = Validators;
