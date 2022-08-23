import type { NextPage } from 'next'
import { Daily } from '../components/BarCharts/Daily'
import { WeatherChart } from '../components/BarCharts/WeatherChart'

const Home: NextPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <h1>Data Fetch + Data Vis POC</h1>
      <hr style={{ width: '100%' }} />
      <Daily events />
      <WeatherChart events />
    </div>
  )
}

export default Home
