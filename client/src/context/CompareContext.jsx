import { createContext, useContext, useState, useEffect } from 'react'

const CompareContext = createContext()

export const useCompare = () => useContext(CompareContext)

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('royalAisleCompare')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('royalAisleCompare', JSON.stringify(compareList))
  }, [compareList])

  const addToCompare = (venue) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 venues at a time.')
      return
    }
    if (!compareList.find(v => v._id === venue._id)) {
      setCompareList([...compareList, venue])
    }
  }

  const removeFromCompare = (id) => {
    setCompareList(compareList.filter(v => v._id !== id))
  }

  const clearCompare = () => setCompareList([])

  const isInCompare = (id) => compareList.some(v => v._id === id)

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  )
}
