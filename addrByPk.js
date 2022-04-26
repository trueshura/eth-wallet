const {
    questionAsync,
    ethAddressFromPublicKey,
    btcAddressFromPublicKey,
    ubxAddressFromPublicKey,
    keyPairFromPrivate,
    getPublic
} = require('./utils');

async function main() {
    const strPk = await questionAsync('Enter private key:');
    const keyPair = keyPairFromPrivate(strPk);

    return {
        ethAddress: ethAddressFromPublicKey(getPublic(keyPair, false, 'bin')),
        btcAddress: btcAddressFromPublicKey(getPublic(keyPair, false)),
        ubxAddress: ubxAddressFromPublicKey(getPublic(keyPair, true)),
    };
}

main()
    .then(({ethAddress, btcAddress, ubxAddress, privateKey}) => {
        console.log(`Your ETH address: "${ethAddress}"`);
        console.log(`Your BTC address: "${btcAddress}"`);
        console.log(`Your UBX address: "${ubxAddress}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
