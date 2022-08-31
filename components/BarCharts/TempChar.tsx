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
  tooltip = false
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
  const margin = { top: 60, right: 40, bottom: 60, left: 40 } // offset for children
  const innerWidth = width - margin.left - margin.right // width of chart
  const innerHeight = height - margin.top - margin.bottom // height of chart

  // 2. Accessor fns
  const getY = (d: any) => d[data.name]
  const getX = (d: any) => d.dt

  // 3. Scales
  const dateScale = R.useMemo(
    () =>
      scaleBand<string>({
        range: [0, innerWidth],
        round: true,
        domain: data[data.name].map(getX),
        padding: 0.65,
      }),
    [innerWidth]
  )

  const tempScale = R.useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [0, Math.max(...data[data.name].map(getY))],
        round: true,
      }),
    [innerHeight]
  )

  const monthDisplay = (data: any) => {
    let formattedDates: string[] = []
    let months = ['Aug', 'Sep', 'Sep', 'Sep', 'Sep', 'Oct', 'Oct', 'Oct'] // for testing purposes only
    // let months: string[] = data.map((d: any) => formatMonth(d.dt))

    months.map((month: string, i: number) => {
      month === months[i - 1]
        ? formattedDates.push('')
        : formattedDates.push(month)
    })

    return formattedDates
  }

  const mapTitle = {
    avg: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    rainfall: 'Rainfall (cm)',
    windSpeed: 'Wind Speed (km/hr)',
  }

  const mapSymbol = {
    avg: '(°C)',
    humidity: '(%)',
    rainfall: '(cm)',
    windSpeed: '(km/hr)',
  }

  const lowerAxisLabels = monthDisplay(data[data.name])

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
            numTicks={4}
            strokeDasharray='2,5'
            fillOpacity={0.1}
            fill='red'
          />
          <AxisLeft
            scale={tempScale}
            tickStroke={gray}
            stroke={gray}
            numTicks={4}
            hideAxisLine
            hideTicks
            tickLabelProps={() => ({
              fill: gray,
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
          <Text
            x='-15'
            y='-20'
            fontSize={12}
            lineHeight={21.86}
            fill={'black'}
            style={{ textDecorationColor: gray }}
          >
            {
              mapTitle[
                data?.name as 'avg' | 'rainfall' | 'windSpeed' | 'humidity'
              ]
            }
          </Text>
          {data[data.name].map((d: any, i: any) => {
            const temp = getY(d)
            const date = getX(d)
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
                rx={width / 75}
                onClick={() => {
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`)
                }}
                onMouseLeave={() => {
                  if(!tooltip) return
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip()
                  }, 300)
                }}
                onMouseMove={(event) => {
                  if(!tooltip) return
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
        <AxisBottom
          top={innerHeight + margin.top}
          scale={dateScale}
          tickFormat={formatDay}
          stroke={gray}
          tickStroke={gray}
          left={margin.left}
          tickLabelProps={() => ({
            fill: gray,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        <g transform='translate(33, 172)'>
          {lowerAxisLabels?.map((m, i) => {
            const monthsArr = data[data?.name]
            const month = monthsArr[i]
            return (
              <svg
                key={`${m}-${i}`}
                fontSize={11}
                overflow='visible'
                fill={gray}
              >
                <text y={5} x={dateScale(month && month?.dt)}>
                  {m}
                </text>
              </svg>
            )
          })}
        </g>
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
