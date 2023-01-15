const crypto = require("crypto");
//const Websocket = require("../Providers/Websocket");
class privateEncryption {
  
  WebSocket = require('../Providers/Websocket').WebSocket;
  
  key;
  iv;
  algorithm = "aes-256-cbc"; // for use in AES

  //Encrypting the AES key and IV to be sent back to app in RSA encrypted format.
  EncryptRSA = (publickey) => {
    const data = Buffer.from(JSON.stringify({ key: this.key.toString('base64'), iv: this.iv.toString('base64') }),'utf-8')  ;
   

    const encryptedData = crypto.publicEncrypt(
      {
        key: publickey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
        // oaepHash: "sha256",
      },
      data
    );

    console.log("encypted data: ", encryptedData.toString('base64'));
   // console.log("encypted data: ", encryptedData);
      //establish websocket connection
      this.WebSocket.GetInstance().InitializeServer();

    return encryptedData;
  };

  //AES key and IV is genereated (This is symetric)
  CreateAES = () => {
    this.key = crypto.randomBytes(32);
    this.iv = crypto.randomBytes(16);

    console.log("key generated...", this.key);
    console.log("iv generated...", this.iv);
  };

  //Symetric encryption to be used when both app and api has the AES keys
  EncryptAES = (dataToEncrypt) => {
    console.log(dataToEncrypt);
    let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let buffer = Buffer.from(JSON.stringify(dataToEncrypt));
    let encryptedData = cipher.update(buffer);

    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    //send to websocket
    
    this.WebSocket.GetInstance().SendMessage(encryptedData.toString('base64'));

   // console.log("encrypted data: ", encryptedData.toString("hex"));
    return encryptedData;
  };

  DecryptAES = (dataToDecrypt) => {
    console.log(dataToDecrypt);
    let encryptedBytes = Buffer.from(dataToDecrypt,'base64');
    let encryptedText = Buffer.from(encryptedBytes, "hex");
    let decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decryptedData = decipher.update(encryptedText, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    console.log(decryptedData);
    return JSON.parse(decryptedData);
  };
}

//exported pbulic singleton class
class Encryption {
  constructor() {
    throw new Error("Use Lobby.getInstance()");
  }
  static GetInstance() {
    if (!Encryption.instance) {
      Encryption.instance = new privateEncryption();
    }
    return Encryption.instance;
  }
}

module.exports = { Encryption: Encryption };
