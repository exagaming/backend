const REEL_SYMBOL_ID = {
  HV1: 201,
  HV2: 202,
  HV3: 203,
  HV4: 204,
  LV1: 101,
  LV2: 102,
  LV3: 103,
  LV4: 104,
  LV5: 105,
  SCATTER: 25,
  MULT: 1001
}

export const REEL_SYMBOL_ID_REVERSE_MAP = {
  201: 'HV1',
  202: 'HV2',
  203: 'HV3',
  204: 'HV4',
  101: 'LV1',
  102: 'LV2',
  103: 'LV3',
  104: 'LV4',
  105: 'LV5',
  25: 'SCATTER',
  1001: 'MULT'
}

const MULTIPLIER_WEIGHT_TABLE = {
  A: {
    2: 48,
    3: 42,
    5: 39,
    8: 36,
    10: 33,
    12: 30,
    15: 27,
    18: 24,
    20: 21,
    25: 18,
    30: 15,
    35: 12,
    50: 9,
    100: 6
  },
  B: {
    2: 48,
    3: 42,
    5: 39,
    8: 36,
    10: 33,
    12: 30,
    15: 27,
    18: 24,
    20: 21,
    25: 18,
    30: 15,
    35: 12,
    50: 9,
    100: 6
  }
}

const REEL_WEIGHT_TABLE = {
  A: 0.155,
  B: 0.144,
  C: 0.701
}

const ANTE_REEL_WEIGHT_TABLE = {
  A: 0.14,
  B: 0.19,
  C: 0.67
}

const REEL_A_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1',
      'HV2', 'LV4', 'LV5', 'LV3', 'LV5', 'LV5',
      'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2',
      'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4',
      'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2',
      'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4',
      'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5',
      'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2',
      'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1',
      'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2',
      'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1',
      'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1',
      'HV2', 'LV4'
    ],
    reel_symbol_total_count: 80,
    reel_symbol_count: {
      HV1: 6,
      HV2: 18,
      HV3: 6,
      HV4: 8,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 9,
      LV4: 13,
      LV5: 7
    }
  },
  REEL_2: {
    reel_sequence: [
      'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1',
      'HV3', 'HV4', 'LV2', 'LV4', 'LV4', 'LV5',
      'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5',
      'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4',
      'LV2', 'LV1', 'LV3', 'LV4', 'LV5', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2',
      'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4',
      'LV2', 'LV2', 'LV4', 'LV3', 'LV3', 'LV3',
      'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3',
      'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2',
      'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1',
      'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1',
      'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4',
      'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3',
      'LV3'
    ],
    reel_symbol_total_count: 91,
    reel_symbol_count: {
      HV1: 8,
      HV2: 12,
      HV3: 10,
      HV4: 10,
      MULT: 0,
      SCATTER: 0,
      LV1: 2,
      LV2: 16,
      LV3: 13,
      LV4: 12,
      LV5: 8
    }
  },
  REEL_3: {
    reel_sequence: [
      'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV2',
      'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2',
      'LV1', 'LV1', 'LV5', 'LV2', 'LV3', 'LV3',
      'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV1',
      'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2',
      'LV2', 'LV4', 'LV4', 'LV2', 'HV3', 'HV1',
      'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2',
      'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2',
      'LV2', 'LV3', 'LV4', 'LV4', 'SCATTER', 'LV5',
      'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV4', 'LV4'
    ],
    reel_symbol_total_count: 77,
    reel_symbol_count: {
      HV1: 9,
      HV2: 5,
      HV3: 13,
      HV4: 4,
      MULT: 0,
      SCATTER: 1,
      LV1: 4,
      LV2: 18,
      LV3: 6,
      LV4: 10,
      LV5: 7
    }
  },
  REEL_4: {
    reel_sequence: [
      'HV2', 'HV3', 'HV3', 'LV3', 'LV1', 'LV1',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5',
      'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2',
      'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4',
      'HV4', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3',
      'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3',
      'LV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5',
      'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2',
      'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4',
      'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3',
      'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3'
    ],
    reel_symbol_total_count: 83,
    reel_symbol_count: {
      HV1: 10,
      HV2: 8,
      HV3: 12,
      HV4: 6,
      MULT: 0,
      SCATTER: 0,
      LV1: 11,
      LV2: 12,
      LV3: 16,
      LV4: 2,
      LV5: 6
    }
  },
  REEL_5: {
    reel_sequence: [
      'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3',
      'HV1', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4',
      'HV2', 'HV4', 'HV1', 'LV1', 'LV3', 'LV2',
      'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3',
      'LV4', 'LV4', 'LV1', 'HV2', 'HV2', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3',
      'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2',
      'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3',
      'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2',
      'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3',
      'LV4', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3',
      'HV3', 'HV4'
    ],
    reel_symbol_total_count: 86,
    reel_symbol_count: {
      HV1: 11,
      HV2: 12,
      HV3: 10,
      HV4: 6,
      MULT: 0,
      SCATTER: 0,
      LV1: 8,
      LV2: 12,
      LV3: 12,
      LV4: 13,
      LV5: 2
    }
  },
  REEL_6: {
    reel_sequence: [
      'HV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2',
      'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1',
      'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2',
      'LV3', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3',
      'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV1', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1',
      'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2',
      'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3',
      'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3',
      'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV1', 'LV1'
    ],
    reel_symbol_total_count: 86,
    reel_symbol_count: {
      HV1: 1,
      HV2: 8,
      HV3: 12,
      HV4: 14,
      MULT: 0,
      SCATTER: 0,
      LV1: 19,
      LV2: 16,
      LV3: 8,
      LV4: 4,
      LV5: 4
    }
  }
}

