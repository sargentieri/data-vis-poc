export const formatDate = (date: string) => {
  if(!date) return 
  let displayDate = date?.split('/')
  return `${displayDate[0]}/ ${displayDate[1]}`
}