import React, { createContext, useCallback, useContext, useState } from 'react'
import { CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '../constants'
import { useEffectOnce } from '../hooks/useEffectOnce'
import { useGoogleAPI } from '../hooks/useGoogleAPI'

const isSignedInContext = createContext<boolean>(false)
const setUpContext = createContext<() => Promise<void>>(async () => {})
const signInContext = createContext<() => Promise<void>>(async () => {})
const signOutContext = createContext<() => Promise<void>>(async () => {})

export function useGoogleAPIProvider() {
  const isSignedIn = useContext(isSignedInContext)
  const setUp = useContext(setUpContext)
  const signIn = useContext(signInContext)
  const signOut = useContext(signOutContext)

  return { isSignedIn, setUp, signIn, signOut } as const
}

export const GoogleApiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const { setup, setToken, getToken, revokeToken } = useGoogleAPI({
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scopes: SCOPES,
  })

  const signIn = useCallback(async () => {
    const token = await getToken()

    localStorage.setItem('access_token', token.access_token)

    setIsSignedIn(true)
  }, [])

  const signOut = useCallback(async () => {
    await revokeToken()
    setIsSignedIn(false)
    localStorage.removeItem('access_token')
  }, [])

  const setUp = useCallback(async () => {
    await setup()
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) return
    setIsSignedIn(await setToken(accessToken))
  }, [])

  return (
    <isSignedInContext.Provider value={isSignedIn}>
      <setUpContext.Provider value={setUp}>
        <signInContext.Provider value={signIn}>
          <signOutContext.Provider value={signOut}>
            {children}
          </signOutContext.Provider>
        </signInContext.Provider>
      </setUpContext.Provider>
    </isSignedInContext.Provider>
  )
}
