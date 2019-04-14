const rp = require('request-promise');
const cheerio = require('cheerio');
const storage = require('node-persist');
//const url = require('url');
var storedPlants;
var cookieJar = rp.jar;
 
var options = {
    uri: '',
    followAllRedirects: true,
    method: 'get',
    transform: function (body) {
        return cheerio.load(body);
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    },
    resolveWithFullResponse : true,
    jar: cookieJar
}


function getProducts() {

    // await storage.init();
    // storedPlants = await storage.keys();
    // for (p=8; p<=10; p++) {
    //     console.log(p + ' ' + url);
    var seedPageUrl = 'https://www.prairiemoon.com/seeds/';
    options.uri = seedPageUrl;
    
    for (var i = 1; i < 2; i++) {
        console.log("****   getProducts: " + options.uri)
            rp(options)
            .then(function ($) {
                processSeedsPageHTML($);
            })
            .catch(function(err) {
                errorProcessor(err);
            })
            options.uri = seedPageUrl + '?page=' + i;
        }
        //url = 'https://www.prairiemoon.com/seeds/?page='+(p+1).toString();
}

// 
function processSeedsPageHTML($) {
//    console.log($.text());
    $('#js-product-list').find('p.category-product-name a').each(function (i, elem) {
        var thisPlant = new Object();
        thisPlant.latinName = $(elem).find('span.latin-name').text(); 
        thisPlant.commonName = $(elem).find('span.common-name').text(); 
        thisPlant.prairieMoonUrl = $(this).attr('href');
        console.log(thisPlant.latinName);
        console.log(thisPlant.commonName);
        console.log(thisPlant.prairieMoonUrl);
        // if ( !storedPlants.includes(thisPlant.latinName) ) {
        //     console.log('New plant found to process : ' + thisPlant.latinName);
        //     rp(thisPlant.prairieMoonUrl)
        //         .then(function (html) { 
        //             parseHtml(html, thisPlant); 
        //             storePlant(thisPlant)
        //                 .then(function(success) {
        //                     console.log("Collected and stored " + thisPlant.latinName);
        //                 })
        //                 .catch(function(err) {
        //                     errorProcessor(err)
        //                 })
        //         })
        //         .catch(errorProcessor(err))
        // } else {
        //     console.log('Stored plant found and skipped : ' + thisPlant.latinName);
        // }
    });
}

async function getPlantFromProductPage(plantUrl) {
    options.uri = plantUrl;
    rp(options)
        .then(function ($) {
            return parsePlantPageHtml($);
        })
        .then(function (thisPlant) {
           return storePlant(thisPlant);
        })
        .catch(function(err) {
            errorProcessor(err);
        })
}

async function storePlant(plantObject) {
    //await storage.setItem(plantObject.latinName, JSON.stringify(plantObject));
    console.log("Collected and stored " + plantObject.latinName);    
    return plantObject;
}

function parsePlantPageHtml($) {
    var thisPlant = new Object();
    
    var myNames = $('div.product-information--purchase').find('h1').text().split('\n');
    thisPlant.latinName = myNames[0]; 
    thisPlant.commonName = myNames[1]; 
    
    $('div.product-information--details').find('dt').each(function (i, elem) {
        prop = $(this).text();
        val = $(this).next('dd').text().trim();
        switch(prop) {
            case "Germination Code":
                val = val.replace(/\s+/g, ',');
                break;
            case "Plant Spacing":
                val = val.substring(0, val.length - 1)
            case "USDA Zones":
                val = val.split('-');
                val = {min:val[0], max:val[1]};
                break;
            case "Seeds/Packet":
            case "Seeds/Ounce":
                break;
            case "Height":
            var n = val.toLowerCase().indexOf("feet");
                if (n != -1) 
                    val = (parseInt(val) * 12).toString();
                else
                    val = parseInt(val)
                break;
            default:
                val = val.split(",").map(function(item) {return item.trim();});
        }
        thisPlant[prop] = JSON.stringify(val);
        console.log('Property:' + prop + ' value:' + JSON.stringify(val));
    });
    return thisPlant;
}

function errorProcessor(err) {
    console.log(err.name);
    console.log(err.message);
}

getProducts();
//getPlantFromProductPage('https://www.prairiemoon.com/bromus-pubescens-hairy-wood-chess-prairie-moon-nursery.html');
//getPlantItemHtml('antennaria', 'neglecta');
//getPlantItemHtml('echinacea', 'pallida');

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