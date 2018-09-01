const {describe, it} = require('mocha');
const {assert} = require('chai');
const EC = require('elliptic').ec;
const {keyPairFromMnemonicAndPath, addressFromPublicKey} = require('../generateWallet');

const ec = new EC('secp256k1');

const sleep = (delay) => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), delay);
    });
};

describe('Generate wallet', () => {
    before(async function() {
        this.timeout(15000);
    });

    after(async function() {
        this.timeout(15000);
    });

    it('should generate private key', async () => {
        const mnemonic = 'test test1 test2';
        const path = 'm/0/0/0';
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
        const ecKeyPair = ec.keyPair({priv: keyPair.privateKey});
        assert.equal(keyPair.privateKey.toString('hex'), ecKeyPair.getPrivate('hex'));
        assert.equal(keyPair.publicKey.toString('hex'), ecKeyPair.getPublic(false, 'hex'));
    });

    it('should create keypair', async () => {
        const keyPair = ec.keyPair(
            {priv: '0000000000000000000000000000000000000000000000000000000000000001', privEnc: 'hex'});
        assert.equal(keyPair.getPrivate('hex').toString('hex'),
            '01'
        );
        assert.equal(keyPair.getPublic(false, 'hex'),
            '0479be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8'
        );
    });

    it('should generate address', async () => {
        const mnemonic = 'test test1 test2';
        const path = 'm/0/0/0';
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
        assert.equal(keyPair.privateKey.toString('hex'),
            '683003d86765039c301c56da100b821556ee2b9dba0e8f9de4ce870622c05a36'
        );
        assert.equal(addressFromPublicKey(keyPair.publicKey), '0xb90a3557dd6b4b3e64b41af7f1a418e54232840c');
    });

    it('should generate another address', async () => {
        const mnemonic = 'tick tack toe';
        const path = 'm/0/0/0';
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
        assert.equal(keyPair.privateKey.toString('hex'),
            '1ed361b286fef47623b8767c1971b552503ace929d8adeb20579991491b51843'
        );
        assert.equal(addressFromPublicKey(keyPair.publicKey), '0x76ecd7d5c44415dc184ee768ce4ffb89bd35a669');
    });
});
