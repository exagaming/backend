/**
 * @param {string} message
 * @param {Array<string>} offensiveWords
 * @returns {boolean}
 */
export function messageContainsOffensiveWords (message, offensiveWords) {
  const lowerCaseMessage = message.toLowerCase()
  return offensiveWords.some((offensiveWord) => {
    const wordRegex = new RegExp(`\\b${offensiveWord.toLowerCase()}\\b`)
    return wordRegex.test(lowerCaseMessage)
  })
}

/**
 * @param {string} message
 * @returns {boolean}
 */
export function messagesContainsURL (message) {
  // Regular expression to match URLs including those starting with www and ending with .com, excluding https://giphy.com
  const urlRegex = /^(?!https?:\/\/(?:www\.)?giphy\.com\/).*\b(?:https?:\/\/(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b)|(?:http?:\/\/(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b))|(?:www\.(?!giphy\.com(?:\/|$))[^\s/$.?#]+\.[^\s/]+(?!\.com\b))|\b\w+\.(?!giphy\.com(?:\/|$))(?:com\b|net\b|org\b|info\b|biz\b|co\.uk\b|org\.uk\b|gov\b|edu\b)\b).*/gi
  return urlRegex.test(message)
}
