const fs=require('fs');

const {
    batchAddresses,
    btcAddressFromKP
} = require('../utils');


batchAddresses(btcAddressFromKP, process.env.SEARCH !== undefined,  process.env.ONLY_ADDR !== undefined)
    .then((arrResult) => {
        arrResult.forEach(([strAddr, strPk]) => console.log(`${strAddr} => ${strPk}`));
//        fs.writeFileSync('eth_pk.json',JSON.stringify(arrResult));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
