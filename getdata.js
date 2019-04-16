const rp = require('request-promise')
const fs = require('fs')
//const cheerio = require('cheerio')
//const axios = require('axios')
const storage = require('node-persist')
// const url = require('url')
var storedPlants
var cookieJar = rp.jar
const baseuri = 'https://api.searchspring.net/api/search/search.json?resultsFormat=native&siteId=qfh40u&filter.category_code=seeds&page='

var options = {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
    'X-Requested-With': 'XMLHttpRequest',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Request': '1'
  },
  jar: true
}

async function getProducts () {
  var pagenumber
  for (pagenumber = 1; pagenumber <= 27; pagenumber++) {
    options.uri = baseuri + pagenumber
    console.log(options.uri)
    rp(options)
      .then(function ($) {
        var myO = JSON.parse($)
        console.log(myO.pagination.totalPages)
        myO.results.forEach(async function (thisPlant, i) {
          var newPlant = {}
          newPlant.name = thisPlant.name
          newPlant.commonName = thisPlant.cmn_name
          newPlant.description = thisPlant.description
          newPlant.sku = thisPlant.sku
          newPlant.bloomtime = thisPlant.bloom_time
          newPlant.color = thisPlant.bloom_color
          if (typeof thisPlant.ss_advantages !== 'undefined') {
            newPlant.features = thisPlant.ss_advantages
          }
          newPlant.germination = thisPlant.germination_code
          newPlant.exposure = thisPlant.sun_exposure
          newPlant.soil = thisPlant.soil_moisture
          if (typeof thisPlant.all_prices !== 'undefined') {
            newPlant.prices = []
            thisPlant.all_prices.forEach(function (price, p) {
              if (thisPlant.available_options[p * 2] === 'Seeds') {
                newPlant.prices.push({ size: thisPlant.available_options[(p * 2) + 1], price: price })
              }
            })
          }
          newPlant.imageUrl = thisPlant.imageUrl
          newPlant.thumbNailUrl = thisPlant.thumbnailImageUrl
          // if (storedPlantNames.includes(newPlant.name)) {
          //   await storage.updateItem(newPlant.name, newPlant)
          // } else {
          //   await storage.setItem(newPlant.name, newPlant)
          // }
          var fn = 'C:\\Google Drive\\data\\plantData\\' + newPlant.name + '.prairiemoon.json'
          fs.writeFile(fn, JSON.stringify(newPlant), (err) => {
            if (err) throw err
            console.log(fn + ' has been saved!')
          })
          // console.log(newPlant)
        })
      })
      .catch(e => console.log('Critical failure: ' + e.message))
  }
}

function processSeedsPageHTML (my$) {
  console.log(my$.html().length)
  console.log(my$('.page-links-active').html())
  let pagePlants = []
  my$('#js-product-list').find('p.category-product-name a').each(function (i, elem) {
    var thisPlant = {}
    thisPlant.latinName = my$(elem).find('span.latin-name').text()
    thisPlant.commonName = my$(elem).find('span.common-name').text()
    thisPlant.prairieMoonUrl = my$(this).attr('href')
    console.log(thisPlant.prairieMoonUrl)
    pagePlants.push(thisPlant)
  })
  return Promise.resolve(pagePlants)
}

// function getPlantFromProductPage (plantUrl) {
//   return new Promise(function (resolve, reject) {
//     options.uri = plantUrl
//     rp(options)
//       .then(function ($) {
//         resolve(parsePlantPageHtml($))
//       })
//     // .then(function (thisPlant) {
//     //   return storePlant(thisPlant)
//     // })
//       .catch(function (err) {
//         reject(err)
//       })
//   })
// }

async function storePlant (plantObject) {
  // await storage.setItem(plantObject.latinName, JSON.stringify(plantObject));
  console.log('Collected and stored ' + plantObject.latinName)
  return plantObject
}

function parsePlantPageHtml ($) {
  var thisPlant = {}
  var myNames = $('div.product-information--purchase').find('h1').text().split('\n')
  thisPlant.latinName = myNames[0]
  thisPlant.commonName = myNames[1]
  $('div.product-information--details').find('dt').each(function (i, elem) {
    var prop = $(this).text()
    var val = $(this).next('dd').text().trim()
    switch (prop) {
      case 'Germination Code':
        val = val.replace(/\s+/g, ',')
        break
      case 'Plant Spacing':
        val = val.substring(0, val.length - 1)
        break
      case 'USDA Zones':
        val = val.split('-')
        val = { min: val[0], max: val[1] }
        break
      case 'Seeds/Packet':
      case 'Seeds/Ounce':
        break
      case 'Height':
        var n = val.toLowerCase().indexOf('feet')
        if (n !== -1) {
          val = (parseInt(val) * 12).toString()
        } else {
          val = parseInt(val)
        }
        break
      default:
        val = val.split(',').map(function (item) { return item.trim() })
    }
    thisPlant[prop] = JSON.stringify(val)
    console.log('Property:' + prop + ' value:' + JSON.stringify(val))
  })
  return thisPlant
}

function errorProcessor (err) {
  console.log(err.name)
  console.log(err.message)
}

getProducts()
// getPlantFromProductPage('https://www.prairiemoon.com/bromus-pubescens-hairy-wood-chess-prairie-moon-nursery.html');
// getPlantItemHtml('antennaria', 'neglecta');
// getPlantItemHtml('echinacea', 'pallida');

//  async function dotheThing($) {
//     var myNames = $('div.product-information--purchase').find('h1').text().split('\n');
//     console.log('Name :' + myNames[0]);
//     console.log('Common Name : ' + myNames[1]);
//     console.log('BC : ' + $('div.breadcrumbs').html());
//     //console.log('html : ' + $.html());
//     $('#js-product-list').find('p.category-product-name a').each(function (i, elem) {
//         console.log('Plant found : ' + $(elem).find('span.latin-name').text());
//      });
// }