const REEL_B_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'HV2', 'HV3', 'HV4',
      'LV1', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV4',
      'LV1', 'HV4', 'HV4',
      'HV4', 'LV1', 'LV1',
      'LV2', 'LV3', 'LV4',
      'LV5', 'LV1', 'HV4',
      'HV3', 'HV3', 'HV1'
    ],
    reel_symbol_total_count: 24,
    reel_symbol_count: {
      HV1: 1,
      HV2: 2,
      HV3: 4,
      HV4: 8,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 1,
      LV3: 1,
      LV4: 1,
      LV5: 1
    }
  },
  REEL_2: {
    reel_sequence: [
      'HV2', 'HV3', 'HV4',
      'HV4', 'HV3', 'HV2',
      'HV4', 'HV4', 'HV2',
      'HV4', 'LV1', 'HV4',
      'LV1', 'LV1', 'LV1',
      'LV2', 'LV3', 'LV4',
      'LV5', 'HV4', 'LV1',
      'HV3', 'HV3', 'HV1'
    ],
    reel_symbol_total_count: 24,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 7,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 1,
      LV3: 1,
      LV4: 1,
      LV5: 1
    }
  },
  REEL_3: {
    reel_sequence: [
      'HV2', 'HV3', 'HV4',
      'LV4', 'HV3', 'HV4',
      'HV4', 'LV1', 'HV2',
      'HV4', 'HV4', 'HV4',
      'LV1', 'LV1', 'LV1',
      'LV2', 'LV3', 'LV4',
      'LV5', 'HV3', 'HV4',
      'HV3', 'HV3', 'HV1'
    ],
    reel_symbol_total_count: 24,
    reel_symbol_count: {
      HV1: 1,
      HV2: 2,
      HV3: 5,
      HV4: 7,
      MULT: 0,
      SCATTER: 0,
      LV1: 4,
      LV2: 1,
      LV3: 1,
      LV4: 2,
      LV5: 1
    }
  },
  REEL_4: {
    reel_sequence: [
      'HV2', 'HV3', 'HV4',
      'LV1', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV4',
      'HV3', 'HV4', 'LV4',
      'LV1', 'LV1', 'LV1',
      'LV2', 'LV3', 'LV4',
      'LV5', 'HV4', 'LV3',
      'HV3', 'HV3', 'HV1'
    ],
    reel_symbol_total_count: 24,
    reel_symbol_count: {
      HV1: 1,
      HV2: 2,
      HV3: 5,
      HV4: 6,
      MULT: 0,
      SCATTER: 0,
      LV1: 4,
      LV2: 1,
      LV3: 2,
      LV4: 2,
      LV5: 1
    }
  },
  REEL_5: {
    reel_sequence: [
      'LV2', 'HV1', 'LV4', 'LV5',
      'LV3', 'LV4', 'LV3', 'LV2',
      'LV4', 'LV5', 'LV4', 'LV5',
      'LV1', 'HV2', 'LV4', 'LV2',
      'LV3', 'LV4', 'HV3', 'LV5',
      'LV5', 'LV3', 'HV4', 'LV1',
      'LV2', 'HV1', 'LV4', 'LV5',
      'LV3', 'LV4', 'LV3', 'LV2',
      'LV4', 'LV5', 'LV4', 'LV5',
      'LV1', 'HV2', 'LV2', 'LV3',
      'LV4', 'HV3', 'LV5', 'LV5',
      'LV3', 'HV4', 'LV1'
    ],
    reel_symbol_total_count: 47,
    reel_symbol_count: {
      HV1: 2,
      HV2: 2,
      HV3: 2,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 4,
      LV2: 6,
      LV3: 8,
      LV4: 11,
      LV5: 10
    }
  },
  REEL_6: {
    reel_sequence: [
      'LV2', 'HV1', 'LV4',
      'LV5', 'LV3', 'LV4',
      'LV4', 'LV4', 'LV2',
      'LV4', 'LV5', 'LV4',
      'LV5', 'LV1', 'HV2',
      'LV2', 'LV3', 'LV4',
      'HV3', 'LV5', 'LV5',
      'LV3', 'HV4', 'LV1'
    ],
    reel_symbol_total_count: 10,
    reel_symbol_count: {
      HV1: 1,
      HV2: 1,
      HV3: 1,
      HV4: 1,
      MULT: 0,
      SCATTER: 0,
      LV1: 2,
      LV2: 3,
      LV3: 3,
      LV4: 7,
      LV5: 5
    }
  }
}

const REEL_C_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'HV1', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'HV1', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV4', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'HV1', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'HV1', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4'],
    reel_symbol_total_count: 181,
    reel_symbol_count: {
      HV1: 12,
      HV2: 16,
      HV3: 16,
      HV4: 9,
      MULT: 0,
      SCATTER: 0,
      LV1: 24,
      LV2: 40,
      LV3: 16,
      LV4: 24,
      LV5: 24
    }
  },
  REEL_2: {
    reel_sequence: ['LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV3', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'SCATTER', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2'],
    reel_symbol_total_count: 189,
    reel_symbol_count: {
      HV1: 8,
      HV2: 16,
      HV3: 24,
      HV4: 8,
      MULT: 0,
      SCATTER: 4,
      LV1: 16,
      LV2: 24,
      LV3: 25,
      LV4: 24,
      LV5: 40
    }
  },
  REEL_3: {
    reel_sequence: ['LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4'],
    reel_symbol_total_count: 181,
    reel_symbol_count: {
      HV1: 8,
      HV2: 16,
      HV3: 16,
      HV4: 8,
      MULT: 0,
      SCATTER: 4,
      LV1: 24,
      LV2: 40,
      LV3: 9,
      LV4: 24,
      LV5: 32
    }
  },
  REEL_4: {
    reel_sequence: ['LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5'],
    reel_symbol_total_count: 180,
    reel_symbol_count: {
      HV1: 8,
      HV2: 16,
      HV3: 9,
      HV4: 8,
      MULT: 0,
      SCATTER: 3,
      LV1: 24,
      LV2: 32,
      LV3: 8,
      LV4: 24,
      LV5: 48
    }
  },
  REEL_5: {
    reel_sequence: ['LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'SCATTER', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4'],
    reel_symbol_total_count: 367,
    reel_symbol_count: {
      HV1: 16,
      HV2: 32,
      HV3: 32,
      HV4: 16,
      MULT: 0,
      SCATTER: 14,
      LV1: 65,
      LV2: 48,
      LV3: 32,
      LV4: 64,
      LV5: 48
    }
  },
  REEL_6: {
    reel_sequence: ['HV1', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV3', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'SCATTER', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'SCATTER', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4'],
    reel_symbol_total_count: 368,
    reel_symbol_count: {
      HV1: 17,
      HV2: 32,
      HV3: 16,
      HV4: 16,
      MULT: 0,
      SCATTER: 15,
      LV1: 48,
      LV2: 64,
      LV3: 33,
      LV4: 64,
      LV5: 63
    }
  }
}

