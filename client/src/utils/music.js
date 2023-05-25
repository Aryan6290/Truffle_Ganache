import Fingerprint2 from 'fingerprintjs';
let contract = null;
export const generateAudioFingerprint = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        Fingerprint2.registerFont({
          swfContainerId: 'fingerprintjs2',
          swfPath: 'path/to/FontList.swf',
        });
        Fingerprint2.get(arrayBuffer, (result) => {
          resolve(result);
        });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  };

export const initialiseContract = (c)=>{
  contract = c;
}
export const getContract = ()=>{
  return contract;
}