const rp = require('request-promise')
const fs = require('fs')
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
