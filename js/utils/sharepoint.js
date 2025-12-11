(function () {
  const config = window.SHAREPOINT_CONFIG || {};
  const defaultScopes = ['Files.ReadWrite.All', 'Sites.ReadWrite.All'];

  const hasMsal = () =>
    typeof window !== 'undefined' &&
    window.msal &&
    typeof window.msal.PublicClientApplication === 'function';

  const SharepointUploader = {
    msalApp: null,
    account: null,

    isConfigured() {
      return Boolean(
        config &&
          config.enabled &&
          config.clientId &&
          config.siteId &&
          config.driveId
      );
    },

    isEnabled() {
      return this.isConfigured() && hasMsal();
    },

    getScopes() {
      return Array.isArray(config.scopes) && config.scopes.length
        ? config.scopes
        : defaultScopes;
    },

    ensureMsalApp() {
      if (this.msalApp || !this.isEnabled()) {
        return;
      }

      this.msalApp = new window.msal.PublicClientApplication({
        auth: {
          clientId: config.clientId,
          authority: `https://login.microsoftonline.com/${
            config.tenantId || 'common'
          }`,
          redirectUri: window.location.origin
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false
        }
      });

      const accounts = this.msalApp.getAllAccounts();
      if (accounts.length) {
        this.account = accounts[0];
      }
    },

    async ensureAccount() {
      if (!this.isEnabled()) {
        throw new Error('SharePoint upload not configured');
      }

      this.ensureMsalApp();
      if (this.account) {
        return this.account;
      }

      const loginResponse = await this.msalApp.loginPopup({
        scopes: this.getScopes(),
        prompt: 'select_account'
      });
      this.account = loginResponse.account;
      return this.account;
    },

    async getToken() {
      await this.ensureAccount();

      const request = {
        scopes: this.getScopes(),
        account: this.account
      };

      try {
        const response = await this.msalApp.acquireTokenSilent(request);
        return response.accessToken;
      } catch (error) {
        if (
          error &&
          error instanceof window.msal.InteractionRequiredAuthError
        ) {
          const interactiveResponse = await this.msalApp.acquireTokenPopup(
            request
          );
          return interactiveResponse.accessToken;
        }
        throw error;
      }
    },

    buildPath(filename) {
      const folder = (config.folderPath || '').trim();
      const normalizedFolder = folder
        ? `/${folder.replace(/^\/+/, '').replace(/\/+$/, '')}`
        : '';
      const safeName = filename || `assessment_${Date.now()}.pdf`;
      const rawPath = `${normalizedFolder}/${safeName}`.replace(/\/+/g, '/');
      return encodeURI(rawPath);
    },

    async uploadFile(blob, filename) {
      if (!this.isEnabled()) {
        console.warn('SharePoint uploader disabled or misconfigured.');
        return null;
      }

      if (!blob) {
        throw new Error('No PDF blob provided for upload.');
      }

      const token = await this.getToken();
      const path = this.buildPath(filename);
      const endpoint = `https://graph.microsoft.com/v1.0/sites/${config.siteId}/drives/${config.driveId}/root:${path}:/content`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/pdf'
        },
        body: blob
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `SharePoint upload failed (${response.status}): ${errorText}`
        );
      }

      const result = await response.json();
      if (config.notifyOnSuccess) {
        this.showMessage('Report uploaded to SharePoint.');
      }
      return result;
    },

    showMessage(message, level = 'info') {
      if (level === 'error') {
        window.alert(message);
        return;
      }
      if (config.notifyOnSuccess) {
        window.alert(message);
      } else {
        console.info(message);
      }
    },

    handleError(error) {
      console.error('SharePoint upload error:', error);
      this.showMessage(
        'SharePoint upload failed. The report was still downloaded locally.',
        'error'
      );
    }
  };

  window.SharepointUploader = SharepointUploader;
})();
