// js/components/assessment-view.js - Assessment display and user scoring

class AssessmentView {
  constructor() {
    this.currentTab = 'competitive';
    this.currentView = {
      team: 'summary',
      funding: 'summary',
      competitive: 'summary',
      market: 'summary',
      iprisk: 'summary'
    };
    this.data = {
      company: null,
      team: null,
      funding: null,
      competitive: null,
      market: null,
      iprisk: null
    };
    this.userScores = {
      team: { score: 5, justification: '', submitted: false },
      funding: { score: 5, justification: '', submitted: false },
      competitive: { score: 5, justification: '', submitted: false },
      market: { score: 5, justification: '', submitted: false },
      iprisk: { score: 5, justification: '', submitted: false }
    };
    this.elements = {};
  }

  /**
   * Initialize assessment view
   */
  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.initializeSliders();
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      // Tabs
      tabs: {
        overview: document.querySelector('[data-tab="overview"]'),
        team: document.querySelector('[data-tab="team"]'),
        funding: document.querySelector('[data-tab="funding"]'),
        competitive: document.querySelector('[data-tab="competitive"]'),
        market: document.querySelector('[data-tab="market"]'),
        iprisk: document.querySelector('[data-tab="iprisk"]'),
        summary: document.querySelector('[data-tab="summary"]')
      },
      tabContents: {
        overview: document.getElementById('overviewTab'),
        team: document.getElementById('teamTab'),
        funding: document.getElementById('fundingTab'),
        competitive: document.getElementById('competitiveTab'),
        market: document.getElementById('marketTab'),
        iprisk: document.getElementById('ipriskTab'),
        summary: document.getElementById('summaryTab')
      },
      
      // Team elements
      team: {
        aiScore: document.getElementById('teamAiScore'),
        userScore: document.getElementById('teamUserScore'),
        slider: document.getElementById('teamSlider'),
        rubric: document.getElementById('teamRubric'),
        justification: document.getElementById('teamJustification'),
        warning: document.getElementById('teamWarning'),
        submitBtn: document.getElementById('teamSubmit'),
        evidence: document.getElementById('teamEvidence'),
        scoreBadge: document.getElementById('teamScoreBadge')
      },

      // Funding elements
      funding: {
        aiScore: document.getElementById('fundingAiScore'),
        userScore: document.getElementById('fundingUserScore'),
        slider: document.getElementById('fundingSlider'),
        rubric: document.getElementById('fundingRubric'),
        justification: document.getElementById('fundingJustification'),
        warning: document.getElementById('fundingWarning'),
        submitBtn: document.getElementById('fundingSubmit'),
        evidence: document.getElementById('fundingEvidence'),
        scoreBadge: document.getElementById('fundingScoreBadge')
      },

      // Competitive elements
      competitive: {
        aiScore: document.getElementById('competitiveAiScore'),
        userScore: document.getElementById('competitiveUserScore'),
        slider: document.getElementById('competitiveSlider'),
        rubric: document.getElementById('competitiveRubric'),
        justification: document.getElementById('competitiveJustification'),
        warning: document.getElementById('competitiveWarning'),
        submitBtn: document.getElementById('competitiveSubmit'),
        evidence: document.getElementById('competitiveEvidence'),
        scoreBadge: document.getElementById('competitiveScoreBadge')
      },
      
      // Market elements
        market: {
          aiScore: document.getElementById('marketAiScore'),
          userScore: document.getElementById('marketUserScore'),
          slider: document.getElementById('marketSlider'),
          rubric: document.getElementById('marketRubric'),
          justification: document.getElementById('marketJustification'),
          warning: document.getElementById('marketWarning'),
          submitBtn: document.getElementById('marketSubmit'),
          evidence: document.getElementById('marketEvidence'),
          scoreBadge: document.getElementById('marketScoreBadge')
        },
        
        // IP Risk elements
        iprisk: {
          aiScore: document.getElementById('ipRiskAiScore'),
          userScore: document.getElementById('ipRiskUserScore'),
          slider: document.getElementById('ipRiskSlider'),
          rubric: document.getElementById('ipRiskRubric'),
          justification: document.getElementById('ipRiskJustification'),
          warning: document.getElementById('ipRiskWarning'),
          submitBtn: document.getElementById('ipRiskSubmit'),
          evidence: document.getElementById('ipRiskEvidence'),
        scoreBadge: document.getElementById('ipRiskScoreBadge')
      },

