import { serverDayjs } from '@src/libs/day'
import { Op } from 'sequelize'

/**
 * @param {string} startDate
 * @param {string} endDate
 * @returns
 */
export function alignDatabaseDateFilter (startDate, endDate) {
  let filterObj = {}
  if (startDate && endDate) filterObj = { [Op.between]: [serverDayjs(startDate).format(), serverDayjs(endDate).format()] }
  else if (endDate) filterObj = { [Op.gte]: serverDayjs(endDate).format() }
  else if (startDate) filterObj = { [Op.gte]: serverDayjs(startDate).format() }

  return filterObj
}
