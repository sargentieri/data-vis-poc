import * as R from 'react'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { ScaleSVG } from '@visx/responsive'
import { GridRows } from '@visx/grid'
import { Bar } from '@visx/shape'
import { dailyData } from '../../utils/data'
import { Text } from '@visx/text'
import { numTicksRows } from '../../utils/numTickRows'
import { formatDate } from '../../utils/formatDate'

/**
 * Four steps to data visualizations with VisX
 * 1. setting chart dimensions. This iscludes margins for chart wrapper, and x/y-axises
 * 2. accessor fns for data
 * 3. Scales for translating into coordinates
 * 4. return visualization
 */

// Colors
const blue = '#7BBCE0'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'
// ======================================================================

export const TemperatureChart = ({ events = false }: { events: boolean }) => {
  // 1. Chart Dimensions
  const width = 700 // width of parent container
  const height = 500 // height of parent container
  const margin = { top: 60, right: 40, bottom: 60, left: 40 }
  const innerWidth = width - margin.left - margin.right // width of chart
  const innerHeight = height - margin.top - margin.bottom // height of chart

  // 2. Accessor fns
  const getTemp = (d: any) => d.avg
  const getDate = (d: any) => d.dt

  // 3. Scales
  const dateScale = R.useMemo(
    () =>
      scaleBand<string>({
        range: [0, innerWidth],
        round: true,
        domain: dailyData.map(getDate),
        padding: 0.4,
      }),
    [innerWidth]
  )

  const tempScale = R.useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        round: true,
        domain: [0, Math.max(...dailyData.map(getTemp))],
      }),
    [innerHeight]
  )

  return (
    <ScaleSVG width={width} height={height}>
      <rect width={width} height={height} fill={background} />
      <Group top={margin.top} left={margin.left}>
        <GridRows
          scale={tempScale}
          width={innerWidth}
          height={innerHeight}
          stroke={gridGray}
          numTicks={numTicksRows(innerHeight, margin.right)}
          strokeDasharray='2,5'
          fillOpacity={0.1}
          fill='red'
        />
        <AxisLeft
          scale={tempScale}
          tickStroke={gray}
          stroke={gray}
          tickLabelProps={() => ({
            fill: gray,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        <Text
          x='-5'
          y='-15'
          fontSize={11}
          fill={gray}
          style={{ textDecorationColor: gray }}
        >
          Temperature (°C)
        </Text>
        {dailyData.map((d, i) => {
          const temp = getTemp(d)
          const date = getDate(d)
          const barWidth = dateScale.bandwidth()
          const barHeight = innerHeight - (tempScale(temp) ?? 0)
          const barX = dateScale(date)
          const barY = innerHeight - barHeight

          return (
            <Bar
              key={`bar-${date}-${i}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={blue}
              rx={20}
              onClick={() => {
                if (events)
                  alert(`clicked: ${JSON.stringify(Object.values(d))}`)
              }}
            />
          )
        })}
      </Group>
      <AxisBottom
        top={innerHeight + margin.top}
        scale={dateScale}
        tickFormat={formatDate}
        stroke={gray}
        tickStroke={gray}
        left={margin.left}
        label={'Date'}
        tickLabelProps={() => ({
          fill: gray,
          fontSize: 11,
          textAnchor: 'middle',
        })}
      />
    </ScaleSVG>
  )
}
