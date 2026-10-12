/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { initialActivities, initialAthletes } from '../data/athletes.js'

const AppContext = createContext(null)

const STORAGE_KEY = 'sportsai:v1'
const DEFAULT_NAME = 'ડેમો કોચ'
const DEFAULT_PREFS = { largeFont: false, compact: false, animation: true }

// localStorage can throw (private mode, blocked storage) or hold bad data; fall back to demo data.
function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved && typeof saved === 'object' ? saved : {}
  } catch {
    return {}
  }
}

export function AppProvider({ children }) {
  const [saved] = useState(loadSaved)
  const [athletes, setAthletes] = useState(Array.isArray(saved.athletes) ? saved.athletes : initialAthletes)
  const [activities, setActivities] = useState(Array.isArray(saved.activities) ? saved.activities : initialActivities)
  const [displayName, setDisplayName] = useState(typeof saved.displayName === 'string' ? saved.displayName : DEFAULT_NAME)
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS, ...saved.prefs })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ athletes, activities, displayName, prefs }))
    } catch {
      // storage unavailable: the app keeps working with in-memory state
    }
  }, [athletes, activities, displayName, prefs])

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

  // Restores the sample data; returns the default display name so forms can resync.
  const resetData = useCallback(() => {
    setAthletes(initialAthletes)
    setActivities(initialActivities)
    setDisplayName(DEFAULT_NAME)
    setPrefs(DEFAULT_PREFS)
    return DEFAULT_NAME
  }, [])

  const value = useMemo(
    () => ({ athletes, activities, displayName, setDisplayName, prefs, setPrefs, toast, notify, saveAthlete, resetData }),
    [athletes, activities, displayName, prefs, toast, notify, saveAthlete, resetData],
  )
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
