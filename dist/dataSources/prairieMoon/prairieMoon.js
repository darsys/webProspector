"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wait = require('util').promisify(setTimeout);
class prairieMoon {
    constructor() {
        this.axios = require('axios').default;
        this.baseuri = 'https://api.searchspring.net/api/search/search.json?resultsFormat=native&siteId=qfh40u&filter.category_code=seeds&page=';
        this.options = {
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Request': '1'
            }
        };
        this.pageoptions = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Request': '1'
            },
        };
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            var pagenumber;
            for (pagenumber = 1; pagenumber <= 27; pagenumber++) {
                var pageuri = this.baseuri + pagenumber;
                console.log(pageuri);
                this.processProductsList(pageuri);
                // await wait(10000)
            }
        });
    }
    processProductsList(pageuri) {
        return __awaiter(this, void 0, void 0, function* () {
            this.options.url = pageuri;
            this.axios(this.options)
                .then(function (response) {
                return __awaiter(this, void 0, void 0, function* () {
                    var myO = response.data.results;
                    //        console.log(myO)
                    var total = 0;
                    myO.forEach(function (thisPlant, i) {
                        return __awaiter(this, void 0, void 0, function* () {
                            total++;
                            console.debug(`plant:${total}`);
                            console.log(thisPlant);
                            // this.getProductsFromPage('https://www.prairiemoon.com' + thisPlant.url)
                        });
                    });
                    Promise.resolve(total);
                });
            })
                .catch((e) => console.log('Critical failure: ' + e.message));
        });
    }
    getProductsFromPage(plantpageuri) {
        return new Promise((resolve, reject) => {
            const opt = this.options;
            opt.url = plantpageuri;
            this.axios(opt)
                .then(function (response) {
                console.log(response);
                resolve(response.data);
                // var $ = cheerio.load(response.data)
                // var myNames = $('div.product-information--purchase').find('h1').text().split('\n')
                // var latin_name = myNames[0].toLowerCase().trim()
                // console.log(latin_name)
                // var newPlant = this.parsePlantPageHtml($)
                // console.log(newPlant)
                // var fn = './' + newPlant.name + '.prairiemoon.json'
                // fs.writeFile(fn, JSON.stringify(newPlant, null, 2), (err) => {
                //   if (err) throw err
                //   console.log(fn + ' has been saved!')
                // })
            })
                .catch(e => {
                console.log('Critical failure: ' + e.message);
                reject(e);
            });
        });
    }
    parseJSON($) {
        var thisPlant;
        var myNames = $('div.product-information--purchase').find('h1').text().split('\n');
        thisPlant.latin_name = myNames[0].toLowerCase().trim();
        thisPlant.common_name = myNames[1].toLowerCase().trim();
        thisPlant.description = $('#tab-descrip').text().trim();
        // console.log(myNames)
        $('div.product-information--details').find('dt').each(function (i, elem) {
            var prop = $(this).text().toLowerCase();
            var val = $(this).next('dd').text().trim();
            var mm;
            switch (prop) {
                case 'germination code':
                    prop = 'germination';
                    val = val.replace(/\s+/g, ',').split(',');
                    break;
                case 'bloom time':
                    prop = 'blooms';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'bloom color':
                    prop = 'color';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'plant spacing':
                    mm = this.getMinMax(val);
                    val = { min: parseInt(mm.min), max: parseInt(mm.max) };
                    prop = 'spacing';
                    break;
                case 'sun exposure':
                    prop = 'light';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'soil moisture':
                    prop = 'moisture';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'catalog number':
                    prop = 'sku';
                    break;
                case 'advantages':
                    prop = 'features';
                    val = [];
                    $(this).next('dd').find('abbr').each(function (i, elem) {
                        val.push($(this).attr('data-tipso'));
                    });
                    break;
                case 'height':
                    var n = val.toLowerCase().indexOf('feet');
                    if (n !== -1) {
                        val = (parseInt(val) * 12);
                    }
                    else {
                        val = parseInt(val);
                    }
                    break;
                case 'usda zones':
                    prop = 'zones';
                    mm = val.split('-');
                    val = [];
                    for (var z = mm[0]; z <= mm[1]; z++) {
                        val.push(parseInt(z));
                    }
                    break;
                case 'seeds/packet':
                case 'seeds/ounce':
                    val = parseFloat(val.replace(/,/g, ''));
                    break;
                default:
                    val = val.split(',').map(function (item) { return item.trim(); });
            }
            // thisPlant.prices = []
            // $('#seeds form div.form-row').each(function (i, elem) {
            //   // console.log(i)
            //   var thisSize = $(this).find('div.prompt').text().toLowerCase()
            //   var price = parseFloat($(this).find('div.price').text().substring(1, 10))
            //   if (Number.isNaN(price)) { return }
            //   var qty, unit
            //   if (thisSize.includes(' ')) {
            //     thisSize = thisSize.split(' ')
            //     qty = thisSize[0]
            //     unit = thisSize[1].replace('.', '')
            //     if (qty.includes('/')) {
            //       qty = qty.split('/')
            //       qty = qty[0] / qty[1]
            //     }
            //   } else {
            //     qty = 1.0
            //     unit = thisSize
            //   }
            //   thisPlant.prices.push({ quantity: parseFloat(qty), unit: unit, price: parseFloat(price) })
            //   // console.log('qty: ' + qty)
            //   // console.log('unit: ' + unit)
            //   // console.log('price: ' + price)
            // })
            thisPlant[prop] = val;
            // console.log('Property:' + prop + ' value:' + JSON.stringify(val))
        });
        return thisPlant;
    }
    parsePlantPageHtml($) {
        var thisPlant;
        var myNames = $('div.product-information--purchase').find('h1').text().split('\n');
        thisPlant.latin_name = myNames[0].toLowerCase().trim();
        thisPlant.common_name = myNames[1].toLowerCase().trim();
        thisPlant.description = $('#tab-descrip').text().trim();
        // console.log(myNames)
        $('div.product-information--details').find('dt').each(function (i, elem) {
            var prop = $(this).text().toLowerCase();
            var val = $(this).next('dd').text().trim();
            var mm;
            switch (prop) {
                case 'germination code':
                    prop = 'germination';
                    val = val.replace(/\s+/g, ',').split(',');
                    break;
                case 'bloom time':
                    prop = 'blooms';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'bloom color':
                    prop = 'color';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'plant spacing':
                    mm = this.getMinMax(val);
                    val = { min: parseInt(mm.min), max: parseInt(mm.max) };
                    prop = 'spacing';
                    break;
                case 'sun exposure':
                    prop = 'light';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'soil moisture':
                    prop = 'moisture';
                    val = val.split(',').map(function (item) { return item.trim(); });
                    break;
                case 'catalog number':
                    prop = 'sku';
                    break;
                case 'advantages':
                    prop = 'features';
                    val = [];
                    $(this).next('dd').find('abbr').each(function (i, elem) {
                        val.push($(this).attr('data-tipso'));
                    });
                    break;
                case 'height':
                    var n = val.toLowerCase().indexOf('feet');
                    if (n !== -1) {
                        val = (parseInt(val) * 12);
                    }
                    else {
                        val = parseInt(val);
                    }
                    break;
                case 'usda zones':
                    prop = 'zones';
                    mm = val.split('-');
                    val = [];
                    for (var z = mm[0]; z <= mm[1]; z++) {
                        val.push(parseInt(z));
                    }
                    break;
                case 'seeds/packet':
                case 'seeds/ounce':
                    val = parseFloat(val.replace(/,/g, ''));
                    break;
                default:
                    val = val.split(',').map(function (item) { return item.trim(); });
            }
            // thisPlant.prices = []
            // $('#seeds form div.form-row').each(function (i, elem) {
            //   // console.log(i)
            //   var thisSize = $(this).find('div.prompt').text().toLowerCase()
            //   var price = parseFloat($(this).find('div.price').text().substring(1, 10))
            //   if (Number.isNaN(price)) { return }
            //   var qty, unit
            //   if (thisSize.includes(' ')) {
            //     thisSize = thisSize.split(' ')
            //     qty = thisSize[0]
            //     unit = thisSize[1].replace('.', '')
            //     if (qty.includes('/')) {
            //       qty = qty.split('/')
            //       qty = qty[0] / qty[1]
            //     }
            //   } else {
            //     qty = 1.0
            //     unit = thisSize
            //   }
            //   thisPlant.prices.push({ quantity: parseFloat(qty), unit: unit, price: parseFloat(price) })
            //   // console.log('qty: ' + qty)
            //   // console.log('unit: ' + unit)
            //   // console.log('price: ' + price)
            // })
            thisPlant[prop] = val;
            // console.log('Property:' + prop + ' value:' + JSON.stringify(val))
        });
        return thisPlant;
    }
    getMinMax(theItem) {
        var min, max;
        if (theItem.includes('-')) {
            theItem = theItem.split('-');
            min = theItem[0];
            max = theItem[1];
        }
        else {
            min = theItem;
            max = theItem;
        }
        return { min: min, max: max };
    }
}
exports.default = prairieMoon;
//# sourceMappingURL=prairieMoon.js.map