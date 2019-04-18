const rp = require('request-promise')
const fs = require('fs')
const cheerio = require('cheerio')
const baseuri = 'https://www.prairienursery.com'

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
    options.uri = baseuri + '/store/seeds/page/' + pagenumber + '?_url=seeds'
    console.log(options.uri)
    rp(options)
      .then(function ($) {
        // console.log(myO.pagination.totalPages)
        $('#productList li .product-link a').each(function (i) {
          var thisUrl = $(this).attr('href')
          console.log(thisUrl)
          // if (i === 1)
          parsePlantPageHtml(thisUrl)
        })
      })
      .catch(e => console.log('Critical failure: ' + e.message))
  }
}

function parsePlantPageHtml (url) {
  options.uri = baseuri + url
  rp(options)
    .then(function ($) {
      var thisPlant = {}
      thisPlant.name = $('#latin-name').text().substring(3, 100).toLowerCase()
      thisPlant.commonName = $('#common-name').text().toLowerCase()
      thisPlant.commonName = thisPlant.commonName.substring(0, thisPlant.commonName.length - 5)
      thisPlant.description = $('#product-bottom').prev('div').text()
      thisPlant.uri = options.uri
      thisPlant.imageuri = baseuri + $('#product-main-image a').attr('href')
      const spo = $('div.price-range-tab').prev('div').text()
      thisPlant['seeds/ounce'] = parseInt(spo.substring(0, spo.indexOf(' ')).replace(/,/g, ''))
      thisPlant.prices = []
      $('table.price-range-table tr').each(function (i) {
        if (i !== 0) {
          var thisPriceData = $(this).find('td')
          var thisSize = thisPriceData.eq(1).text().toLowerCase()
          var qty, unit
          if (thisSize.includes(' ')) {
            thisSize = thisSize.split(' ')
            qty = thisSize[0]
            unit = thisSize[1]
            if (qty.includes('/')) {
              qty = qty.split('/')
              qty = qty[0] / qty[1]
            }
          } else {
            qty = 1
            unit = thisSize
          }
          // console.log('1:' + qty)
          // console.log('2:' + unit)
          // console.log('3:' + thisPriceData.eq(2).text())
          thisPlant.prices.push({ quantity: qty, unit: unit, price: thisPriceData.eq(2).text() })
        }
      })
      $('#product-right div.bg-style1 table tr').each(function () {
        var data = $(this).find('td')
        var prop = (data.eq(0).text())
        var val = data.eq(1).text()
        // console.log('data:' + prop)
        // console.log('prop:' + val)
        prop = prop.substring(0, prop.length - 1).toLowerCase()
        switch (prop) {
          case 'zones':
            val = val.split(',').map(function (item) { return parseInt(item.trim()) })
            break
          case 'blooms':
            val = val.split(',').map(function (item) { return months[item.trim().toLowerCase()] })
            break
          case 'light':
            val = val.split(',').map(function (item) { return lights[item.trim().toLowerCase()] })
            break
          case 'color':
            val = [ val ]
            break
          case 'spacing':
          case 'height':
            var mm = getMinMax(val)
            val = { min: cvInches(mm.min), max: cvInches(mm.max) }
            break
          case 'per acre':
            prop = 'seedrate_acre'
            break
          case '1000sqft':
            prop = 'seedrate_1000sqft'
            break
          default:
            if (val.includes(',')) {
              val = val.split(',').map(function (item) { return item.trim() })
            }
        }
        thisPlant[prop] = val
      })
      console.log(thisPlant)
      var fn = 'C:\\Google Drive\\data\\plantData\\' + thisPlant.name + '.prairienursery.json'
      fs.writeFile(fn, JSON.stringify(thisPlant, null, 2), (err) => {
        if (err) throw err
        console.log(fn + ' has been saved!')
      })
    })
    .catch(e => console.log('Critical failure: ' + e.message))
}

function getMinMax (theItem) {
  var min, max
  if (theItem.includes('-')) {
    theItem = theItem.split('-')
    min = theItem[0]
    max = theItem[1]
  } else {
    min = theItem
    max = theItem
  }
  return { min: min, max: max }
}

function cvInches (theItem) {
  if (theItem.includes('\'')) {
    return parseFloat(theItem) * 12
  } else {
    return parseFloat(theItem)
  }
}

var months = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'Apr',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'Novermber',
  dec: 'December'
}

var lights = {
  'full sun': 'Full',
  'partial': 'Partial',
  'shade': 'Shade'
}

getProducts()
