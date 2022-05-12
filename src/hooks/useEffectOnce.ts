import { useEffect, useState } from 'react'

export function useEffectOnce(effect: React.EffectCallback) {
  const [affected, setAffected] = useState(false)

  useEffect(() => {
    if (affected) return

    setAffected(true)

    return effect()
  }, [])
}
