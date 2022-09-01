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
import { formatDay } from '../../utils/formatDate'
import { mapSymbol, mapTitle } from '../../utils/mapper'
import { Axes } from '../Axis/Axis'

/**
 * Four steps to data visualizations with VisX
 * 1. setting chart dimensions. This iscludes margins for chart wrapper, and x/y-axises
 * 2. accessor fns for data
 * 3. Scales for translating into coordinates
 * 4. return visualization
 */

/**
 * Seperate Axises into own File
 * Seperate Grid lines into Own File
 * Make Rects their own file
 * embellish styles
 * make tooltip more generic and in own file
 */

/**
 * when I console.log(data), will re console.log on scroll
 *
 */
// colors
const blue = '#7BBCE0'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'
// tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 120,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
}

export const TempChart = ({
  data,
  width = 700,
  height = 600,
  events = false,
  tooltip = false,
}: {
  data: any
  width?: number
  height?: number
  events?: boolean
  tooltip?: boolean
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
    scroll: true,
  })
  let tooltipTimeout: number

  // 1. Chart Dimensions
  const margin = { top: 40, right: 25, bottom: 40, left: 25 } // offset for children
  const innerWidth = width - margin.left - margin.right // width of chart
  const innerHeight = height - margin.top - margin.bottom // height of chart

  // 2. Accessor fns
  const getY = (d: any) => d[data.name]
  const getX = (d: any) => d.dt

  // 3. Scales
  const xScale = R.useMemo(
    () =>
      scaleBand<string>({
        range: [0, innerWidth],
        round: true,
        domain: data[data.name].map(getX),
        padding: 0.65,
      }),
    [innerWidth]
  )

  const yScale = R.useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [0, Math.max(...data[data.name].map(getY))],
        round: true,
      }),
    [innerHeight]
  )

  return (
    <div>
      <svg width={width} height={height} ref={containerRef}>
        <rect width={width} height={height} fill={background} />
        <Group top={margin.top} left={margin.left}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            height={innerHeight}
            stroke={gridGray}
            numTicks={4}
            strokeDasharray='2,5'
            fillOpacity={0.1}
            fill='red'
          />
          
          {data[data.name].map((d: any, i: any) => {
            const temp = getY(d)
            const date = getX(d)
            const barWidth = xScale.bandwidth()
            const barHeight = innerHeight - (yScale(temp) ?? 0)
            const barX = xScale(date)
            const barY = innerHeight - barHeight

            return (
              <Bar
                key={`bar-${date}-${i}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={blue}
                rx={width / 75}
                onClick={() => {
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                }}
                onMouseLeave={() => {
                  if (!tooltip) return
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip()
                  }, 300)
                }}
                onMouseMove={(event) => {
                  if (!tooltip) return
                  if (tooltipTimeout) clearTimeout(tooltipTimeout)
                  const eventSvgCoords = localPoint(event)
                  const left = barX ?? 1 + barWidth / 2

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
        <Axes
          yScale={yScale}
          xScale={xScale}
          tickStroke={gray}
          stroke={gray}
          margin={margin}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          data={data}
          yTitle={
            mapTitle[
              data?.name as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'
            ]
          }
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
            <strong>
              {
                mapTitle[
                  data?.name as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'
                ]
              }
            </strong>
          </div>
          <div>{tooltipData.dt}</div>
          <div>
            {data.name === 'avg' ? (
              <small>
                {Math.round(tooltipData[data.name]).toFixed(2)}{' '}
                {
                  mapSymbol[
                    data?.name as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'
                  ]
                }
              </small>
            ) : (
              <small>
                {tooltipData[data.name]}{' '}
                {
                  mapSymbol[
                    data?.name as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'
                  ]
                }
              </small>
            )}
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
