/**
 * dynamicSlotConfigs.js
 *
 * This file contains:
 *  - Your new JSON data
 *  - A map of symbol definitions
 *  - Helper methods for building weight tables (base vs. free spin)
 *  - A function to get payout multipliers from “ranges”
 */

/// /////////////////////////////////
// 1. YOUR NEW JSON DATA
/// /////////////////////////////////
export const NEW_SYMBOLS_DATA = [
  {
    id: 79,
    weight: 140,
    key: '1',
    special_type: null,
    special_weight: 973,
    free_spin_weight: 973,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 0.25 },
      { max: 11, min: 10, reward_multiplier: 0.75 },
      { min: 12, reward_multiplier: 2 }
    ],
    board_id: 4,
    more_free_spin_weight: 74
  },
  {
    id: 80,
    weight: 124,
    key: '2',
    special_type: null,
    special_weight: 908,
    free_spin_weight: 908,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 0.4 },
      { max: 11, min: 10, reward_multiplier: 0.9 },
      { min: 12, reward_multiplier: 4 }
    ],
    board_id: 4,
    more_free_spin_weight: 69
  },
  {
    id: 81,
    weight: 104,
    key: '3',
    special_type: null,
    special_weight: 831,
    free_spin_weight: 831,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 0.5 },
      { max: 11, min: 10, reward_multiplier: 1 },
      { min: 12, reward_multiplier: 5 }
    ],
    board_id: 4,
    more_free_spin_weight: 58
  },
  {
    id: 82,
    weight: 89,
    key: '4',
    special_type: null,
    special_weight: 731,
    free_spin_weight: 731,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 0.8 },
      { max: 11, min: 10, reward_multiplier: 1.2 },
      { min: 12, reward_multiplier: 8 }
    ],
    board_id: 4,
    more_free_spin_weight: 47
  },
  {
    id: 83,
    weight: 66,
    key: '5',
    special_type: null,
    special_weight: 577,
    free_spin_weight: 577,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 1 },
      { max: 11, min: 10, reward_multiplier: 1.5 },
      { min: 12, reward_multiplier: 10 }
    ],
    board_id: 4,
    more_free_spin_weight: 30
  },
  {
    id: 84,
    weight: 43,
    key: '6',
    special_type: null,
    special_weight: 376,
    free_spin_weight: 376,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 1.5 },
      { max: 11, min: 10, reward_multiplier: 2 },
      { min: 12, reward_multiplier: 12 }
    ],
    board_id: 4,
    more_free_spin_weight: 26
  },
  {
    id: 85,
    weight: 30,
    key: '7',
    special_type: null,
    special_weight: 324,
    free_spin_weight: 324,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 2 },
      { max: 11, min: 10, reward_multiplier: 5 },
      { min: 12, reward_multiplier: 15 }
    ],
    board_id: 4,
    more_free_spin_weight: 20
  },
  {
    id: 86,
    weight: 24,
    key: '8',
    special_type: null,
    special_weight: 306,
    free_spin_weight: 306,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 2.5 },
      { max: 11, min: 10, reward_multiplier: 10 },
      { min: 12, reward_multiplier: 25 }
    ],
    board_id: 4,
    more_free_spin_weight: 16
  },
  {
    id: 87,
    weight: 16,
    key: '9',
    special_type: null,
    special_weight: 288,
    free_spin_weight: 288,
    special_type_value: null,
    ranges: [
      { max: 9, min: 8, reward_multiplier: 10 },
      { max: 11, min: 10, reward_multiplier: 25 },
      { min: 12, reward_multiplier: 50 }
    ],
    board_id: 4,
    more_free_spin_weight: 10
  },
  {
    id: 88,
    weight: 2,
    key: '10',
    special_type: 'free_spin',
    special_weight: 6,
    free_spin_weight: 6,
    special_type_value: 5,
    ranges: [
      { max: 3, min: 3, reward_multiplier: 0 },
      { max: 4, min: 4, reward_multiplier: 3 },
      { max: 5, min: 5, reward_multiplier: 5 },
      { min: 6, reward_multiplier: 100 }
    ],
    board_id: 4,
    more_free_spin_weight: 6
  },
  {
    id: 89,
    weight: 0,
    key: 'b2',
    special_type: 'multiplier',
    special_weight: 48,
    free_spin_weight: 48,
    special_type_value: 2,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 90,
    weight: 0,
    key: 'b3',
    special_type: 'multiplier',
    special_weight: 42,
    free_spin_weight: 42,
    special_type_value: 3,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 91,
    weight: 0,
    key: 'b5',
    special_type: 'multiplier',
    special_weight: 39,
    free_spin_weight: 39,
    special_type_value: 5,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 92,
    weight: 0,
    key: 'b8',
    special_type: 'multiplier',
    special_weight: 36,
    free_spin_weight: 36,
    special_type_value: 8,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 93,
    weight: 0,
    key: 'b10',
    special_type: 'multiplier',
    special_weight: 33,
    free_spin_weight: 33,
    special_type_value: 10,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 94,
    weight: 0,
    key: 'b12',
    special_type: 'multiplier',
    special_weight: 30,
    free_spin_weight: 30,
    special_type_value: 12,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 95,
    weight: 0,
    key: 'b15',
    special_type: 'multiplier',
    special_weight: 27,
    free_spin_weight: 27,
    special_type_value: 15,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 96,
    weight: 0,
    key: 'b18',
    special_type: 'multiplier',
    special_weight: 24,
    free_spin_weight: 24,
    special_type_value: 18,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 97,
    weight: 0,
    key: 'b20',
    special_type: 'multiplier',
    special_weight: 21,
    free_spin_weight: 21,
    special_type_value: 20,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 98,
    weight: 0,
    key: 'b25',
    special_type: 'multiplier',
    special_weight: 18,
    free_spin_weight: 18,
    special_type_value: 25,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 99,
    weight: 0,
    key: 'b30',
    special_type: 'multiplier',
    special_weight: 15,
    free_spin_weight: 15,
    special_type_value: 30,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 100,
    weight: 0,
    key: 'b35',
    special_type: 'multiplier',
    special_weight: 12,
    free_spin_weight: 12,
    special_type_value: 35,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 101,
    weight: 0,
    key: 'b50',
    special_type: 'multiplier',
    special_weight: 9,
    free_spin_weight: 9,
    special_type_value: 50,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  },
  {
    id: 102,
    weight: 0,
    key: 'b100',
    special_type: 'multiplier',
    special_weight: 6,
    free_spin_weight: 6,
    special_type_value: 100,
    ranges: [],
    board_id: 4,
    more_free_spin_weight: 0
  }
]

