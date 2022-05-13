import React, { createContext, useContext, useState } from 'react'

const isLoadingContext = createContext<boolean>(false)
const setIsLoadingContext = createContext<
  React.Dispatch<React.SetStateAction<boolean>>
>(() => {})

export function useLoadingProvider() {
  const isLoading = useContext(isLoadingContext)
  const setIsLoading = useContext(setIsLoadingContext)

  return [isLoading, setIsLoading] as const
}

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <isLoadingContext.Provider value={isLoading}>
      <setIsLoadingContext.Provider value={setIsLoading}>
        {children}
      </setIsLoadingContext.Provider>
    </isLoadingContext.Provider>
  )
}
