import * as React from 'react'

import pestData from '../../data/pest.json'

export const PestCountsChart = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  console.log('pest data', pestData)

  return (
    <div>
      <h3>PestCounts</h3>
    </div>
  )
}
