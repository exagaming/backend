declare namespace App {
  export interface Authenticated {
    userId: string;
    gameId: string;
    userCode: string;
    operatorId: string;
    currencyId: string;
    currencyCode: string;
    operatorUserToken: string;
  }

  export interface Context {
    auth?: Authenticated;
    reqTimeStamp: string;
    traceId: string;
    sequelize: import("sequelize").Sequelize;
    logger: typeof import("./src/libs/logger").default;
    dbModels: { [key: string]: typeof import("sequelize").Model };
    sequelizeTransaction?: import("sequelize").Transaction;
  }

  export interface RouletteRule {
    payout: Number;
    winningNumbers: object.<string, number[]>;
  }
}

declare namespace Express {
  export interface Request {
    context?: App.Context;
  }
}