const CASCADING_REEL_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV1', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4'],
    reel_symbol_total_count: 313,
    reel_symbol_count: {
      HV1: 24,
      HV2: 72,
      HV3: 24,
      HV4: 32,
      MULT: 0,
      SCATTER: 0,
      LV1: 25,
      LV2: 32,
      LV3: 32,
      LV4: 48,
      LV5: 24
    }
  },
  REEL_2: {
    reel_sequence: ['LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV5', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3'],
    reel_symbol_total_count: 353,
    reel_symbol_count: {
      HV1: 32,
      HV2: 48,
      HV3: 40,
      HV4: 40,
      MULT: 0,
      SCATTER: 0,
      LV1: 8,
      LV2: 64,
      LV3: 48,
      LV4: 40,
      LV5: 33
    }
  },
  REEL_3: {
    reel_sequence: ['LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV4', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4'],
    reel_symbol_total_count: 289,
    reel_symbol_count: {
      HV1: 32,
      HV2: 16,
      HV3: 48,
      HV4: 17,
      MULT: 0,
      SCATTER: 0,
      LV1: 16,
      LV2: 72,
      LV3: 24,
      LV4: 40,
      LV5: 24
    }
  },
  REEL_4: {
    reel_sequence: ['HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'MULT', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3'],
    reel_symbol_total_count: 321,
    reel_symbol_count: {
      HV1: 40,
      HV2: 32,
      HV3: 48,
      HV4: 24,
      MULT: 0,
      SCATTER: 0,
      LV1: 40,
      LV2: 48,
      LV3: 56,
      LV4: 9,
      LV5: 24
    }
  },
  REEL_5: {
    reel_sequence: ['HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV5', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4'],
    reel_symbol_total_count: 329,
    reel_symbol_count: {
      HV1: 40,
      HV2: 48,
      HV3: 40,
      HV4: 24,
      MULT: 0,
      SCATTER: 0,
      LV1: 24,
      LV2: 48,
      LV3: 48,
      LV4: 48,
      LV5: 9
    }
  },
  REEL_6: {
    reel_sequence: ['HV2', 'HV2', 'LV1', 'HV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV5', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1'],
    reel_symbol_total_count: 330,
    reel_symbol_count: {
      HV1: 1,
      HV2: 32,
      HV3: 48,
      HV4: 56,
      MULT: 0,
      SCATTER: 0,
      LV1: 72,
      LV2: 64,
      LV3: 24,
      LV4: 16,
      LV5: 17
    }
  }
}

const REEL_SYMBOLS = ['HV1', 'HV2', 'HV3', 'HV4', 'LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'SCATTER', 'MULT']

const REEL_SYMBOLS_KEYS = {
  HV1: 'HV1',
  HV2: 'HV2',
  HV3: 'HV3',
  HV4: 'HV4',
  LV1: 'LV1',
  LV2: 'LV2',
  LV3: 'LV3',
  LV4: 'LV4',
  LV5: 'LV5',
  SCATTER: 'SCATTER',
  MULT: 'MULT',
  RANDSYM: 'RANDSYM'
}

// INFO: These are payouts are according to the bet of 1
const REEL_SYMBOL_COMBINATION_PAYOUT = {
  HV1: {
    8: 20,
    9: 20,
    10: 50,
    11: 50,
    12: 100
  },
  HV2: {
    8: 5,
    9: 5,
    10: 20,
    11: 20,
    12: 50
  },
  HV3: {
    8: 4,
    9: 4,
    10: 10,
    11: 10,
    12: 30
  },
  HV4: {
    8: 3,
    9: 3,
    10: 4,
    11: 4,
    12: 24
  },
  LV1: {
    8: 2,
    9: 2,
    10: 3,
    11: 3,
    12: 20
  },
  LV2: {
    8: 1.60,
    9: 1.60,
    10: 2.40,
    11: 2.40,
    12: 16
  },
  LV3: {
    8: 1,
    9: 1,
    10: 2,
    11: 2,
    12: 10
  },
  LV4: {
    8: 0.8,
    9: 0.48,
    10: 1.8,
    11: 1.8,
    12: 8
  },
  LV5: {
    8: 0.50,
    9: 0.50,
    10: 1.5,
    11: 1.5,
    12: 4
  },
  // Free Spin Config
  SCATTER: {
    4: 6,
    5: 10,
    6: 200
  }
}

const ANTE_REEL_SYMBOL_COMBINATION_PAYOUT = {
  HV1: {
    8: 8,
    9: 8,
    10: 20,
    11: 20,
    12: 40
  },
  HV2: {
    8: 2,
    9: 2,
    10: 8,
    11: 8,
    12: 20
  },
  HV3: {
    8: 1.6,
    9: 1.6,
    10: 4,
    11: 4,
    12: 12
  },
  HV4: {
    8: 1.2,
    9: 1.2,
    10: 1.6,
    11: 1.6,
    12: 9.6
  },
  LV1: {
    8: 0.8,
    9: 0.8,
    10: 1.2,
    11: 1.2,
    12: 8
  },
  LV2: {
    8: 0.64,
    9: 0.64,
    10: 0.96,
    11: 0.96,
    12: 6.4
  },
  LV3: {
    8: 0.4,
    9: 0.4,
    10: 0.8,
    11: 0.8,
    12: 4
  },
  LV4: {
    8: 0.32,
    9: 0.32,
    10: 0.72,
    11: 0.72,
    12: 3.2
  },
  LV5: {
    8: 0.2,
    9: 0.2,
    10: 0.6,
    11: 0.6,
    12: 1.6
  },
  // Free Spin Config
  SCATTER: {
    4: 2.4,
    5: 4,
    6: 80
  }
}

// INFO: Free Game Constants
const FREE_GAME_REEL_A_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV2', 'HV2', 'MULT', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV2', 'HV4', 'HV1', 'HV1', 'HV3', 'MULT', 'LV2', 'LV2', 'LV1',
      'LV3', 'LV4', 'HV2', 'HV3', 'HV4', 'HV4', 'LV4', 'LV4', 'LV4',
      'LV3', 'LV1', 'LV1', 'HV2', 'HV2', 'HV1', 'LV4', 'LV4'
    ],
    reel_symbol_total_count: 80,
    reel_symbol_count: {
      HV1: 6,
      HV2: 10,
      HV3: 6,
      HV4: 3,
      MULT: 3,
      SCATTER: 0,
      LV1: 13,
      LV2: 12,
      LV3: 11,
      LV4: 13,
      LV5: 0
    }
  },
  REEL_2: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV2', 'HV2', 'MULT', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV2', 'HV4', 'HV1', 'HV1', 'HV3', 'MULT', 'LV2', 'LV2', 'LV1',
      'LV3', 'LV4', 'HV2', 'HV3', 'HV4', 'HV4', 'LV4', 'LV4', 'LV4',
      'LV3', 'LV1', 'LV1', 'HV2', 'HV2', 'HV1', 'LV4', 'LV4', 'LV3', 'LV3', 'LV2', 'LV2'
    ],
    reel_symbol_total_count: 90,
    reel_symbol_count: {
      HV1: 8,
      HV2: 10,
      HV3: 8,
      HV4: 4,
      MULT: 3,
      SCATTER: 0,
      LV1: 11,
      LV2: 15,
      LV3: 13,
      LV4: 15,
      LV5: 0
    }
  },
  REEL_3: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV1', 'HV1', 'MULT', 'HV3',
      'HV3', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV1',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV1', 'HV1', 'HV3', 'MULT', 'LV2', 'LV2', 'LV1', 'LV3', 'LV4',
      'LV4', 'LV4', 'LV4', 'LV4', 'LV2', 'LV2', 'LV4', 'LV4'
    ],
    reel_symbol_total_count: 75,
    reel_symbol_count: {
      HV1: 8,
      HV2: 3,
      HV3: 10,
      HV4: 2,
      MULT: 3,
      SCATTER: 0,
      LV1: 10,
      LV2: 15,
      LV3: 9,
      LV4: 15,
      LV5: 0
    }
  },
  REEL_4: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV2', 'HV2', 'MULT', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV1', 'HV1', 'HV1', 'MULT', 'HV2', 'HV2', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV2', 'HV2'
    ],
    reel_symbol_total_count: 82,
    reel_symbol_count: {
      HV1: 10,
      HV2: 8,
      HV3: 6,
      HV4: 2,
      MULT: 3,
      SCATTER: 0,
      LV1: 12,
      LV2: 14,
      LV3: 10,
      LV4: 15,
      LV5: 0
    }
  },
  REEL_5: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV1', 'HV1', 'MULT', 'HV3',
      'HV3', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV1',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV1', 'HV1', 'HV1', 'MULT', 'HV2', 'HV2', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV4', 'LV4', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'HV2', 'HV2', 'HV1', 'HV1'
    ],
    reel_symbol_total_count: 85,
    reel_symbol_count: {
      HV1: 10,
      HV2: 10,
      HV3: 8,
      HV4: 2,
      MULT: 3,
      SCATTER: 0,
      LV1: 11,
      LV2: 13,
      LV3: 10,
      LV4: 15,
      LV5: 0
    }
  },
  REEL_6: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV1', 'HV1', 'MULT', 'HV3',
      'HV3', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV1',
      'LV1', 'LV1', 'LV1', 'LV3', 'MULT', 'LV2', 'LV2', 'LV2', 'LV3',
      'LV4', 'LV4', 'HV2', 'HV1', 'HV1', 'HV4', 'HV3', 'HV3', 'HV2',
      'HV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV1', 'HV1', 'HV1', 'MULT', 'HV2', 'HV2', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV4', 'LV4', 'LV4', 'LV1', 'LV1', 'HV2', 'HV2', 'LV3', 'LV3', 'LV2', 'LV2', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 84,
    reel_symbol_count: {
      HV1: 10,
      HV2: 8,
      HV3: 8,
      HV4: 2,
      MULT: 3,
      SCATTER: 0,
      LV1: 14,
      LV2: 14,
      LV3: 10,
      LV4: 15,
      LV5: 0
    }
  }
}

