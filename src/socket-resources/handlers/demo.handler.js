import { sendSocketResponse } from '../../helpers/response.helpers'
import { InternalServerErrorType } from '../../libs/errorTypes'
import DemoEmitter from '../emitters/demo.emitter'

/**
 * Demo Handler for handling all the request of /demo namespace
 *
 * @export
 * @class DemoHandler
 */
export default class DemoHandler {
  /**
   * Handler method to handle the request for helloWorld event
   *
   * @static
   * @param {import('../../middlewares/socket/contextSocket').SocketRequestData} reqData - object contains all the request params sent from the client
   * @param {function} resCallback - function to send acknowledgement with data to the emitter
   * @memberof DemoHandler
   */
  static async helloWorld (reqData, resCallback) {
    try {
      const result = {}

      sendSocketResponse({ reqData, resCallback }, { result: {}, successful: true, serviceErrors: [], defaultError: InternalServerErrorType })
      DemoEmitter.emitHelloWorld(result)
    } catch (error) {
      resCallback({ data: {}, errors: [InternalServerErrorType] })
    }
  }
}
