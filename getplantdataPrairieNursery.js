const rp = require('request-promise')
const fs = require('fs')
const cheerio = require('cheerio')
const baseuri = 'https://www.prairienursery.com/store/seeds/page/'

var options = {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Request': '1'
  },
  transform: function (body) {
    return cheerio.load(body)
  },
  jar: true
}

async function getProducts () {
  var pagenumber
  for (pagenumber = 1; pagenumber <= 5; pagenumber++) {
    options.uri = baseuri + pagenumber + '?_url=seeds'
    console.log(options.uri)
    rp(options)
      .then(function ($) {
        // console.log(myO.pagination.totalPages)
        $('#productList li .product-link a').each(function () {
          var thisUrl = $(this).attr('href')
          console.log(thisUrl)
          parsePlantPageHtml(thisUrl)
        })
      })
      .catch(e => console.log('Critical failure: ' + e.message))
  }
}

function parsePlantPageHtml (url) {
  options.uri = 'https://www.prairienursery.com/' + url
  rp(options)
    .then(function ($) {
      var thisPlant = {}
      thisPlant.name = $('#common-name').text()
      thisPlant.commonName = $('#latin-name').text()
      thisPlant.description = $('#product-bottom').prev('div').text()
      const spo = $('div.price-range-tab').prev('div').text()
      thisPlant.seedsperoz = parseInt(spo.substring(0, spo.indexOf(' ')).replace(/,/g, ''))
      $('#product-right div.bg-style1 table tr').each(function () {
        // console.log('item: ' + $(this).text())
        var data = $(this).find('td').text()
        var colon = data.indexOf(':')
        var prop = data.substring(0, colon).toLowerCase()
        var val = data.substring(colon + 1, 100)
        // switch (prop) {
        //   case 'Germination Code':
        //     val = val.replace(/\s+/g, ',')
        //     break
        //   case 'Plant Spacing':
        //     val = val.substring(0, val.length - 1)
        //     break
        //   case 'USDA Zones':
        //     val = val.split('-')
        //     val = { min: val[0], max: val[1] }
        //     break
        //   case 'Seeds/Packet':
        //   case 'Seeds/Ounce':
        //     break
        //   case 'Height':
        //     var n = val.toLowerCase().indexOf('feet')
        //     if (n !== -1) {
        //       val = (parseInt(val) * 12).toString()
        //     } else {
        //       val = parseInt(val)
        //     }
        //     break
        //   default:
        //     val = val.split(',').map(function (item) { return item.trim() })
        // }

        if (val.includes(', ')) {
          thisPlant[prop] = val.split(', ')
        } else {
          thisPlant[prop] = val
        }
      })
      console.log(thisPlant)
      var fn = 'C:\\Google Drive\\data\\plantData\\' + thisPlant.name + '.prairienursery.json'
      fs.writeFile(fn, JSON.stringify(thisPlant, null, 2), (err) => {
        if (err) throw err
        console.log(fn + ' has been saved!')
      })
    })
    .catch(e => console.log('Critical failure: ' + e.message))
    //     $('div.product-information--details').find('dt').each(function (i, elem) {
    //     var prop = $(this).text()
    //     var val = $(this).next('dd').text().trim()
    //     switch (prop) {
    //       case 'Germination Code':
    //         val = val.replace(/\s+/g, ',')
    //         break
    //       case 'Plant Spacing':
    //         val = val.substring(0, val.length - 1)
    //         break
    //       case 'USDA Zones':
    //         val = val.split('-')
    //         val = { min: val[0], max: val[1] }
    //         break
    //       case 'Seeds/Packet':
    //       case 'Seeds/Ounce':
    //         break
    //       case 'Height':
    //         var n = val.toLowerCase().indexOf('feet')
    //         if (n !== -1) {
    //           val = (parseInt(val) * 12).toString()
    //         } else {
    //           val = parseInt(val)
    //         }
    //         break
    //       default:
    //         val = val.split(',').map(function (item) { return item.trim() })
    //     }
}

getProducts()
