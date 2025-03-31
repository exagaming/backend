import { dayjs } from '@src/libs/day'

export function secondsToMidnight () {
  const now = dayjs()
  return now.endOf('day').diff(now, 'second')
}
