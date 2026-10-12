export const SPORTS = ['Cricket', 'Football', 'Badminton', 'Athletics', 'Volleyball']
export const STATUSES = ['active', 'inactive', 'injured']
export const METRICS = ['speed', 'strength', 'endurance', 'fitness']

export const initialAthletes = [
  { id: 1, name: 'હાર્દિક પટેલ', sport: 'Cricket', age: 22, team: 'એલ. ડી. કોલેજ, અમદાવાદ', status: 'active', speed: 82, strength: 78, endurance: 85, fitness: 88 },
  { id: 2, name: 'મિતાલી શાહ', sport: 'Badminton', age: 20, team: 'ગુજરાત યુનિવર્સિટી, અમદાવાદ', status: 'active', speed: 90, strength: 70, endurance: 84, fitness: 86 },
  { id: 3, name: 'ધ્રુવ જોષી', sport: 'Football', age: 23, team: 'એમ. એસ. યુનિવર્સિટી, વડોદરા', status: 'active', speed: 88, strength: 84, endurance: 80, fitness: 83 },
  { id: 4, name: 'કૃતિ દેસાઈ', sport: 'Athletics', age: 21, team: 'વી. એન. એસ. જી. યુનિવર્સિટી, સુરત', status: 'active', speed: 94, strength: 76, endurance: 90, fitness: 92 },
  { id: 5, name: 'નિરવ ત્રિવેદી', sport: 'Volleyball', age: 24, team: 'સરદાર પટેલ યુનિવર્સિટી, વલ્લભ વિદ્યાનગર', status: 'injured', speed: 74, strength: 86, endurance: 72, fitness: 70 },
  { id: 6, name: 'રિયા મહેતા', sport: 'Badminton', age: 19, team: 'સૌરાષ્ટ્ર યુનિવર્સિટી, રાજકોટ', status: 'active', speed: 85, strength: 66, endurance: 78, fitness: 80 },
  { id: 7, name: 'જિગ્નેશ ઠાકોર', sport: 'Cricket', age: 25, team: 'હેમચંદ્રાચાર્ય ઉત્તર ગુજરાત યુનિવર્સિટી, પાટણ', status: 'inactive', speed: 70, strength: 74, endurance: 68, fitness: 66 },
  { id: 8, name: 'પ્રિયંકા ચૌધરી', sport: 'Athletics', age: 22, team: 'ગુજરાત વિદ્યાપીઠ, અમદાવાદ', status: 'active', speed: 89, strength: 72, endurance: 87, fitness: 85 },
  { id: 9, name: 'યશ ભટ્ટ', sport: 'Football', age: 21, team: 'ભાવનગર યુનિવર્સિટી, ભાવનગર', status: 'active', speed: 80, strength: 79, endurance: 76, fitness: 78 },
  { id: 10, name: 'દિવ્યા પરમાર', sport: 'Volleyball', age: 20, team: 'કચ્છ યુનિવર્સિટી, ભુજ', status: 'active', speed: 77, strength: 81, endurance: 79, fitness: 82 },
  { id: 11, name: 'કેયૂર સોલંકી', sport: 'Cricket', age: 23, team: 'સરદાર પટેલ યુનિવર્સિટી, વલ્લભ વિદ્યાનગર', status: 'active', speed: 76, strength: 83, endurance: 74, fitness: 75 },
  { id: 12, name: 'ભૂમિ વ્યાસ', sport: 'Badminton', age: 18, team: 'એચ. કે. આર્ટ્સ કોલેજ, અમદાવાદ', status: 'inactive', speed: 72, strength: 60, endurance: 70, fitness: 68 },
]

export const initialActivities = [
  { id: 1, text: 'કૃતિ દેસાઈએ ૧૦૦ મીટર દોડમાં નવો અંગત રેકોર્ડ બનાવ્યો', time: '૨ કલાક પહેલાં' },
  { id: 2, text: 'નિરવ ત્રિવેદીની સ્થિતિ “ઇજાગ્રસ્ત” તરીકે અપડેટ થઈ', time: '૫ કલાક પહેલાં' },
  { id: 3, text: 'મિતાલી શાહે સપ્તાહની તાલીમ સફળતાપૂર્વક પૂર્ણ કરી', time: 'ગઈકાલે' },
  { id: 4, text: 'ધ્રુવ જોષીનો ફિટનેસ ટેસ્ટ નોંધાયો', time: 'ગઈકાલે' },
  { id: 5, text: 'હાર્દિક પટેલનો પ્રદર્શન સ્કોર ૮૨ થી વધીને ૮૩ થયો', time: '૨ દિવસ પહેલાં' },
]

export const score = (a) => Math.round((a.speed + a.strength + a.endurance + a.fitness) / 4)

// Deterministic 6-month history ending at the athlete's current values.
export function history(a, months) {
  return months.map((month, i) => {
    const back = months.length - 1 - i
    const row = { month }
    METRICS.forEach((m, k) => {
      const wobble = ((a.id * 7 + k * 5 + i * 3) % 5) - 2
      row[m] = Math.max(0, Math.min(100, a[m] - back * (2 + (k % 2)) + (back ? wobble : 0)))
    })
    return row
  })
}
