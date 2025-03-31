import BaseError from '@src/errors/base.error'
import { errorTypes } from '@src/utils/constants/error.constants'
import { extractErrorAttributes } from '@src/utils/error.utils'
import _ from 'lodash'

export const sendResponse = ({ req, res, next }, { successful, result, errors }) => {
  if (successful) {
    res.payload = { data: result, errors: [] }
    next()
  } else {
    next(errors)
  }
}

export const sendSocketResponse = ({ reqData, resCallback }, { successful, result, serviceErrors, defaultError }) => {
  if (successful && !_.isEmpty(result)) {
    return resCallback({ data: result, errors: [] })
  } else {
    if (!_.isEmpty(serviceErrors)) {
      // executed when addError is called from service
      const responseErrors = extractErrorAttributes(serviceErrors).map(errorAttr => errorTypes[errorAttr] || errorAttr)
      return resCallback({ data: {}, errors: responseErrors })
    }
    const responseError = new BaseError({ ...defaultError })
    return resCallback({ data: {}, errors: [responseError] })
  }
}
