import { calculateCardPoints } from '@src/utils/blackJack.utils'
import { BLACKJACK, BLACKJACK_DECK_SIZE, BLACKJACK_TOTAL_DECKS } from '@src/utils/constants/blackJack.constants'
import { DECK, DECK_SIZE } from '@src/utils/constants/game.constants'
import _ from 'lodash'
import { times } from 'number-precision'
import { generateRandomNumber } from './encryption.helpers'

/**
 * @param {number} minOdd
 * @param {number} maxOdd
 * @param {number} graphTime
 * @returns {number}
 */
export function getMultiplierByGraphTime (minOdd, maxOdd, graphTime) {
  const multiplier = +(Math.pow(2, times(graphTime, 0.09))).toFixed(2)
  return multiplier <= +minOdd ? +minOdd.toFixed(2) : multiplier >= maxOdd ? +maxOdd : +multiplier
}

/**
 * @param {string} roundHash
 * @param {string} salt
 * @param {number} minOdds
 * @param {number} maxOdds
 * @param {number} houseEdge
 * @returns {number}
 */
export function crashGameResult (roundHash, salt, minOdds, maxOdds, houseEdge) {
  const probability = (100 - houseEdge) / generateRandomNumber(roundHash, salt)
  const result = Math.floor(probability)

  return Math.max(minOdds, Math.min(maxOdds, result / 100))
}

/**
 * @param {string} clientSeed
 * @param {string} serverSeed
 * @returns {number}
 */
export function rouletteGameResult (clientSeed, serverSeed) {
  const probability = generateRandomNumber(clientSeed, serverSeed, 37)
  return parseInt(probability)
}

/**
 * @param {string} clientSeed
 * @param {string} serverSeed
 * @param {number} numberOfRows
 * @returns {string}
 */
export function plinkoGameResult (clientSeed, serverSeed, numberOfRows) {
  let binaryString = ''

  for (let i = 1; i <= numberOfRows; i++) {
    const probability = generateRandomNumber(clientSeed.concat(`-${i}`), serverSeed, 2)
    binaryString = binaryString.concat(String(parseInt(probability)))
  }

  return binaryString
}

/**
 * @param {string} clientSeed
 * @param {string} serverSeed
 * @param {number} numberOfMines
 * @param {number} totalNumberOfTiles
 * @returns {Array<number>}
 */
export function mineGameResult (clientSeed, serverSeed, numberOfMines, totalNumberOfTiles) {
  const mines = _.times(totalNumberOfTiles, (value) => value + 1)

  for (let i = 0; i < numberOfMines; i++) {
    const probability = generateRandomNumber(clientSeed + `-${i + 1}`, serverSeed, totalNumberOfTiles, i)
    let randomTileIndex = parseInt(probability)
    if (randomTileIndex >= totalNumberOfTiles) randomTileIndex = totalNumberOfTiles - 1;

    [mines[i], mines[randomTileIndex]] = [mines[randomTileIndex], mines[i]]
  }

  return mines.slice(0, numberOfMines)
}

/**
 * @param {string} clientSeed
 * @param {string} serverSeed
 * @returns {Array<string>}
 */
export function randomBlackJackDeck (clientSeed, serverSeed) {
  const blackJackDeck = _.times(DECK_SIZE * BLACKJACK_TOTAL_DECKS, (index) => DECK[(index % DECK_SIZE) + 1])

  for (let i = 0; i < BLACKJACK_DECK_SIZE; i++) {
    const randomNumber = parseInt(generateRandomNumber(clientSeed.concat(':').concat(i), serverSeed, blackJackDeck.length - i))
    if (i !== randomNumber) {
      [blackJackDeck[i], blackJackDeck[randomNumber]] = [blackJackDeck[randomNumber], blackJackDeck[i]]
    }
  }

  return blackJackDeck.slice(0, BLACKJACK_DECK_SIZE)
}

/**
 * @param {object} blackJackRound
 * @returns
 */
function getCardDeck (blackJackRound) {
  const cardDeck = randomBlackJackDeck(blackJackRound.clientSeed, blackJackRound.serverSeed)
  const totalCardDistributed = blackJackRound.dealerHand.length + blackJackRound.mainBet.playerHand.length + (blackJackRound?.splitBet?.playerHand?.length || 0)

  return { cardDeck, totalCardDistributed }
}

/**
 * @param {object} blackJackRound
 * @param {object} currentBet
 */
export function drawCard (blackJackRound, currentBet) {
  const { cardDeck, totalCardDistributed } = getCardDeck(blackJackRound)

  currentBet.playerHand.push(cardDeck[totalCardDistributed])
  currentBet.playerPoints = calculateCardPoints(currentBet.playerHand)
  currentBet.changed('playerHand', true)
}

/**
 * @param {object} blackJackRound
 */
export function drawDealerCards (blackJackRound) {
  let { cardDeck, totalCardDistributed } = getCardDeck(blackJackRound)

  // INFO: Generate and append cards in dealer's hand until the point reaches 16 (standard case, https://bicyclecards.com/how-to-play/blackjack).
  if (blackJackRound.mainBet.playerPoints < BLACKJACK) {
    while (blackJackRound.dealerPoints <= 16) {
      blackJackRound.dealerHand.push(cardDeck[totalCardDistributed++])
      blackJackRound.dealerPoints = calculateCardPoints(blackJackRound.dealerHand)
    }
    blackJackRound.changed('dealerHand', true)
  }
}
