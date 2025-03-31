export const BASE_LOSE = {
  Current: {
    Type: 1,
    TotalWin: 0,
    AccWin: 0,
    Result: {
      SC: 0,
      R: '105,204,101,103|102,104,104,102|101,105,101,101|105,101,102,103|103,105,104,102',
      WR: []
    },
    MultiplierMap: {},
    Round: {
      RoundType: 1,
      Bet: 200,
      ActualBet: 200,
      BetValue: 200,
      Line: 20,
      LineBet: 10,
      Payout: 0,
      Mode: 1
    }
  },
  Next: {
    Type: 1
  },
  Status: 200,
  Ts: 1720773394069,
  Player: {
    Balance: 1360591.6900000004,
    Rate: 1,
    Currency: 'EUR',
    CoinRate: 100
  },
  nextServerSeedHash: '4e6acf5ad45e0141313f28d7bc7c4cd992ed0685f6ab95439c2f9a43b6ca4c10',
  Details: {
    betId: '41814',
    gameId: 15,
    userId: '5'
  }
}

export const BASE_WIN = {
  Current: {
    Type: 1,
    TotalWin: 216,
    AccWin: 216,
    Result: {
      SC: 0,
      R: '101,109,202,203|204,302,301,103|104,105,103,101|203,204,104,104|101,103,105,105',
      WR: [
        {
          symbol: 'LV1',
          wayPayout: 2.4,
          way: [
            '0-0',
            '1-1',
            '2-3'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV1',
          wayPayout: 4.8,
          way: [
            '0-0',
            '1-2',
            '2-3'
          ],
          multiplier: 7
        },
        {
          symbol: 'LV4',
          wayPayout: 6,
          way: [
            '0-1',
            '1-1',
            '2-0',
            '3-2'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV4',
          wayPayout: 6,
          way: [
            '0-1',
            '1-1',
            '2-0',
            '3-3'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV4',
          wayPayout: 12,
          way: [
            '0-1',
            '1-2',
            '2-0',
            '3-2'
          ],
          multiplier: 7
        },
        {
          symbol: 'LV4',
          wayPayout: 12,
          way: [
            '0-1',
            '1-2',
            '2-0',
            '3-3'
          ],
          multiplier: 7
        }
      ]
    },
    MultiplierMap: {
      '1,1': 1,
      '1,2': 7
    },
    Round: {
      RoundType: 1,
      Bet: 4,
      ActualBet: 4,
      BetValue: 4,
      Line: 20,
      LineBet: 0.2,
      Payout: 216,
      Mode: 1
    }
  },
  Next: {
    Type: 1
  },
  Status: 200,
  Ts: 1720773501210,
  Player: {
    Balance: 98621.4,
    Rate: 1,
    Currency: 'EUR',
    CoinRate: 100
  },
  nextServerSeedHash: '404cf7e0e12ff713452b87dd56b2d194e262c8bc2207d8f4da517c9b06cf825c',
  Details: {
    betId: '101',
    gameId: 15,
    userId: '1'
  }
}

export const FREE_SPIN_WIN = {
  Player: {
    Balance: 1354081.6900000004,
    Rate: 1,
    Currency: 'EUR',
    CoinRate: 100
  },
  Current: {
    Type: 10,
    FreeSpin: {
      Current: 2,
      Total: 15
    },
    TotalWin: 400,
    AccWin: 400,
    Result: {
      R: '102,103,105,102|104,204,201,102|102,105,102,103|109,108,104,101|103,105,202,104',
      WR: [
        {
          symbol: 'LV2',
          wayPayout: 100,
          way: [
            '0-0',
            '1-3',
            '2-0'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV2',
          wayPayout: 100,
          way: [
            '0-0',
            '1-3',
            '2-2'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV2',
          wayPayout: 100,
          way: [
            '0-3',
            '1-3',
            '2-0'
          ],
          multiplier: 1
        },
        {
          symbol: 'LV2',
          wayPayout: 100,
          way: [
            '0-3',
            '1-3',
            '2-2'
          ],
          multiplier: 1
        }
      ]
    },
    MultiplierMap: {},
    Round: {
      RoundType: 2,
      Bet: 200,
      ActualBet: 200,
      BetValue: 200,
      Line: 20,
      LineBet: 10,
      Payout: 400,
      Mode: 1
    }
  },
  Next: {
    Type: 10,
    FreeSpin: {
      Next: 3,
      Total: 15,
      MoreAwarded: 0 // This will may come as a quantity in number, since free spins can be awarded in between free spins too.
    }
  },
  Status: 200,
  Ts: 1720773232146,
  nextServerSeedHash: 'demo',
  Details: {
    betId: '41813',
    gameId: 15,
    userId: '5'
  }
}
