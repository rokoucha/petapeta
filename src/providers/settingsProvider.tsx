import React, { createContext, useContext, useEffect, useState } from 'react'
import { useEffectOnce } from '../hooks/useEffectOnce'

export type SettingsState = {
  trashed: boolean
  searchByName: boolean
  searchByFullText: boolean
}

const DefaultSettingsState: SettingsState = {
  trashed: false,
  searchByName: true,
  searchByFullText: true,
}

const settingsContext = createContext(DefaultSettingsState)
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
  const [settings, setSettings] = useState<SettingsState>(DefaultSettingsState)

  useEffectOnce(() => {
    const settingsJson = localStorage.getItem('settings')
    if (!settingsJson) return

    setSettings(JSON.parse(settingsJson))
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
