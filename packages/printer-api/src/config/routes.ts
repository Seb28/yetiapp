import { Request, Response } from 'express'
import { TicketController } from '../controllers/ticket.controller'
import { LinkController } from '../controllers/link.controller'

export class Routes {
  public ticketController: TicketController = new TicketController()
  public linkController: LinkController = new LinkController()

  public routes(app): void {
    app.route('/v1/ticket').post(this.ticketController.add)
    app.route('/v1/ticket').patch(this.ticketController.update)
    app.route('/v1/link').post(this.linkController.link)
  }
}
