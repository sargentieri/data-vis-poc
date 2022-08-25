import weatherData from '../data/weather.json'
import pestData from '../data/pest.json'

export const dailyData = weatherData.daily.map((d) => ({
  avg: (d.temp.day - 273.15).toString(),
  dt: new Date(d.dt * 1000).toLocaleString('en-US').split(',')[0],
  humidity: d.humidity,
  windSpeed: d.wind_speed,
  rainfall: d.rain ?? 0,
}))

export const tempRangeData = weatherData.daily.map((d) => ({
  min: (d.temp.min - 273.15).toString(),
  avg: (d.temp.day - 273.15).toString(),
  max: (d.temp.max - 273.15).toString(),
  dt: new Date(d.dt * 1000).toLocaleString('en-US').split(',')[0],
}))

export const pestDataByFarm = pestData.farms.map((d) => {
  const pests = d.pests.map((p) => {
    
    const timeSeries = p.pestTimeSeries.map((ts) => {
      const newDate = new Date(ts?.week).toLocaleString('en-US').split(',')[0]

      return {
        date: newDate,
        count: ts.count,
        projection: ts.projection
      }
    }) 

    return {
      name: p.name, 
      pestTimeSeries: timeSeries
    }
  })

  return {
    name: d.name,
    pests: pests
  }
})

