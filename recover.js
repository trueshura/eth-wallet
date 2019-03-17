const {questionAsync, addressFromPublicKey, keyPairFromMnemonicAndPath, readPath, formVariants} = require('./utils');

/*
 * This file should help you to recover your PK if you still memember
 * 1. address (TODO: get rid of it, by checking balance of every address in process)
 * 2. parts of mnemonics
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
        for (let i = 1; i < variant.length; i++) {
            const strMnemonicCandidate = variant.slice(0, i).map(idx => arrWords[idx]).join(' ');
            console.log(`Trying ${strMnemonicCandidate}`);
            const keyPair = keyPairFromMnemonicAndPath(strMnemonicCandidate, path);
            if (strAddrToSearch === addressFromPublicKey(keyPair.publicKey)) {
                return [addressFromPublicKey(keyPair.publicKey), keyPair.privateKey.toString('hex')];
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
