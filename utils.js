const readline = require('readline');
const bip39 = require('bip39');
const bip32 = require('bip32');
const sha3 = require('js-sha3');

const defaultPath = '0/0/0';

module.exports = {
    questionAsync,
    addressFromPublicKey,
    keyPairFromMnemonicAndPath,
    readPath,
    formVariants,
    arrWithoutElement
};

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

function keyPairFromMnemonicAndPath(mnemonic, path) {
    const buffSeed = bip39.mnemonicToSeed(mnemonic);
    const bip32Root = bip32.fromSeed(buffSeed);
    const keyPair = bip32Root.derivePath(path);
    keyPair.compressed = false;
    return keyPair;
}

async function readPath() {
    let resp = await questionAsync(`Enter derivation path (default: ${defaultPath}):`);
    if (!resp.length) resp = defaultPath;
    if (!resp.match(/^(m\/)?(\d+'?\/)*\d+'?$/)) throw new Error(`Bad path. Should be like defaultPath`);
    return `m/${resp}`;
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

/**
 * Form array of substitutions of array elements (@see tests)
 *
 *
 * @param {Array} arrItems
 * @param {Number} length
 * @returns {*}
 */
function formVariants(arrItems, length) {
    if (!arrItems && length) arrItems = range(length);
    if (arrItems.length === 1) return [arrItems];

    let arrAllVariants = [];
    for (let i = 0; i < arrItems.length; i++) {
        const firstPlace = arrItems[i];
        const arrThisStepVariants = formVariants(arrWithoutElement(arrItems, firstPlace));
        arrAllVariants = arrAllVariants.concat(
            arrThisStepVariants.map(arrVariant => [firstPlace].concat(arrVariant))
        );
    }
    return arrAllVariants;
}

function arrWithoutElement(arr, numToExclude) {
    const setAllElem = new Set(arr);
    setAllElem.delete(numToExclude);
    return [...setAllElem];
}

function range(length) {
    const arrRetVal = new Array(length);
    for (let i = 0; i < length; i++) {
        arrRetVal[i] = i;
    }
    return arrRetVal;
}