const CryptoJS = require('crypto-js');  //引用AES源码js
    
const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量
    
//解密方法
function Decrypt(password) {
    let encryptedHexStr = CryptoJS.enc.Hex.parse(password);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
    
//加密方法
function Encrypt(password) {
    let srcs = CryptoJS.enc.Utf8.parse(password);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}


exports.Decrypt = Decrypt;
exports.Encrypt = Encrypt;