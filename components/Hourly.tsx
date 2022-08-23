import * as R from 'react'
import data from '../data.json'

export const Hourly = () => {
  const hourly = data.hourly.map((d) => ({
    dt: new Date(d.dt * 1000),
    temp: d.temp - 100,
    feelsLike: d.feels_like - 100,
  }))

  console.log('hourly', hourly)

  return <div>Hourly</div>
}
