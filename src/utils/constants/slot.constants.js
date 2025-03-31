export const TRANSACTION_TYPE = {
  BASE: 1,
  FREE_SPIN: 10,
  BONUS: 20,
  RE_SPIN: 30,
  PRE_FREE_SPIN: 40
}

export const PAY_TYPE = {
  LINE: 1,
  BONUS: 2,
  SCATTER: 3,
  WAY: 4
}

export const ROUND_TYPE = {
  NORMAL: 1,
  BUY_FREE_SPIN: 2
}

export const ENGINE_NAME = {
  ENGINE_1: 'engine_1',
  ENGINE_2: 'engine_2',
  ENGINE_3: 'engine_3',
  ENGINE_4: 'engine_4',
  ENGINE_6: 'engine_6'
}

export const ENGINE_TYPE = {
  PAY_LINE: 'pay_line',
  PAY_ANYWHERE: 'pay_anywhere'
}

export const ENGINE_12_LINE_BET = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.50, 2.00, 2.50, 3.00, 4.00, 5.00, 6.00, 7.50, 10.00, 15.00, 20.00]

export const SLOT_LINE_BET_PER_CURRENCY = {
  DEFAULT: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.20, 1.60, 2.00, 2.40, 2.80, 3.20, 3.60, 4.00, 4.50, 5.00, 5.50, 6.00, 7.00, 8.00, 9.00, 10.00, 12.00, 15.00, 20.00, 25.00, 30.00, 40.00, 50.00, 60.00, 70.00, 80.00, 90.00, 100.00],
  BRL: [0.20, 0.40, 0.60, 0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 4.00, 6.00, 8.00, 10.00, 12.00, 14.00, 16.00, 18.00, 20.00, 24.00, 28.00, 32.00, 36.00, 40.00, 45.00, 50.00, 60.00, 70.00, 75.00, 80.00, 90.00, 100.00, 105.00, 120.00, 135.00, 150.00, 160.00, 200.00, 240.00, 280.00, 320.00, 360.00, 400.00],
  EUR: [0.20, 0.40, 0.60, 0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.80, 4.00, 4.20, 5.60, 6.00, 7.00, 8.00, 8.40, 9.80, 10.00, 11.20, 12.00, 12.60, 14.00, 16.00, 18.00, 20.00, 24.00, 28.00, 30.00, 32.00, 36.00, 40.00, 48.00, 50.00, 60.00, 70.00, 72.00, 80.00, 90.00, 96.00, 100.00, 120.00, 144.00, 168.00, 192.00, 216.00, 240.00],
  USD: [0.20, 0.40, 0.60, 0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.80, 4.00, 4.20, 5.60, 6.00, 7.00, 8.00, 8.40, 9.80, 10.00, 11.20, 12.00, 12.60, 14.00, 16.00, 18.00, 20.00, 24.00, 28.00, 30.00, 32.00, 36.00, 40.00, 48.00, 50.00, 60.00, 70.00, 72.00, 80.00, 90.00, 96.00, 100.00, 120.00, 144.00, 168.00, 192.00, 216.00, 240.00],
  TRY: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.20, 1.60, 2.00, 2.40, 2.80, 3.20, 3.60, 4.00, 4.50, 5.00, 5.50, 6.00, 7.00, 8.00, 9.00, 10.00, 12.00, 15.00, 20.00, 25.00, 30.00, 40.00, 50.00, 60.00, 70.00, 80.00, 90.00, 100.00]
}

export const DEFAULT_LINE_BET = [0.20, 0.40, 0.60, 0.80, 1.00, 1.20, 1.40, 1.60, 1.80, 2.00, 2.80, 4.00, 4.20, 5.60, 6.00, 7.00, 8.00, 8.40, 9.80, 10.00, 11.20, 12.00, 12.60, 14.00, 16.00, 18.00, 20.00, 24.00, 28.00, 30.00, 32.00, 36.00, 40.00, 48.00, 50.00, 60.00, 70.00, 72.00, 80.00, 90.00, 96.00, 100.00, 120.00, 144.00, 168.00, 192.00, 216.00, 240.00]
