import {
	Component,
	OnInit
} from '@angular/core';
import {
	ApiService
} from '../api.service';
import {
	Constants
} from './file-data.constants';
import {
	FileUtil
} from './file.util';
import {
	filterPipe
} from './file-data.pipe';
import {
	ExtractDataService
} from '../extract-data.service';

import {Sort} from '@angular/material/sort';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';



@Component({
	selector: 'app-file-data',
	templateUrl: './file-data.component.html',
	styleUrls: ['./file-data.component.css']
})
export class FileDataComponent implements OnInit {

	startDateForm = new FormControl(new Date());
  	endDateForm = new FormControl(new Date());
	startDate: any;
	endDate: any;
	fileImportInput: any;
	deviceId: string;
	matStartDate: Date;
	matEndDate: Date;
	deviceIdFromFile: string;
	csvRecords = [];
	csvRecordData = [];
	decodedA1Data: any;
	decodedA4Data: any = [];
	decodedA6Data: any = [];
	timeStamp: any = [];
	binarySamplingInterval : any;
	A4Data = [];
	noOfA4Data;
	downloadingFile: boolean = false;
	disableDownload: boolean = false;
	showProcessingMessage: boolean = false;
	resumeDownload: boolean = false;
	tempRange: any = [];
	chartData: any = [];
	chartLabels: any = [];
	chartOptions: any;
	endDeviceId: string;
	startDeviceId: string;
	dataIndex = 0;
	dataCounter = 0;
	noOfSamples;
	filteredData = [];
	sortedData = []
	newArrayToDisplay = [];
	arrayToDisplay = [];

	constructor(private api: ApiService,
		private _fileUtil: FileUtil,
		private filterPipe: filterPipe,
		private extractService: ExtractDataService,
		// this.sortedData = this.newArrayToDisplay.slice();
	) {}

	ngOnInit() {}

	startDateFun(type: string, event: MatDatepickerInputEvent<Date>) {
		console.log(this.matStartDate);
		this.startDate = this.matStartDate;
	  }
	  endDateFun(type: string, event: MatDatepickerInputEvent<Date>) {
		console.log(this.matEndDate);
		this.endDate = this.matEndDate;
	  }

	downloadFile() {
		// return new Promise((resolve, reject) => {

		let start = this.startDate;
		let ddStart = start.getDate();
		let mmStart = start.getMonth() + 1;
		let yyyyStart = start.getFullYear();
		let dateStart = ddStart.toString();
		let monthStart = mmStart.toString();
		let yearStart = yyyyStart.toString();
		if (ddStart < 10) {
			dateStart = '0' + ddStart;
		}

		if (mmStart < 10) {
			monthStart = '0' + mmStart;
		}
		let startDate = yearStart + monthStart + dateStart;



		let end = this.endDate;
		let ddEnd = end.getDate();
		let mmEnd = end.getMonth() + 1;
		let yyyyEnd = end.getFullYear();
		let dateEnd = ddEnd.toString();
		let monthEnd = mmEnd.toString();
		let yearEnd = yyyyEnd.toString();
		if (ddStart < 10) {
			dateEnd = '0' + ddEnd;
		}

		if (mmStart < 10) {
			monthEnd = '0' + mmEnd;
		}
		let endDate = yearEnd + monthEnd + dateEnd;


		window.location.href = 'https://escavoxwebapi.azurewebsites.net/IoT/1.0/GetRaw/' + this.deviceId +'/'+startDate+ '-0000/' + endDate + '-0000';

		//   resolve();
		// })
	}

	getFileData() {
		this.api.getFiles().subscribe((csvData) => {
			let csvRecordsArray = (csvData as string).split(/\r\n|\n/);
			let headerLength = -1;
			if (Constants.isHeaderPresentFlag) {
				let headersRow = this._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
				headerLength = headersRow.length;
			}
			console.log("Reading data from file")
			this.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
				headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
			this.filteredData.push(this.filterPipe.transform(this.csvRecords));
			// console.log("filtered data", this.filteredData);
			this.arrayToDisplay.push(this.filteredData[0]);
			let arrayTodecode = [];
			arrayTodecode.push(this.arrayToDisplay[0]);
			for (let i=0; i<arrayTodecode[0].length; i++) {
				this.A4Data.push(arrayTodecode[0][i][3]);
				this.timeStamp.push(arrayTodecode[0][i][1]);
			}
			
			// this.deviceIdFromFile = this.filteredData[0].shift();
			this.decodeData(this.A4Data)
			let objToDisplay = {}
			if (this.csvRecords == null) {
				this.fileReset();
			}
		})
	}

	decodeData(data) {
		this.dataIndex++;
		for (let i = 0; i < data.length; i++) {
			if (typeof (data[i]) == "string" && data[i].startsWith('A4')) {
				this.decodedA4Data[i] = this.extractService.extractA4Data(data[i]);
				this.decodedA4Data[i].time = this.timeStamp[i];
      } 
    }
	console.log("A4 decoded data: ",this.decodedA4Data);
	this.noOfA4Data = this.decodedA4Data.length;
	this.displayData();
	}