const FREE_GAME_REEL_B_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV1', 'LV1', 'HV1',
      'HV2', 'HV3', 'HV2', 'LV3', 'LV3', 'LV2', 'LV1', 'LV1', 'LV4'
    ],
    reel_symbol_total_count: 36,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 3,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 6,
      LV3: 9,
      LV4: 5,
      LV5: 2
    }
  },
  REEL_2: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV4', 'LV4', 'LV5', 'LV5', 'LV1', 'LV1', 'HV1',
      'HV3', 'HV2', 'HV3', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4'
    ],
    reel_symbol_total_count: 34,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 5,
      LV2: 5,
      LV3: 6,
      LV4: 7,
      LV5: 4
    }
  },
  REEL_3: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV1', 'LV1', 'HV1',
      'HV3', 'HV2', 'HV3', 'LV3', 'LV3', 'LV2', 'LV1', 'LV1', 'LV4'
    ],
    reel_symbol_total_count: 36,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 6,
      LV3: 9,
      LV4: 5,
      LV5: 2
    }
  },
  REEL_4: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV4', 'LV4', 'LV5', 'LV5', 'LV1', 'LV1', 'HV1',
      'HV3', 'HV2', 'HV3', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4'
    ],
    reel_symbol_total_count: 34,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 5,
      LV2: 5,
      LV3: 6,
      LV4: 7,
      LV5: 4
    }
  },
  REEL_5: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV1', 'LV1', 'HV1',
      'HV3', 'HV2', 'HV3', 'LV3', 'LV3', 'LV2', 'LV1', 'LV1', 'LV4'
    ],
    reel_symbol_total_count: 36,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 6,
      LV3: 9,
      LV4: 5,
      LV5: 2
    }
  },
  REEL_6: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'MULT', 'LV5', 'LV5', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV1', 'LV1', 'HV1',
      'HV3', 'HV2', 'HV3', 'LV3', 'LV3', 'LV2', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 34,
    reel_symbol_count: {
      HV1: 1,
      HV2: 3,
      HV3: 4,
      HV4: 1,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 6,
      LV3: 9,
      LV4: 5,
      LV5: 2
    }
  }
}

const FREE_GAME_REEL_C_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1', 'LV4'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  },
  REEL_2: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  },
  REEL_3: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  },
  REEL_4: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  },
  REEL_5: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  },
  REEL_6: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'LV5', 'LV5', 'LV2', 'LV2', 'LV3', 'HV2', 'HV3', 'HV4', 'LV1', 'LV1'
    ],
    reel_symbol_total_count: 38,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 3,
      HV4: 2,
      MULT: 0,
      SCATTER: 0,
      LV1: 5,
      LV2: 8,
      LV3: 7,
      LV4: 5,
      LV5: 4
    }
  }
}

