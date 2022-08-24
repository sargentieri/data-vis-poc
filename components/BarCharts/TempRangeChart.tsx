import * as R from 'react'
import { Group } from '@visx/group'
import { BarGroup } from '@visx/shape'
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale'
// Axis imports
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'
// grid imports
import { GridRows } from '@visx/grid'

// tooltip imports
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'

//utils
import { numTicksRows } from '../../utils/numTickRows'
import { formatDate } from '../../utils/formatDate'
import { tempRangeData } from '../../utils/data'

/**
 * Four steps to data visualizations with VisX
 * 1. setting chart dimensions. This iscludes margins for chart wrapper, and x/y-axises
 * 2. accessor fns for data
 * 3. Scales for translating into coordinates
 * 4. return visualization
 */

const blue = '#4071A9'
export const green = '#40AC98'
const purple = '#8970CF'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 120,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
}

export const TempRangeChart = ({
  events = false,
  width,
  height,
}: {
  events?: boolean
  width: number
  height: number
}) => {
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
  const margin = { top: 60, right: 40, bottom: 60, left: 40 } // values used to derive inner width/height from parent
  // the above values should be props
  const innerWidth = width - margin.left - margin.right // width of axis
  const innerHeight = height - margin.top - margin.bottom // height of axis
  // ---------------------------------------------------------------------
  // 2. Accessor fns
  const keys = Object.keys(tempRangeData[0]).filter((d) => d !== 'dt') // used to derive min, max, avg
  const accessDateTime = (d: any) => d.dt // will map to x-axis value
  // ---------------------------------------------------------------------
  // 3. Scales
  // set group range
  const dateScale = scaleBand<string>({
    domain: tempRangeData.map(accessDateTime),
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
        ...tempRangeData.map((d) =>
          //@ts-ignore
          Math.max(...keys.map((key) => Number(d[key])))
        )
      ),
    ],
  }).range([innerHeight, 0])

  // applys color to min, max, avg bar
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: [green, blue, purple],
  })
  // ---------------------------------------------------------------------
  // 4. Return visualization

  console.log('tooltip data', tooltipData)
  return (
    <div>
      <svg width={width} height={height} ref={containerRef}>
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
            data={tempRangeData}
            keys={keys}
            height={innerHeight}
            x0={accessDateTime}
            x0Scale={dateScale}
            x1Scale={rangeScale}
            yScale={tempScale}
            color={colorScale}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => {
                return (
                  <Group
                    key={`bar-group-${barGroup.index}-${barGroup.x0}`}
                    left={barGroup.x0}
                  >
                    {barGroup.bars.map((bar) => {
                      return (
                        <rect
                          key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={bar.color}
                          rx={width / 70}
                          onClick={() => {
                            if (!events) return
                            const { key, value } = bar
                            alert(JSON.stringify({ key, value }))
                          }}
                          onMouseLeave={() => {
                            tooltipTimeout = window.setTimeout(() => {
                              hideTooltip()
                            }, 300)
                          }}
                          onMouseMove={(event) => {
                            if (tooltipTimeout) clearTimeout(tooltipTimeout)
                            const eventSvgCoords = localPoint(event)
                            const left = barGroup.x0 + bar.width / 2

                            showTooltip({
                              tooltipData: bar,
                              tooltipTop: eventSvgCoords?.y,
                              tooltipLeft: left,
                            })
                          }}
                        />
                      )
                    })}
                  </Group>
                )
              })
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
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div>
            <strong>Daily Temp Range</strong>
          </div>
          {/* DATE not accessible, not sure exactly how to fix */}
          <div>
            <small>
              {tooltipData.key}: {Math.round(tooltipData.value).toFixed(2)}°C
            </small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  )
}
