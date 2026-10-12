/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { initialActivities, initialAthletes } from '../data/athletes.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [athletes, setAthletes] = useState(initialAthletes)
  const [activities, setActivities] = useState(initialActivities)
  const [displayName, setDisplayName] = useState('ડેમો કોચ')
  const [prefs, setPrefs] = useState({ largeFont: false, compact: false, animation: true })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    document.documentElement.classList.toggle('font-large', prefs.largeFont)
  }, [prefs.largeFont])

  useEffect(() => {
    if (!toast) return undefined
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const notify = useCallback((message) => setToast({ message, key: Date.now() }), [])

  const logActivity = useCallback((text) => {
    setActivities((prev) => [{ id: Date.now(), text, time: 'હમણાં જ' }, ...prev].slice(0, 8))
  }, [])

  const saveAthlete = useCallback(
    (data) => {
      if (data.id) {
        setAthletes((prev) => prev.map((a) => (a.id === data.id ? data : a)))
        logActivity(`${data.name} ની માહિતી અપડેટ કરવામાં આવી`)
      } else {
        setAthletes((prev) => [...prev, { ...data, id: Math.max(0, ...prev.map((a) => a.id)) + 1 }])
        logActivity(`નવા ખેલાડી ${data.name} ઉમેરવામાં આવ્યા`)
      }
    },
    [logActivity],
  )

  const value = useMemo(
    () => ({ athletes, activities, displayName, setDisplayName, prefs, setPrefs, toast, notify, saveAthlete }),
    [athletes, activities, displayName, prefs, toast, notify, saveAthlete],
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
