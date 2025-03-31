export const preLoad = {
  data: {
    Player: {
      Balance: 1000,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    GameInfo: {
      Line: 10,
      LineBet: [
        0.2,
        0.4,
        0.6,
        0.8,
        1,
        1.2,
        1.4,
        1.6,
        1.8,
        2,
        2.8,
        4,
        4.2,
        5.6,
        6,
        7,
        8,
        8.4,
        9.8,
        10,
        11.2,
        12,
        12.6,
        14,
        16,
        18,
        20,
        24,
        28,
        30,
        32,
        36,
        40,
        48,
        50,
        60,
        70,
        72,
        80,
        90,
        96,
        100,
        120,
        144,
        168,
        192,
        216,
        240
      ],
      BetValue: [
        1
      ],
      BuyFeature: [
        {
          RoundType: 2,
          Multiplier: 100
        },
        {
          RoundType: 3,
          Multiplier: 100
        }
      ]
    },
    Status: 200,
    Ts: 1732696360512,
    Next: {
      Type: 1
    }
  },
  errors: []
}

export const baseGame = {
  data: {
    Current: {
      Type: 1,
      TotalWin: 0,
      AccWin: 0,
      Result: {
        R: '203,205,102|202,103,201,102,101|201,203,104,204,102|202,103,104,201,202|103,101,201,205,104|102,203'
      },
      Round: {
        RoundType: 1,
        Bet: 2,
        ActualBet: 2,
        BetValue: 2,
        Line: 10,
        LineBet: 0.2,
        Payout: 0,
        Mode: 1
      }
    },
    Next: {
      Type: 1
    },
    Status: 200,
    Ts: 1732696773304,
    Player: {
      Balance: 998,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    nextServerSeedHash: '395adacd35e2114a33da0a04dc8318814914c723cc5a76744e6af29223db4149',
    Details: {
      betId: '1',
      gameId: '48',
      userId: '35'
    }
  },
  errors: []
}

export const freeGame = {
  data: {
    Player: {
      Balance: 980,
      Rate: 1,
      Currency: 'EUR',
      CoinRate: 100
    },
    Type: 10,
    Current: {
      Result: {
        Current: {
          Type: 10,
          Result: {
            R: '203|205|202|101|105|104|103|103|105|201|103|205|103|101|105|104|202|103|102|202|202|103|205|101|203',
            R2: '203|205|202|101|105|104|103|103|105|201|103|205|103|101|105|104|202|103|102|202|202|103|205|101|203'
          },
          payout: 1
        }
      },
      FreeSpin: {
        Current: 1,
        Total: 10
      }
    },
    next: {
      Type: 10,
      FreeSpin: {
        Next: 2,
        Total: 10
      }
    },
    Status: 200,
    Ts: 1732696882137,
    nextServerSeedHash: 'demo',
    payout: 1,
    Details: {
      betId: '10',
      gameId: '48',
      userId: '35'
    }
  },
  errors: []
}
