import { GameIsUnderMaintenanceModeErrorType, GameNotActiveErrorType, OperatorGameNotActiveErrorType } from '@src/libs/errorTypes'
import { GameSettingsService } from '@src/services/common/gameSettings.service'

/** @type {import('express').Handler} */
export async function checkGameStatusMiddleware (req, _, next) {
  try {
    const gameId = req.body.gameId || req.query.gameId || req.params.gameId || req.context.auth.gameId
    const operatorId = req.body.operatorId || req.query.operatorId || req.params.operatorId || req.context.auth.operatorId

    const gameSetting = await GameSettingsService.run({ gameId, operatorId }, req.context)

    // if (!gameSetting.game.isActive) next(GameNotActiveErrorType)
    // if (!gameSetting.isActive) next(OperatorGameNotActiveErrorType)
    // if (gameSetting.maintenanceMode) next(GameIsUnderMaintenanceModeErrorType)

    next()
  } catch (error) {
    next(error)
  }
}
