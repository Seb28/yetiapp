import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

export class NodesController {
  public index(req: Request, res: Response) {
    const requestId = uuid()
    res.json({
      identifier: requestId,
    })
  }
}
