function callApi() {
  var myHeaders = new Headers();
  //var url = process.env.APIURL;
  var url = "http://localhost:8081/api/invoices";
  fetch(url, {
          mode: 'no-cors',
          method:'GET',
          headers: myHeaders
      }
  ).then(function(response) {
    return response.json();
  }).then(function(tickets) {
      addTicket(tickets.data)
  }).catch(function(error) {
    console.error('request failed : ', error)
  });
}

function addTicket(tickets) {
  var listContentOld = document.getElementsByClassName("list-content")[0];
  var listContent = document.createElement("ul");
  listContent.setAttribute("class", "list-content")
  var labelMonthOld = "null"
  tickets.forEach((data) => {
    // Si changement de mois
    var options = {year: 'numeric', month: 'long'};
    var labelMonth = new Intl.DateTimeFormat('fr-FR', options).format(new Date(`${data.create_date}`));
    if (labelMonth != labelMonthOld) {
      var listContentLabel = document.createElement("li")
      listContentLabel.innerHTML = labelMonth
      listContentLabel.setAttribute("class", "list-content-label");
      listContent.appendChild(listContentLabel);
      labelMonthOld = labelMonth
    }
    // Ajout d'un ticket

    var shop_info = data.shop
    var listContentItem = document.createElement("li")
    listContentItem.setAttribute("class", "list-content-item")
    listContentItem.setAttribute("onclick", `show(\"${data._id}\")`)

    var itemLogo = document.createElement("img")
    itemLogo.setAttribute("class", "item-logo")
    itemLogo.setAttribute("src", "img/shops/logo_"+shop_info.shop_group.toLowerCase()+".png")
    itemLogo.setAttribute("alt", "shop logo")
    listContentItem.appendChild(itemLogo)

    var itemText = document.createElement("div")
    itemText.setAttribute("class", "item-text")
    var itemTextName = document.createElement("span")
    itemTextName.setAttribute("class", "item-text-name")
    itemTextName.innerHTML = ""+`${shop_info.shop_name}`.toString()
    itemText.appendChild(itemTextName)
    var itemTextDate = document.createElement("span")
    itemTextDate.setAttribute("class", "item-text-date")
    var optionsDate = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    var labelDate = new Intl.DateTimeFormat('fr-FR', optionsDate).format(new Date(`${data.create_date}`));
    itemTextDate.innerHTML = labelDate //`${data.create_date}`
    itemText.appendChild(itemTextDate)
    listContentItem.appendChild(itemText)


    var itemPrice = document.createElement("span")
    itemPrice.setAttribute("class", "item-price")
    itemPrice.innerHTML = Math.round(`${data.invoice_prices.price_with_taxes.amount}`/Math.pow(10, `${data.invoice_prices.price_with_taxes.scale}`)*100)/100+" "+`${data.invoice_prices.price_with_taxes.currency.symbol}`
    listContentItem.appendChild(itemPrice)

    listContent.appendChild(listContentItem)
  })

  listContentOld.replaceWith(listContent)
}

var x = setTimeout(callApi, 10);
