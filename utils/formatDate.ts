export const formatDate = (date: string) => {
  let displayDate = date.split('/')
  return `${displayDate[0]}/ ${displayDate[1]}`
}