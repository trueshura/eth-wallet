const {describe, it} = require('mocha');
const {assert} = require('chai');
const EC = require('elliptic').ec;
const {keyPairFromMnemonicAndPath, ethAddressFromPublicKey, btcAddressFromPublicKey, hash160, wifFromPk} = require(
    '../utils');
const recover = require('../recover');

const ec = new EC('secp256k1');

describe('Tests', () => {
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

    it('should generate ETH address', async () => {
        const mnemonic = 'test test1 test2';
        const path = 'm/0/0/0';
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
        assert.equal(keyPair.privateKey.toString('hex'),
            '683003d86765039c301c56da100b821556ee2b9dba0e8f9de4ce870622c05a36'
        );
        assert.equal(ethAddressFromPublicKey(keyPair.publicKey), '0xb90a3557dd6b4b3e64b41af7f1a418e54232840c');
    });

    it('should generate another ETH address', async () => {
        const mnemonic = 'tick tack toe';
        const path = 'm/0/0/0';
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);
        assert.equal(keyPair.privateKey.toString('hex'),
            '1ed361b286fef47623b8767c1971b552503ace929d8adeb20579991491b51843'
        );
        assert.equal(ethAddressFromPublicKey(keyPair.publicKey), '0x76ecd7d5c44415dc184ee768ce4ffb89bd35a669');
    });

    it('should generate another ETH address', async () => {
        const mnemonic = 'tick tack toe';
        const path = "m/16/56'/0";
        const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);

        assert.equal(keyPair.privateKey.toString('hex'),
            '3e8f1d46152b21b4dcd7b5e413eb211527d8bb5b2fe4f0a7a282d7ca5df53e76'
        );
        assert.equal(ethAddressFromPublicKey(keyPair.publicKey), '0xab98b0bf2c8d453e7a4880ab41af0e9095085641');
    });

    describe('Bitcoin P2PKH addresses', async () => {
        it('should create hash160', async () => {
            const strPubKey = '02b4632d08485ff1df2db55b9dafd23347d1c47a457072a1e87be26896549a8737';
            assert.strictEqual(hash160(strPubKey), '93ce48570b55c42c2af816aeaba06cfee1224fae');
        });

        it('should create it from UNCOMPRESSED pubkey', async () => {
            const pk = '1ed361b286fef47623b8767c1971b552503ace929d8adeb20579991491b51843';
            const ecKeyPair = ec.keyPair({priv: pk});
            assert.strictEqual(btcAddressFromPublicKey(ecKeyPair.getPublic(false, 'hex')),
                '17prwmgyT8QLtqBkx5HnkYcmLy2H94qHM7'
            );
        });

        it('should create it from UNCOMPRESSED pubkey 2', async () => {
            const pk = '3e8f1d46152b21b4dcd7b5e413eb211527d8bb5b2fe4f0a7a282d7ca5df53e76';
            const ecKeyPair = ec.keyPair({priv: pk});
            assert.strictEqual(btcAddressFromPublicKey(ecKeyPair.getPublic(false, 'hex')),
                '1D4FJkUMzhR1JY8W6RAXRpkwv2nLXBGZss'
            );
        });

        it('should generate BTC address', async () => {
            const mnemonic = 'tick tack toe';
            const path = "m/16/56'/0";
            const keyPair = keyPairFromMnemonicAndPath(mnemonic, path);

            assert.strictEqual(keyPair.privateKey.toString('hex'),
                '3e8f1d46152b21b4dcd7b5e413eb211527d8bb5b2fe4f0a7a282d7ca5df53e76'
            );
            assert.equal(btcAddressFromPublicKey(keyPair.publicKey), '1D4FJkUMzhR1JY8W6RAXRpkwv2nLXBGZss');
        });
    });

    describe('Bitcoin WIF', async () => {
        it('should generate WIF', async () => {
            // see https://en.bitcoin.it/wiki/Wallet_import_format

            const pk = '0C28FCA386C7A227600B2FE50B7CAE11EC86D3BF1FBE471BE89827E19D72AA1D';
            const WIF = '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ';
            assert.strictEqual(wifFromPk(pk), WIF);
        });
    });

    describe('Mnemonic recovery', async () => {
        it('should recover', async () => {
            const strMnemonicParts = "1 2 3 4";
            const strExpectedMnemonic = "3 2 1";
            const strPath = "0/0/0";
            const strKnownAddress = '0x3608bc66d4689cad940fcdb63d85d8bee4c7c071';

            const [, , result] = recover(strMnemonicParts, strPath, strKnownAddress, 3);

            assert.strictEqual(result, strExpectedMnemonic);
        });
    });
});
