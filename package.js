Package.describe({
  name   : 'valodya:instagram-oauth',
  summary: 'Instagram OAuth flow',
  version: '1.0.0',
  git    : 'https://github.com/Valodya/meteor-instagram-oauth.git'
})

Package.onUse(function (api) {
  api.versionsFrom('1.4.3')

  api.use('oauth2', ['client', 'server'])
  api.use('oauth', ['client', 'server'])
  api.use('http', ['server'])
  api.use('underscore', 'server')
  api.use('random', 'client')
  api.use('service-configuration', ['client', 'server'])

  api.addFiles('instagram-client.js', 'client')
  api.addFiles('instagram-server.js', 'server')

  api.export('Instagram')
})