import AES from "crypto-js/aes";
import ENC from "crypto-js/enc-utf8";

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

export const stringEncrypt = (obj) => {
    const encrypted = AES.encrypt(JSON.stringify(obj), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
};

export const stringDecrypt = (encryptedText) => {
    // Here use .toString(ENC) directly, not .toString(ENC.Utf8)
    let decryptedStr = null;
    try {
        decryptedStr = AES.decrypt(
            decodeURIComponent(encryptedText),
            SECRET_KEY
        ).toString(ENC);
    } catch (error) {
        return null;
    } 

    try {
        const result = JSON.parse(decryptedStr);
        return result;
    } catch (error) {
        return null;
    }
};
