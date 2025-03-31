import { DEFAULT_PRECISION_MONEY } from './constants/game.constants'

/**
 * @param {Object} gameSettings
 * @param {Number} probability
 * @returns {Number} Calculated Odds
 */
export function calculateOdds (minOdd, maxOdd, houseEdge, odds) {
  return Math.floor(Math.max(minOdd, Math.min(maxOdd, odds * (1 - houseEdge / 100))) * 100) / 100
}

/**
 *
 * @param {number} value
 * @param {number} precision
 * @returns {number} Returns precision value for specified decimal places
 */
export const getPrecision = (value, precision = DEFAULT_PRECISION_MONEY) => {
  const precisionDivide = 10 ** precision
  const result = parseInt(value * precisionDivide) / precisionDivide
  return result || 0
}
