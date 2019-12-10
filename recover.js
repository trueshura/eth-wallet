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
    .then(([address, privateKey]) => {
        console.log(`Your address: "${address}"`);
        console.log(`Your privateKey (keep it secret!!): "${privateKey}"`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

async function main() {
    const strMnemonicParts = await readMnemonic();
    const path = await readPath();
    const strAddrToSearch = await readAddress();

    const arrWords = strMnemonicParts.split(' ');
    const arrVariants = formVariants(undefined, arrWords.length);

    for (let variant of arrVariants) {

        // try all length
        for (let i = 1; i <= variant.length; i++) {
            const strMnemonicCandidate = variant.slice(0, i).map(idx => arrWords[idx]).join(' ');
            const keyPair = keyPairFromMnemonicAndPath(strMnemonicCandidate, path);
            const addr = ethAddressFromPublicKey(keyPair.publicKey);
            console.log(`Trying ${strMnemonicCandidate}  (${addr})`);
            if (strAddrToSearch === addr) {
                return [addr, keyPair.privateKey.toString('hex')];
            }
        }
    }

    throw new Error('Sorry, can\'t restore private key for that address');
}

async function readAddress() {
    return await questionAsync('Enter known address:');
}

async function readMnemonic() {
    return await questionAsync('Enter suggested parts of mnemonic:');
}
