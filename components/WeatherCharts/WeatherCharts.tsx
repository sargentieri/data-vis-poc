import React from 'react'
import { ParentSizeModern } from '@visx/responsive'
import { dailyData } from '../../utils/data'
import { TempChart } from '../BarCharts/TempChar'
import { group } from 'd3-array'

export const WeatherCharts = ({ data = dailyData }) => {
  const [show, setShow] = React.useState(false)

  const keys: string[] = Object.keys(data[0])

  const dataGrouped = () => {
    let groupedData: any[] = []
    keys.map((key) => {
      if ((key as string) !== 'dt') return
      
      let arr = Array.from(
        group(data, (d) => d.dt),
        ([ky, val]) => ({
          dt: ky,
          [key]: val[0][key as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'],
        })
      )
      const newDataObj = {
        name: key,
        data: arr,
      }
      if (key !== 'dt') groupedData.push(newDataObj)
    })
    return groupedData
  }

  return show ? (
    <div
      style={{
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '1250px',
        maxWidth: '350px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50px', height: '50px' }} />
        <p>Weather</p>
        <button
          style={{
            background: 'white',
            color: 'black',
            border: 'none',
            marginRight: '.5rem',
            marginTop: '.5rem',
            alignSelf: 'flex-start',
          }}
          onClick={() => setShow(false)}
        >
          X
        </button>
      </div>
      {dataGrouped().map((arr, i) => {
        return (
          <>
            <div style={{ width: '100%', height: '250px' }} key={arr.name + i}>
              <ParentSizeModern debounceTime={10}>
                {({ width, height }) => {
                  return (
                    width > 0 &&
                    height > 0 && (
                      <TempChart
                        data={arr}
                        width={width}
                        height={height}
                        events
                      />
                    )
                  )
                }}
              </ParentSizeModern>
            </div>
            <div style={{ width: '100%', height: '.5rem' }} />
          </>
        )
      })}
    </div>
  ) : (
    <div>
      <button onClick={() => setShow(true)}>Open Weather</button>
    </div>
  )
}
