import React from 'react'
import { ParentSizeModern } from '@visx/responsive'
import { dailyData } from '../../utils/data'
import { TempChart } from '../BarCharts/TempChar'

export const WeatherCharts = ({ data = dailyData }) => {
  const [show, setShow] = React.useState(false)

  const makeArrays = (data: any) => {
    let modifiedData = []
    for (const key in data[0]) {
      let newArray = {
        name: key,
        data: data.map((d: any) => {
          if (key === 'dt') return
          return {
            dt: d.dt,
            [key]: d[key],
          }
        }),
      }
      if (!newArray.data.includes(undefined)) modifiedData.push(newArray)
    }
    return modifiedData
  }

  const dataArrays = makeArrays(data)

  console.log('makedata', dataArrays)

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
      {dataArrays.map((arr, i) => {
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
