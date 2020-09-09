const {
    questionAsync,
    ethAddressFromPublicKey,
    btcAddressFromPublicKey,
    keyPairFromMnemonicAndPath,
    readPath,
    wifFromPk
} = require('./utils');

async function main() {
    const mnemonic = await readMnemonic();
    console.log(`Just to make sure: "${mnemonic}"`);
    const path = await readPath();
    console.log(`Derivation path: "${path}"`);
    const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
    return {
        ethAddress: ethAddressFromPublicKey(keyPair.publicKey),
        btcAddress: btcAddressFromPublicKey(keyPair.publicKey),
        privateKey: keyPair.privateKey.toString('hex'),
        WIF: wifFromPk(keyPair.privateKey.toString('hex'))
    };
}

async function readMnemonic() {
    return await questionAsync('Enter mnemonic:');
}

main()
    .then(({ethAddress, btcAddress, privateKey, WIF}) => {
        console.log(`Your ETH address: "${ethAddress}"`);
        console.log(`Your BTC address: "${btcAddress}"`);
        console.log(`Your privateKey (keep it secret!!): "${privateKey}"`);
        console.log(`WIF (Bitcoin PK!): "${WIF}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