const FREE_GAME_CASCADING_REEL_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4',
      'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV3', 'HV3', 'HV4',
      'HV2', 'LV1', 'LV2', 'LV3', 'LV4', 'LV4', 'LV2', 'LV2', 'LV3',
      'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV1', 'LV4', 'LV4', 'LV3',
      'MULT', 'LV1', 'LV3', 'LV5', 'LV5', 'HV3', 'HV2', 'LV4', 'LV4',
      'LV3', 'LV2', 'LV1', 'HV2', 'HV1', 'HV2', 'HV4', 'HV4', 'LV1',
      'LV2', 'LV3', 'LV4', 'LV4', 'HV3', 'HV3', 'HV2'
    ],
    reel_symbol_total_count: 70,
    reel_symbol_count: {
      HV1: 4,
      HV2: 10,
      HV3: 6,
      HV4: 6,
      MULT: 1,
      SCATTER: 0,
      LV1: 8,
      LV2: 10,
      LV3: 8,
      LV4: 9,
      LV5: 4
    }
  },
  REEL_2: {
    reel_sequence: [
      'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4',
      'LV4', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV1', 'MULT', 'LV4', 'LV5', 'LV3', 'LV3', 'LV4',
      'HV3', 'HV2', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV1', 'LV1',
      'HV4', 'HV4', 'HV2', 'LV3', 'LV2', 'LV3', 'LV4', 'LV4', 'LV4',
      'HV3', 'HV1', 'HV2'
    ],
    reel_symbol_total_count: 50,
    reel_symbol_count: {
      HV1: 4,
      HV2: 5,
      HV3: 5,
      HV4: 3,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 9,
      LV3: 10,
      LV4: 9,
      LV5: 3
    }
  },
  REEL_3: {
    reel_sequence: [
      'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4',
      'LV4', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV3', 'HV3',
      'HV4', 'MULT', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'LV4', 'LV3', 'LV2', 'LV1'
    ],
    reel_symbol_total_count: 47,
    reel_symbol_count: {
      HV1: 3,
      HV2: 3,
      HV3: 4,
      HV4: 3,
      MULT: 1,
      SCATTER: 0,
      LV1: 6,
      LV2: 8,
      LV3: 9,
      LV4: 8,
      LV5: 4
    }
  },
  REEL_4: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5',
      'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV3', 'HV3', 'HV4',
      'HV4', 'MULT', 'LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'LV5', 'HV1',
      'HV2', 'HV2', 'LV3', 'LV3', 'LV1', 'LV2', 'LV2', 'LV4', 'LV4',
      'LV5', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV3'
    ],
    reel_symbol_total_count: 45,
    reel_symbol_count: {
      HV1: 3,
      HV2: 4,
      HV3: 4,
      HV4: 4,
      MULT: 1,
      SCATTER: 0,
      LV1: 7,
      LV2: 7,
      LV3: 7,
      LV4: 5,
      LV5: 5
    }
  },
  REEL_5: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2',
      'HV3', 'HV3', 'HV4', 'MULT', 'LV2', 'LV3', 'LV4', 'LV5', 'LV5',
      'HV3', 'HV2', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV4',
      'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV1',
      'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4'
    ],
    reel_symbol_total_count: 54,
    reel_symbol_count: {
      HV1: 4,
      HV2: 5,
      HV3: 6,
      HV4: 3,
      MULT: 1,
      SCATTER: 0,
      LV1: 7,
      LV2: 9,
      LV3: 9,
      LV4: 8,
      LV5: 3
    }
  },
  REEL_6: {
    reel_sequence: [
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV3',
      'HV3', 'HV4', 'MULT', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5',
      'LV5', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV5', 'HV4', 'HV4', 'HV3', 'HV3', 'LV1', 'LV1',
      'LV2', 'LV2', 'LV3', 'LV3'
    ],
    reel_symbol_total_count: 51,
    reel_symbol_count: {
      HV1: 2,
      HV2: 4,
      HV3: 5,
      HV4: 3,
      MULT: 1,
      SCATTER: 0,
      LV1: 7,
      LV2: 10,
      LV3: 9,
      LV4: 6,
      LV5: 4
    }
  }
}

// Increased weights for better reel configurations
const FREE_GAME_REEL_WEIGHT_TABLE = {
  A: 0.50, // Increased from 0.40
  B: 0.35,
  C: 0.15 // Decreased from 0.25
}

const FREE_SPINS_AWARDED = {
  SCATTER: {
    4: 10,
    5: 10,
    6: 10
  }
}

const FREE_GAME_SYMBOL_COMBINATION_PAYOUT = {
  HV1: {
    8: 15,
    9: 15,
    10: 35,
    11: 35,
    12: 70
  },
  HV2: {
    8: 4,
    9: 4,
    10: 15,
    11: 15,
    12: 35
  },
  HV3: {
    8: 3,
    9: 3,
    10: 7.5,
    11: 7.5,
    12: 22.5
  },
  HV4: {
    8: 2.5,
    9: 2.5,
    10: 3,
    11: 3,
    12: 18
  },
  LV1: {
    8: 1.5,
    9: 1.5, // Increased from 1
    10: 2.5, // Increased from 1.5
    11: 2.5, // Increased from 1.5
    12: 15 // Increased from 10
  },
  LV2: {
    8: 1.3, // Increased from 0.8
    9: 1.3, // Increased from 0.8
    10: 2, // Increased from 1.2
    11: 2, // Increased from 1.2
    12: 12 // Increased from 8
  },
  LV3: {
    8: 0.8, // Increased from 0.5
    9: 0.8, // Increased from 0.5
    10: 1.5, // Increased from 1
    11: 1.5, // Increased from 1
    12: 8 // Increased from 5
  },
  LV4: {
    8: 0.6, // Increased from 0.4
    9: 0.6, // Increased from 0.4
    10: 1.2, // Increased from 0.9
    11: 1.2, // Increased from 0.9
    12: 6 // Increased from 4
  },
  LV5: {
    8: 0.4, // Increased from 0.25
    9: 0.4, // Increased from 0.25
    10: 1, // Increased from 0.75
    11: 1, // Increased from 0.75
    12: 3 // Increased from 2
  },
  SCATTER: {
    3: 0,
    4: 2,
    5: 5,
    6: 10
  }
}

const FREE_GAME_MULTIPLIERS_WEIGHT_TABLE = {
  A: {
    2: 2300,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1

  },
  B: {
    2: 2300,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1
  },
  C: {
    2: 2300,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1
  }
}

const FREE_GAME_CASCADING_RANDSYM_FIXED_WEIGHT_TABLE = {
  HV1: 10,
  HV2: 10,
  HV3: 10,
  HV4: 10,
  LV1: 500,
  LV2: 500,
  LV3: 2500,
  LV4: 6000,
  LV5: 6000
}

const BUY_FREE_SPINS_SCATTER_TRIGGER_WEIGHT_TABLE = {
  4: 47,
  5: 2,
  6: 1
}

const BUY_FREE_SPIN_INITIAL_PAYWINDOWS = {
  4: [
    ['SCATTER', 'LV1', 'LV4', 'LV5', 'HV1'],
    ['LV5', 'LV1', 'SCATTER', 'HV3', 'LV3'],
    ['HV1', 'HV3', 'HV4', 'SCATTER', 'HV2'],
    ['LV5', 'SCATTER', 'HV3', 'HV4', 'HV2'],
    ['LV1', 'LV2', 'LV4', 'LV1', 'LV2'],
    ['LV4', 'LV5', 'LV2', 'LV2', 'LV5']
  ],
  5: [
    ['SCATTER', 'LV1', 'LV4', 'LV5', 'HV1'],
    ['LV5', 'LV1', 'SCATTER', 'HV3', 'LV3'],
    ['HV1', 'HV3', 'HV4', 'SCATTER', 'HV2'],
    ['LV5', 'SCATTER', 'HV3', 'HV4', 'HV2'],
    ['LV1', 'LV2', 'LV4', 'SCATTER', 'LV2'],
    ['LV4', 'LV5', 'LV2', 'LV2', 'LV1']
  ],
  6: [
    ['SCATTER', 'LV3', 'LV4', 'LV5', 'LV3'],
    ['LV5', 'LV1', 'SCATTER', 'HV3', 'LV3'],
    ['LV1', 'HV3', 'HV4', 'SCATTER', 'LV1'],
    ['LV5', 'SCATTER', 'HV3', 'HV4', 'LV2'],
    ['LV1', 'LV3', 'LV4', 'SCATTER', 'LV3'],
    ['LV4', 'SCATTER', 'LV2', 'LV2', 'LV4']
  ]
}

