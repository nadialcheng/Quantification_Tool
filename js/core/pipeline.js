// js/core/pipeline.js - Sequential analysis pipeline manager

class AnalysisPipeline {
  constructor() {
    this.phases = [
	  { 
		name: 'Company Analysis',
		key: 'company',
		duration: 480,  // 8 minutes (was 260 seconds)
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  },
	  { 
		name: 'Team Analysis',
		key: 'team',
		duration: 300,  // 5 minutes
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  },
	  { 
		name: 'Funding Analysis',
		key: 'funding',
		duration: 300,  // 5 minutes
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  },
	  { 
		name: 'Competitive Analysis',
		key: 'competitive',
		duration: 240,  // 4 minutes (was 120 seconds)
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  },
	  { 
		name: 'Market Analysis',
		key: 'market',
		duration: 480,  // 8 minutes (was 150 seconds)
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  },
	  { 
		name: 'IP Risk Analysis',
		key: 'iprisk',
		duration: 300,  // 5 minutes
		status: 'pending',
		startTime: null,
		endTime: null,
		data: null,
		error: null
	  }
	];
    
    this.startTime = null;
    this.abortController = null;
    this.companyUrl = null;
    this.techDescription = null;
    this.callbacks = {};
    this.isRunning = false;
    this.activePhases = new Set();
  }

  /**
   * Register callback functions
   */
  on(event, callback) {
    this.callbacks[event] = callback;
  }

