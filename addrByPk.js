const {
    questionAsync,
    ethAddressFromPublicKey,
    btcAddressFromPublicKey,
    keyPairFromPrivate,
    getPublic
} = require('./utils');

async function main() {
    const strPk = await questionAsync('Enter private key:');
    const keyPair = keyPairFromPrivate(strPk);

    return {
        ethAddress: ethAddressFromPublicKey(getPublic(keyPair, 'bin')),
        btcAddress: btcAddressFromPublicKey(getPublic(keyPair, false))
    };
}

main()
    .then(({ethAddress, btcAddress, privateKey}) => {
        console.log(`Your ETH address: "${ethAddress}"`);
        console.log(`Your BTC address: "${btcAddress}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
