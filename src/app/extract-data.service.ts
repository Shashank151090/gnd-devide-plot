import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExtractDataService {

  constructor() { }
  dataWithoutSign = [];
  
  extractA4Data(data) {
    let originalData = data;
    let typeOfMessage = data.substring(0,2);
    data = data.slice(2);     
    let messageCounter = data.substring(0,4);
    data = data.slice(4);     
    let numberOfSamples = parseInt(data.substring(0,4),16);
    data = data.slice(4);     
    let currentTempSample = data.substring(0,4);
    data = data.slice(4);     
    data.substring(0,2);
    data = data.slice(2);
    let batteryPer = parseInt(data.substring(0,2),16);
    data = data.slice(2);     
    let dataSamples = data.substring(0,(numberOfSamples*6));
    data = data.slice(numberOfSamples*6);
    let extractedData = this.extractDataSamples(dataSamples,numberOfSamples);     
    let lat = parseInt(data.substring(0,8), 16)/100000;
    data = data.slice(8);     
    let long = parseInt(data.substring(0,8),16)/100000;
    data = data.slice(8);     
    let debugByte = data.substring(0,2);
    data = data.slice(2);     
    let lbs = data.substring(0,2);
    data = data.slice(2);     
    let counter = data.substring(0,2);
    data = data.slice(2);
    let createReturnObj = {
      "typeOfMessage": typeOfMessage,
      "messageCounter": messageCounter,
      "numberOfSamples": numberOfSamples,
      "currentTempSample": currentTempSample,
      "batteryPer": batteryPer,
      "extractedData": extractedData,
      "latitute": lat,
      "longitute": long,
      "debugByte": debugByte,
      "lbs": lbs,
      "counter": counter
    }

    return(createReturnObj);
     
  }
  extractA6Data(data) {
    let originalData = data;
    let ccid = data.substring(10,48);
    data = data.slice(48);     
    let imei = data.substring(2,32);
    data = data.slice(32); 
    let createReturnObjA6 = {
      "ccid": ccid,
      "imei": imei
    } 
    return(createReturnObjA6);   
  }
  extractA1Data(data) {
    if(data) {
      let originalData = data;
      data = data.slice(26);
      let hwv = data.substring(0,4);
      data = data.slice(4);     
      let swv = data.substring(0,4);
      data = data.slice(4); 
      let pv = data.substring(0,4);
      data = data.slice(4);
      let uploadInterval = data.substring(0,4);
      data = data.slice(4);
      let samplingInterval = data.substring(0,4);
      data = data.slice(4);
      let highThreshold = data.substring(0,4);
      data = data.slice(4);
      let lowThreshold = data.substring(0,4);
      data = data.slice(4);
      let tbd2 = data.substring(0,6);
      data = data.slice(6);
      let mode = data.substring(0,2);
      let createReturnObjA6 = {
        "hwv": hwv,
        "swv": swv,
        "pv": parseInt(pv,16),
        "uploadInterval": parseInt(uploadInterval,16)?parseInt(uploadInterval,16): 60,
        "samplingInterval": samplingInterval?samplingInterval: 900,
        "highThreshold": parseInt(highThreshold,16),
        "lowThreshold": parseInt(lowThreshold,16),
        "mode": mode = '01'? 'Standard Mode': 'Alert Mode'
      } 
      return(createReturnObjA6);
    }
    else {
      let createReturnObjA6 = {
        "hwv": 'NA',
        "swv": 'NA',
        "pv": 'NA',
        "uploadInterval": 60,
        "samplingInterval": 384,
        "highThreshold": 'NA',
        "lowThreshold": 'NA',
        "mode":'NA'
      } 
      return(createReturnObjA6);
    }
       
  }

  extractDebugByteData(data) {
    let ObjToReturn = {};
    let originalData = data;
    let compareCgReg = parseInt('0x07',16);
    let compareMqtt = parseInt('0x08',16);
    let compareSignalStrength = parseInt('0x70',16);
    let compareGps = parseInt('0x80',16);
    let cgReg = (parseInt(originalData,16) & compareCgReg)*2.3;
    let mqtt = (parseInt(originalData,16) & compareMqtt);
    let signalStrength = (parseInt(originalData,16) & compareSignalStrength);
    let signalStrengthInHex = parseInt(signalStrength.toString(16))/10;
    
    let gps = (parseInt(originalData,16) & compareGps);
    let gpsInHex = parseInt(gps.toString(16));
    let gpsToReturn = gpsInHex == 0?'OFF':'ON';
    let mqttToReturn = mqtt == 0?'No Retry':'Retry';
    ObjToReturn = {"cgReg": cgReg, "mqtt": mqttToReturn, "signal": signalStrengthInHex, "gps": gpsToReturn}

    return ObjToReturn;
  }

  extractDataSamples(dataSamples,numberOfSamples) {
    let arrayToReturn = []
    for(let i=0; i< numberOfSamples; i++) {
      let tempInString =  dataSamples.substring(0,4);
      let compareTemp = parseInt('7FFF',16);
      let checkSign = this.checkForSign(tempInString);
      let tempInHex = parseInt(tempInString, 16);
      let tempInInt = (tempInHex & compareTemp)/10;
      this.dataWithoutSign.push(tempInInt);
      dataSamples = dataSamples.slice(4);
      let logger = dataSamples.substring(0,1);
      dataSamples = dataSamples.slice(1);
      let movement = dataSamples.substring(0,1);
      dataSamples = dataSamples.slice(1);
      arrayToReturn.push({"temp":checkSign+tempInInt, "logger": logger, "movement": movement});
    }
    return arrayToReturn;
  }
  checkForSign(data) {
    let comparer = parseInt('8000',16)
    let checkForSign = parseInt(data,16);
    let result = checkForSign & comparer;
    if (result == 32768) {
      return('-')
    } 
    else if(result == 0) {
      return('+')
    }

  }
}
