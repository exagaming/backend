import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvKeywords from 'ajv-keywords'

const ajv = new Ajv({ strict: 'log', removeAdditional: 'all', coerceTypes: true, allowUnionTypes: true, useDefaults: true })

addFormats(ajv)
ajvKeywords(ajv)

export default ajv
