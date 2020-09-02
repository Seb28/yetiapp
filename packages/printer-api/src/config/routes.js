"use strict";
exports.__esModule = true;
exports.Routes = void 0;
var ticket_controller_1 = require("../controllers/ticket.controller");
var Routes = /** @class */ (function () {
    function Routes() {
        this.ticketController = new ticket_controller_1.TicketController();
    }
    Routes.prototype.routes = function (app) {
        app.route('/v1/ticket').post(this.ticketController.add);
        app.route('/v1/ticket').patch(this.ticketController.update);
    };
    return Routes;
}());
exports.Routes = Routes;
