const crypto = require("crypto");
let key;
let iv;
encryption = {};
const algorithm= 'aes-256-cbc'; // for use in AES


//Encrypting the AES key and IV to be sent back to app in RSA encrypted format.
encryption.EncryptRSA = (publickey) =>{

    console.log(publickey);
    const data = {"key": key, "iv": iv};
    
    data2 = "test"

    const encryptedData = crypto.publicEncrypt(
        {
          key: publickey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        // Converting the json object to a buffer
        Buffer.from(data2)
      );

      console.log("encypted data: ", encryptedData.toString("base64"));
    return encryptedData;
    
} 








//AES key and IV is genereated (This is symetric)
encryption.CreateAES = () =>{
     key = crypto.randomBytes(32);
     iv = crypto.randomBytes(16);
    
     console.log("keys generated...",key,iv);
}



//Symetric encryption to be used when both app and api has the AES keys
encryption.EncryptAES = (dataToEncrypt) =>{

  
  let cipher = crypto.createCipheriv("aes-256-cbc",key,iv);
  let encryptedData = cipher.update(dataToEncrypt);
  
  encryptedData = Buffer.concat([encryptedData,cipher.final()]);
  
  //send to websocket

  console.log('encrypted data: ', encryptedData.toString('hex'));
  return encryptedData;
}



encryption.DecryptAES = (dataToDecrypt) =>{

  console.log(dataToDecrypt);
  //let iv= Buffer.from(iv, 'hex');
  let encryptedText = Buffer.from(dataToDecrypt, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedData = decipher.update(encryptedText,"hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData.toString();


}





module.exports = encryption;