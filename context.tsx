import { createContext, useContext, useState } from 'react'

const defaults = {
  counter: {
    count: 0,
    incrementCount: () => undefined,
    decrementCount: () => undefined,
  },
}

const CounterContext = createContext(defaults)

export const CounterProvider= ({ children }) => {
  const [count, setCount] = useState<number>(0)

  return (
    <CounterContext.Provider
      value={{
        counter: {
          count,
          incrementCount: () => {
            setCount((prevCount) => prevCount + 1)
          },
          decrementCount: () => {
            setCount((prevCount) => prevCount - 1)
          },
        },
      }}
    >
      {children}
    </CounterContext.Provider>
  )
}

export const useCounter = () => {
  return useContext(CounterContext)
}