const ANTE_BASE_GAME_REEL_A_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'MULT', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV2', 'LV2', 'MULT', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'SCATTER', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'SCATTER', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4']
  },
  REEL_2: {
    reel_sequence: ['LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'MULT', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'MULT', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'SCATTER', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'SCATTER', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3']
  },
  REEL_3: {
    reel_sequence: ['LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'MULT', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'MULT', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'MULT', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'SCATTER', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'SCATTER', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4']
  },
  REEL_4: {
    reel_sequence: ['HV2', 'HV3', 'HV3', 'MULT', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'SCATTER', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'MULT', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'SCATTER', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'SCATTER', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3']
  },
  REEL_5: {
    reel_sequence: ['HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'MULT', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'MULT', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'MULT', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'SCATTER', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'SCATTER', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4']
  },
  REEL_6: {
    reel_sequence: ['HV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'MULT', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'SCATTER', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'MULT', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'SCATTER', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'SCATTER', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'SCATTER', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1']
  }
}

const ANTE_BASE_GAME_REEL_B_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['HV2', 'HV3', 'HV4', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV4', 'LV1', 'HV4', 'HV4', 'SCATTER', 'LV1', 'LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV4', 'HV3', 'HV3', 'HV1']
  },
  REEL_2: {
    reel_sequence: ['HV2', 'HV3', 'HV4', 'HV4', 'HV3', 'SCATTER', 'HV4', 'HV4', 'HV2', 'HV4', 'LV1', 'HV4', 'LV1', 'LV1', 'LV1', 'LV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'HV4', 'LV1', 'HV3', 'HV3', 'HV1']
  },
  REEL_3: {
    reel_sequence: ['HV2', 'HV3', 'HV4', 'LV4', 'HV3', 'HV4', 'HV4', 'SCATTER', 'HV2', 'HV4', 'HV4', 'HV4', 'LV1', 'LV1', 'LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'HV3', 'HV4', 'HV3', 'HV3', 'HV1']
  },
  REEL_4: {
    reel_sequence: ['HV2', 'HV3', 'HV4', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV4', 'HV3', 'HV4', 'SCATTER', 'LV1', 'LV1', 'LV1', 'LV2', 'LV3', 'LV4', 'LV5', 'HV4', 'LV3', 'HV3', 'HV3', 'HV1']
  },
  REEL_5: {
    reel_sequence: ['LV2', 'HV1', 'LV4', 'LV5', 'LV3', 'LV4', 'LV3', 'LV2', 'LV4', 'LV5', 'LV4', 'LV5', 'LV1', 'HV2', 'SCATTER', 'LV2', 'LV3', 'LV4', 'HV3', 'LV5', 'LV5', 'LV3', 'HV4', 'LV1', 'LV2', 'HV1', 'LV4', 'LV5', 'LV3', 'LV4', 'LV3', 'LV2', 'LV4', 'LV5', 'LV4', 'LV5', 'LV1', 'HV2', 'LV2', 'LV3', 'LV4', 'HV3', 'LV5', 'LV5', 'LV3', 'HV4', 'LV1']
  },
  REEL_6: {
    reel_sequence: ['LV2', 'HV1', 'LV4', 'LV5', 'LV3', 'LV4', 'LV4', 'SCATTER', 'LV2', 'LV4', 'LV5', 'LV4', 'LV5', 'LV1', 'HV2', 'LV2', 'LV3', 'LV4', 'HV3', 'LV5', 'LV5', 'LV3', 'HV4', 'LV1']
  }
}

const ANTE_BASE_GAME_REEL_C_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'MULT', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV2', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4']
  },
  REEL_2: {
    reel_sequence: ['LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'MULT', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2', 'LV5', 'LV2', 'LV1', 'LV4', 'LV5', 'SCATTER', 'HV1', 'HV3', 'HV4', 'HV3', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV3', 'LV2', 'LV4', 'HV2']
  },
  REEL_3: {
    reel_sequence: ['LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'MULT', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'SCATTER', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'HV3', 'LV2', 'LV2', 'LV4']
  },
  REEL_4: {
    reel_sequence: ['LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'MULT', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'SCATTER', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5', 'LV1', 'LV5', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV2', 'LV4', 'LV2', 'LV5']
  },
  REEL_5: {
    reel_sequence: [
      'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER',
      'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'MULT', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'SCATTER', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV1', 'SCATTER', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV3', 'LV4', 'LV5', 'LV1', 'HV2', 'HV3', 'LV1', 'LV2', 'LV4']
  },
  REEL_6: {
    reel_sequence: [
      'HV1', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3',
      'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'MULT', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'SCATTER', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'SCATTER', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'SCATTER', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'SCATTER', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4', 'LV1', 'LV2', 'LV1', 'LV4', 'LV5', 'HV1', 'HV3', 'HV4', 'HV2', 'LV3', 'LV4', 'LV5', 'LV2', 'LV2', 'LV5', 'LV5', 'LV1', 'HV2', 'LV4', 'LV3', 'LV2', 'LV4']
  }
}

const ANTE_BASE_GAME_CASCADING_REEL_CONFIGURATION = {
  REEL_1: {
    reel_sequence: ['LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'MULT', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4']
  },
  REEL_2: {
    reel_sequence: ['LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'MULT', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3']
  },
  REEL_3: {
    reel_sequence: ['LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'MULT', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV4', 'LV4']
  },
  REEL_4: {
    reel_sequence: ['HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'MULT', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3']
  },
  REEL_5: {
    reel_sequence: ['HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'MULT', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4']
  },
  REEL_6: {
    reel_sequence: ['HV2', 'HV2', 'LV1', 'HV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'MULT', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3', 'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2', 'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1']
  }
}

const ANTE_FREE_GAME_REEL_A_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2',
      'LV4', 'MULT', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1',
      'HV3', 'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2',
      'MULT', 'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4',
      'LV4', 'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5',
      'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4',
      'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3',
      'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4',
      'HV2', 'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3',
      'LV1', 'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2',
      'HV1', 'HV2', 'LV4'
    ]
  },
  REEL_2: {
    reel_sequence: [
      'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3',
      'HV4', 'LV2', 'MULT', 'LV4', 'LV5', 'HV1', 'HV2',
      'HV3', 'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3',
      'HV3', 'HV4', 'HV4', 'LV2', 'LV1', 'MULT', 'LV4',
      'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4',
      'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2',
      'HV2', 'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4',
      'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5',
      'LV5', 'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2',
      'LV1', 'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV3', 'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2',
      'HV2', 'LV4', 'LV2', 'LV2', 'LV3', 'LV3'
    ]
  },
  REEL_3: {
    reel_sequence: [
      'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'MULT', 'HV3',
      'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1',
      'MULT', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5',
      'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'MULT', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4',
      'LV2', 'LV2', 'LV4', 'LV4', 'LV2', 'HV1', 'HV1',
      'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2',
      'LV2', 'LV1', 'LV1', 'LV2', 'LV3', 'LV3', 'LV2',
      'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV4', 'LV4',
      'LV5', 'LV5', 'HV1', 'HV2', 'HV3', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV4', 'LV4'
    ]
  },
  REEL_4: {
    reel_sequence: [
      'HV2', 'HV3', 'HV3', 'MULT', 'LV1', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5',
      'HV1', 'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1',
      'HV3', 'HV3', 'HV4', 'HV4', 'MULT', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1',
      'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3',
      'HV3', 'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3',
      'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3'
    ]
  },
  REEL_5: {
    reel_sequence: [
      'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'MULT',
      'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4',
      'HV1', 'MULT', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1',
      'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'MULT', 'HV2',
      'HV2', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3',
      'LV3', 'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3',
      'HV3', 'HV4', 'HV1', 'HV1', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV2', 'LV1', 'HV3', 'HV4', 'HV2',
      'HV4', 'HV1', 'LV3', 'LV2', 'HV2', 'HV2', 'LV1',
      'LV1', 'HV3', 'HV3', 'LV4', 'LV4', 'HV2', 'HV2',
      'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'LV4', 'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3',
      'HV4'
    ]
  },
  REEL_6: {
    reel_sequence: [
      'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2',
      'MULT', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5',
      'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3',
      'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV2', 'MULT', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3',
      'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1',
      'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5',
      'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3',
      'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3',
      'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1'
    ]
  }
}

