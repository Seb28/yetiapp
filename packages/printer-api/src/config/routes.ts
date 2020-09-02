import { Request, Response } from 'express'
import { TicketController } from '../controllers/ticket.controller'

export class Routes {
  public ticketController: TicketController = new TicketController()

  public routes(app): void {
    app.route('/v1/tickets').post(this.ticketController.index)
  }
}
