import { BLACKJACK } from './constants/blackJack.constants'
import { FACE_CARD_NUMBERS } from './constants/game.constants'

/**
 * Send string array in format i.e. ['HEART:1']
 * @param {Array<string>} cardList
 * @returns
 */
export function calculateCardPoints (cardList) {
  const { acePoints, points } = cardList.reduce((prev, card) => {
    const cardNumber = +card.split(':')[1]
    let cardPoints = cardNumber

    if (FACE_CARD_NUMBERS.includes(cardNumber)) {
      prev.points += 10
      cardPoints = 10
    } else {
      prev.points += cardNumber
    }
    prev.acePoints += cardNumber === 1 && (prev.acePoints + 11) <= 21 ? 11 : cardPoints

    return prev
  }, { points: 0, acePoints: 0 })

  return acePoints > 21 ? points : Math.max(points, Math.min(acePoints, 21))
}

/**
 * Send dealerFirstCard in format i.e. 'HEART:1'
 * @param {string} dealerFirstCard
 * @returns {boolean}
 */
export function insuranceAvailableForBet (dealerFirstCard) {
  return +dealerFirstCard.split(':')[1] === 1
}

/**
 * Send playerFirstCard and playerSecondCard in format i.e. 'HEART:1'
 * @param {string} playerFirstCard
 * @param {string} playerSecondCard
 * @returns {boolean}
 */
export function splitAvailableForBet (playerFirstCard, playerSecondCard) {
  return playerFirstCard.split(':')[1] === playerSecondCard.split(':')[1]
}

/**
 * Send string array in format i.e. ['HEART:1']
 * @param {Array<string>} playerCards
 * @returns {boolean}
 */
export function doublingAvailableForBet (playerCards) {
  if (playerCards.length !== 2) return false
  return true
}

/**
 * @param {string} dealerHand
 * @param {number} dealerPoints
 * @param {object} insuranceBet
 * @returns {boolean}
 */
export function bypassingInsuranceBetValidation (dealerFirstHand, dealerPoints, insuranceBet) {
  if (insuranceBet) return false
  else if (dealerPoints === BLACKJACK && dealerFirstHand.split(':')[1] === 1) return true

  return false
}