        // Summary elements
        summary: {
          teamAi: document.getElementById('summaryTeamAi'),
          teamUser: document.getElementById('summaryTeamUser'),
          teamJustification: document.getElementById('teamJustificationSummary'),
          fundingAi: document.getElementById('summaryFundingAi'),
          fundingUser: document.getElementById('summaryFundingUser'),
          fundingJustification: document.getElementById('fundingJustificationSummary'),
          competitiveAi: document.getElementById('summaryCompetitiveAi'),
          competitiveUser: document.getElementById('summaryCompetitiveUser'),
          competitiveJustification: document.getElementById('competitiveJustificationSummary'),
          marketAi: document.getElementById('summaryMarketAi'),
          marketUser: document.getElementById('summaryMarketUser'),
          marketJustification: document.getElementById('marketJustificationSummary'),
          ipRiskAi: document.getElementById('summaryIpRiskAi'),
          ipRiskUser: document.getElementById('summaryIpRiskUser'),
          ipRiskJustification: document.getElementById('ipRiskJustificationSummary'),
          companySummary: document.getElementById('companySummary')
        }
    };
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Tab switching
    Object.entries(this.elements.tabs).forEach(([key, tab]) => {
      if (tab) {
        tab.addEventListener('click', () => this.switchTab(key));
      }
    });
    
    // Sliders
    if (this.elements.team.slider) {
      this.elements.team.slider.addEventListener('input', (e) => {
        this.handleSliderChange('team', parseInt(e.target.value));
      });
    }
    
    if (this.elements.funding.slider) {
      this.elements.funding.slider.addEventListener('input', (e) => {
        this.handleSliderChange('funding', parseInt(e.target.value));
      });
    }
    
      if (this.elements.competitive.slider) {
        this.elements.competitive.slider.addEventListener('input', (e) => {
          this.handleSliderChange('competitive', parseInt(e.target.value));
        });
      }
      
      if (this.elements.market.slider) {
        this.elements.market.slider.addEventListener('input', (e) => {
          this.handleSliderChange('market', parseInt(e.target.value));
        });
      }
      
      if (this.elements.iprisk.slider) {
        this.elements.iprisk.slider.addEventListener('input', (e) => {
          this.handleSliderChange('iprisk', parseInt(e.target.value));
        });
      }
      
      // Submit buttons
    if (this.elements.funding.submitBtn) {
      this.elements.funding.submitBtn.addEventListener('click', () => {
        this.submitAssessment('funding');
      });
    }
    
    if (this.elements.competitive.submitBtn) {
      this.elements.competitive.submitBtn.addEventListener('click', () => {
        this.submitAssessment('competitive');
      });
    }
    
    if (this.elements.market.submitBtn) {
      this.elements.market.submitBtn.addEventListener('click', () => {
        this.submitAssessment('market');
      });
    }
    
    if (this.elements.iprisk.submitBtn) {
      this.elements.iprisk.submitBtn.addEventListener('click', () => {
        this.submitAssessment('iprisk');
      });
    }
    if (this.elements.team.submitBtn) {
      this.elements.team.submitBtn.addEventListener('click', () => {
        this.submitAssessment('team');
      });
    }
	// Continue to Assessment button
	const continueBtn = document.getElementById('continueToAssessment');
	if (continueBtn) {
	  continueBtn.addEventListener('click', () => {
		this.switchTab('team');
	  });
	}
      
      // View toggles
      document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const view = e.currentTarget.dataset.view;
          const tabContent = e.currentTarget.closest('.tab-content');
          if (!tabContent || !tabContent.id.endsWith('Tab')) return;
          const tab = tabContent.id.replace('Tab', '');
          this.switchView(tab, view);
        });
      });
    }

  /**
   * Initialize sliders with default values
   */
  initializeSliders() {
      ['team', 'funding', 'competitive', 'market', 'iprisk'].forEach(type => {
      const slider = this.elements[type].slider;
      const display = this.elements[type].userScore;
      
      if (slider && display) {
        slider.value = 5;
        display.textContent = 5;
        this.updateRubricDisplay(type, 5);
      }
    });
  }

  /**
   * Load analysis results
  */
  loadResults(results) {
	  this.data = results;
	  
	  ['team', 'funding', 'competitive', 'market', 'iprisk'].forEach(type => {
		if (this.userScores[type]) {
		  this.userScores[type].score = 5;
		  this.userScores[type].justification = '';
		  this.userScores[type].submitted = false;
		}
	  });
	  
	  // Load and display company overview first
	  if (results.company) {
		this.displayCompanyOverview(results.company);
		this.loadCompanyData(results.company);
	  }
	  
	  // Load team data
	  if (results.team) {
		this.loadTeamData(results.team);
	  }

	  // Load funding data
	  if (results.funding) {
		this.loadFundingData(results.funding);
	  }
	  
	  // Load competitive data
	  if (results.competitive) {
		this.loadCompetitiveData(results.competitive);
	  }
	  
  	  // Load market data
  	  if (results.market) {
  		this.loadMarketData(results.market);
  	  }
	  
	  // Load IP risk data
	  if (results.iprisk) {
		this.loadIpRiskData(results.iprisk);
	  }
	  
	  // Show assessment section
	  document.getElementById('resultsSection').style.display = 'flex';
	  
	  // Show overview tab by default
	  this.switchTab('overview');
	  

	}

  /**
   * Load team data
   */
  loadTeamData(data) {
    const elements = this.elements.team;
    if (!elements) return;

    const aiScore = Number.isInteger(data.score) ? data.score : null;

    if (elements.aiScore) {
      elements.aiScore.textContent = aiScore !== null ? aiScore : '-';
    }

    if (elements.scoreBadge) {
      if (aiScore !== null) {
        elements.scoreBadge.textContent = aiScore;
        const scoreData = Formatters.scoreColor(aiScore, 'team');
        elements.scoreBadge.style.background = scoreData.color;
      } else {
        elements.scoreBadge.textContent = '-';
        elements.scoreBadge.style.background = 'var(--gray-300)';
      }
    }

    const initialScore = aiScore !== null ? aiScore : 5;
    if (elements.slider) {
      elements.slider.value = initialScore;
      this.handleSliderChange('team', initialScore);
    } else {
      this.userScores.team.score = initialScore;
    }

    this.displayTeamEvidence(data.formatted || {});
  }

  /**
   * Display team evidence content
   */
  displayTeamEvidence(data) {
    const container = this.elements.team.evidence;
    if (!container) return;

    const composition = data.teamComposition || {};
    const members = Array.isArray(data.members) ? data.members : [];
    const confidence = (typeof data.confidence === 'number' && !isNaN(data.confidence))
      ? Formatters.confidence(data.confidence)
      : 'Not available';

    const renderList = (items, formatter, emptyLabel) => {
      if (!Array.isArray(items) || items.length === 0) {
        return `<p class="empty-item">${emptyLabel}</p>`;
      }
      return `<ul>${items.map(item => formatter(item)).join('')}</ul>`;
    };

    const formatWork = (entry) => {
      if (typeof entry === 'string') return `<li>${Formatters.escapeHTML(entry)}</li>`;
      const company = Formatters.escapeHTML(entry.company || 'Unknown Company');
      const role = Formatters.escapeHTML(entry.position || '');
      const duration = Formatters.escapeHTML(entry.duration || '');
      return `<li><strong>${company}</strong>${role ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ ${role}` : ''}${duration ? ` <span class="history-duration">(${duration})</span>` : ''}</li>`;
    };

    const formatEducation = (entry) => {
      if (typeof entry === 'string') return `<li>${Formatters.escapeHTML(entry)}</li>`;
      const institution = Formatters.escapeHTML(entry.institution || 'Unknown Institution');
      const degree = Formatters.escapeHTML(entry.degree || '');
      const year = Formatters.escapeHTML(entry.year || '');
      return `<li><strong>${institution}</strong>${degree ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ ${degree}` : ''}${year ? ` <span class="history-duration">${year}</span>` : ''}</li>`;
    };

    const formatCommercial = (entry) => {
      if (typeof entry === 'string') return `<li>${Formatters.escapeHTML(entry)}</li>`;
      const description = Formatters.escapeHTML(entry.description || 'Experience');
      const company = Formatters.escapeHTML(entry.company || '');
      const outcome = Formatters.escapeHTML(entry.outcome || '');
      return `<li>${description}${company ? ` <strong>(${company})</strong>` : ''}${outcome ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ ${outcome}` : ''}</li>`;
    };

    const formatPublication = (entry) => {
      if (typeof entry === 'string') return `<li>${Formatters.escapeHTML(entry)}</li>`;
      const title = Formatters.escapeHTML(entry.title || 'Publication');
      const venue = Formatters.escapeHTML(entry.venue || '');
      const year = Formatters.escapeHTML(entry.year || '');
      const type = Formatters.escapeHTML(entry.type || '');
      const details = [venue, year, type].filter(Boolean).join(' ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ');
      return `<li><strong>${title}</strong>${details ? ` <span class="history-duration">${details}</span>` : ''}</li>`;
    };

    const formatAward = (entry) => {
      if (typeof entry === 'string') return `<li>${Formatters.escapeHTML(entry)}</li>`;
      const name = Formatters.escapeHTML(entry.award_name || 'Award');
      const org = Formatters.escapeHTML(entry.organization || '');
      const year = Formatters.escapeHTML(entry.year || '');
      return `<li><strong>${name}</strong>${org ? ` ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ ${org}` : ''}${year ? ` <span class="history-duration">${year}</span>` : ''}</li>`;
    };

    const summaryHTML = `
      <div class="evidence-summary">
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-label">AI Score</div>
            <div class="metric-value">${this.data.team?.score ?? '-'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Team Size</div>
            <div class="metric-value">${composition.total ?? members.length ?? '-'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Technical Experts</div>
            <div class="metric-value">${composition.technical ?? 0}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Confidence</div>
            <div class="metric-value">${confidence}</div>
          </div>
        </div>

        <div class="content-section">
          <h4>AI Assessment Rationale</h4>
          <p>${Formatters.escapeHTML(data.justification || 'No justification provided.')}</p>
        </div>

        <div class="content-section">
          <h4>Key Strengths</h4>
          <ul>${Formatters.listToHTML(data.strengths || [], 5)}</ul>
        </div>

        <div class="content-section">
          <h4>Key Gaps</h4>
          <ul>${Formatters.listToHTML(data.gaps || [], 5)}</ul>
        </div>
      </div>
    `;

    const detailedHTML = `
      <div class="evidence-detailed">
        <div class="content-section">
          <h4>Relevant Experience Highlights</h4>
          <ul>${Formatters.listToHTML(data.experiences || [], 6)}</ul>
        </div>
        <div class="team-members">
          ${members.map(member => `
            <div class="team-member-card">
              <div class="member-header">
                <h4>${Formatters.escapeHTML(member.name || 'Team Member')}</h4>
                <span class="member-role">${Formatters.escapeHTML(member.role_at_venture || 'Role not specified')}</span>
              </div>
              <div class="member-content">
                <div class="member-section">
                  <h5>Commercial Experience</h5>
                  ${renderList(member.commercialization_experience, formatCommercial, 'No commercialization experience listed.')}
                </div>
                <div class="member-section">
                  <h5>Work History</h5>
                  ${renderList(member.work_history, formatWork, 'No work history listed.')}
                </div>
                <div class="member-section">
                  <h5>Education</h5>
                  ${renderList(member.education_history, formatEducation, 'No education history listed.')}
                </div>
                <div class="member-section">
                  <h5>Papers & Publications</h5>
                  ${renderList(member.papers_publications, formatPublication, 'No publications listed.')}
                </div>
                <div class="member-section">
                  <h5>Awards & Recognition</h5>
                  ${renderList(member.awards_recognition, formatAward, 'No awards listed.')}
                </div>
              </div>
            </div>
          `).join('') || '<p class="empty-item">No team members listed.</p>'}
        </div>
      </div>
    `;

    const sourcesHTML = `
      <div class="evidence-sources">
        <div class="content-section">
          <h4>Data Sources</h4>
          ${this.renderSources(data.sources || [], 'team')}
        </div>
        <div class="content-section">
          <h4>Rubric Alignment</h4>
          <p>${Formatters.escapeHTML(data.rubric || 'No rubric explanation provided.')}</p>
        </div>
      </div>
    `;

    container.innerHTML = summaryHTML;
    container.dataset.summary = summaryHTML;
    container.dataset.detailed = detailedHTML;
    container.dataset.sources = sourcesHTML;
  }

  /**
   * Load funding data
   */
  loadFundingData(data) {
    const elements = this.elements.funding;
    if (!elements) return;

    const formatted = data.formatted || {};
    const aiScore = Number.isInteger(data.score) ? data.score : null;

    if (elements.aiScore) {
      elements.aiScore.textContent = aiScore !== null ? aiScore : '-';
    }

    if (elements.scoreBadge) {
      if (aiScore !== null) {
        elements.scoreBadge.textContent = aiScore;
        const scoreData = Formatters.scoreColor(aiScore, 'funding');
        elements.scoreBadge.style.background = scoreData.color;
      } else {
        elements.scoreBadge.textContent = '-';
        elements.scoreBadge.style.background = 'var(--gray-300)';
      }
    }

    const initialScore = aiScore !== null ? aiScore : 5;
    if (elements.slider) {
      elements.slider.value = initialScore;
      this.handleSliderChange('funding', initialScore);
    } else {
      this.userScores.funding.score = initialScore;
    }

    this.displayFundingEvidence(formatted);
  }

  /**
   * Display funding evidence content
   */
  displayFundingEvidence(data) {
    const container = this.elements.funding.evidence;
    if (!container) return;

    const normalizeText = (value) => {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/[ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ÂÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢]/g, '-')
        .replace(/[ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÂ¢Ã¢â€šÂ¬Ã‚Â]/g, '"')
        .replace(/[ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢]/g, "'")
        .replace(/[ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢Ãƒâ€šÃ‚Â·]/g, '-')
        .replace(/[^\x20-\x7E]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const sanitizeText = (value, fallback = '') => {
      const normalized = normalizeText(value);
      if (!normalized) return fallback;
      return Formatters.escapeHTML(normalized);
    };

    const confidence = (typeof data.confidence === 'number' && !isNaN(data.confidence))
      ? Formatters.confidence(data.confidence)
      : 'Not available';
    const priorFunding = data.hasPriorFunding ? 'Yes' : 'No';
    const fundingRounds = Array.isArray(data.fundingRounds) ? data.fundingRounds : [];
    const peerDeals = Array.isArray(data.peerDeals) ? data.peerDeals : [];
    const fundingDetails = Array.isArray(data.fundingDetails) ? data.fundingDetails : [];

    const formatFundingAmount = (amount, currency = 'USD') => {
      if (amount === null || amount === undefined) return 'Undisclosed';
      if (typeof amount === 'number') {
        return `${Formatters.currency(amount)} ${currency !== 'USD' ? currency : ''}`.trim();
      }
      return sanitizeText(amount, 'Undisclosed');
    };

    const roundsHTML = fundingRounds.length
      ? `<ul>${fundingRounds.map(round => {
          const date = Formatters.date(round.date);
          const amount = sanitizeText(round.amount || 'Undisclosed', 'Undisclosed');
          const type = sanitizeText(round.type || 'Funding Round', 'Funding Round');
          const source = sanitizeText(round.source || 'Unknown Source', 'Unknown Source');
          const link = round.url
            ? `<a href="${round.url}" target="_blank" rel="noopener">Source</a>`
            : source;
          const description = sanitizeText(round.description || '', '');
          return `<li>
              <strong>${type}</strong> - ${amount}
              <div class="meta-line">
                <span>${date}</span>
                <span>${link}</span>
              </div>
              ${description ? `<p class="subtext">${description}</p>` : ''}
            </li>`;
        }).join('')}</ul>`
      : '<p class="empty-item">No venture funding rounds identified.</p>';

    const dealsHTML = peerDeals.length
      ? `<ul>${peerDeals.map(deal => {
          const company = sanitizeText(deal.company || 'Unknown Company', 'Unknown Company');
          const date = Formatters.date(deal.date);
          const series = sanitizeText(deal.series || 'N/A', 'N/A');
          const amount = formatFundingAmount(deal.amount, deal.currency);
          const investorList = Array.isArray(deal.investors)
            ? deal.investors.map(inv => sanitizeText(inv, '')).filter(Boolean)
            : [];
          const investors = investorList.length
            ? investorList.join(', ')
            : 'Investors undisclosed';
          const link = deal.url
            ? `<a href="${deal.url}" target="_blank" rel="noopener">Source</a>`
            : '';
          return `<li>
              <strong>${company}</strong> - ${series} round (${amount})
              <div class="meta-line">
                <span>${date}</span>
                ${link}
              </div>
              <p class="subtext">Investors: ${investors}</p>
            </li>`;
        }).join('')}</ul>`
      : '<p class="empty-item">No comparable market deals identified.</p>';

    const detailsHTML = fundingDetails.length
      ? `<ul>${fundingDetails.map(item => {
          const type = sanitizeText(item.type || 'Funding', 'Funding');
          const amount = sanitizeText(item.amount || 'Undisclosed', 'Undisclosed');
          const date = Formatters.date(item.date);
          const investorList = Array.isArray(item.investors)
            ? item.investors.map(inv => sanitizeText(inv, '')).filter(Boolean)
            : [];
          const investors = investorList.length
            ? investorList.join(', ')
            : 'Investors undisclosed';
          const reference = sanitizeText(item.reference || '', '');
          return `<li>
              <strong>${type}</strong> - ${amount}
              <div class="meta-line">
                <span>${date}</span>
              </div>
              <p class="subtext">Investors: ${investors}</p>
              ${reference ? `<p class="subtext">${reference}</p>` : ''}
            </li>`;
        }).join('')}</ul>`
      : '<p class="empty-item">No supporting deal documents provided.</p>';

    const summaryHTML = `
      <div class="evidence-summary">
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-label">Prior Funding</div>
            <div class="metric-value">${priorFunding}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Funding Rounds</div>
            <div class="metric-value">${fundingRounds.length}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Market Deals</div>
            <div class="metric-value">${data.totalPeerDeals ?? peerDeals.length}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Confidence</div>
            <div class="metric-value">${confidence}</div>
          </div>
        </div>

        <div class="content-section">
          <h4>AI Assessment Rationale</h4>
          <p>${sanitizeText(data.summary || 'No justification provided.', 'No justification provided.')}</p>
        </div>

      </div>
    `;

    const detailedHTML = `
      <div class="evidence-detailed">
        <div class="content-section">
          <h4>Venture Funding Rounds</h4>
          ${roundsHTML}
        </div>
        <div class="content-section">
          <h4>Comparable Market Deals</h4>
          ${dealsHTML}
        </div>
        <div class="content-section">
          <h4>Supporting Deal Evidence</h4>
          ${detailsHTML}
        </div>
      </div>
    `;

    const sourcesHTML = `
      <div class="evidence-sources">
        <div class="content-section">
          <h4>Primary Research Focus</h4>
          <ul>
            <li><strong>Topic:</strong> ${sanitizeText(data.researchTopic || 'Unknown', 'Unknown')}</li>
            <li><strong>Application:</strong> ${sanitizeText(data.applicationArea || 'Unknown', 'Unknown')}</li>
            <li><strong>Research Date:</strong> ${Formatters.date(data.searchDate)}</li>
            <li><strong>Assessment Date:</strong> ${Formatters.date(data.assessmentDate)}</li>
          </ul>
        </div>
        <div class="content-section">
          <h4>Source Links</h4>
          <ul>
            ${fundingRounds.map(round => round.url
              ? `<li><a href="${round.url}" target="_blank" rel="noopener">${sanitizeText(round.source || 'Funding Round Source', 'Funding Round Source')}</a></li>`
              : '').join('')}
            ${peerDeals.map(deal => deal.url
              ? `<li><a href="${deal.url}" target="_blank" rel="noopener">${sanitizeText(deal.company || 'Market Deal Source', 'Market Deal Source')}</a></li>`
              : '').join('')}
          </ul>
        </div>
      </div>
    `;

    container.innerHTML = summaryHTML;
    container.dataset.summary = summaryHTML;
    container.dataset.detailed = detailedHTML;
    container.dataset.sources = sourcesHTML;
  }

  /**
   * Load competitive data
   */
  loadCompetitiveData(data) {
    const elements = this.elements.competitive;
    
    // Set AI score
    if (elements.aiScore) {
      elements.aiScore.textContent = data.assessment.score;
    }
    
    // Set score badge
    if (elements.scoreBadge) {
      elements.scoreBadge.textContent = data.assessment.score;
      const scoreData = Formatters.scoreColor(data.assessment.score, 'competitive');
      elements.scoreBadge.style.background = scoreData.color;
    }
    
    // Set initial user score to match AI
    if (elements.slider) {
      elements.slider.value = data.assessment.score;
      this.handleSliderChange('competitive', data.assessment.score);
    }
    
    // Display evidence
    this.displayCompetitiveEvidence(data.formatted);
  }

  /**
   * Load market data
   */
  loadMarketData(data) {
      const elements = this.elements.market;
      
      // Set AI score
      if (elements.aiScore) {
        elements.aiScore.textContent = data.scoring.score;
      }
    
    // Set score badge
    if (elements.scoreBadge) {
      elements.scoreBadge.textContent = data.scoring.score;
      const scoreData = Formatters.scoreColor(data.scoring.score, 'market');
      elements.scoreBadge.style.background = scoreData.color;
    }
    
    // Set initial user score to match AI
    if (elements.slider) {
      elements.slider.value = data.scoring.score;
      this.handleSliderChange('market', data.scoring.score);
    }
    
      // Display evidence
      this.displayMarketEvidence(data.formatted);
    }

  /**
   * Load IP risk data
   */
  loadIpRiskData(data) {
    const elements = this.elements.iprisk;
    if (!elements) return;

    const aiScore = Number.isInteger(data.score) ? data.score : null;

    if (elements.aiScore) {
      elements.aiScore.textContent = aiScore !== null ? aiScore : '-';
    }

    if (elements.scoreBadge) {
      if (aiScore !== null) {
        elements.scoreBadge.textContent = aiScore;
        const scoreData = Formatters.scoreColor(aiScore, 'iprisk');
        elements.scoreBadge.style.background = scoreData.color;
      } else {
        elements.scoreBadge.textContent = '-';
        elements.scoreBadge.style.background = 'var(--gray-300)';
      }
    }

    const initialScore = aiScore !== null ? aiScore : 5;
    if (elements.slider) {
      elements.slider.value = initialScore;
      this.handleSliderChange('iprisk', initialScore);
    } else {
      this.userScores.iprisk.score = initialScore;
    }

    this.displayIpRiskEvidence(data.formatted || {});
  }

  /**
   * Display IP risk evidence
   */
  displayIpRiskEvidence(data) {
    const container = this.elements.iprisk.evidence;
    if (!container) return;

    const riskLevel = data.riskLevel ? Formatters.titleCase(data.riskLevel) : 'Unknown';
    const dataConfidence = (typeof data.dataConfidence === 'number' && !isNaN(data.dataConfidence))
      ? Formatters.confidence(data.dataConfidence)
      : 'Not available';
    const companyDescription = data.companyIP?.description
      ? Formatters.escapeHTML(data.companyIP.description)
      : 'No company IP summary available.';
    const challengesList = Formatters.listToHTML(data.challenges || [], 5);
    const uniqueFeaturesList = Formatters.listToHTML(data.uniqueFeatures || [], 5);
    const crowdedFeaturesList = Formatters.listToHTML(data.crowdedFeatures || [], 5);

    const topOwnersHTML = Array.isArray(data.topOwners) && data.topOwners.length > 0
      ? `<ul>${data.topOwners.map(owner => `
            <li>
              <strong>${Formatters.escapeHTML(owner.assignee || 'Unknown')}</strong>
              <span class="owner-count">(${owner.patentCount ?? 0})</span>
            </li>
          `).join('')}</ul>`
      : '<p class="empty-item">No major patent holders identified.</p>';

    const formatPatentList = (patents) => {
      if (!Array.isArray(patents) || patents.length === 0) {
        return '<p class="empty-item">No patents listed.</p>';
      }

      return `<ul>${patents.map(patent => {
        const id = Formatters.escapeHTML(patent.patentID || 'Unknown ID');
        const title = Formatters.escapeHTML(patent.title || 'Untitled Patent');
        const assignee = Formatters.escapeHTML(patent.assignee || 'Unknown Assignee');
        const year = patent.year ? ` (${patent.year})` : '';
        const link = patent.link
          ? `<a href="${patent.link}" target="_blank" rel="noopener">${id}</a>`
          : id;
        return `<li>${link}${year} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${title} <em>${assignee}</em></li>`;
      }).join('')}</ul>`;
    };

    const awardedHTML = formatPatentList(data.awardedPatents);
    const pendingHTML = formatPatentList(data.pendingPatents);

    const relevantPatentsHTML = Array.isArray(data.relevantPatents) && data.relevantPatents.length > 0
      ? `<ul>${data.relevantPatents.map(patent => {
          const id = Formatters.escapeHTML(patent.id || 'Unknown ID');
          const title = Formatters.escapeHTML(patent.title || 'Untitled Patent');
          const assignee = Formatters.escapeHTML(patent.assignee || 'Unknown Assignee');
          const link = patent.link
            ? `<a href="${patent.link}" target="_blank" rel="noopener">${id}</a>`
            : id;
          return `<li>${link} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ${title} <em>${assignee}</em></li>`;
        }).join('')}</ul>`
      : '<p class="empty-item">No reference patents identified.</p>';

    const summaryHTML = `
      <div class="evidence-summary">
        <div class="metrics-row">
          <div class="metric-card">
            <div class="metric-label">Risk Level</div>
            <div class="metric-value">${riskLevel}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">AI Score</div>
            <div class="metric-value">${this.data.iprisk?.score ?? '-'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Data Confidence</div>
            <div class="metric-value">${dataConfidence}</div>
          </div>
        </div>

        <div class="content-section">
          <h4>Company IP Position</h4>
          <p>${companyDescription}</p>
        </div>

        <div class="content-section">
          <h4>Unique Protectable Features</h4>
          <ul>${uniqueFeaturesList}</ul>
        </div>

        <div class="content-section risk-section">
          <h4>Key IP Challenges</h4>
          <ul>${challengesList}</ul>
        </div>
      </div>
    `;

    const detailedHTML = `
      <div class="evidence-detailed">
        <div class="content-section">
          <h4>Crowded Feature Areas</h4>
          <ul>${crowdedFeaturesList}</ul>
        </div>

        <div class="content-section">
          <h4>Top Patent Owners</h4>
          ${topOwnersHTML}
        </div>

        <div class="content-section">
          <h4>Granted Patents (Landscape)</h4>
          ${awardedHTML}
        </div>

        <div class="content-section">
          <h4>Pending Applications</h4>
          ${pendingHTML}
        </div>

        <div class="content-section">
          <h4>Risk Analysis Notes</h4>
          <p>${Formatters.escapeHTML(data.riskAnalysis || 'No additional analysis provided.')}</p>
        </div>
      </div>
    `;

    const sourcesHTML = `
      <div class="evidence-sources">
        <h4>Reference Patents</h4>
        ${relevantPatentsHTML}
      </div>
    `;

    container.innerHTML = summaryHTML;
    container.dataset.summary = summaryHTML;
    container.dataset.detailed = detailedHTML;
    container.dataset.sources = sourcesHTML;
  }

  /**
   * Load company data
   */
  loadCompanyData(company) {
    if (!this.elements.summary.companySummary) return;
    
    const overview = company.company_overview || {};
    const tech = company.technology || {};
    const market = company.market_context || {};
    
    this.elements.summary.companySummary.innerHTML = `
      <h3>${Formatters.escapeHTML(overview.name || 'Unknown Company')}</h3>
      <div class="company-details">
        <div class="detail-item">
          <span class="detail-label">Website:</span>
          <span class="detail-value">${Formatters.displayUrl(overview.website)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Founded:</span>
          <span class="detail-value">${overview.founded_year || '-'}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Stage:</span>
          <span class="detail-value">${Formatters.companyStage(overview.company_stage)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Industry:</span>
          <span class="detail-value">${Formatters.escapeHTML(market.industry || '-')}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Core Technology:</span>
          <span class="detail-value">${Formatters.truncate(tech.core_technology, 100)}</span>
        </div>
      </div>
    `;
  }

  /**
   * Display competitive evidence
   */
  displayCompetitiveEvidence(data) {
	  const container = this.elements.competitive.evidence;
	  if (!container) return;
	  
	  const summaryHTML = `
		<div class="evidence-summary">
		  <div class="metrics-row">
			<div class="metric-card">
			  <div class="metric-label">Total Competitors</div>
			  <div class="metric-value">${data.totalCompetitors || 0}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">Market Leaders</div>
			  <div class="metric-value">${data.marketLeaders.length || 0}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">Intensity</div>
			  <div class="metric-value">${Formatters.competitiveIntensity(data.competitiveIntensity)}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">Confidence</div>
			  <div class="metric-value">${Formatters.confidence(data.confidence)}</div>
			</div>
		  </div>
		  
		  <div class="content-section">
			<h4>AI Assessment Rationale</h4>
			<p>${Formatters.escapeHTML(data.justification)}</p>
		  </div>
		  
		  <div class="content-section risk-section">
			<h4>Key Risks</h4>
			<ul>${Formatters.listToHTML(data.keyRisks, 5)}</ul>
		  </div>
		  
		  <div class="content-section opportunity-section">
			<h4>Opportunities</h4>
			<ul>${Formatters.listToHTML(data.opportunities, 5)}</ul>
		  </div>
		</div>
	  `;
	  
	  const detailedHTML = `
		<div class="evidence-detailed">
		  <div class="content-section">
			<h4>Competitor Breakdown</h4>
			<p>${Formatters.competitorBreakdown(data.competitorCount)}</p>
		  </div>
		  
		  <div class="content-section">
			<h4>All Competitors Identified (${data.competitors.length})</h4>
			<div class="competitor-list" id="competitorList">
			  ${this.renderAllCompetitors(data.competitors)}
			</div>
			${data.competitors.length > 5 ? '<button class="show-more-btn" onclick="window.assessmentView.toggleCompetitorList()">Show All Competitors</button>' : ''}
		  </div>
		  
		  <div class="content-section">
			<h4>Market Dynamics</h4>
			<ul>${Formatters.listToHTML(data.technologyTrends)}</ul>
		  </div>
		</div>
	  `;
	  
	  const sourcesHTML = `
		<div class="evidence-sources">
		  <div class="content-section">
			<h4>Data Sources</h4>
			${this.renderSources(data.sources || [], 'competitive')}
		  </div>
		  
		  <div class="content-section">
			<h4>Data Quality</h4>
			<div class="metrics-row">
			  <div class="metric-card">
				<div class="metric-label">Confidence Level</div>
				<div class="metric-value">${Formatters.confidence(data.confidence)}</div>
			  </div>
			  <div class="metric-card">
				<div class="metric-label">Data Date</div>
				<div class="metric-value">${Formatters.date(data.dataDate)}</div>
			  </div>
			</div>
		  </div>
		</div>
	  `;
	  
	  container.innerHTML = summaryHTML;
	  container.dataset.summary = summaryHTML;
	  container.dataset.detailed = detailedHTML;
	  container.dataset.sources = sourcesHTML;
	}

  /**
   * Display market evidence
   */
  displayMarketEvidence(data) {
	  const container = this.elements.market.evidence;
	  if (!container) return;
	  
	  const summaryHTML = `
		<div class="evidence-summary">
		  <div class="metrics-row">
			<div class="metric-card">
			  <div class="metric-label">TAM</div>
			  <div class="metric-value">${Formatters.currency(data.primaryMarket.tam)}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">CAGR</div>
			  <div class="metric-value">${Formatters.percentage(data.primaryMarket.cagr)}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">Category</div>
			  <div class="metric-value">${Formatters.tamCategory(data.tamCategory)}</div>
			</div>
			<div class="metric-card">
			  <div class="metric-label">Confidence</div>
			  <div class="metric-value">${Formatters.confidence(data.confidence)}</div>
			</div>
		  </div>
		  
		  <div class="content-section">
			<h4>AI Assessment Rationale</h4>
			<p>${Formatters.escapeHTML(data.justification)}</p>
		  </div>
		  
		  <div class="content-section opportunity-section">
			<h4>Strengths</h4>
			<ul>${Formatters.listToHTML(data.strengths, 5)}</ul>
		  </div>
		  
		  <div class="content-section risk-section">
			<h4>Limitations</h4>
			<ul>${Formatters.listToHTML(data.limitations, 5)}</ul>
		  </div>
		</div>
	  `;
	  
	  const detailedHTML = `
		<div class="evidence-detailed">
		  <div class="content-section">
			<h4>Executive Summary</h4>
			<p>${Formatters.escapeHTML(data.executiveSummary)}</p>
		  </div>
		  
		  <div class="content-section">
			<h4>All Market Segments Analyzed</h4>
			${this.renderAllMarkets(data.markets)}
		  </div>
		  
		  <div class="content-section">
			<h4>Market Opportunities</h4>
			<ul>${Formatters.listToHTML(data.opportunities)}</ul>
		  </div>
		  
		  <div class="content-section">
			<h4>Market Trends</h4>
			<ul>${Formatters.listToHTML(data.trends)}</ul>
		  </div>
		  
		  <div class="content-section">
			<h4>Barriers to Entry</h4>
			<ul>${Formatters.listToHTML(data.barriers)}</ul>
		  </div>
		</div>
	  `;
	  
	  const sourcesHTML = `
		<div class="evidence-sources">
		  <div class="content-section">
			<h4>TAM/CAGR Data Sources</h4>
			${this.renderMarketSources(data.markets)}
		  </div>
		  
		  <div class="content-section">
			<h4>Data Quality</h4>
			<div class="metrics-row">
			  <div class="metric-card">
				<div class="metric-label">Overall Confidence</div>
				<div class="metric-value">${Formatters.confidence(data.confidence)}</div>
			  </div>
			  <div class="metric-card">
				<div class="metric-label">Data Recency</div>
				<div class="metric-value">${data.dataRecency || 'Unknown'}</div>
			  </div>
			</div>
			${data.dataConcerns && data.dataConcerns.length > 0 ? `
			  <div class="data-concerns">
				<h5>Data Concerns:</h5>
				<ul>${Formatters.listToHTML(data.dataConcerns)}</ul>
			  </div>
			` : ''}
		  </div>
		</div>
	  `;
	  
	  container.innerHTML = summaryHTML;
	  container.dataset.summary = summaryHTML;
	  container.dataset.detailed = detailedHTML;
	  container.dataset.sources = sourcesHTML;
	}
	renderAllMarkets(markets) {
	  if (!markets || markets.length === 0) {
		return '<p>No additional market data available</p>';
	  }
	  
	  return `
		<table class="markets-table">
		  <thead>
			<tr>
			  <th>Rank</th>
			  <th>Market Description</th>
			  <th>TAM</th>
			  <th>CAGR</th>
			  <th>Confidence</th>
			</tr>
		  </thead>
		  <tbody>
			${markets.map(market => `
			  <tr>
				<td>${market.rank || '-'}</td>
				<td>${Formatters.escapeHTML(market.description)}</td>
				<td>${Formatters.currency(market.tam)}</td>
				<td>${Formatters.percentage(market.cagr)}</td>
				<td>${Formatters.confidence(market.confidence)}</td>
			  </tr>
			`).join('')}
		  </tbody>
		</table>
	  `;
	}

	renderMarketSources(markets) {
	  if (!markets || markets.length === 0) {
		return '<p>No source information available</p>';
	  }
	  
	  return markets.filter(m => m.source).map(market => `
		<div class="source-item">
		  <div>
			<strong>${Formatters.escapeHTML(market.description)}</strong><br>
			${market.source ? `<a href="${market.source}" target="_blank" rel="noopener">${market.source}</a>` : 'No source URL'}
			<br>
			<span class="source-confidence">Confidence: ${Formatters.confidence(market.confidence)}</span>
		  </div>
		</div>
	  `).join('');
	}

  /**
   * Render competitors list
   */
  renderCompetitors(competitors) {
    if (!competitors || competitors.length === 0) {
      return '<p>No detailed competitor information available</p>';
    }
    
    return competitors.slice(0, 5).map(comp => `
      <div class="competitor-card">
        <div class="competitor-header">
          <h5>${Formatters.escapeHTML(comp.name)}</h5>
          <span class="size-badge">${Formatters.companySize(comp.size)}</span>
        </div>
        <p>${Formatters.escapeHTML(comp.description)}</p>
      </div>
    `).join('');
  }
  renderAllCompetitors(competitors) {
	  if (!competitors || competitors.length === 0) {
		return '<p>No detailed competitor information available</p>';
	  }
	  
	  return competitors.map((comp, index) => `
		<div class="competitor-card" ${index >= 5 ? 'style="display:none;" data-hidden="true"' : ''}>
		  <div class="competitor-header">
			<h5>${Formatters.escapeHTML(comp.name)}</h5>
			<span class="size-badge">${Formatters.companySize(comp.size)}</span>
		  </div>
		  <p>${Formatters.escapeHTML(comp.description || comp.product || 'No description available')}</p>
		  ${comp.strengths && comp.strengths.length > 0 ? `
			<div class="competitor-strengths">
			  <strong>Strengths:</strong> ${comp.strengths.slice(0, 3).join(', ')}
			</div>
		  ` : ''}
		</div>
	  `).join('');
	}

	toggleCompetitorList() {
	  const list = document.getElementById('competitorList');
	  if (!list) return;
	  
	  const hiddenCards = list.querySelectorAll('[data-hidden="true"]');
	  const button = list.parentElement.querySelector('.show-more-btn');
	  
	  if (!button || hiddenCards.length === 0) return;
	  
	  // Check current state by looking at the first hidden card
	  const isHidden = hiddenCards[0].style.display === 'none';
	  
	  if (isHidden) {
		// Show all competitors
		hiddenCards.forEach(card => {
		  card.style.display = 'block';
		});
		button.textContent = 'Show Less';
		list.classList.add('expanded');
	  } else {
		// Hide extra competitors
		hiddenCards.forEach(card => {
		  card.style.display = 'none';
		});
		button.textContent = 'Show All Competitors';
		list.classList.remove('expanded');
	  }
	}

	renderSources(sources, type) {
	  if (!sources || sources.length === 0) {
		return '<p>No source information available</p>';
	  }
	  
	  return sources.map(source => {
		const isUrl = source.startsWith('http');
		return `
		  <div class="source-item">
			<div class="source-content">
			  ${isUrl ? `<a href="${source}" target="_blank" rel="noopener">${source}</a>` : Formatters.escapeHTML(source)}
			</div>
		  </div>
		`;
	  }).join('');
	}

  /**
   * Switch tab
   */
  /**
 * Switch tab
 */
	switchTab(tab) {
	  this.currentTab = tab;
	  
	  // Update tab buttons
	  Object.entries(this.elements.tabs).forEach(([key, element]) => {
		if (element) {
		  element.classList.toggle('active', key === tab);
		}
	  });
	  
	  // Update tab contents
	  Object.entries(this.elements.tabContents).forEach(([key, element]) => {
		if (element) {
		  element.style.display = key === tab ? 'block' : 'none';
		}
	  });
	  
	  // Also check for overview tab content (if not in tabContents)
	  const overviewContent = document.getElementById('overviewTab');
	  if (overviewContent) {
		overviewContent.style.display = tab === 'overview' ? 'block' : 'none';
	  }
	  
	  // Update summary if switching to it
	  if (tab === 'summary') {
		this.updateSummary();
	  }
	}

  /**
   * Switch view (summary/detailed)
   */
  switchView(tab, view) {
	  this.currentView[tab] = view;
	  
	  // Update view buttons
	  document.querySelectorAll(`#${tab}Tab .view-btn`).forEach(btn => {
		btn.classList.toggle('active', btn.dataset.view === view);
	  });
	  
	  // Update content
    const tabElements = this.elements[tab];
    if (!tabElements || !tabElements.evidence) {
      return;
    }

	  const container = tabElements.evidence;
	  if (container) {
		if (view === 'summary' && container.dataset.summary) {
		  container.innerHTML = container.dataset.summary;
		} else if (view === 'detailed' && container.dataset.detailed) {
		  container.innerHTML = container.dataset.detailed;
		} else if (view === 'sources' && container.dataset.sources) {
		  container.innerHTML = container.dataset.sources;
		}
	  }
	}

  /**
   * Handle slider change
   */
  handleSliderChange(type, score) {
    this.userScores[type].score = score;
    
    // Update display
    if (this.elements[type].userScore) {
      this.elements[type].userScore.textContent = score;
      const scoreData = Formatters.scoreColor(score, type);
      this.elements[type].userScore.style.color = scoreData.color;
    }
    
    // Update rubric
    this.updateRubricDisplay(type, score);
    
    // Check deviation
    this.checkDeviation(type, score);
  }

  /**
   * Update rubric display
   */
  updateRubricDisplay(type, score) {
    const rubricElement = this.elements[type].rubric;
    if (!rubricElement) return;
    
      let rubricText;
    if (type === 'competitive') {
      rubricText = CompetitiveAPI.getRubricDescription(score);
    } else if (type === 'market') {
      rubricText = MarketAPI.getRubricDescription(score);
    } else if (type === 'iprisk') {
      rubricText = IPRiskAPI.getRubricDescription(score);
    } else if (type === 'team') {
      rubricText = TeamAPI.getRubricDescription(score);
    } else if (type === 'funding') {
      rubricText = FundingAPI.getRubricDescription(score);
    }
      
      const scoreData = Formatters.scoreColor(
        score,
        type === 'competitive' ? 'competitive' : type
      );
    
    rubricElement.innerHTML = `
      <strong>Score ${score}: ${scoreData.label}</strong><br>
      ${Formatters.escapeHTML(rubricText)}
    `;
    
    rubricElement.style.borderLeftColor = scoreData.color;
  }

  /**
   * Check score deviation
   */
  checkDeviation(type, userScore) {
      let aiScore;
    if (type === 'competitive') {
      aiScore = this.data.competitive?.assessment?.score;
    } else if (type === 'market') {
      aiScore = this.data.market?.scoring?.score;
    } else if (type === 'iprisk') {
      aiScore = this.data.iprisk?.score;
    } else if (type === 'team') {
      aiScore = this.data.team?.score;
    } else if (type === 'funding') {
      aiScore = this.data.funding?.score;
    }
      
      if (aiScore === undefined || aiScore === null) return;
    
    const deviation = Validators.checkScoreDeviation(aiScore, userScore);
    const warning = this.elements[type].warning;
    
    if (warning) {
      if (deviation.hasDeviation) {
        warning.textContent = deviation.message;
        warning.style.display = 'block';
      } else {
        warning.style.display = 'none';
      }
    }
  }

  /**
   * Submit assessment
   */
  submitAssessment(type) {
    const justification = this.elements[type].justification.value;
    const score = this.userScores[type].score;
    
    // Validate
    const validation = Validators.validateAssessment(score, justification);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    // Save
    this.userScores[type].justification = justification;
    this.userScores[type].submitted = true;
    
    // Update UI
    const submitBtn = this.elements[type].submitBtn;
    if (submitBtn) {
      submitBtn.textContent = 'Submitted';
      submitBtn.disabled = true;
    }
    
    // Disable inputs
      if (this.elements[type].slider) {
        this.elements[type].slider.disabled = true;
      }
      if (this.elements[type].justification) {
        this.elements[type].justification.disabled = true;
      }
      
      // Update badge
      const badge = this.elements[type].scoreBadge;
      if (badge) {
        badge.textContent = `${score} (User)`;
      }
      
      // Check if all assessments complete
      if (this.userScores.team.submitted
        && this.userScores.funding.submitted
        && this.userScores.competitive.submitted 
        && this.userScores.market.submitted
        && this.userScores.iprisk.submitted) {
        this.onComplete();
      }
    }

  /**
   * Update summary
   */
  updateSummary() {
    const summary = this.elements.summary;

    // Team scores
    if (summary.teamAi) {
      summary.teamAi.textContent = this.data.team?.score ?? '-';
    }
    if (summary.teamUser) {
      summary.teamUser.textContent = this.userScores.team.submitted
        ? this.userScores.team.score
        : '-';
    }
    if (summary.teamJustification) {
      summary.teamJustification.textContent = this.userScores.team.justification || 'Not submitted';
    }

    // Funding scores
    if (summary.fundingAi) {
      summary.fundingAi.textContent = this.data.funding?.score ?? '-';
    }
    if (summary.fundingUser) {
      summary.fundingUser.textContent = this.userScores.funding.submitted
        ? this.userScores.funding.score
        : '-';
    }
    if (summary.fundingJustification) {
      summary.fundingJustification.textContent = this.userScores.funding.justification || 'Not submitted';
    }
    
    // Competitive scores
    if (summary.competitiveAi) {
      summary.competitiveAi.textContent = this.data.competitive?.assessment?.score || '-';
    }
    if (summary.competitiveUser) {
      summary.competitiveUser.textContent = this.userScores.competitive.submitted 
        ? this.userScores.competitive.score 
        : '-';
    }
    if (summary.competitiveJustification) {
      summary.competitiveJustification.textContent = this.userScores.competitive.justification || 'Not submitted';
    }
    
    // Market scores
      if (summary.marketAi) {
        summary.marketAi.textContent = this.data.market?.scoring?.score || '-';
      }
      if (summary.marketUser) {
        summary.marketUser.textContent = this.userScores.market.submitted 
          ? this.userScores.market.score 
          : '-';
      }
      if (summary.marketJustification) {
        summary.marketJustification.textContent = this.userScores.market.justification || 'Not submitted';
      }
      
      // IP Risk scores
      if (summary.ipRiskAi) {
        summary.ipRiskAi.textContent = this.data.iprisk?.score ?? '-';
      }
      if (summary.ipRiskUser) {
        summary.ipRiskUser.textContent = this.userScores.iprisk.submitted
          ? this.userScores.iprisk.score
          : '-';
      }
      if (summary.ipRiskJustification) {
        summary.ipRiskJustification.textContent = this.userScores.iprisk.justification || 'Not submitted';
      }
    }

  /**
   * Called when both assessments complete
   */
  onComplete() {
    // Show export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.style.display = 'inline-block';
    }
  }

  /**
   * Get assessment data for export
   */
  getExportData() {
    return {
      company: this.data.company,
      team: {
        ...(this.data.team || {}),
        userScore: this.userScores.team.score,
        userJustification: this.userScores.team.justification
      },
      funding: {
        ...(this.data.funding || {}),
        userScore: this.userScores.funding.score,
        userJustification: this.userScores.funding.justification
      },
      competitive: {
        ...(this.data.competitive || {}),
        userScore: this.userScores.competitive.score,
        userJustification: this.userScores.competitive.justification
      },
        market: {
          ...(this.data.market || {}),
          userScore: this.userScores.market.score,
          userJustification: this.userScores.market.justification
        },
        iprisk: {
          ...(this.data.iprisk || {}),
          userScore: this.userScores.iprisk.score,
          userJustification: this.userScores.iprisk.justification
        }
      };
    }
  displayCompanyOverview(company) {
  // Update persistent header
	const headerBar = document.getElementById('companyHeaderBar');
	if (headerBar) {
	  headerBar.classList.add('active');
	  
	  const overview = company.company_overview || {};
	  const market = company.market_context || {};
	  const tech = company.technology || {};
	  
	  document.getElementById('headerCompanyName').textContent = overview.name || 'Unknown Company';
	  
	  // Use a shorter tagline - either mission or tech category
	  const tagline = tech.technology_category || 
					   (overview.mission_statement ? Formatters.truncate(overview.mission_statement, 50) : '');
	  document.getElementById('headerTagline').textContent = tagline;
	  
	  document.getElementById('headerIndustry').textContent = market.industry || 'Technology';
	  document.getElementById('headerStage').textContent = Formatters.companyStage(overview.company_stage) || 'Early Stage';
	}
  
  // Basic Information
  const basicInfo = document.getElementById('overviewBasicInfo');
  if (basicInfo) {
    const overview = company.company_overview || {};
    basicInfo.innerHTML = `
      <div class="overview-field">
        <div class="overview-field-label">Company Name</div>
        <div class="overview-field-value">${Formatters.escapeHTML(overview.name || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Website</div>
        <div class="overview-field-value">${Formatters.displayUrl(overview.website) || '-'}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Founded</div>
        <div class="overview-field-value">${overview.founded_year || '-'}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Stage</div>
        <div class="overview-field-value">${Formatters.companyStage(overview.company_stage) || '-'}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Employees</div>
        <div class="overview-field-value">${Formatters.employeeCount(overview.employee_count) || '-'}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Description</div>
        <div class="overview-field-value">${Formatters.escapeHTML(overview.company_description || overview.mission_statement || '-')}</div>
      </div>
    `;
  }
  
  // Technology
  const techInfo = document.getElementById('overviewTechnology');
  if (techInfo) {
    const tech = company.technology || {};
    techInfo.innerHTML = `
      <div class="overview-field">
        <div class="overview-field-label">Core Technology</div>
        <div class="overview-field-value">${Formatters.escapeHTML(tech.core_technology || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Category</div>
        <div class="overview-field-value">${Formatters.escapeHTML(tech.technology_category || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Technical Approach</div>
        <div class="overview-field-value">${Formatters.escapeHTML(tech.technical_approach || '-')}</div>
      </div>
      ${tech.key_innovations && tech.key_innovations.length > 0 ? `
        <div class="overview-field">
          <div class="overview-field-label">Key Innovations</div>
          <div class="overview-field-value">
            <ul>${Formatters.listToHTML(tech.key_innovations)}</ul>
          </div>
        </div>
      ` : ''}
    `;
  }
  
  // Products
	const productsInfo = document.getElementById('overviewProducts');
	if (productsInfo) {
	  const products = company.products_and_applications || {};
	  productsInfo.innerHTML = `
		<div class="overview-field">
		  <div class="overview-field-label">Primary Application</div>
		  <div class="overview-field-value">${Formatters.escapeHTML(products.primary_application || '-')}</div>
		</div>
		${products.products && products.products.length > 0 ? `
		  <div class="overview-field">
			<div class="overview-field-label">Products</div>
			<div class="overview-field-value">
			  <ul>${products.products.map(product => {
				// Handle both string and object formats
				if (typeof product === 'string') {
				  return `<li>${Formatters.escapeHTML(product)}</li>`;
				} else if (product && typeof product === 'object') {
				  // If it's an object, try to get name, title, or convert to string
				  const productName = product.name || product.title || product.product_name || JSON.stringify(product);
				  return `<li>${Formatters.escapeHTML(productName)}</li>`;
				}
				return '';
			  }).join('')}</ul>
			</div>
		  </div>
		` : ''}
		${products.use_cases && products.use_cases.length > 0 ? `
		  <div class="overview-field">
			<div class="overview-field-label">Use Cases</div>
			<div class="overview-field-value">
			  <ul>${Formatters.listToHTML(products.use_cases, 3)}</ul>
			</div>
		  </div>
		` : ''}
	  `;
	}
  
  // Market Context
  const marketInfo = document.getElementById('overviewMarket');
  if (marketInfo) {
    const market = company.market_context || {};
    marketInfo.innerHTML = `
      <div class="overview-field">
        <div class="overview-field-label">Industry</div>
        <div class="overview-field-value">${Formatters.escapeHTML(market.industry || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Problem Addressed</div>
        <div class="overview-field-value">${Formatters.escapeHTML(market.problem_addressed || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Value Proposition</div>
        <div class="overview-field-value">${Formatters.escapeHTML(market.value_proposition || '-')}</div>
      </div>
      <div class="overview-field">
        <div class="overview-field-label">Business Model</div>
        <div class="overview-field-value">${Formatters.escapeHTML(market.business_model || '-')}</div>
      </div>
    `;
  }
}
}

// Make available globally
window.AssessmentView = AssessmentView;
