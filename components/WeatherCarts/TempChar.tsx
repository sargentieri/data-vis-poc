import * as R from 'react'
// graph basics
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { Bar } from '@visx/shape'
import { Text } from '@visx/text'
// grid and axis defs
import { GridRows } from '@visx/grid'
import { AxisBottom, AxisLeft } from '@visx/axis'
// tooltip
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'
// utils
import { dailyData } from '../../utils/data'
import { numTicksRows } from '../../utils/numTickRows'
import { formatDate } from '../../utils/formatDate'

/**
 * Four steps to data visualizations with VisX
 * 1. setting chart dimensions. This iscludes margins for chart wrapper, and x/y-axises
 * 2. accessor fns for data
 * 3. Scales for translating into coordinates
 * 4. return visualization
 */

// colors
const blue = '#7BBCE0'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'
// tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
}

export const TempChart = ({
  width = 700,
  height = 500,
  events = false,
}: {
  width?: number
  height?: number
  events?: boolean
}) => {
  // Tooltip
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<any>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // TooltipInPortal is rendered in a separate child of <body /> and positioned
    // with page coordinates which should be updated on scroll. consider using
    // Tooltip or TooltipWithBounds if you don't need to render inside a Portal
    scroll: true,
  })

  let tooltipTimeout: number

  // 1. Chart Dimensions
  const margin = { top: 60, right: 40, bottom: 60, left: 40 } // offset for children
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

  console.log('tooltip data', tooltipData)

  return (
    <div>
      <svg width={width} height={height} ref={containerRef}>
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
                rx={width / 30}
                onClick={() => {
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                }}
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip()
                  }, 300)
                }}
                onMouseMove={(event) => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout)
                  const eventSvgCoords = localPoint(event)
                  const left = barX ?? 0 + barWidth / 2
                  showTooltip({
                    tooltipData: d,
                    tooltipTop: eventSvgCoords?.y,
                    tooltipLeft: left,
                  })
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
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>Daily Temp</strong>
          </div>
          <div>{tooltipData.dt}</div>
          <div>
            <small>{Math.round(tooltipData.avg).toFixed(2)}°C</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
