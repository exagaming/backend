export const SOCKET_NAMESPACES = {
  DEMO: '/demo',
  COMMON: '/common',
  WALLET: '/wallet',
  CRASH_GAME: '/crash-game',
  ADMIN: '/admin',
  PLINKO_GAME: '/plinko-game',
  BLACKJACK_GAME: '/blackjack-game',
  MINE_GAME: '/mine-game',
  CHAT: '/chat',
  ENGINE3_GAME: '/engine3-game'
}

export const SOCKET_EMITTERS = {
  DEMO_HELLO_WORLD: SOCKET_NAMESPACES.DEMO + '/helloWorld',
  WALLET_USER_WALLET_BALANCE: SOCKET_NAMESPACES.WALLET + '/userWalletBalance',
  PLINKO_GAME_LIGHTNING_BOARD: SOCKET_NAMESPACES.PLINKO_GAME + '/lightningBoard',
  BLACKJACK_GAME_BET: SOCKET_NAMESPACES.BLACKJACK_GAME + '/getBets',
  MINE_GAME_LIVE_STATS: SOCKET_NAMESPACES.MINE_GAME + '/liveStats',
  CHAT_NEW_MESSAGE: SOCKET_NAMESPACES.CHAT + '/newMessage',
  CRASH_GAME_BETS_INFO: SOCKET_NAMESPACES.CRASH_GAME + '/betsInfo',
  ENGINE3_GAME_JACKPOT_WIN_INFO: SOCKET_NAMESPACES.ENGINE3_GAME + '/jackpotWinInfo',
  ENGINE3_GAME_JACKPOT_INCREMENT_INFO: SOCKET_NAMESPACES.ENGINE3_GAME + '/jackpotInfo'
}

export const SOCKET_LISTENERS = {
  DEMO_HELLO_WORLD: SOCKET_NAMESPACES.DEMO + '/helloWorld',
  CHAT_CHANGE_CHAT_ROOM: SOCKET_NAMESPACES.CHAT + '/changeChatRoom'
}

export const SOCKET_ROOMS = {
  WALLET_USER: SOCKET_NAMESPACES.WALLET + '/user', // append id of the user like this /user:1 for one to one,
  DEMO_USER: SOCKET_NAMESPACES.DEMO + '/demo', // append id of the demo like this /demo:1 for one to one
  CHAT_NEW_MESSAGE: SOCKET_NAMESPACES.CHAT + '/newMessage'
}

export const DEFAULT_CHAT_LANGUAGE_ID = 1
