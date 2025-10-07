module.exports = {
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    loadingOverlay: 'div.loading-spinner',
    signin: 'a.login-button[href="/login"]'
  }
};