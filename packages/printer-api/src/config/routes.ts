import { Request, Response } from 'express'
import { TicketController } from '../controllers/ticket.controller'

export class Routes {
  public ticketController: TicketController = new TicketController()

  public routes(app): void {
    app.route('/v1/ticket').post(this.ticketController.add)
    app.route('/v1/ticket').patch(this.ticketController.update)
  }
}
