import * as R from 'react'
import { Group } from '@visx/group'
import { BarGroup } from '@visx/shape'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'
import { ScaleSVG } from '@visx/responsive'

// grid imports
import { GridRows } from '@visx/grid'

// tooltip imports
import {
  useTooltip,
  useTooltipInPortal,
  TooltipWithBounds,
} from '@visx/tooltip'
import { localPoint } from '@visx/event'

import data from '../../data.json'

/**
 * Four steps to data visualizations with VisX
 * 1. setting chart dimensions. This iscludes margins for chart wrapper, and x/y-axises
 * 2. accessor fns for data
 * 3. Scales for translating into coordinates
 * 4. return visualization
 */

// TODO:
// extra steps for responsive designs
// Refactor to handle data
// Pull steps out of fn definition
// Build tooltip
// Background GridCol colors

// ======================================================================
// utils -> derived from theme obj (uses current values)
const blue = '#4071A9'
export const green = '#40AC98'
const purple = '#8970CF'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'

// utils
const formatDate = (date: string) => {
  let displayDate = date.split('/')
  return `${displayDate[0]}/ ${displayDate[1]}`
}

const numTicksRows = (height: number, margin: number) => {
  return height / margin
}
// ======================================================================

export const Daily = ({
  events = false,
  daily = dailyData,
}: {
  events: boolean
  daily?: any[]
}) => {
  /**
   *  ALL OF THIS NEEDS TO BE MOVED OUTSIDE OF COMPONENT FN DEFINITION
   */
  // 1. Chart Dimensions
  const width = 800 // width of parent container
  const height = 500 // height of parent container
  const margin = { top: 60, right: 40, bottom: 60, left: 40 } // values used to derive inner width/height from parent
  // the above values should be props
  const innerWidth = width - margin.left - margin.right // width of axis
  const innerHeight = height - margin.top - margin.bottom // height of axis
  // ---------------------------------------------------------------------

  // 2. Accessor fns
  const keys = Object.keys(daily[0]).filter((d) => d !== 'dt') // used to derive min, max, avg
  const accessDateTime = (d: any) => d.dt // will map to x-axis value
  // ---------------------------------------------------------------------
  // 3. Scales

  // set group range
  const dateScale = scaleBand<string>({
    domain: daily.map(accessDateTime),
    padding: 0.2,
  }).rangeRound([0, innerWidth])

  // set bar range
  const rangeScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  }).rangeRound([0, dateScale.bandwidth()])

  // sets height of each bar
  const tempScale = scaleLinear<number>({
    domain: [
      0,
      Math.max(
        //@ts-ignore
        ...daily.map((d) => Math.max(...keys.map((key) => Number(d[key]))))
      ),
    ],
  }).range([innerHeight, 0])

  // applys color to min, max, avg bar
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [green, blue, purple],
  })
  // ---------------------------------------------------------------------
  // ======================================================================
  // 4. Return visualization
  return (
    <>
      <h3>
        8-day forcast with min, max, and average temperature of Yushu City,
        China
      </h3>
      <ScaleSVG width={width} height={height}>
        {/* background Svg element */}
        <rect x={0} y={0} width={width} height={height} fill={background} />
        {/* ================================ */}
        <Group top={margin.top} left={margin.left}>
          {/* make own grid component */}
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
          <BarGroup
            data={daily}
            keys={keys}
            height={innerHeight}
            x0={accessDateTime}
            x0Scale={dateScale}
            x1Scale={rangeScale}
            yScale={tempScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group
                  key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                  left={barGroup.x0}
                >
                  {barGroup.bars.map((bar) => {
                    // console.log('bar', bar)
                    return (
                      <rect
                        key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                        x={bar.x}
                        y={bar.y}
                        width={bar.width}
                        height={bar.height}
                        fill={bar.color}
                        rx={5}
                        ry={5}
                        onClick={() => {
                          if (!events) return
                          const { key, value } = bar
                          alert(JSON.stringify({ key, value }))
                        }}
                      />
                    )
                  })}
                </Group>
              ))
            }
          </BarGroup>
        </Group>
        <AxisBottom
          top={innerHeight + margin.top}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={gray}
          tickStroke={gray}
          left={margin.left}
          tickLabelProps={() => ({
            fill: gray,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
      </ScaleSVG>
    </>
  )
}

const dailyData = data.daily.map((d) => ({
  min: (d.temp.min - 273.15).toString(),
  avg: (d.temp.day - 273.15).toString(),
  max: (d.temp.max - 273.15).toString(),
  dt: new Date(d.dt * 1000).toLocaleString('en-US').split(',')[0],
}))
