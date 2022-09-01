import * as R from 'react'
// graph basics
import { Group } from '@visx/group'
import { Text } from '@visx/text'
// grid and axis defs
import { AxisBottom, AxisLeft, SharedAxisProps, AxisScale } from '@visx/axis'
import { formatDay } from '../../utils/formatDate'

type MarginType = {
  top: number
  left: number
  right: number
  bottom: number
}

type AxesComponentProps = Omit<SharedAxisProps<AxisScale>, 'scale'> & {
  margin: MarginType
  xScale: any
  yScale: any
  yTitle: string
  innerHeight: number
  innerWidth: number
  data: any
}

export const Axes = ({
  margin,
  xScale,
  yScale,
  yTitle,
  data,
  innerHeight,
  innerWidth,
  ...rest
}: AxesComponentProps) => {
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

  const lowerAxisLabels = monthDisplay(data[data.name])

  console.log('data', data)

  return (
    <>
      <Text
        x={margin.left / 2}
        y={margin.top / 2}
        fontSize={12}
        lineHeight={21.86}
        fill={'black'}
        style={{ textDecorationColor: rest.stroke }}
      >
        {yTitle}
      </Text>
      <AxisLeft
        {...rest}
        left={margin.left}
        top={margin.top}
        scale={yScale}
        numTicks={4}
        hideTicks
        hideAxisLine
      />
      <AxisBottom
        {...rest}
        tickFormat={formatDay}
        top={innerHeight + margin.top}
        scale={xScale}
        left={margin.left}
      />
      <Group
        top={innerHeight + margin.top + margin.bottom - 5}
        left={margin.left - 5}
      >
        {lowerAxisLabels?.map((m, i) => {
          const monthsArr = data[data.name]
          const month = monthsArr[i]

          console.log('month', month)
          return (
            <Text
              key={`${m}-${i}`}
              fontSize={11}
              overflow='visible'
              fill={rest.stroke}
              x={xScale(month && month?.dt)}
            >
              {m}
            </Text>
          )
        })}
      </Group>
    </>
  )
}
