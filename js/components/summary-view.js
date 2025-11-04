// js/components/summary-view.js - Summary display component

class SummaryView {
  constructor() {
    this.elements = {};
  }

  /**
   * Initialize summary view
   */
  init() {
    this.cacheElements();
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      companySummary: document.getElementById('companySummary'),
      competitiveAi: document.getElementById('summaryCompetitiveAi'),
      competitiveUser: document.getElementById('summaryCompetitiveUser'),
      competitiveJustification: document.getElementById('competitiveJustificationSummary'),
      teamAi: document.getElementById('summaryTeamAi'),
      teamUser: document.getElementById('summaryTeamUser'),
      teamJustification: document.getElementById('teamJustificationSummary'),
      fundingAi: document.getElementById('summaryFundingAi'),
      fundingUser: document.getElementById('summaryFundingUser'),
      fundingJustification: document.getElementById('fundingJustificationSummary'),
      marketAi: document.getElementById('summaryMarketAi'),
      marketUser: document.getElementById('summaryMarketUser'),
      marketJustification: document.getElementById('marketJustificationSummary'),
      ipRiskAi: document.getElementById('summaryIpRiskAi'),
      ipRiskUser: document.getElementById('summaryIpRiskUser'),
      ipRiskJustification: document.getElementById('ipRiskJustificationSummary'),
      teamMembers: document.getElementById('summaryTeamMembers')
    };
  }

  /**
   * Update summary with complete data
   */
  update(data) {
    this.displayCompanySummary(data.company);
    this.displayAssessmentSummary(data);
  }

  /**
   * Display company summary
   */
  displayCompanySummary(company) {
    if (!company || !this.elements.companySummary) return;

    const overview = company.company_overview || {};
    const tech = company.technology || {};
    const products = company.products_and_applications || {};
    const market = company.market_context || {};
    const funding = company.funding_and_investors || {};
    const team = company.team || {};

    // Build summary HTML
    let html = `
      <div class="company-overview">
        <h3>${Formatters.escapeHTML(overview.name || 'Company')}</h3>
        
        <div class="summary-grid">
          <div class="summary-section">
            <h4>Overview</h4>
            <div class="summary-items">
              <div class="summary-item">
                <span class="label">Website:</span>
                <span class="value">${Formatters.displayUrl(overview.website) || '-'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Founded:</span>
                <span class="value">${overview.founded_year || '-'}</span>
              </div>
              <div class="summary-item">
                <span class="label">Stage:</span>
                <span class="value">${Formatters.companyStage(overview.company_stage)}</span>
              </div>
              <div class="summary-item">
                <span class="label">Employees:</span>
                <span class="value">${Formatters.employeeCount(overview.employee_count)}</span>
              </div>
              <div class="summary-item">
                <span class="label">Location:</span>
                <span class="value">${Formatters.escapeHTML(overview.headquarters || '-')}</span>
              </div>
            </div>
          </div>
          
          <div class="summary-section">
            <h4>Technology</h4>
            <div class="summary-items">
              <div class="summary-item">
                <span class="label">Category:</span>
                <span class="value">${Formatters.escapeHTML(tech.technology_category || '-')}</span>
              </div>
              <div class="summary-item full-width">
                <span class="label">Core Technology:</span>
                <span class="value">${Formatters.truncate(tech.core_technology, 150) || '-'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="summary-grid">
          <div class="summary-section">
            <h4>Market</h4>
            <div class="summary-items">
              <div class="summary-item">
                <span class="label">Industry:</span>
                <span class="value">${Formatters.escapeHTML(market.industry || '-')}</span>
              </div>
              <div class="summary-item full-width">
                <span class="label">Value Proposition:</span>
                <span class="value">${Formatters.truncate(market.value_proposition, 150) || '-'}</span>
              </div>
            </div>
          </div>
          
          <div class="summary-section">
            <h4>Funding</h4>
            <div class="summary-items">
              <div class="summary-item">
                <span class="label">Total Raised:</span>
                <span class="value">${this.formatFunding(funding.total_funding)}</span>
              </div>
              <div class="summary-item">
                <span class="label">Rounds:</span>
                <span class="value">${(funding.funding_rounds || []).length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.elements.companySummary.innerHTML = html;
    this.elements.companySummary.style.display = 'block';
  }

  /**
   * Display assessment summary
   */
  displayAssessmentSummary(data) {
    // Team scores
    if (this.elements.teamAi && data.team) {
      this.elements.teamAi.textContent = data.team.score ?? '-';
      const scoreData = Formatters.scoreColor(data.team.score, 'team');
      this.elements.teamAi.style.color = scoreData.color;
    }

    if (this.elements.teamUser && data.team?.userScore) {
      this.elements.teamUser.textContent = data.team.userScore;
      const scoreData = Formatters.scoreColor(data.team.userScore, 'team');
      this.elements.teamUser.style.color = scoreData.color;
    }

    if (this.elements.teamJustification && data.team?.userJustification) {
      this.elements.teamJustification.textContent = data.team.userJustification;
    }

    this.displayTeamMembers(data.team);

    // Funding scores
    if (this.elements.fundingAi && data.funding) {
      this.elements.fundingAi.textContent = data.funding.score ?? '-';
      const scoreData = Formatters.scoreColor(data.funding.score, 'funding');
      this.elements.fundingAi.style.color = scoreData.color;
    }

    if (this.elements.fundingUser && data.funding?.userScore !== undefined) {
      this.elements.fundingUser.textContent = data.funding.userScore;
      const scoreData = Formatters.scoreColor(data.funding.userScore, 'funding');
      this.elements.fundingUser.style.color = scoreData.color;
    }

    if (this.elements.fundingJustification && data.funding?.userJustification) {
      this.elements.fundingJustification.textContent = data.funding.userJustification;
    }

    // Competitive scores
    if (this.elements.competitiveAi && data.competitive) {
      this.elements.competitiveAi.textContent = data.competitive.assessment?.score || '-';
      const scoreData = Formatters.scoreColor(data.competitive.assessment?.score, 'competitive');
      this.elements.competitiveAi.style.color = scoreData.color;
    }

    if (this.elements.competitiveUser && data.competitive?.userScore) {
      this.elements.competitiveUser.textContent = data.competitive.userScore;
      const scoreData = Formatters.scoreColor(data.competitive.userScore, 'competitive');
      this.elements.competitiveUser.style.color = scoreData.color;
    }

    if (this.elements.competitiveJustification && data.competitive?.userJustification) {
      this.elements.competitiveJustification.textContent = data.competitive.userJustification;
    }

    // Market scores
    if (this.elements.marketAi && data.market) {
      this.elements.marketAi.textContent = data.market.scoring?.score || '-';
      const scoreData = Formatters.scoreColor(data.market.scoring?.score, 'market');
      this.elements.marketAi.style.color = scoreData.color;
    }

    if (this.elements.marketUser && data.market?.userScore) {
      this.elements.marketUser.textContent = data.market.userScore;
      const scoreData = Formatters.scoreColor(data.market.userScore, 'market');
      this.elements.marketUser.style.color = scoreData.color;
    }

    if (this.elements.marketJustification && data.market?.userJustification) {
      this.elements.marketJustification.textContent = data.market.userJustification;
    }

    // IP Risk scores
    if (this.elements.ipRiskAi && data.iprisk) {
      this.elements.ipRiskAi.textContent = data.iprisk.score ?? '-';
      const scoreData = Formatters.scoreColor(data.iprisk.score, 'iprisk');
      this.elements.ipRiskAi.style.color = scoreData.color;
    }

    if (this.elements.ipRiskUser && data.iprisk?.userScore) {
      this.elements.ipRiskUser.textContent = data.iprisk.userScore;
      const scoreData = Formatters.scoreColor(data.iprisk.userScore, 'iprisk');
      this.elements.ipRiskUser.style.color = scoreData.color;
    }

    if (this.elements.ipRiskJustification && data.iprisk?.userJustification) {
      this.elements.ipRiskJustification.textContent = data.iprisk.userJustification;
    }
  }

  /**
   * Display team members overview
   */
  displayTeamMembers(teamData) {
    const container = this.elements.teamMembers;
    if (!container) return;

    const members = teamData?.formatted?.members || teamData?.team?.team_members || [];

    const normalizeText = (value) => {
      if (value === null || value === undefined) return '';
      return String(value)
        .replace(/[–—−]/g, '-')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/[•·]/g, '-')
        .replace(/[^\x20-\x7E]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const sanitizeText = (value, fallback = '') => {
      const normalized = normalizeText(value);
      if (!normalized) return fallback;
      return Formatters.escapeHTML(normalized);
    };

    if (!Array.isArray(members) || members.length === 0) {
      container.innerHTML = '<p class="empty-item">No team members listed.</p>';
      return;
    }

    const summarizeMember = (member) => {
      const workHistory = Array.isArray(member?.work_history) ? member.work_history : [];
      if (workHistory.length > 0) {
        const entry = workHistory[0];
        if (typeof entry === 'string') {
          return sanitizeText(entry, '');
        }
        const role = sanitizeText(entry.position || entry.role || '', '');
        const company = sanitizeText(entry.company || entry.organization || '', '');
        const duration = sanitizeText(entry.duration || '', '');
        const parts = [role, company].filter(Boolean);
        const core = parts.join(' at ');
        return duration ? `${core}${core ? ' ' : ''}(${duration})` : core;
      }

      const education = Array.isArray(member?.education_history) ? member.education_history : [];
      if (education.length > 0) {
        const entry = education[0];
        if (typeof entry === 'string') {
          return sanitizeText(entry, '');
        }
        const degree = sanitizeText(entry.degree || '', '');
        const institution = sanitizeText(entry.institution || '', '');
        const year = sanitizeText(entry.year || '', '');
        const parts = [degree, institution].filter(Boolean);
        const core = parts.join(' - ');
        return year ? `${core}${core ? ' ' : ''}(${year})` : core;
      }

      const commercialization = Array.isArray(member?.commercialization_experience)
        ? member.commercialization_experience
        : [];
      if (commercialization.length > 0) {
        const entry = commercialization[0];
        if (typeof entry === 'string') {
          return sanitizeText(entry, '');
        }
        const text = entry.description || entry.summary || entry.title || entry.result || '';
        return sanitizeText(text, '');
      }

      return '';
    };

    const listItems = members.map(member => {
      const name = sanitizeText(member?.name || 'Unknown', 'Unknown');
      const role = sanitizeText(member?.role_at_venture || 'Role not specified', 'Role not specified');
      const summary = summarizeMember(member);
      return `
        <li>
          <strong>${name}</strong>
          <span class="team-role">${role}</span>
          ${summary ? `<p class="team-summary-text">${summary}</p>` : ''}
        </li>`;
    }).join('');

    container.innerHTML = `<ul class="team-summary-list">${listItems}</ul>`;
  }

  /**
   * Format funding amount
   */
  formatFunding(amount) {
    if (!amount) return '-';
    return Formatters.currency(amount);
  }

  /**
   * Clear summary
   */
  clear() {
    Object.values(this.elements).forEach(element => {
      if (element && element.textContent !== undefined) {
        element.textContent = '-';
      }
    });

    if (this.elements.companySummary) {
      this.elements.companySummary.style.display = 'none';
    }
    if (this.elements.teamMembers) {
      this.elements.teamMembers.innerHTML = '';
    }
  }
}

// Make available globally
window.SummaryView = SummaryView;
