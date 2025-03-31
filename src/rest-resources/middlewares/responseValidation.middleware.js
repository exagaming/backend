import ajv from '@src/libs/ajv'
import { mapValues } from 'lodash'

/**
 * A Socket Context Data type
 * @typedef {Object} ResponseSchema
 * @property {import('ajv').Schema} default
 */

/**
 * This middleware is to validate the response of a request, accespts and object containing response object
 * @param {{
 *   responseSchema: ResponseSchema
 * }}
 * @return {import('express').RequestHandler}
 * @example
 * responseValidationMiddleware({
 *  responseSchema: {
 *    default: {
 *      type: 'string'
 *    },
 *    200: {
 *      type: 'string'
 *    },
 *    '2xx': {
 *      type: 'string'
 *    }
 *  }
 * })
 */
export default function responseValidationMiddleware ({ responseSchema = {} } = {}) {
  const compiledResponseSchema = mapValues(responseSchema, schema => ajv.compile(schema))

  return (req, res) => {
    res.payload = JSON.parse(JSON.stringify({ data: null, errors: [], ...res.payload }))

    const statusCode = res.statusCode || req?.context?.statusCode || 200
    const compiledSchema = compiledResponseSchema[statusCode] || compiledResponseSchema[`${statusCode.toString()[0]}xx`] || compiledResponseSchema.default

    if (compiledSchema) compiledSchema(res.payload.data)
    res.status(statusCode).json(res.payload)
  }
}
