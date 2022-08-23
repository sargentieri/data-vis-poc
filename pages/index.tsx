import type { NextPage } from 'next'
import { ParentSizeModern } from '@visx/responsive'
import { Daily } from '../components/BarCharts/Daily'
import { TempChart } from '../components/BarCharts/TempChar'
import { PestCounts } from '../components/LineCharts/PestCounts'

const Home: NextPage = () => {
  // For tool tip to work the tempChar implementation needs to be uses. Super stupid

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
      <h1>Data Fetch + Data Vis POC</h1>
      <hr style={{ width: '100%' }} />

      <Daily events />

      <div style={{ height: 500, width: '100%' }}>
        <ParentSizeModern debounceTime={10}>
          {({ width, height }) => <TempChart width={width} height={height} />}
        </ParentSizeModern>
      </div>

      <PestCounts />
    </div>
  )
}

export default Home
