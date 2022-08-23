import type { NextPage } from 'next'
import { TemperatureChart } from '../components/WeatherCarts/TemperatureChart'

const Home: NextPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <h1>Data Fetch + Data Vis POC</h1>
      <hr style={{ width: '100%' }} />
      <TemperatureChart events />
    </div>
  )
}

export default Home
