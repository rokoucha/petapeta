import React, { createContext, useContext, useEffect, useState } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'

export type SettingsState = {
  parents: string[]
  searchByFullText: boolean
  searchByName: boolean
  trashed: boolean
}

const defaultSettingsState: SettingsState = {
  parents: [],
  searchByFullText: true,
  searchByName: true,
  trashed: false,
}

const settingsContext = createContext(defaultSettingsState)
const setSetingsContext = createContext<
  React.Dispatch<React.SetStateAction<SettingsState>>
>(() => {})

export function useSettingsProvider() {
  const settings = useContext(settingsContext)
  const setSettings = useContext(setSetingsContext)

  return [settings, setSettings] as const
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const settingsJson = localStorage.getItem('settings')
    return settingsJson ? JSON.parse(settingsJson) : defaultSettingsState
  })

  useEffect(
    () => localStorage.setItem('settings', JSON.stringify(settings)),
    [settings],
  )

  return (
    <settingsContext.Provider value={settings}>
      <setSetingsContext.Provider value={setSettings}>
        {children}
      </setSetingsContext.Provider>
    </settingsContext.Provider>
  )
}
