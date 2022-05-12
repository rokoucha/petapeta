export type useGoogleAPIParams = {
  clientId: string
  discoveryDocs: string[]
  scopes: string[]
}

export function useGoogleAPI({
  clientId,
  discoveryDocs,
  scopes,
}: useGoogleAPIParams) {
  let isReady = false

  const setup = async () => {
    const loadGapi = new Promise<void>((resolve, reject) => {
      if ('gapi' in window) {
        return resolve()
      }

      const script = document.getElementById('gapi-script')
      if (!script) throw new Error('Failed to load gapi')
      script.onload = () => resolve()
      script.onerror = reject
    })

    const loadGis = new Promise<void>((resolve, reject) => {
      if ('google' in window) {
        return resolve()
      }

      const script = document.getElementById('gis-script')
      if (!script) throw new Error('Failed to load gis')
      script.onload = () => resolve()
      script.onerror = reject
    })

    await Promise.all([loadGapi, loadGis])

    await new Promise<void>((resolve, reject) => {
      gapi.load('client', {
        callback: () => resolve(),
        onerror: (...args: unknown[]) => reject(...args),
      })
    })

    await gapi.client.init({})
    await Promise.all(discoveryDocs.map((d) => gapi.client.load(d)))
  }

  const setToken = async (accessToken: string): Promise<boolean> => {
    if (!isReady) await setup()

    let res: gapi.client.Response<any> | undefined = undefined
    try {
      res = await gapi.client.request({
        path: `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`,
        method: 'GET',
      })
    } catch (e) {
      console.error('Failed to fetch tokeninfo', e)

      return false
    }

    if (res.status !== 200) {
      console.error('Status is not 200: ', res)

      return false
    }

    gapi.client.setToken({ access_token: accessToken })

    return true
  }

  const getToken = () =>
    new Promise<google.accounts.oauth2.TokenResponse>(
      async (resolve, reject) => {
        if (!isReady) await setup()

        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: scopes.join(' '),
          prompt: 'consent',
          callback: (res) =>
            res.error === undefined ? resolve(res) : reject(res),
        })

        try {
          tokenClient.requestAccessToken()
        } catch (e) {
          console.error(e)
        }
      },
    )

  const revokeToken = async () => {
    if (!isReady) await setup()

    const cred = gapi.client.getToken()
    if (cred !== null) {
      await new Promise<void>((resolve) => {
        google.accounts.oauth2.revoke(cred.access_token, () => resolve())
      })
      gapi.client.setToken(null)
    }
  }

  return { setup, setToken, getToken, revokeToken } as const
}
