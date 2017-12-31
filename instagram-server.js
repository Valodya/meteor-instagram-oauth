Instagram = {}

const INSTAGRAM = 'instagram'

const getTokenResponse = query => {
  const config = ServiceConfiguration.configurations.findOne({ service: INSTAGRAM })

  if (!config) {
    throw new ServiceConfiguration.ConfigError()
  }

  try {
    const response = HTTP.post(
      'https://api.instagram.com/oauth/access_token', {
        params: {
          client_id    : config.clientId,
          redirect_uri : OAuth._redirectUri(INSTAGRAM, config),
          client_secret: OAuth.openSecret(config.secret),
          grant_type   : 'authorization_code',
          code         : query.code,
        }
      })

    if (response.error) {
      throw response.error
    }

    if (typeof response.content === 'string') {
      response.content = JSON.parse(response.content)
    }

    if (response.content.error) {
      throw response.content
    }

    const accessToken = response.content.access_token
    const serviceData = response.content.user

    return { ...serviceData, accessToken }

  } catch (error) {
    throw _.extend(new Error(`Failed to complete OAuth handshake with Instagram. ${error.message}`),
      { response: error.response })
  }
}

Oauth.registerService(INSTAGRAM, 2, null, query => {
  const serviceData = getTokenResponse(query)

  return {
    serviceData,
    options: {
      profile : { name: serviceData.full_name },
      services: { instagram: serviceData }
    }
  }
})

Instagram.retrieveCredential = (credentialToken, credentialSecret) => Oauth.retrieveCredential(credentialToken, credentialSecret)