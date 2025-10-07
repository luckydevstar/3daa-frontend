module.exports = {
  url: function() {
    return this.api.launchUrl + '/login';
  },

  elements: {
    email: 'input[type=email]',
    password: 'input[type=password]',
    loginButton: 'form.login-form button'
  }
};
