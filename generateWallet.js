const readline = require('readline');
const bip39 = require('bip39');
const bip32 = require('bip32');
const sha3 = require('js-sha3');

//const web3=require('web3');

const defaultPath = '0/0/0';

async function main() {
    const mnemonic = await readMnemonic();
    console.log(`Just to make sure: "${mnemonic}"`);
    const path = await readPath();
    console.log(`Derivation path: "${path}"`);
    const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
    return [addressFromPublicKey(keyPair.publicKey), keyPair.privateKey.toString('hex')];
}

function keyPairFromMnemonicAndPath(mnemonic, path) {
    const buffSeed = bip39.mnemonicToSeed(mnemonic);
    const bip32Root = bip32.fromSeed(buffSeed);
    const keyPair = bip32Root.derivePath(path);
    keyPair.compressed = false;
    return keyPair;
}

async function readMnemonic() {
    return await questionAsync('Enter mnemonic:');
}

async function readPath() {
    let resp = await questionAsync(`Enter derivation path (default: ${defaultPath}):`);
    if (!resp.length) resp = defaultPath;
//    if(!resp.match(/^(\d+'?\/?)+$/)) throw new Error(`Bad path. Should me like defaultPath`);
    if (!resp.match(/^(m\/)?(\d+'?\/)*\d+'?$/)) throw new Error(`Bad path. Should me like defaultPath`);
    return `m/${resp}`;
}

function questionAsync(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(prompt, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function addressFromPublicKey(buffPubKey) {
    let pubKey = buffPubKey;

    // prefixed key: https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm
    if (buffPubKey.length === 65 && buffPubKey[0] === 4) {
        pubKey = buffPubKey.slice(1);
    }
    const hash = sha3.keccak256(pubKey);
    return `0x${hash.substring(24)}`;
}

module.exports = {
    addressFromPublicKey,
    keyPairFromMnemonicAndPath
};

// running this module
if (require.main === module) {
    main()
        .then(([address, privateKey]) => {
            console.log(`Your address: "${address}"`);
            console.log(`Your privateKey (kep it secret!!): "${privateKey}"`);
            process.exit(0);
        })
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