const ANTE_FREE_GAME_REEL_B_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'HV1', 'HV1', 'HV2', 'HV2', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV4', 'HV3',
      'HV2', 'LV4', 'LV5', 'LV5', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV4',
      'LV5', 'HV4', 'HV4', 'LV5', 'LV5',
      'LV2', 'LV2', 'LV3', 'HV2', 'HV3',
      'HV4', 'LV3', 'LV3'
    ]
  },
  REEL_2: {
    reel_sequence: [
      'HV1', 'HV1', 'HV2', 'HV2', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV4', 'HV3',
      'HV2', 'LV4', 'LV5', 'LV5', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV4',
      'LV5', 'HV4', 'HV4', 'LV5', 'LV5',
      'LV2', 'LV2', 'LV3', 'HV2', 'HV3',
      'HV4', 'LV3', 'LV3'
    ]
  },
  REEL_3: {
    reel_sequence: [
      'HV1', 'HV1', 'HV2', 'HV2', 'HV2',
      'LV1', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV4', 'HV3',
      'HV2', 'LV4', 'LV5', 'LV5', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV4',
      'LV5', 'HV4', 'HV4', 'LV5', 'LV5',
      'LV2', 'LV2', 'LV3', 'HV2', 'HV3',
      'HV4', 'LV3', 'LV3'
    ]
  },
  REEL_4: {
    reel_sequence: [
      'LV4', 'LV4', 'LV4', 'HV1', 'HV2',
      'HV2', 'HV3', 'HV3', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV4', 'LV3', 'LV3',
      'LV2', 'LV2', 'LV1', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV5', 'LV5',
      'LV5', 'LV1', 'HV1', 'LV5', 'LV5',
      'LV4', 'LV4', 'LV5', 'LV2', 'LV2',
      'LV1', 'LV2', 'LV1'
    ]
  },
  REEL_5: {
    reel_sequence: [
      'LV4', 'LV4', 'LV4', 'HV1', 'HV2',
      'HV2', 'HV3', 'HV3', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV4', 'LV3', 'LV3',
      'LV2', 'LV2', 'LV1', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV5', 'LV5',
      'LV5', 'LV1', 'HV1', 'LV5', 'LV5',
      'LV4', 'LV4', 'LV5', 'LV2', 'LV2',
      'LV1', 'LV2', 'LV1'
    ]
  },
  REEL_6: {
    reel_sequence: [
      'LV4', 'LV4', 'LV4', 'HV1', 'HV2',
      'HV2', 'HV3', 'HV3', 'HV3', 'HV4',
      'HV4', 'HV2', 'HV4', 'LV3', 'LV3',
      'LV2', 'LV2', 'LV1', 'LV1', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV5', 'LV5',
      'LV5', 'LV1', 'HV1', 'LV5', 'LV5',
      'LV4', 'LV4', 'LV5', 'LV2', 'LV2',
      'LV1', 'LV2', 'LV1'
    ]
  }
}

