function show(invoiceId) {
  var element = document.getElementById("body");
  element.classList.toggle("show-ticket");
  var myHeaders = new Headers();
  fetch(url+"/"+invoiceId, {
          mode: 'no-cors',
          method:'GET',
          headers: myHeaders
      }
  ).then(function(response) {
    return response.json();
  }).then(function(ticket) {
      fillTicket(ticket.data)
  }).catch(function(error) {
    console.error('request failed : ', error)
  });

}

function back() {
  var element = document.getElementById("body");
  element.classList.toggle("show-ticket");
}

function fillTicket(ticket) {
  var ticketHeaderTitle = document.getElementsByClassName("ticket-header-title")[0];
  var options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  var labelMonth = new Intl.DateTimeFormat('fr-FR', options).format(new Date(`${ticket.create_date}`));
  ticketHeaderTitle.innerHTML = "Votre ticket du "+ labelMonth

  var shop_info = ticket.shop
  var ticketShopLogo = document.getElementsByClassName("ticket-shop-logo")[0];
  ticketShopLogo.setAttribute("src", "img/shops/logo_"+shop_info.shop_group.toLowerCase()+".png")

  var ticketShopName = document.getElementsByClassName("ticket-shop-name")[0];
  ticketShopName.innerHTML = ""+`${shop_info.shop_name}`.toString()

  var ticketShopInfo = document.getElementsByClassName("ticket-shop-info")[0];
  ticketShopInfo.innerHTML = ""+`${shop_info.shop_info}`.toString()

  var ticketContentOld = document.getElementsByClassName("ticket-content")[0];
  var ticketContent = document.createElement("ul");
  ticketContent.setAttribute("class", "ticket-content")

  ticket.order.forEach((line) => {
    var ticketContentItemArticle = document.createElement("li")
    ticketContentItemArticle.setAttribute("class", "ticket-content-item article")

    var ticketContentItemQuantity = document.createElement("span")
    ticketContentItemQuantity.setAttribute("class", "ticket-content-item-quantity")
    ticketContentItemQuantity.innerHTML = ""+`${line.product_qty.quantity}`.toString()
    ticketContentItemArticle.appendChild(ticketContentItemQuantity)

    var ticketContentItemName = document.createElement("span")
    ticketContentItemName.setAttribute("class", "ticket-content-item-name")
    ticketContentItemName.innerHTML = ""+`${line.product_short_desc}`.toString()
    ticketContentItemArticle.appendChild(ticketContentItemName)

    var ticketContentItemPrice = document.createElement("span")
    ticketContentItemPrice.setAttribute("class", "ticket-content-item-price")
    ticketContentItemPrice.innerHTML = Math.round(`${line.product_prices.price_with_taxes.amount}`/Math.pow(10, `${line.product_prices.price_with_taxes.scale}`)*100)/100+ " " + `${line.product_prices.price_with_taxes.currency.symbol}`
    ticketContentItemArticle.appendChild(ticketContentItemPrice)

    ticketContent.appendChild(ticketContentItemArticle)
  })
  ticketContentOld.replaceWith(ticketContent)


  var ticketSummaryOld = document.getElementsByClassName("ticket-summary")[0]
  var ticketSummary = document.createElement("ul")
  ticketSummary.setAttribute("class","ticket-summary")

  var ticketSummaryItemTotal = document.createElement("li")
  ticketSummaryItemTotal.setAttribute("class","ticket-summary-item total")
  ticketSummary.appendChild(ticketSummaryItemTotal)

  var ticketSummaryItemLabel = document.createElement("span")
  ticketSummaryItemLabel.setAttribute("class","ticket-summary-item-label")
  ticketSummaryItemLabel.innerHTML = "Total"
  ticketSummaryItemTotal.appendChild(ticketSummaryItemLabel)
  var ticketSummaryItemPrice = document.createElement("span")
  ticketSummaryItemPrice.setAttribute("class","ticket-summary-item-price")
  ticketSummaryItemPrice.innerHTML = Math.round(`${ticket.invoice_prices.price_with_taxes.amount}`/Math.pow(10, `${ticket.invoice_prices.price_with_taxes.scale}`)*100)/100+ " " + `${ticket.invoice_prices.price_with_taxes.currency.symbol}`
  ticketSummaryItemTotal.appendChild(ticketSummaryItemPrice)
  ticketSummaryOld.replaceWith(ticketSummary)

  ticket.invoice_taxes.forEach((taxe) => {
    var ticketSummaryItemTaxes = document.createElement("li")
    ticketSummaryItemTaxes.setAttribute("class", "ticket-summary-item tax")
    var ticketSummaryItemTaxesLabel = document.createElement("span")
    ticketSummaryItemTaxesLabel.setAttribute("class", "ticket-summary-item-label")
    ticketSummaryItemTaxesLabel.innerHTML = `${taxe.code}` + " " + `${taxe.value}` + "%"
    ticketSummaryItemTaxes.appendChild(ticketSummaryItemTaxesLabel)

    var ticketSummaryItemTaxesPrice = document.createElement("span")
    ticketSummaryItemTaxesPrice.setAttribute("class", "ticket-summary-item-price")
    ticketSummaryItemTaxesPrice.innerHTML = Math.round(`${taxe.amount.amount}`/Math.pow(10, `${taxe.amount.scale}`)*100)/100+ " " + `${taxe.amount.currency.symbol}`
    ticketSummaryItemTaxes.appendChild(ticketSummaryItemTaxesPrice)
    ticketSummary.appendChild(ticketSummaryItemTaxes)
  })
  var ticketBarcodeNumber = document.getElementsByClassName("ticket-barcode-number")[0]
  ticketBarcodeNumber.innerHTML = `${ticket.invoice_id}`

  var ticketEditionDate = document.getElementsByClassName("ticket-shop-info date")[0]
  var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
  var labelDate = new Intl.DateTimeFormat('fr-FR', optionsDate).format(new Date(`${ticket.create_date}`));
  ticketEditionDate.innerHTML = "Édité le "+ labelDate

}
