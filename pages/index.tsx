import type { NextPage } from 'next'
import { ParentSizeModern } from '@visx/responsive'
import { TempRangeChart } from '../components/BarCharts/TempRangeChart'
import { TempChart } from '../components/BarCharts/TempChar'
import { PestCountsChart } from '../components/LineCharts/PestCountsChart'

const Home: NextPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <h1>Data Fetch + Data Vis POC</h1>
      <hr style={{ width: '100%' }} />
      <div style={{ height: 500, width: '100%' }}>
        <ParentSizeModern debounceTime={10}>
          {({ width, height }) => (
            <TempRangeChart width={width} height={height} events />
          )}
        </ParentSizeModern>
      </div>
      <br />
      <div style={{ height: 500, width: '100%' }}>
        <ParentSizeModern debounceTime={10}>
          {({ width, height }) => <TempChart width={width} height={height} />}
        </ParentSizeModern>
      </div>
      <br />
      <div style={{ height: 500, width: '100%' }}>
        <ParentSizeModern debounceTime={10}>
          {({ width, height }) => (
            <PestCountsChart width={width} height={height} />
          )}
        </ParentSizeModern>
      </div>
    </div>
  )
}

export default Home