const ANTE_FREE_GAME_CASCADING_REEL_CONFIGURATION = {
  REEL_1: {
    reel_sequence: [
      'LV5', 'LV3', 'LV4', 'LV2', 'HV2', 'HV1', 'HV2',
      'LV4', 'LV3', 'LV5', 'LV5', 'HV2', 'HV1', 'HV3',
      'HV3', 'HV4', 'HV2', 'LV1', 'LV2', 'LV2', 'MULT',
      'LV3', 'LV4', 'HV2', 'HV4', 'HV2', 'LV4', 'LV4',
      'LV2', 'LV3', 'LV1', 'LV1', 'HV3', 'HV4', 'HV4',
      'HV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV5', 'LV3',
      'LV4', 'LV2', 'HV2', 'HV1', 'HV2', 'LV4', 'LV3',
      'LV5', 'LV5', 'HV2', 'HV1', 'HV3', 'HV3', 'HV4',
      'HV2', 'LV1', 'LV2', 'LV2', 'LV3', 'LV4', 'HV2',
      'HV4', 'HV2', 'LV4', 'LV4', 'LV2', 'LV3', 'LV1',
      'LV1', 'HV3', 'HV4', 'HV4', 'HV2', 'HV2', 'HV1',
      'HV2', 'LV4'
    ]
  },
  REEL_2: {
    reel_sequence: [
      'LV3', 'LV2', 'LV2', 'HV2', 'HV2', 'HV1', 'HV3',
      'HV4', 'LV2', 'LV4', 'LV5', 'HV1', 'HV2', 'HV3',
      'HV3', 'LV4', 'LV5', 'LV5', 'HV1', 'HV3', 'HV3',
      'HV4', 'HV4', 'LV2', 'LV1', 'MULT', 'LV4', 'LV5',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV4', 'HV2',
      'HV1', 'HV4', 'LV4', 'HV2', 'HV2', 'LV4', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV3', 'LV2', 'LV2', 'HV2',
      'HV2', 'HV1', 'HV3', 'HV4', 'LV2', 'LV4', 'LV5',
      'HV1', 'HV2', 'HV3', 'HV3', 'LV4', 'LV5', 'LV5',
      'HV1', 'HV3', 'HV3', 'HV4', 'HV4', 'LV2', 'LV1',
      'LV4', 'LV5', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3',
      'HV4', 'HV2', 'HV1', 'HV4', 'LV4', 'HV2', 'HV2',
      'LV4', 'LV2', 'LV2', 'LV3', 'LV3'
    ]
  },
  REEL_3: {
    reel_sequence: [
      'LV2', 'HV1', 'HV1', 'HV1', 'HV2', 'HV3', 'HV3',
      'HV3', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1', 'LV2',
      'LV3', 'LV3', 'LV2', 'LV4', 'LV5', 'LV2', 'LV2',
      'LV3', 'LV4', 'LV4', 'LV5', 'LV5', 'MULT', 'HV1',
      'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2',
      'LV4', 'LV4', 'LV2', 'HV1', 'HV1', 'HV1', 'HV2',
      'HV3', 'HV3', 'HV3', 'HV4', 'LV2', 'LV2', 'LV1',
      'LV1', 'LV2', 'LV3', 'LV3', 'LV2', 'LV4', 'LV5',
      'LV2', 'LV2', 'LV3', 'LV4', 'LV4', 'LV5', 'LV5',
      'HV1', 'HV2', 'HV3', 'HV3', 'HV3', 'HV4', 'LV2',
      'LV2', 'LV4', 'LV4'
    ]
  },
  REEL_4: {
    reel_sequence: [
      'HV2', 'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV3', 'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1',
      'HV1', 'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3',
      'HV3', 'HV4', 'HV4', 'MULT', 'LV1', 'LV2', 'LV2',
      'LV3', 'LV3', 'HV1', 'HV1', 'HV1', 'HV3', 'HV3',
      'HV4', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'HV2',
      'HV3', 'HV3', 'LV1', 'LV1', 'LV2', 'LV2', 'LV3',
      'LV3', 'LV4', 'LV5', 'LV5', 'LV5', 'HV1', 'HV1',
      'HV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3', 'HV3',
      'HV4', 'HV4', 'LV1', 'LV2', 'LV2', 'LV3', 'LV3',
      'HV1', 'HV1', 'HV1', 'HV3', 'HV3', 'HV4', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV3'
    ]
  },
  REEL_5: {
    reel_sequence: [
      'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4',
      'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1',
      'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3',
      'HV3', 'LV4', 'LV4', 'MULT', 'HV2', 'HV2', 'HV1',
      'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4',
      'LV4', 'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4',
      'HV1', 'HV1', 'LV2', 'LV2', 'LV3', 'LV3', 'LV4',
      'LV2', 'LV1', 'HV3', 'HV4', 'HV2', 'HV4', 'HV1',
      'LV3', 'LV2', 'HV2', 'HV2', 'LV1', 'LV1', 'HV3',
      'HV3', 'LV4', 'LV4', 'HV2', 'HV2', 'HV1', 'HV1',
      'LV2', 'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4',
      'LV4', 'LV5', 'HV2', 'HV3', 'HV3', 'HV4'
    ]
  },
  REEL_6: {
    reel_sequence: [
      'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2', 'LV2',
      'HV1', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5',
      'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3',
      'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV2', 'MULT', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3',
      'HV3', 'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1',
      'LV1', 'HV2', 'HV2', 'LV1', 'LV1', 'LV2', 'LV2',
      'LV2', 'LV3', 'LV3', 'LV3', 'LV4', 'LV4', 'LV5',
      'LV5', 'HV2', 'HV2', 'HV4', 'HV4', 'HV3', 'HV3',
      'HV3', 'LV1', 'LV1', 'HV4', 'HV4', 'LV2', 'LV2',
      'LV2', 'LV1', 'LV1', 'LV1', 'HV3', 'HV3', 'HV3',
      'HV4', 'HV4', 'HV4', 'LV2', 'LV2', 'LV1', 'LV1'
    ]
  }
}

const ANTE_FREE_GAME_REEL_WEIGHT_TABLE = {
  A: 0.94,
  B: 0.06
}

const ANTE_FREE_GAME_MULTIPLIERS_WEIGHT_TABLE = {
  A: {
    2: 2000,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1
  },
  B: {
    2: 2000,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1
  },
  C: {
    2: 2000,
    3: 1000,
    4: 300,
    5: 100,
    6: 50,
    8: 50,
    10: 50,
    12: 30,
    15: 30,
    20: 30,
    25: 30,
    50: 20,
    100: 10,
    250: 5,
    500: 1
  }
}

export {
  MULTIPLIER_WEIGHT_TABLE,
  REEL_SYMBOL_ID,
  REEL_WEIGHT_TABLE,
  ANTE_REEL_WEIGHT_TABLE,
  REEL_A_CONFIGURATION,
  REEL_B_CONFIGURATION,
  REEL_C_CONFIGURATION,
  CASCADING_REEL_CONFIGURATION,
  REEL_SYMBOLS,
  REEL_SYMBOLS_KEYS,
  REEL_SYMBOL_COMBINATION_PAYOUT,
  FREE_GAME_REEL_A_CONFIGURATION,
  FREE_GAME_REEL_B_CONFIGURATION,
  FREE_GAME_REEL_C_CONFIGURATION,
  FREE_GAME_CASCADING_REEL_CONFIGURATION,
  FREE_GAME_REEL_WEIGHT_TABLE,
  FREE_SPINS_AWARDED,
  FREE_GAME_SYMBOL_COMBINATION_PAYOUT,
  FREE_GAME_CASCADING_RANDSYM_FIXED_WEIGHT_TABLE,
  FREE_GAME_MULTIPLIERS_WEIGHT_TABLE,
  BUY_FREE_SPINS_SCATTER_TRIGGER_WEIGHT_TABLE,
  BUY_FREE_SPIN_INITIAL_PAYWINDOWS,
  ANTE_BASE_GAME_REEL_A_CONFIGURATION,
  ANTE_BASE_GAME_REEL_B_CONFIGURATION,
  ANTE_BASE_GAME_REEL_C_CONFIGURATION,
  ANTE_BASE_GAME_CASCADING_REEL_CONFIGURATION,
  ANTE_FREE_GAME_REEL_A_CONFIGURATION,
  ANTE_FREE_GAME_REEL_B_CONFIGURATION,
  ANTE_FREE_GAME_CASCADING_REEL_CONFIGURATION,
  ANTE_FREE_GAME_REEL_WEIGHT_TABLE,
  ANTE_FREE_GAME_MULTIPLIERS_WEIGHT_TABLE,
  ANTE_REEL_SYMBOL_COMBINATION_PAYOUT
}
