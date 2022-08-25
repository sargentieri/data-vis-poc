import * as R from 'react'
import { LinePath } from '@visx/shape'
import { Group } from '@visx/group'
import { MarkerCircle, Marker } from '@visx/marker'
import { scaleBand, scaleLinear } from '@visx/scale'
// axis
import { AxisBottom, AxisLeft } from '@visx/axis'
import { GridRows } from '@visx/grid'
//utils
import { numTicksRows } from '../../utils/numTickRows'
import { formatDate } from '../../utils/formatDate'
import { pestDataByFarm } from '../../utils/data'
import { extent } from 'd3-array'

// this chart is designed to be a singular line that maps to a graph
// will need to add support for multi lines
// line is slightly to the left

const blue = '#4071A9'
export const green = '#40AC98'
const purple = '#8970CF'
export const background = '#FFFFFF'
export const gray = '#CDCDCD'
export const gridGray = '#E1E1E1'

const colors = [green, blue, purple]
const markers = [
  'url(#marker-square)',
  'url(#marker-circle)',
  'url(#marker-arrow)',
]

const pestDataByFarmA = pestDataByFarm[0]

type TimeSeriesData = {
  date: string
  count: number
  projection: boolean
}

interface DataProps {
  name: 'string'
  pestTimeSeries: TimeSeriesData[]
}

export const PestCountsChart = ({
  data = pestDataByFarmA,
  width,
  height,
}: {
  data?: any
  width: number
  height: number
}) => {
  // 1. chart dimensions
  const margin = { top: 60, right: 40, bottom: 60, left: 40 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // 2. accessors
  const getCount = (d: any) => d.count
  const getDate = (d: any) => d.date

  // 3. scales
  const dateScale = R.useMemo(
    () =>
      scaleBand<string>({
        range: [0, innerWidth],
        round: true,
        domain: data.pests[0].pestTimeSeries.map(getDate),
        padding: 1,
      }),
    [innerWidth]
  )

  // vertical, y scale
  const countScale = R.useMemo(
    () =>
      scaleLinear<number>({
        range: [innerHeight, 0],
        domain: [0, Math.max(...data.pests[0].pestTimeSeries.map(getCount))],
        round: true,
      }),
    [innerHeight]
  )

  // console.log('data', data)

  // 4. return visualization
  return (
    <div>
      <svg width={width} height={height}>
        <rect width={width} height={height} fill={background} />
        <MarkerSquare id='marker-square' fill={green} size={2} refX={2} />
        <MarkerCircle id='marker-circle' fill={blue} size={2} refX={2} />
        <MarkerArrow id='marker-arrow' fill={purple} size={4} refX={2} />
        <Group top={margin.top} left={margin.left}>
          <GridRows
            scale={countScale}
            width={innerWidth}
            height={innerHeight}
            stroke={gridGray}
            numTicks={numTicksRows(innerHeight, margin.right)}
            strokeDasharray='2,5'
            fillOpacity={0.1}
            fill='red'
          />
          <AxisLeft
            scale={countScale}
            tickStroke={gray}
            stroke={gray}
            tickLabelProps={() => ({
              fill: gray,
              fontSize: 11,
              textAnchor: 'middle',
            })}
          />
          {/* current */}
          {data?.pests?.map((pest: any, i: number) => {
            const data = pest.pestTimeSeries

            console.log('looped data', data)
            return (
              <Line
                key={`${data.name}-${i}`}
                marker={markers[i]}
                stroke={colors[i]}
                strokeWidth={3}
                data={data.reverse()}
                dateScale={dateScale}
                countScale={countScale}
                getDate={getDate}
                getCount={getCount}
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
          tickLabelProps={() => ({
            fill: gray,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
      </svg>
    </div>
  )
}

/** TS ERROR for date scale
 * Type 'ScaleBand<string>' is not assignable to type '(n: string) => string'.
    Type 'number | undefined' is not assignable to type 'string'.
     Type 'undefined' is not assignable to type 'string'.ts(2322)
 */

interface LineProps {
  data: TimeSeriesData[]
  dateScale: any // see above
  getDate: (d: TimeSeriesData) => number
  countScale: (n: number) => number
  getCount: (d: TimeSeriesData) => number
  strokeDashArray?: number
  stroke?: string
  strokeWidth?: number
  marker: string
}

const Line = ({
  data,
  dateScale,
  getDate,
  countScale,
  getCount,
  strokeDashArray,
  marker,
  ...rest
}: LineProps) => {
  const futureData = data.filter((d) => d.projection)
  const pastData = data.filter((d) => !d.projection)
  return (
    <>
      {/* passed */}
      <LinePath
        {...rest}
        data={pastData}
        x={(d) => dateScale(getDate(d)) ?? 0}
        y={(d) => countScale(getCount(d)) ?? 0}
        markerMid={marker}
        markerStart={marker}
        markerEnd={marker}
      />
      {/* future */}
      <LinePath
        {...rest}
        data={futureData}
        x={(d) => dateScale(getDate(d)) ?? 0}
        y={(d) => countScale(getCount(d)) ?? 0}
        strokeDasharray={5}
        markerMid={marker}
        markerStart={marker}
      />
    </>
  )
}

export interface MarkerProps {
  /** Unique id for the `<marker>`. Should be unique across all page elements. */
  id: string
  /** A number used to determine the size of the bounding box the marker content. */
  size?: number
  /** The width of the marker viewport */
  markerWidth?: string | number
  /** The height of the marker viewport */
  markerHeight?: string | number
  /** Set the coordinate system for the markerWidth, markerHeight, and `<marker>` contents  */
  markerUnits?: string
  /** The x coordinate for the reference point of the maker */
  refX?: string | number
  /** The y coordinate for the reference point of the maker */
  refY?: string | number
  /** The stroke width. constrained to a `number` type due to use in bounding box calculations */
  strokeWidth?: number
  /** The <marker> contents. Typically one of: `<path>`, `<line>`, `<polyline>`, or `<polygon>` */

  fill?: string
}

// Need to have more programtic functionality
export function MarkerSquare({
  id,
  size = 9,
  strokeWidth = 1,
  ...restProps
}: MarkerProps) {
  const bounds = size + strokeWidth * 5
  const mid = bounds / 2

  return (
    <Marker
      id={id}
      markerWidth={bounds}
      markerHeight={bounds}
      refX={2}
      refY={2}
      markerUnits='strokeWidth'
      strokeWidth={strokeWidth}
      {...restProps}
    >
      <rect r={size} width={mid} height={mid} />
    </Marker>
  )
}

export function MarkerArrow({
  id,
  size = 9,
  strokeWidth = 1,
  ...restProps
}: MarkerProps) {
  const max = size + strokeWidth * 2
  const midX = size
  const midY = max / 2
  const points = `0 0, ${size} ${size / 2}, 0 ${size}`

  return (
    <Marker
      id={id}
      markerWidth={max}
      markerHeight={max}
      refX={midX}
      refY={midY}
      orient='270'
      markerUnits='strokeWidth'
      fill='none'
      strokeWidth={strokeWidth}
      {...restProps}
    >
      <g transform={`translate(${strokeWidth}, ${strokeWidth})`}>
        <polyline points={points} />
      </g>
    </Marker>
  )
}
