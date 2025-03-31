export const baseWinWithoutMultiplierResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 2,
        AccWin: 2,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {}
        },
        Result: {
          R: '103,103,101,101,105,105|101,101,202,202,103,103|103,103,25,104,104,105|203,102,102,103,103,202|103,104,104,203,203,101',
          winningDetails: [
            {
              payout: 2,
              symbol: 103,
              positions: [
                '0,0',
                '0,1',
                '1,4',
                '1,5',
                '2,0',
                '2,1',
                '3,3',
                '3,4',
                '4,0'
              ],
              count: 9
            }
          ]
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 2,
          Mode: 1,
          Items: [
            '1|2'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729252179269,
      Player: {
        Balance: 98317.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: '13aeeb993f1f4a401eee4ea698d03b5c1a40f18f305dd7414c2aec3f89f840aa',
      Details: {
        betId: '562',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_ONE: {
    data: {
      Player: {
        Balance: 98319.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 1,
        TotalWin: 0,
        AccWin: 2,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {}
        },
        Result: {
          R: '203,25,101,101,105,105|101,102,101,101,202,202|102,203,25,104,104,105|105,102,203,102,102,202|25,104,104,203,203,101',
          winningDetails: []
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 2,
          Mode: 1,
          Items: [
            '1|2',
            '30|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729252194148,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '562',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}

export const baseWinWithMultiplierResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 1.6,
        AccWin: 1.6,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {
            '0,5': 5
          }
        },
        Result: {
          R: '105,105,104,104,104,1000|103,103,105,202,102,104|103,104,25,201,201,204|105,105,25,102,204,204|105,25,104,104,104,203',
          winningDetails: [
            {
              payout: 1.6,
              symbol: 104,
              positions: [
                '0,2',
                '0,3',
                '0,4',
                '1,5',
                '2,1',
                '4,2',
                '4,3',
                '4,4'
              ],
              count: 8
            }
          ]
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 1.6,
          Mode: 1,
          Items: [
            '1|1.6'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729252305961,
      Player: {
        Balance: 98324.19,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: 'e4fb8ceb723576c52ae0a51e34721d0f1d138c397a21cc91bc9eac75d620af60',
      Details: {
        betId: '568',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_ONE: {
    data: {
      Player: {
        Balance: 98332.19,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 1,
        TotalWin: 0,
        AccWin: 8,
        Multiplier: {
          active: true,
          netMultiplier: 5,
          map: {
            '0,5': 5
          }
        },
        Result: {
          R: '102,203,25,105,105,1000|103,103,103,105,202,102|103,103,25,201,201,204|105,105,25,102,204,204|201,104,202,105,25,203',
          winningDetails: []
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 8,
          Mode: 1,
          Items: [
            '1|1.6',
            '30|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729252348123,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '568',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}

export const baseLostResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 0,
        AccWin: 0,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {}
        },
        Result: {
          R: '104,104,104,101,203,105|202,204,204,103,103,103|204,105,105,203,203,102|103,204,101,101,104,202|203,203,104,104,104,202',
          winningDetails: []
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 0,
          Mode: 1,
          Items: [
            '1|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729251678714,
      Player: {
        Balance: 98337.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: '20ac28545b8dc7b04a73a8b489539fbce7f1b2e8467780ffea11107f1a3a14ff',
      Details: {
        betId: '557',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}

export const baseFeatureOneResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 3.2,
        AccWin: 3.2,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {
            '3,3': 5
          }
        },
        Result: {
          R: '105,203,203,102,104,104|104,103,102,102,102,103|105,105,203,203,25,102|105,105,105,1000,204,102|103,103,204,204,102,102',
          winningDetails: [
            {
              payout: 3.2,
              symbol: 102,
              positions: [
                '0,3',
                '1,2',
                '1,3',
                '1,4',
                '2,5',
                '3,5',
                '4,4',
                '4,5'
              ],
              count: 8
            }
          ],
          feature: {
            isTriggered: true,
            type: 'FEATURE_1',
            details: {
              beforeR: '105,203,203,102,104,104|104,103,102,102,102,103|105,105,203,203,25,102|105,105,105,204,204,102|103,103,204,204,102,102',
              symbolConversionDetails: {
                position: '3,3',
                newMultiplier: 5
              }
            }
          }
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 3.2,
          Mode: 1,
          Items: [
            '1|3.2'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729254632020,
      Player: {
        Balance: 98342.59,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: '7f31da2c315b30d7d586bfd8a6e311c56eefcf072d8c725a884f29400a66491b',
      Details: {
        betId: '577',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_ONE: {
    data: {
      Player: {
        Balance: 98377.79,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 1,
        TotalWin: 0,
        AccWin: 35.2,
        Multiplier: {
          active: true,
          netMultiplier: 11,
          map: {
            '3,3': 5,
            '3,4': 6
          }
        },
        Result: {
          R: '105,105,203,203,104,104|101,204,204,104,103,103|103,105,105,203,203,25|102,105,105,105,1000,204|203,101,103,103,204,204',
          winningDetails: []
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 35.2,
          Mode: 1,
          Items: [
            '1|3.2',
            '30|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729254670095,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '577',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}

export const baseFeatureTwoResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 2,
        AccWin: 2,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {
            '2,5': 8
          }
        },
        Result: {
          R: '203,203,104,104,104,102|104,102,102,103,103,204|105,104,104,103,103,1000|203,203,103,103,202,202|102,102,103,103,204,204',
          winningDetails: [
            {
              payout: 2,
              symbol: 103,
              positions: [
                '1,3',
                '1,4',
                '2,3',
                '2,4',
                '3,2',
                '3,3',
                '4,2',
                '4,3'
              ],
              count: 8
            }
          ]
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 2,
          Mode: 1,
          Items: [
            '1|2'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729254751756,
      Player: {
        Balance: 98373.79,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: '2307ddb14519a574cd860a82877de8f02919d3a621e955f4b89968e87bfe8dcc',
      Details: {
        betId: '578',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_ONE: {
    data: {
      Player: {
        Balance: 98373.79,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 1,
        TotalWin: 1.6,
        AccWin: 3.6,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {
            '2,5': 8
          }
        },
        Result: {
          R: '203,203,104,104,104,102|201,201,104,102,102,204|104,204,105,104,104,1000|103,103,203,203,202,202|25,104,102,102,204,204',
          winningDetails: [
            {
              count: 8,
              payout: 1.6,
              symbol: 104,
              positions: [
                '0,2',
                '0,3',
                '0,4',
                '1,2',
                '2,0',
                '2,3',
                '2,4',
                '4,1'
              ]
            }
          ]
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 3.6,
          Mode: 1,
          Items: [
            '1|2',
            '30|1.6'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729254766757,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '578',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_TWO: {
    data: {
      Player: {
        Balance: 98431.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 2,
        TotalWin: 0,
        AccWin: 57.6,
        Multiplier: {
          active: true,
          netMultiplier: 16,
          map: {
            '2,5': 8
          }
        },
        Result: {
          R: '201,105,105,203,203,102|105,201,201,102,102,204|105,105,202,204,105,1000|103,103,203,203,202,202|104,25,102,102,204,204',
          winningDetails: [],
          feature: {
            type: 'FEATURE_2',
            details: {
              isDoubleMultiplier: true
            },
            isTriggered: true
          }
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 57.6,
          Mode: 1,
          Items: [
            '1|2',
            '30|1.6',
            '30|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729254784655,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '578',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}

export const baseFeatureThreeResponse = {
  BASE_SPIN: {
    data: {
      Current: {
        Type: 1,
        TumbleIndex: 0,
        TotalWin: 6,
        AccWin: 6,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {}
        },
        Result: {
          R: '101,203,204,204,201,201|103,105,202,102,204,204|202,204,204,105,203,102|102,203,203,101,101,204|105,105,204,25,103,102',
          winningDetails: [
            {
              payout: 6,
              symbol: 204,
              positions: [
                '0,2',
                '0,3',
                '1,4',
                '1,5',
                '2,1',
                '2,2',
                '3,5',
                '4,2'
              ],
              count: 8
            }
          ],
          feature: {
            isTriggered: true,
            type: 'FEATURE_3',
            details: {
              beforeR: '101,203,104,104,201,201|103,105,202,102,104,104|202,104,104,105,203,102|102,203,203,101,101,104|105,105,204,25,103,102',
              symbolConversionDetails: {
                previousSymbol: 'L4',
                newSymbol: 'H4'
              }
            }
          }
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 6,
          Mode: 1,
          Items: [
            '1|6'
          ]
        }
      },
      Next: {
        Type: 30
      },
      Status: 200,
      Ts: 1729254862681,
      Player: {
        Balance: 98427.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      nextServerSeedHash: 'f83dcd6bd3b8a8c3efc7094e5ceb9fe3b4603bdc82c0267984d27e6b02283a72',
      Details: {
        betId: '579',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  },
  TUMBLE_ONE: {
    data: {
      Player: {
        Balance: 98433.39,
        Rate: 1,
        Currency: 'EUR',
        CoinRate: 100
      },
      Current: {
        Type: 30,
        TumbleIndex: 1,
        TotalWin: 0,
        AccWin: 6,
        Multiplier: {
          active: false,
          netMultiplier: 1,
          map: {}
        },
        Result: {
          R: '102,203,101,203,201,201|105,105,103,105,202,102|103,103,202,105,203,102|204,102,203,203,101,101|104,105,105,25,103,102',
          winningDetails: []
        },
        Round: {
          RoundType: 1,
          Bet: 4,
          ActualBet: 4,
          BetValue: 4,
          Line: 20,
          LineBet: 0.2,
          Payout: 6,
          Mode: 1,
          Items: [
            '1|6',
            '30|0'
          ]
        }
      },
      Next: {
        Type: 1
      },
      Status: 200,
      Ts: 1729254886956,
      nextServerSeedHash: 'demo',
      Details: {
        betId: '579',
        gameId: '50',
        userId: '2'
      }
    },
    errors: []
  }
}
