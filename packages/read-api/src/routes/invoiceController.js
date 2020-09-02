// invoiceController.js
// Import invoice model
Invoice = require('./invoiceModel');
// Handle index actions
exports.index = function (req, res) {
    Invoice.get(function (err, invoices) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Invoice retrieved successfully",
            data: invoices
        });
    });
};
// Handle create invoice actions
exports.new = function (req, res) {
    var invoice = new Invoice();
    var arr = JSON.parse(JSON.stringify(req.body));
    invoice.invoice_id = arr['invoice_id'];
    invoice.shop = arr['shop'];
    invoice.client_id = arr['client_id'];
    invoice.order = arr['order'];
    invoice.invoice_taxes = arr['invoice_taxes'];
    invoice.invoice_prices = arr['invoice_prices'];
    invoice.customer = arr['customer'];
    invoice.certification = arr['certification'];
    invoice.transaction = arr['transaction'];
// save the invoice and check for errors
    invoice.save(function (err) {
        // if (err)
        //     res.json(err);
        res.json({
            message: 'New invoice created!',
            data: invoice
        });
   });
};
// Handle view invoice info
exports.view = function (req, res) {
    Invoice.findById(req.params.invoice_id, function (err, invoice) {
        if (err)
            res.send(err);
        res.json({
            message: 'Invoice details loading..',
            data: invoice
        });
    });
};
// Handle update invoice info
exports.update = function (req, res) {
Invoice.findById(req.params.invoice_id, function (err, invoice) {
        if (err)
            res.send(err);
    var arr = JSON.parse(JSON.stringify(req.body));
    invoice.ticket_id = arr['ticket_id'];
    invoice.shop_id = arr['shop_id'];
    invoice.shop_info = arr['shop_info'];
    invoice.client_id = arr['client_id'];
    invoice.product_list = arr['product_list'];
    invoice.ticket_total_price = arr['ticket_total_price'];
    invoice.ticket_tva = arr['ticket_tva'];
// save the invoice and check for errors
        invoice.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Invoice Info updated',
                data: invoice
            });
        });
    });
};
// Handle delete invoice
exports.delete = function (req, res) {
    Invoice.remove({
        _id: req.params.invoice_id
    }, function (err, invoice) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Invoice deleted'
        });
    });
};
