export const baseWinFirstCascade = {
  data: {
    Current: {
      Type: 1,
      TotalWin: 2,
      AccWin: 2,
      MultiplierMap: { '1,1': '1', '1,2': 1, '1,3': 1, '2,2': 1, '2,3': 1, '2,4': 1 },
      Result: {
        R: '102,201,201,201,102,102,104|102,101,101,101,102,102,101|201,201,101,101,101,202,202|103,103,102,102,102,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 101,
            positions: ['1,1', '1,2', '1,3', '2,2', '2,3', '2,4'],
            payout: 2,
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 2,
        Items: [
          '1|0.5|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966303.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 30
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const baseWinSecondCascade = {
  data: {
    Current: {
      Type: 30,
      TotalWin: 6.4,
      AccWin: 8.4,
      MultiplierMap: {
        '0,1': 1,
        '0,2': 1,
        '0,3': 1,
        '0,4': 1,
        '0,5': 1,
        '1,1': 2,
        '1,2': 2,
        '1,3': 2,
        '1,4': 1,
        '1,5': 1,
        '2,1': 1,
        '2,2': 2,
        '2,3': 1,
        '2,4': 1,
        '3,2': 1,
        '3,3': 1,
        '3,4': 1
      },
      Result: {
        R: '102,201,201,201,102,102,104|101,201,201,102,102,102,101|104,102,102,201,201,202,202|103,103,102,102,102,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 201,
            positions: ['0,1', '0,2', '0,3', '1,1', '1,2'],
            payout: 4, // 1 * 4
            multiplier: 1,
            multiplierPositions: []
          },
          {
            symbol: 102,
            positions: ['0,4', '0,5', '1,3', '1,4', '1,5'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          },
          {
            symbol: 102,
            positions: ['2,1', '2,2', '3,2', '3,3', '3,4'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 8.4,
        Items: [
          '1|0.5|1',
          '30|1.6|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 30
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const baseWinThirdCascade = {
  data: {
    Current: {
      Type: 30,
      TotalWin: 7.2,
      AccWin: 15.6,
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 4,
        '1,2': 4,
        '1,3': 2,
        '1,4': 1,
        '1,5': 1,
        '2,1': 1,
        '2,2': 4,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 1,
        '4,3': 1
      },
      Result: {
        R: '103,104,104,104,202,102,104|203,104,104,203,203,101,101|202,203,104,201,201,202,202|201,103,103,103,103,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 104,
            positions: ['0,1', '0,2', '0,3', '1,1', '1,2', '2,2'],
            payout: 6, // 0.25 * 4 * 6
            multiplier: 6,
            multiplierPositions: ['1,1', '1,2', '2,2']
          },
          {
            symbol: 103,
            positions: ['3,1', '3,2', '3,3', '3,4', '4,2', '4,3'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0.5|1',
          '30|1.6|1',
          '30|1.8|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 30
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const baseLoseFourthCascade = {
  data: {
    Current: {
      Type: 30,
      TotalWin: 0,
      AccWin: 15.6,
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 8,
        '1,2': 8,
        '1,3': 4,
        '1,4': 2,
        '1,5': 1,
        '2,1': 1,
        '2,2': 8,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 2,
        '4,3': 2,
        '5,2': 1,
        '5,3': 1,
        '5,4': 1
      },
      Result: {
        R: '102,102,201,103,202,102,104|101,101,101,102,201,101,101|104,201,104,201,201,202,202|202,203,203,104,201,101,101|104,203,203,102,102,202,102|203,101,201,201,102,101,101|101,101,103,103,103,203,203'
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0.5|1',
          '30|1.6|1',
          '30|1.8|1',
          '30|0|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 1
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const baseTriggerFreeSpin = {
  data: {
    Current: {
      Type: 1,
      TotalWin: 0,
      AccWin: 0,
      MultiplierMap: {},
      Result: {
        R: '102,102,201,103,25,102,104|101,101,25,102,201,101,101|104,201,25,201,201,202,202|202,203,25,104,201,101,101|104,203,203,102,102,202,102|203,101,201,201,102,101,101|101,101,103,103,103,203,203'
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 0,
        Items: [
          '1|0|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 10,
      FreeSpin: {
        Next: 1,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const firstFreeSpinFirstCascade = {
  data: {
    Current: {
      Type: 10,
      TotalWin: 2,
      AccWin: 2,
      FreeSpin: {
        Current: 1,
        Total: 3
      },
      MultiplierMap: { '1,1': '1', '1,2': 1, '1,3': 1, '2,2': 1, '2,3': 1, '2,4': 1 },
      Result: {
        R: '102,201,201,201,102,102,104|102,101,101,101,102,102,101|201,201,101,101,101,202,202|103,103,102,102,102,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 101,
            positions: ['1,1', '1,2', '1,3', '2,2', '2,3', '2,4'],
            payout: 2,
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 2,
        Items: [
          '1|0|1',
          '10|2|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966303.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 31,
      FreeSpin: {
        Next: 1,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const firstFreeSpinSecondCascade = {
  data: {
    Current: {
      Type: 31,
      TotalWin: 6.4,
      AccWin: 8.4,
      FreeSpin: {
        Current: 1,
        Total: 3
      },
      MultiplierMap: {
        '0,1': 1,
        '0,2': 1,
        '0,3': 1,
        '0,4': 1,
        '0,5': 1,
        '1,1': 2,
        '1,2': 2,
        '1,3': 2,
        '1,4': 1,
        '1,5': 1,
        '2,1': 1,
        '2,2': 2,
        '2,3': 1,
        '2,4': 1,
        '3,2': 1,
        '3,3': 1,
        '3,4': 1
      },
      Result: {
        R: '102,201,201,201,102,102,104|101,201,201,102,102,102,101|104,102,102,201,201,202,202|103,103,102,102,102,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 201,
            positions: ['0,1', '0,2', '0,3', '1,1', '1,2'],
            payout: 4, // 1 * 4
            multiplier: 1,
            multiplierPositions: []
          },
          {
            symbol: 102,
            positions: ['0,4', '0,5', '1,3', '1,4', '1,5'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          },
          {
            symbol: 102,
            positions: ['2,1', '2,2', '3,2', '3,3', '3,4'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 8.4,
        Items: [
          '1|0|1',
          '10|2|1',
          '31|6.4|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 31,
      FreeSpin: {
        Current: 1,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const firstFreeSpinThirdCascade = {
  data: {
    Current: {
      Type: 31,
      TotalWin: 7.2,
      AccWin: 15.6,
      FreeSpin: {
        Current: 1,
        Total: 3
      },
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 4,
        '1,2': 4,
        '1,3': 2,
        '1,4': 1,
        '1,5': 1,
        '2,1': 1,
        '2,2': 4,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 1,
        '4,3': 1
      },
      Result: {
        R: '103,104,104,104,202,102,104|203,104,104,203,203,101,101|202,203,104,201,201,202,202|201,103,103,103,103,101,101|202,202,103,103,104,104,102|102,102,202,202,202,101,101|101,101,103,103,103,203,203',
        clusterDetails: [
          {
            symbol: 104,
            positions: ['0,1', '0,2', '0,3', '1,1', '1,2', '2,2'],
            payout: 6, // 0.25 * 4 * 6
            multiplier: 6,
            multiplierPositions: ['1,1', '1,2', '2,2']
          },
          {
            symbol: 103,
            positions: ['3,1', '3,2', '3,3', '3,4', '4,2', '4,3'],
            payout: 1.2, // 0.3 * 4
            multiplier: 1,
            multiplierPositions: []
          }
        ]
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0|1',
          '10|2|1',
          '31|6.4|1',
          '31|7.2|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 31,
      FreeSpin: {
        Next: 1,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const firstFreeSpinFourthCascade = {
  data: {
    Current: {
      Type: 31,
      TotalWin: 0,
      AccWin: 15.6,
      FreeSpin: {
        Current: 1,
        Total: 3
      },
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 8,
        '1,2': 8,
        '1,3': 4,
        '1,4': 2,
        '1,5': 1,
        '2,1': 1,
        '2,2': 8,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 2,
        '4,3': 2,
        '5,2': 1,
        '5,3': 1,
        '5,4': 1
      },
      Result: {
        R: '102,102,201,103,202,102,104|101,101,101,102,201,101,101|104,201,104,201,201,202,202|202,203,203,104,201,101,101|104,203,203,102,102,202,102|203,101,201,201,102,101,101|101,101,103,103,103,203,203'
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0|1',
          '10|2|1',
          '31|6.4|1',
          '31|7.2|1',
          '31|0|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 10,
      FreeSpin: {
        Next: 2,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const secondFreeSpinFirstCascade = {
  data: {
    Current: {
      Type: 10,
      TotalWin: 0,
      AccWin: 0,
      FreeSpin: {
        Current: 2,
        Total: 3
      },
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 8,
        '1,2': 8,
        '1,3': 4,
        '1,4': 2,
        '1,5': 1,
        '2,1': 1,
        '2,2': 8,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 2,
        '4,3': 2,
        '5,2': 1,
        '5,3': 1,
        '5,4': 1
      },
      Result: {
        R: '102,102,201,103,202,102,104|101,101,101,102,201,101,101|104,201,104,201,201,202,202|202,203,203,104,201,101,101|104,203,203,102,102,202,102|203,101,201,201,102,101,101|101,101,103,103,103,203,203'
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0|1',
          '10|2|1',
          '31|6.4|1',
          '31|7.2|1',
          '31|0|1',
          '10|0|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 10,
      FreeSpin: {
        Next: 3,
        Total: 3
      }
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}

export const thirdFreeSpinFirstCascade = {
  data: {
    Current: {
      Type: 10,
      TotalWin: 0,
      AccWin: 0,
      FreeSpin: {
        Current: 3,
        Total: 3
      },
      MultiplierMap: {
        '0,1': 2,
        '0,2': 2,
        '0,3': 2,
        '0,4': 1,
        '0,5': 1,
        '1,1': 8,
        '1,2': 8,
        '1,3': 4,
        '1,4': 2,
        '1,5': 1,
        '2,1': 1,
        '2,2': 8,
        '2,3': 1,
        '2,4': 1,
        '3,1': 1,
        '3,2': 2,
        '3,3': 2,
        '3,4': 2,
        '4,2': 2,
        '4,3': 2,
        '5,2': 1,
        '5,3': 1,
        '5,4': 1
      },
      Result: {
        R: '102,102,201,103,202,102,104|101,101,101,102,201,101,101|104,201,104,201,201,202,202|202,203,203,104,201,101,101|104,203,203,102,102,202,102|203,101,201,201,102,101,101|101,101,103,103,103,203,203'
      },
      Round: {
        RoundType: 1,
        Bet: 4,
        ActualBet: 4,
        BetValue: 1,
        Line: 20,
        LineBet: 0.2,
        Payout: 15.6,
        Items: [
          '1|0|1',
          '10|2|1',
          '31|6.4|1',
          '31|7.2|1',
          '31|0|1',
          '10|0|1',
          '10|0|1'
        ],
        Mode: 1
      }
    },
    Player: {
      Balance: 9966307.28,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Next: {
      Type: 1
    },
    Details: {
      betId: '107553',
      gameId: 26,
      userId: '17'
    }
  },
  errors: []
}