  /**
   * Emit event to registered callback
   */
  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event](data);
    }
  }

  /**
   * Start the analysis pipeline
   */
  async start(companyUrl) {
    if (this.isRunning) {
      throw new Error('Analysis already in progress');
    }

    const validation = Validators.validateUrl(companyUrl);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    this.companyUrl = validation.url;
    this.techDescription = null;
    this.startTime = Date.now();
    this.abortController = new AbortController();
    this.isRunning = true;
    this.activePhases.clear();
    
    this.phases.forEach(phase => {
      phase.status = 'pending';
      phase.startTime = null;
      phase.endTime = null;
      phase.data = null;
      phase.error = null;
      delete phase.promise;
    });

    this.emit('start', { url: this.companyUrl });

    try {
      await this.executePhase('company');

      const teamPromise = this.executePhase('team');
      const fundingPromise = this.executePhase('funding');
      const competitivePromise = this.executePhase('competitive');
      const ipRiskPromise = this.executePhase('iprisk');

      const marketPromise = (async () => {
        await competitivePromise;
        if (this.abortController?.signal.aborted) {
          throw new Error('Analysis cancelled');
        }
        return this.executePhase('market');
      })();

      await Promise.all([teamPromise, fundingPromise, competitivePromise, ipRiskPromise, marketPromise]);

      this.emit('complete', this.getResults());
      return this.getResults();

    } catch (error) {
      if (this.abortController && !this.abortController.signal.aborted) {
        this.abortController.abort();
      }
      this.emit('error', error);
      throw error;
    } finally {
      this.isRunning = false;
      this.abortController = null;
      this.activePhases.clear();
    }
  }

  /**
   * Run a single phase (supports concurrent execution)
   */
  executePhase(key) {
    const phase = this.phases.find(p => p.key === key);
    if (!phase) {
      return Promise.reject(new Error(`Unknown phase: ${key}`));
    }

    if (phase.promise) {
      return phase.promise;
    }

    phase.status = 'active';
    phase.startTime = Date.now();
    phase.endTime = null;
    phase.error = null;
    this.activePhases.add(key);

    this.emit('phaseStart', {
      phase: phase.key,
      name: phase.name,
      estimatedDuration: phase.duration
    });

    const runPhase = async () => {
      try {
        let result;

        switch (phase.key) {
          case 'company':
            result = await this.runCompanyAnalysis();
            break;
          case 'team':
            result = await this.runTeamAnalysis();
            break;
          case 'competitive':
            result = await this.runCompetitiveAnalysis();
            break;
          case 'funding':
            result = await this.runFundingAnalysis();
            break;
          case 'market':
            result = await this.runMarketAnalysis();
            break;
          case 'iprisk':
            result = await this.runIpRiskAnalysis();
            break;
          default:
            throw new Error(`Unknown phase: ${phase.key}`);
        }

        phase.data = result;
        phase.status = 'completed';
        phase.endTime = Date.now();

        this.emit('phaseComplete', {
          phase: phase.key,
          name: phase.name,
          duration: (phase.endTime - phase.startTime) / 1000,
          data: result
        });

        return result;
      } catch (error) {
        phase.status = 'error';
        phase.error = error;
        phase.endTime = Date.now();

        this.emit('phaseError', {
          phase: phase.key,
          name: phase.name,
          error: error.message
        });

        throw error;
      } finally {
        this.activePhases.delete(key);
        delete phase.promise;
      }
    };

    phase.promise = runPhase();
    return phase.promise;
  }

  /**
   * Run company analysis
   */
  async runCompanyAnalysis() {
    const response = await CompanyAPI.analyze(
      this.companyUrl,
      this.abortController.signal
    );
    
    // Validate response
    const validation = Validators.validateCompany(response);
    if (!validation.valid) {
      throw new Error(`Invalid company data: ${validation.error}`);
    }
    
    // Extract tech description for next phases
    this.techDescription = this.buildTechDescription(response);
    
    return response;
  }

  /**
   * Run team analysis
   */
  async runTeamAnalysis() {
    if (!this.companyUrl) {
      throw new Error('Company URL not available');
    }

    const response = await TeamAPI.analyze(
      this.companyUrl,
      this.abortController.signal
    );

    const validation = Validators.validateTeam(response);
    if (!validation.valid) {
      throw new Error(`Invalid team data: ${validation.error}`);
    }

    return response;
  }

  /**
   * Run funding analysis
   */
  async runFundingAnalysis() {
    if (!this.techDescription) {
      throw new Error('Tech description not available');
    }

    const response = await FundingAPI.analyze(
      this.techDescription,
      this.abortController.signal
    );

    const validation = Validators.validateFunding(response);
    if (!validation.valid) {
      throw new Error(`Invalid funding data: ${validation.error}`);
    }

    return response;
  }

  /**
   * Run competitive analysis
   */
  async runCompetitiveAnalysis() {
    if (!this.techDescription) {
      throw new Error('Tech description not available');
    }

    const response = await CompetitiveAPI.analyze(
      this.techDescription,
      this.abortController.signal
    );
    
    // Validate response
    const validation = Validators.validateCompetitive(response);
    if (!validation.valid) {
      throw new Error(`Invalid competitive data: ${validation.error}`);
    }
    
    return response;
  }

  /**
   * Run market analysis
   */
  async runMarketAnalysis() {
    if (!this.techDescription) {
      throw new Error('Tech description not available');
    }

    const competitiveData = this.phases.find(p => p.key === 'competitive')?.data;
    if (!competitiveData) {
      throw new Error('Competitive analysis not available');
    }

    const response = await MarketAPI.analyze(
      this.techDescription,
      competitiveData.analysisText || competitiveData,
      this.abortController.signal
    );
    
    // Validate response
    const validation = Validators.validateMarket(response);
    if (!validation.valid) {
      throw new Error(`Invalid market data: ${validation.error}`);
    }
    
    return response;
  }

  /**
   * Run IP risk analysis
   */
  async runIpRiskAnalysis() {
    if (!this.techDescription) {
      throw new Error('Tech description not available');
    }

    const response = await IPRiskAPI.analyze(
      this.techDescription,
      this.abortController.signal
    );

    return response;
  }

  /**
   * Build tech description from company data
   */
  buildTechDescription(company) {
    const parts = [];
    
    // Company basics
    if (company.company_overview) {
      const o = company.company_overview;
      if (o.name) parts.push(`Company: ${o.name}`);
      if (o.mission_statement) parts.push(`Mission: ${o.mission_statement}`);
      if (o.company_description) parts.push(o.company_description);
    }
    
    // Technology
    if (company.technology) {
      const t = company.technology;
      if (t.core_technology) parts.push(`Core Technology: ${t.core_technology}`);
      if (t.technical_approach) parts.push(`Technical Approach: ${t.technical_approach}`);
      if (t.key_innovations && t.key_innovations.length > 0) {
        parts.push(`Key Innovations: ${t.key_innovations.slice(0, 3).join('; ')}`);
      }
    }
    
    // Products and applications
    if (company.products_and_applications) {
      const p = company.products_and_applications;
      if (p.primary_application) parts.push(`Primary Application: ${p.primary_application}`);
      if (p.target_industries && p.target_industries.length > 0) {
        parts.push(`Target Industries: ${p.target_industries.join(', ')}`);
      }
    }
    
    // Market context
    if (company.market_context) {
      const m = company.market_context;
      if (m.problem_addressed) parts.push(`Problem Addressed: ${m.problem_addressed}`);
      if (m.value_proposition) parts.push(`Value Proposition: ${m.value_proposition}`);
    }
    
    const description = parts.join('\n\n');
    
    // Ensure minimum length
    if (description.length < 200) {
      parts.push('This company is developing innovative technology solutions for their target market.');
    }
    
    return parts.join('\n\n');
  }

  /**
   * Cancel the analysis
   */
  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      const activeKeys = Array.from(this.activePhases);
      this.emit('cancelled', {
        phase: activeKeys.length > 0 ? activeKeys[0] : null
      });
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    const totalDuration = this.phases.reduce((sum, phase) => sum + phase.duration, 0) || 1;
    const now = Date.now();
    const elapsed = this.startTime ? (now - this.startTime) / 1000 : 0;

    const completedContribution = this.phases.reduce((sum, phase) => {
      if (phase.status === 'completed') {
        return sum + phase.duration;
      }
      if (phase.status === 'active' && phase.startTime) {
        const phaseElapsed = (now - phase.startTime) / 1000;
        const phaseProgress = Math.min(phaseElapsed / phase.duration, 1);
        return sum + phaseProgress * phase.duration;
      }
      return sum;
    }, 0);

    const allCompleted = this.phases.every(phase => phase.status === 'completed');
    const percentage = allCompleted
      ? 100
      : Math.min(95, (completedContribution / totalDuration) * 100);

    const estimated = totalDuration;
    const remaining = Math.max(0, estimated - elapsed);
    const activeNames = Array.from(this.activePhases)
      .map(key => this.phases.find(phase => phase.key === key)?.name)
      .filter(Boolean);

    return {
      percentage,
      elapsed,
      estimated,
      remaining,
      currentPhase: activeNames.length > 0 ? activeNames.join(', ') : null
    };
  }

  /**
   * Get results
  */
  getResults() {
    return {
      company: this.phases.find(p => p.key === 'company')?.data || null,
      team: this.phases.find(p => p.key === 'team')?.data || null,
      funding: this.phases.find(p => p.key === 'funding')?.data || null,
      competitive: this.phases.find(p => p.key === 'competitive')?.data || null,
      market: this.phases.find(p => p.key === 'market')?.data || null,
      iprisk: this.phases.find(p => p.key === 'iprisk')?.data || null,
      techDescription: this.techDescription,
      duration: (Date.now() - this.startTime) / 1000
    };
  }

  /**
   * Check if all phases completed
   */
  isComplete() {
    return this.phases.every(phase => phase.status === 'completed');
  }

  /**
   * Get phase status
   */
  getPhaseStatus(key) {
    const phase = this.phases.find(p => p.key === key);
    return phase ? phase.status : null;
  }

  /**
   * Reset pipeline
   */
  reset() {
    if (this.abortController) {
      this.abortController.abort();
    }
    
    this.startTime = null;
    this.abortController = null;
    this.companyUrl = null;
    this.techDescription = null;
    this.isRunning = false;
    this.activePhases.clear();
    
    this.phases.forEach(phase => {
      phase.status = 'pending';
      phase.startTime = null;
      phase.endTime = null;
      phase.data = null;
      phase.error = null;
      delete phase.promise;
    });
  }
}

// Make available globally
window.AnalysisPipeline = AnalysisPipeline;
