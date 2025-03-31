import _ from 'lodash'

export const ROULETTE_NUMBER_TABLE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

export const ROULETTE_BET_TYPES = {
  STRAIGHT: 'STRAIGHT',
  SPLIT_HORIZONTAL: 'SPLIT_HORIZONTAL',
  STREET: 'STREET',
  CORNER: 'CORNER',
  LINE: 'LINE',
  COLUMN: 'COLUMN',
  DOZEN: 'DOZEN',
  ODD_EVEN: 'ODD_EVEN',
  COLOR: 'COLOR',
  LOW_HIGH: 'LOW_HIGH',
  SPLIT_VERTICAL: 'SPLIT_VERTICAL'
}

export const ROULETTE_BOARD_ROWS = 12

export const ROULETTE_BOARD_COLUMNS = 3

// INFO: Considering the roulette table number from left to right and up to down
//    i.e. [1,  2,  3]
//         [4,  5,  6]
//              .
//              .
//              .
//         [34, 35, 36]
// So the number of rows will be 12 and columns will be 3
// To find the index using 2d row and column aly below formula you can derivate multiple formulas according to your need
// i.e. index = row × number_of_columns + column
//
// Calculating everything with a formula is less costly then maintaining a 2d array and searching through it every time (Loop vs expression complexity).

/** @type {Object<string, App.RouletteRule>} */
export const ROULETTE_RULES = {
  [ROULETTE_BET_TYPES.STRAIGHT]: { payout: 36, winningNumbers: {} },
  [ROULETTE_BET_TYPES.SPLIT_HORIZONTAL]: {
    payout: 18,
    winningNumbers: _.fromPairs(_.times(24, (i) => {
      const firstIndex = (Math.floor(i / 2) * ROULETTE_BOARD_COLUMNS) + (i % 2)
      return [i + 1, [ROULETTE_NUMBER_TABLE[firstIndex], ROULETTE_NUMBER_TABLE[firstIndex + 1]]]
    }))
  },
  [ROULETTE_BET_TYPES.STREET]: {
    payout: 12,
    winningNumbers: _.fromPairs(_.times(12, (i) => {
      const firstIndex = i * ROULETTE_BOARD_COLUMNS
      return [i + 1, _.times(ROULETTE_BOARD_COLUMNS, (j) => ROULETTE_NUMBER_TABLE[firstIndex + j])]
    }))
  },
  [ROULETTE_BET_TYPES.CORNER]: {
    payout: 9,
    winningNumbers: _.fromPairs(_.times(22, (i) => {
      const firstIndex = (Math.floor(i / 2) * ROULETTE_BOARD_COLUMNS) + (i % 2)
      return [i + 1, [ROULETTE_NUMBER_TABLE[firstIndex], ROULETTE_NUMBER_TABLE[firstIndex + 1], ROULETTE_NUMBER_TABLE[firstIndex + 3], ROULETTE_NUMBER_TABLE[firstIndex + 4]]]
    }))
  },
  [ROULETTE_BET_TYPES.LINE]: {
    payout: 6,
    winningNumbers: _.fromPairs(_.times(11, (i) => {
      const firstIndex = i * ROULETTE_BOARD_COLUMNS
      return [i + 1, _.times(6, (j) => ROULETTE_NUMBER_TABLE[firstIndex + j])]
    }))
  },
  [ROULETTE_BET_TYPES.COLUMN]: {
    payout: 3,
    winningNumbers: _.fromPairs(_.times(3, (i) => {
      return [i + 1, _.times(ROULETTE_BOARD_ROWS, (j) => ROULETTE_NUMBER_TABLE[i + (j * 3)])]
    }))
  },
  [ROULETTE_BET_TYPES.DOZEN]: {
    payout: 3,
    winningNumbers: _.fromPairs(_.times(3, (i) => {
      const firstIndex = i * ROULETTE_BOARD_ROWS
      return [i + 1, _.times(ROULETTE_BOARD_ROWS, (j) => ROULETTE_NUMBER_TABLE[firstIndex + j])]
    }))
  },
  [ROULETTE_BET_TYPES.ODD_EVEN]: {
    payout: 2,
    winningNumbers: _.fromPairs(_.times(2, (i) => {
      return [i + 1, _.times(Math.floor(ROULETTE_NUMBER_TABLE.length / 2), (j) => ROULETTE_NUMBER_TABLE[(j * 2) + i])]
    }))
  },
  [ROULETTE_BET_TYPES.COLOR]: {
    payout: 2,
    winningNumbers: {
      1: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
      2: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]
    }
  },
  [ROULETTE_BET_TYPES.LOW_HIGH]: {
    payout: 2,
    winningNumbers: _.fromPairs(_.times(2, (i) => {
      const firstIndex = i * Math.floor(ROULETTE_NUMBER_TABLE.length / 2)
      return [i + 1, _.times(Math.floor(ROULETTE_NUMBER_TABLE.length / 2), (j) => ROULETTE_NUMBER_TABLE[firstIndex + j])]
    }))
  },
  [ROULETTE_BET_TYPES.SPLIT_VERTICAL]: {
    payout: 18,
    winningNumbers: _.fromPairs(_.times(33, (i) => {
      return [i + 1, [ROULETTE_NUMBER_TABLE[i], ROULETTE_NUMBER_TABLE[i + ROULETTE_BOARD_COLUMNS]]]
    }))
  }
}
