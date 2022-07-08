const fs=require('fs');

const {
    questionAsync,
    ethAddressFromPublicKey,
    btcAddressFromPublicKey,
    keyPairFromMnemonicAndPath,
    readPath,
    readBatchSize,
    wifFromPk, ubxAddressFromPublicKey
} = require('../utils');

async function main() {
    const nWalletsToGenerate=await readBatchSize();
    const mnemonic = await readMnemonic();
    console.log(`Just to make sure: "${mnemonic}"`);
    const path = await readPath();
    console.log(`Derivation path will start from: "${path}/0"`);
    const arrWallets=[];
    for(let i=0;i<nWalletsToGenerate;i++){
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, `${path}/${i}`);
        const strPk= process.env.ONLY_ADDR ? "" : keyPair.privateKey.toString('hex');
        arrWallets.push([ethAddressFromPublicKey(keyPair.publicKey), strPk]);
    }
    return arrWallets;
}

async function readMnemonic() {
    return await questionAsync('Enter mnemonic:');
}

main()
    .then((arrResult) => {
        arrResult.forEach(([strAddr, strPk]) => console.log(`${strAddr} => ${strPk}`));
//        fs.writeFileSync('eth_pk.json',JSON.stringify(arrResult));
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
