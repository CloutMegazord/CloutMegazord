import {randomBytes} from 'crypto';
import * as bip39 from 'bip39';

class EntropyGeneratorConstants {
    static DEFAULT_ENTROPY_BYTES = 16;
    static ENTROPY_ALIGNMENT_BYTES = 4;
    static MIN_ENTROPY_BYTES = 16;
    static MAX_ENTROPY_BYTES = 64;
  }

export default {
    createSeedPhrase() {
        const entropy = randomBytes(EntropyGeneratorConstants.DEFAULT_ENTROPY_BYTES);
        const mnemonic = bip39.entropyToMnemonic(entropy);
        return mnemonic;
    }
}