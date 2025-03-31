import { MINE_MAX_TILE_COUNT } from '@src/utils/constants/mine.constants'
import { calculateOdds } from '@src/utils/math.utils'

/**
 * @param {number} numberOfMines
 * @param {number} openTileCount
 * @param {number} minOdds
 * @param {number} maxOdds
 * @param {number} houseEdge
 * @returns {number}
 */
export function calculateMineGameOdd (numberOfMines, openTileCount, minOdds, maxOdds, houseEdge) {
  let combinedOdds = 1

  for (let index = 0; index < openTileCount; index++) {
    combinedOdds *= 1 / ((MINE_MAX_TILE_COUNT - numberOfMines - index) / (MINE_MAX_TILE_COUNT - index))
  }

  return calculateOdds(minOdds, maxOdds, houseEdge, combinedOdds)
}
