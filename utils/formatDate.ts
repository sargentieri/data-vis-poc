export const formatDate = (date: string) => {
  if(!date) return 
  let displayDate = date?.split('/')
  return `${displayDate[0]}/ ${displayDate[1]}`
}

export const formatDay = (date: string) => {
  if(!date) return 
  let displayDate = date?.split('/')
  return `${displayDate[1]}`
}

export const formatMonth = (date: string) => {
  const dt = new Date(date); 
  const month = dt.toLocaleString('default', { month: 'short' });
  return month
}