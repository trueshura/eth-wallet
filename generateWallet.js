const {questionAsync, addressFromPublicKey, keyPairFromMnemonicAndPath, readPath} = require('./utils');

async function main() {
    const mnemonic = await readMnemonic();
    console.log(`Just to make sure: "${mnemonic}"`);
    const path = await readPath();
    console.log(`Derivation path: "${path}"`);
    const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
    return [addressFromPublicKey(keyPair.publicKey), keyPair.privateKey.toString('hex')];
}

async function readMnemonic() {
    return await questionAsync('Enter mnemonic:');
}

main()
    .then(([address, privateKey]) => {
        console.log(`Your address: "${address}"`);
        console.log(`Your privateKey (keep it secret!!): "${privateKey}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
