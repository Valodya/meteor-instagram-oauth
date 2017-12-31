Instagram = {}

const INSTAGRAM = 'instagram'
const DEFAULT_SCOPE = ['basic', 'likes', 'relationships', 'comments']

Instagram.requestCredential = (options, credentialRequestCompleteCallback) => {
  if (typeof options === 'function') {
    credentialRequestCompleteCallback = options
    options = {}
  }

  const config = ServiceConfiguration.configurations.findOne({ service: INSTAGRAM })

  if (!config) {
    if (credentialRequestCompleteCallback) {
      credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError())
    }

    return
  }

  const credentialToken = Random.secret()
  const loginStyle = OAuth._loginStyle(INSTAGRAM, config, options)

  const scope = typeof config.scope === 'string'
    ? [config.scope]
    : (config.scope || DEFAULT_SCOPE)

  const query = [
    `client_id=${config.clientId}`,
    `response_type=code`,
    `scope=${scope.map(encodeURIComponent).join('+')}`,
    `redirect_uri=${OAuth._redirectUri(INSTAGRAM, config)}`,
    `state=${OAuth._stateParam(loginStyle, credentialToken)}`,
  ]

  OAuth.launchLogin({
    loginService: INSTAGRAM,
    loginUrl    : `https://instagram.com/oauth/authorize?${query.join('&')}`,
    loginStyle,
    credentialToken,
    credentialRequestCompleteCallback,
  })
}

