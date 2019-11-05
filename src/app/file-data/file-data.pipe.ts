import { Pipe, PipeTransform } from '@angular/core'; 
import { ValueTransformer } from '@angular/compiler/src/util';
import { timestamp } from 'rxjs/operators';
 
@Pipe({
    name:'filterPipe'
})
export class filterPipe implements PipeTransform {
    startValue = 0;
    endValue = 0;
    timeStampA1: any;
    transform(value:any): any{
        let arrayToReturn = [];
        let deviceId = value[1];
        let array2 = [];
        let arrayA4 = [];
        let A4counter = 0;
        
        let counter = 0;
        if(deviceId) {
            arrayToReturn.push(deviceId[2]);
        }
        for (let i = 1; i < value.length; i++) {
            let tempValue = false;
            let arrayTemp = value[i];
            this.endValue = value.length;
            // console.log("array value: ",arrayTemp);
            // if(arrayTemp[3] && arrayTemp[3].startsWith('A400')) {
            //    arrayToReturn.push(arrayTemp[3]);
            // }
            if(arrayTemp[3] && arrayTemp[3].startsWith('A1')) {
                counter ++;
                if(counter ==1) {
                    this.timeStampA1 = arrayTemp[3];
                     this.startValue = i;
                    //  console.log("Start value: ", this.startValue)
                }
                else if (counter ==2 || i == (value.length)-1) {
                    this.endValue = i;
                    // console.log("End value: ", this.endValue)
                    counter = 0;
                    i--;
                }

                for( let j= this.startValue; j< this.endValue; j++) {
                    let A4value = value[j]
                    if(A4value[3] && A4value[3].startsWith('A4')) {
                        // this.timeStampA4 = A4value[0];
                        arrayA4.push(A4value);
                        A4counter ++;
                    }
                }
                if(A4counter > 0) {
                    array2.push(arrayA4);
                    A4counter = 0;
                    arrayA4 = []
                    // break;
                } 
                
                
               
                //  arrayToReturn.push(arrayTemp);
           }
           else {
            this.startValue = i;

            for( let j= this.startValue; j< this.endValue; j++) {
                let A4value = value[j]
                if(A4value[3] && A4value[3].startsWith('A4')) {
                    // this.timeStampA4 = A4value[0];
                    arrayA4.push(A4value);
                    A4counter ++;
                }
            }
            if(A4counter > 0) {
                array2.push(arrayA4);
                A4counter = 0;
                arrayA4 = []
                // break;
            } 
            
           }
           
        }
        return array2[0];
    }
}