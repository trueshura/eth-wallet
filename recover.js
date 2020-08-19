const {
    questionAsync,
    ethAddressFromPublicKey,
    keyPairFromMnemonicAndPath,
    readPath,
    formVariants
} = require('./utils');

/*
 * This file should help you to recover your PK if you still rememember
 * 1. address (TODO: get rid of it, by checking balance of every address in process)
 * 2. parts of mnemonics
 * 3. path
 */

main()
    .then(([address, privateKey, strMnemonic]) => {
        console.log(`Your address: "${address}"`);
        console.log(`Your privateKey (keep it secret!!): "${privateKey}"`);
        console.log(`Your mnemonic: "${strMnemonic}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

let nStarted = Date.now();
let nCount = 0;

async function main() {
    const strMnemonicParts = await readMnemonic();
    const path = await readPath();
    let nSupposedLength = await readSupposedLength();
    if (nSupposedLength === '') nSupposedLength = 3;
    const strAddrToSearch = await readAddress();

    const arrWords = strMnemonicParts.split(' ');
    const arrVariants = formVariants(undefined, arrWords.length);
    console.log(`Created ${arrVariants.length} variants`);

    for (let variant of arrVariants) {

        // try all length
        for (let i = nSupposedLength; i <= variant.length; i++) {
            const strMnemonicCandidate = variant.slice(0, i).map(idx => arrWords[idx]).join(' ');
            const keyPair = keyPairFromMnemonicAndPath(strMnemonicCandidate, path);
            const addr = ethAddressFromPublicKey(keyPair.publicKey);
//            console.log(`Trying ${strMnemonicCandidate}  (${addr})`);
            if (strAddrToSearch === addr) {
                return [addr, keyPair.privateKey.toString('hex'), strMnemonicCandidate];
            }
            nCount++;
        }
        if (nCount >= 1000) {
            const nElapsed = Date.now() - nStarted;
            console.log(`${parseInt(nCount / (nElapsed / 1000))} variants per second`);
            startLap();
        }
    }

    throw new Error('Sorry, can\'t restore private key for that address');
}

function startLap() {
    nStarted = Date.now();
    nCount = 0;
}

async function readAddress() {
    return await questionAsync('Enter known address (with prefix!):');
}

async function readSupposedLength() {
    return await questionAsync('Supposed length of mnemonic (it could increase speed. Default: 3):');
}

async function readMnemonic() {
    return await questionAsync('Enter suggested parts of mnemonic:');
}
