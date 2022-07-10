const axios = require('axios');
const cheerio = require('cheerio');
const fitings = [
 '108762', '614984', '602580', '610782', '614859', '148963',
 '613162', '108761', '108759', '108392', '132624', '502383',
 '502384', '502386', '502388', '502396', '161949', '161926',
 '502391', '104193', '143195', '143230', '101615', '614995',
 '108738', '149882', '102646', '143235', '149893', '143258',
 '108751', '143203', '149884', '149878', '104907', '149904',
 '143188', '143229', '143255', '143210', '610793', '610804',
 '502382', '614857', '635052', '613183', '613161', '108376',
 '132625', '143280', '132615', '132593', '161948', '161937',
 '502376', '502390', '502393', '161944', '613182', '613160',
 '602651', '610779', '149891', '132611', '109143', '148966',
 '108748', '602584', '143294', '143267', '143246', '148945',
 '143248', '109144', '149895', '614848', '132595', '143308',
 '161924', '104936', '143302', '143269', '103887', '149885',
 '148974', '104921', '108758', '108375', '102650', '610776',
 '614849', '143274', '108756', '610771', '610798', '108396',
 '102651', '132633', '143236', '149887'
];

const loadData = async (code) => {
    let product = '';
    await axios
        .get(`https://petrovich.ru/catalog/146041878/${code}/`)
        .then((response) => {
            console.log(1);
            product = response.data;
        })
        .catch((error) => {
            console.log(error);
        });

    return product;
};

let getData = async (list) => {
    const data = [];
    for (const item of list) {
        const product = await loadData(item);
        if (product) {
            const $ = cheerio.load(product);
            data.push({
                code: $('.product-header').find('.pt-c-secondary').text(),
                title: $('.product-title').find('.title-lg').text(),
                price: parseInt($('.product-content').find('.retail-price').text(), 10),
                card_price: parseInt($('.product-content').find('.gold-price').text(), 10),
            });
        }
    }
    console.log(data);
    return data;
};

// Requiring the module
// const reader = require('xlsx');
// Reading our test file
// const file = reader.readFile('./test.xlsx');
// let dat = [];
// const sheets = file.SheetNames;
// for (let i = 0; i < sheets.length; i++) {
//     const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
//     temp.forEach((res) => {
//         dat.push(res);
//     });
// }
// Printing data
// console.log(dat);

// let student_data = [
//     {
//         name: 'Nikhil',
//         surname: 22,
//     },
//     {
//         name: 'Amitha',
//         surname: 21,
//     },
// ];

// const ws = reader.utils.json_to_sheet(student_data);
// reader.utils.book_append_sheet(file, ws, 'Sheet4');
// Writing to our file
// reader.writeFile(file, './test.xlsx');

const loadAndSave = async (list) => {
    const products = await getData(list);
    const reader = require('xlsx');
    const file = reader.readFile('./test.xlsx');
    const ws = reader.utils.json_to_sheet(products);
    const date = new Date();
    console.log(`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`);
    reader.utils.book_append_sheet(file, ws, `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`);
    reader.writeFile(file, './test.xlsx');
};

loadAndSave(fitings);

const list = [];

for (let i = 22; i > 0; i--) {
    axios
        .get(`https://petrovich.ru/catalog/146041878/?p=${i}`)
        .then((response) => {
            getList(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
}

const getList = (data) => {
    const $ = cheerio.load(data);
    $('.preview').each((i, elem) => {
        list.push($(elem).find('.pt-c-secondary').text());
    });
    // loadAndSave(list);
    console.log(list);
};