	displayData() {
		let A1Data = this.filterPipe.timeStampA1;
		console.log(A1Data);
		 this.decodedA1Data = this.extractService.extractA1Data(A1Data);
		let highThresholdHexa = this.decodedA1Data.highThreshold;
		// let highThresholdBin = parseInt(highThresholdHexa,16);
		let timeInHexa = ((this.decodedA1Data.samplingInterval));
		let timeInBin = parseInt(timeInHexa, 16)
		this.binarySamplingInterval = timeInBin;
		//  console.log(ust)
		let finalArrayToDisplay = [];
		let tempFrame = [];
		let timeFrame = [];
		let ustFrame = [];
		let batteryFrame = [];
		let movementFrame = [];
		let loggerFrame = [];
		let sensorFrame = [];
		let locationFrame = [];
		let lbsFrame = [];
		let debugFrame = [];
		for (let i=0; i< this.decodedA4Data.length; i++) {
			let time = this.decodedA4Data[i].time;
			let ust= Math.round(new Date(time).getTime());
			for (let j=0;j<(this.decodedA4Data[i].extractedData).length; j++) {
				
				tempFrame.push(this.decodedA4Data[i].extractedData[j].temp);
				let findMovement = parseInt(this.decodedA4Data[i].extractedData[j].movement,16);
				let findMovementInString = '';
				if (findMovement == 15) {
					findMovementInString = 'Accelerometer Off'
				}
				else if (findMovement == 0) {
					findMovementInString = 'Idle'
				}
				else if (findMovement == 1) {
					findMovementInString = 'Moving'
				}
				movementFrame.push(findMovementInString);
				loggerFrame.push(this.decodedA4Data[i].extractedData[j].logger==0?'stop':'start');
				if(ust>0) {
					let date = new Date(ust)
					let dd = date.getDate();
					let mm = date.getMonth() + 1;
					let yyyy = date.getFullYear();
					let hh = date.getHours();
					let min = date.getMinutes();
					let sec = date.getSeconds();
					let hours = hh.toString();
					let minute = min.toString();
					let seconds = sec.toString();
					let day = dd.toString();
					let month = mm.toString();
					let year = yyyy.toString();
					if (dd < 10) {
						day = '0' + dd;
					}
					if (mm < 10) {
						month = '0' + mm;
					}
					if (hh < 10) {
						hours = '0' + hh;
					}
					if (min < 10) {
						minute = '0' + min;
					}
					if (sec < 10) {
						seconds = '0' + sec;
					}
					let todayDate =day+'-'+month+'-'+year +' ' + hours+':'+minute+':'+seconds;
					timeFrame.push(todayDate);
					ustFrame.push(ust);
					batteryFrame.push(this.decodedA4Data[i].batteryPer);
					locationFrame.push({"lat": this.decodedA4Data[i].latitute, "long": this.decodedA4Data[i].longitute})
					let lbsInt = parseInt(this.decodedA4Data[i].lbs,16);
					let lbsString = lbsInt == 0?'LBS':'WiFi'
					lbsFrame.push(lbsString);
					let sensor = this.decodedA4Data[i].typeOfMessage == 'A4'?'ON': 'OFF';
					sensorFrame.push(sensor);
					let debugObj = this.extractService.extractDebugByteData(this.decodedA4Data[i].debugByte);
					debugFrame.push(debugObj);
					ust = ust - timeInBin*1000;
				}
				
			}
		
			// finalArrayToDisplay[i].push(timeFrame[i]); 
		}
		for(let k=0; k<timeFrame.length; k++) {
			finalArrayToDisplay.push({"time":timeFrame[k], "temp":tempFrame[k], "ust": ustFrame[k], "battery": batteryFrame[k], "movement": movementFrame[k],"sensor":sensorFrame[k], "logger": loggerFrame[k], "lat":locationFrame[k].lat, "long": locationFrame[k].long, "lbs": lbsFrame[k], "debug": debugFrame[k]});
				this.newArrayToDisplay = finalArrayToDisplay;
		}
		this.noOfSamples = tempFrame.length;
		// console.log("final array: ", finalArrayToDisplay);
		this.chartOptions = {
			responsive: true,
			maintainAspectRatio: false
		  };
		
		  
		
		  this.chartLabels = timeFrame;
		
		  
		this.chartData = [
			{ data: tempFrame, label: 'Temperature' },
			// { data: [120, 455, 100, 340], label: 'Account B' },
			// { data: [45, 67, 800, 500], label: 'Account C' }
		  ];

		
	}

	fileReset() {
		this.fileImportInput.nativeElement.value = "";
	}

	onChartClick(event) {
		console.log(event);
	  }


	sortData(sort: Sort) {
		const data = this.newArrayToDisplay.slice();
		if (!sort.active || sort.direction === '') {
		  this.sortedData = data;
		  return;
		}
	
		this.sortedData = data.sort((a, b) => {
		  const isAsc = sort.direction === 'asc';
		  switch (sort.active) {
			case 'ust': return this.compare(a.ust, b.ust, isAsc);
			case 'time': return this.compare(a.time, b.time, isAsc);
			case 'temp': return this.compare(a.temp, b.temp, isAsc);
		
			default: return 0;
		  }
		});

		// console.log(this.sortedData)
		this.newArrayToDisplay = this.sortedData;
		let sortedTemp = [];
		let sortedTime = [];
		for(let i=0; i<this.newArrayToDisplay.length;i++) {
			sortedTemp.push(this.newArrayToDisplay[i].temp);
			sortedTime.push(this.newArrayToDisplay[i].time)
		}
		this.chartLabels = sortedTime;
		
		  
		this.chartData = [
			{ data: sortedTemp, label: 'Temperature' },
			// { data: [120, 455, 100, 340], label: 'Account B' },
			// { data: [45, 67, 800, 500], label: 'Account C' }
		  ];
	  }

	   compare(a: number | string, b: number | string, isAsc: boolean) {
		return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
	  }

	  print() {

		this._fileUtil.convertArrayToCsv(this.newArrayToDisplay,this.decodedA1Data);
	
	  }
	  
	  deleteFile() {
		  	  this.api.deleteFiles().subscribe((data)=>{
		 	  console.log("File deleted successfully");
		  });
	  }
	 

}