/// /////////////////////////////////
// 2. Build a map for easy lookups
/// /////////////////////////////////
export const symbolDefMap = {}
for (const symbolData of NEW_SYMBOLS_DATA) {
  symbolDefMap[symbolData.key] = symbolData
}

/// /////////////////////////////////
// 3. Build “weight tables” for random symbol picks
/// /////////////////////////////////
export function buildBaseWeightTable () {
  const table = {}
  for (const key in symbolDefMap) {
    const info = symbolDefMap[key]
    // By default, let's use "weight"
    table[key] = info.weight || 0
  }
  return table
}

export function buildFreeSpinWeightTable () {
  const table = {}
  for (const key in symbolDefMap) {
    const info = symbolDefMap[key]
    // By default, let's use "free_spin_weight"
    table[key] = info.free_spin_weight || 0
  }
  return table
}

/// /////////////////////////////////
// 4. Helper to get the “reward_multiplier” from a symbol’s ranges, given a count
/// /////////////////////////////////
export function getSymbolPayoutMultiplier (symbolKey, count) {
  const def = symbolDefMap[symbolKey]
  if (!def || !def.ranges) return 0

  for (const r of def.ranges) {
    const { min, max, reward_multiplier } = r
    const hasMin = (typeof min === 'number')
    const hasMax = (typeof max === 'number')

    if (hasMin && hasMax) {
      if (count >= min && count <= max) {
        return reward_multiplier
      }
    } else if (hasMin && !hasMax) {
      // means min or more
      if (count >= min) {
        return reward_multiplier
      }
    }
  }
  return 0
}
