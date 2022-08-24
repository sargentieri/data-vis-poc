import data from '../data/weather.json'

export const dailyData = data.daily.map((d) => ({
  avg: (d.temp.day - 273.15).toString(),
  dt: new Date(d.dt * 1000).toLocaleString('en-US').split(',')[0],
  humidity: d.humidity,
  windSpeed: d.wind_speed,
  rainfall: d.rain ?? 0,
}))

export const tempRangeData = data.daily.map((d) => ({
  min: (d.temp.min - 273.15).toString(),
  avg: (d.temp.day - 273.15).toString(),
  max: (d.temp.max - 273.15).toString(),
  dt: new Date(d.dt * 1000).toLocaleString('en-US').split(',')[0],
}))
