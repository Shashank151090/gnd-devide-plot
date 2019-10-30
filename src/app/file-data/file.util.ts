import { Injectable }       from '@angular/core';

@Injectable()
export class FileUtil {

    constructor() {}

    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr, tokenDelimeter) {        
        let headers = csvRecordsArr[0].split(tokenDelimeter);
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }

        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength, 
        validateHeaderAndRecordLengthFlag, tokenDelimeter) {
        var dataArr = []

        for (let i = 0; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(tokenDelimeter);
            let col = [];
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
            if(i==0){
                for(let k =0; k<4 ; k++) {
                    col.push('-')
                }
               
            }
            dataArr.push(col)
        }   
        return dataArr;
    }

    convertArrayToCsv (table,data) {
        const rows = table
        const info = data

        let infoContent = "Product Version:," + info.pv + "\n" + "Reporting Interval:," + info.uploadInterval + "\n" + "Sensor Sampling Interval:,"+ info.samplingInterval + "\n" + "Temperature High Threshold:,"+ info.highThreshold + "\n" + "Temperature Low Threshold:,"+info.lowThreshold + "\n" + "Operation Mode:,"+ info.mode + "\n" + "\n" + "\n";


        let csvContent = infoContent;

         csvContent+= "Time, Temperature, Battery%, Movement, Logger, Sensor, Location, LBS Mode, Debug Info-cgReg, Debug Info-MQTT Retry, Debug Info-Signal Strength, Debug Info-GPS \n" 
       for(let i=0;i<rows.length;i++) {
        //    console.log(rows[i]);

        if(!rows[i].time) {
            rows[i].time = ""
        } 
         if(!rows[i].temp) {
            rows[i].temp = ""
        } 
         if(!rows[i].battery) {
            rows[i].battery = ""
        } 
         if(!rows[i].movement) {
            rows[i].movement = ""
        } 
         if(!rows[i].logger) {
            rows[i].logger = ""
        } 
         if(!rows[i].sensor) {
            rows[i].sensor = ""
        } 
         if(!rows[i].lat) {
            rows[i].lat = ""
        } 
         if(!rows[i].lbs) {
            rows[i].lbs = ""
        } 
         

           csvContent += rows[i].time + ','+
                         rows[i].temp+','+
                         rows[i].battery+','+ 
                         rows[i].movement+','+ 
                         rows[i].logger+','+ 
                         rows[i].sensor+','+ 
                         rows[i].lat+'-'+rows[i].long+','+ 
                         rows[i].lbs+','+ 
                         rows[i].debug.cgReg+','+rows[i].debug.mqtt+','+rows[i].debug.signal+','+rows[i].debug.gps+',';
                     
           csvContent += '\n'

       }

            console.log(csvContent);
             this.downloadCsv(csvContent)
    }
    downloadCsv(csvContent) {
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Details.csv';
        hiddenElement.click();
    }

    

}