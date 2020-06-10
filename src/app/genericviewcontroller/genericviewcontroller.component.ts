import { Component, OnInit } from '@angular/core';
import { NavigatorstackService } from '../navigatorstack.service';
import { masterJson } from '../configjson/masterJson';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../http.service';
import { UtilfuncService } from '../shared/utilfunc.service';
import * as Quagga  from 'quagga';
//var Quagga = require('quagga').default;
/*import QrScanner from "node_modules/qr-scanner/qr-scanner.min.js";
QrScanner.WORKER_PATH = '../qr-scanner-worker.min.js';*/
@Component({
  selector: 'app-genericviewcontroller',
  templateUrl: './genericviewcontroller.component.html',
  styleUrls: ['./genericviewcontroller.component.scss'],
})
export class GenericviewcontrollerComponent implements OnInit {
  Quagga:any;
  masterJson = masterJson;
  data;
  x;
  y;
  formdata: any;
  formGroup: FormGroup;
  userData: any;
  collectedQuestion = [];
  loading = false
  errormsg = ''
  errorstatus = false
  file: File;
  public fileup: any;
  public uploadData: any = FormData;
  fileName: string;
  lat = ' ';
  lng = ' ';
  cardData;
  _scannerIsRunning: any = false;


  constructor(private util: UtilfuncService, private navigatorstack: NavigatorstackService, private router: Router, private fb: FormBuilder, public http: HttpService) {
    this.userData = JSON.parse(localStorage.getItem('user'));
  }

  checkValid() {
    let isError = false;
    this.formdata.questions.forEach(element => {

      if (this.dependencyResolver(element)) {
        if (element.is_mandatory && element.is_mandatory === 1) {
          if (!this.formGroup.value[element.attribute_name]) {
            this.showError(element.title + ' is required');
            isError = true;
            return false;
          }
        }
      }
    })
    if (isError) {
      return false;
    } else {
      return true;
    }
  }
  scan(){
     /*this.x = document.createElement("VIDEO");
    document.getElementById("vdiv").appendChild(this.x);
    var scanner = new QrScanner(this.x, result =>console.log(result));
    scanner.start();*/
    /*this.y=document.createElement("IMG");
    this.y.src="https://miro.medium.com/max/1424/1*sHmqYIYMV_C3TUhucHrT4w.png"
    QrScanner.scanImage(this.y)
    .then(result => console.log(result))
    .catch(e => console.log(e));*/
   
      if (this._scannerIsRunning) {
          Quagga.stop();
          this._scannerIsRunning= false;
          console.log("stop sacnner")
      } else {
          this.startScanner();
          console.log("start sacnner")
      }
  }
  
   startScanner() {
    /*Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: 480,
                height: 320,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader"
            ],
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
                }
            }
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");*/
        this._scannerIsRunning = true;
        Quagga.start();

        // Set flag to is running
       
      //});

    Quagga.onProcessed(result=> {
      console.log(result)
    
        var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });


    Quagga.onDetected(function (result) {
      console.log("hello guys")
        console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
        alert("Barcode detected and processed : [" + result.codeResult.code + "]"+result)
    });
}
    




  returnDefaultvalue(question) {
    if (question.field_value_type) {
      if (question.field_value_type === 'card') {
        return this.util.getvalue(this.cardData, question.field_value, '');
      }
      if (question.field_value_type === 'user') {
        return this.util.getvalue(this.userData, question.field_value, '');
      }
    } else {
      return '';
    }
  }

  ngOnInit() {
   
    Quagga.init({
      inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector('#scanner-container'),
          constraints: {
              width: 480,
              height: 320,
              facingMode: "environment"
          },
      },
      decoder: {
          readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader"
          ],
          debug: {
              showCanvas: true,
              showPatches: true,
              showFoundPatches: true,
              showSkeleton: true,
              showLabels: true,
              showPatchLabels: true,
              showRemainingPatchLabels: true,
              boxFromPatches: {
                  showTransformed: true,
                  showTransformedBox: true,
                  showBB: true
              }
          }
      },

  }, function (err) {
      if (err) {
          console.log(err);
          return
      }
alert("initialization finished now u can start the scanner")
      console.log("Initialization finished. Ready to start");
    });
    
    console.log(this.userData);
    this.formGroup = this.fb.group({});
    this.masterJson = masterJson;
    
    this.data = this.navigatorstack.returntop();
    console.log(this.data.card_data);
    this.cardData = this.data.card_data;
    const generic_view_id = this.data.generic_view_id || this.data.card_data['generic_view_id'];
    // this variable contains the card parameters user parameters constants
    if (this.masterJson[generic_view_id]) { } else { this.router.navigateByUrl('/home'); }
    this.formdata = this.masterJson[generic_view_id] || '';
    console.log(this.formdata['card_parameters'])
   
    if (!this.formdata['card_parameters']) {
      console.log(this.data['card_parameters'])
      if (this.data['card_parameters']) {
        this.formdata['card_parameters'] = [...this.data['card_parameters']]

      }
    } else {
      if (this.data['card_parameters']) {

        this.formdata['card_parameters'] = [...this.data['card_parameters'], ...this.formdata['card_parameters']]
      }
    }
    if (this.formdata.pages) {
      var sectionquestion = []
      
      this.formdata.pages.forEach(page => {
        page.sections.forEach(section => {
          section.questions.forEach(question => { sectionquestion.push(question) })
        })
      })
      this.formdata.questions = sectionquestion
    }
    if (this.formdata) {
      this.formdata.questions.forEach(element => {
        
        if (element['type'] == "HIDDEN_LOCATION") {
          try {
            if (window.navigator['permissions']) {
              window.navigator['permissions'].query({ name: 'geolocation' }).then((result) => { this.location(result, element['is_mandatory']) });
            }
          } catch{ }

        }
        if (element.is_mandatory && element.is_mandatory === 1 && this.dependencyResolver(element)) {
          this.formGroup.addControl(element.attribute_name, this.fb.control(this.returnDefaultvalue(element), Validators.required));
        } else {
          this.formGroup.addControl(element.attribute_name, this.fb.control(this.returnDefaultvalue(element)));
        }

      });
    }
    console.log(this.formdata.questions)
    this.getOptions()
  }
  location(result, required) {
    // Will return ['granted', 'prompt', 'denied']
    console.log(result.state);
    if (result.state == 'prompt') {
      this.showError('Please provide location permission and try again')
      setTimeout(() => { this.back() }, 1500)
    }
    if (result.state == 'denied') {
      if (required != 1) { this.showError('Please provide location permission and try again') } else {
        this.showError('Please provide location permission and try again')
        setTimeout(() => { this.back() }, 1500)
      }
    } else {
      this.getloc()
    }
  }
  back() {
    this.navigatorstack.navigate_popup();
  }
  submit() {
    console.log(this.formGroup);
    console.log(this.formGroup.valid);
    if (this.formGroup.valid) {
      console.log('submitted')
      // console.log(this.checkValid())
      if (this.checkValid()) {
        this.submittheform()
      }
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  getTitle(x) {
    if (x.length > 25) {
      return x.substring(0, 25) + '...';
    }
    return x
  }

  onFileChange(event, attribute_name) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.fileup = fileList[0];
      if (this.file.size < 2 * 1024 * 1024) {
        this.uploadData = new FormData();
        this.uploadData.append('file', this.file, this.file.name);
        this.loading = true;
        this.http.postapi(this.http.getcompleteurl('fileupload'), this.uploadData).subscribe((value) => {
          this.fileName = this.file.name
          this.formGroup.patchValue({ [attribute_name]: value['response'].data.url });
          this.loading = false
        }, (error) => {
          this.showError(error['error']['msg'])
        })
      } else {
        this.showError('Upload file should be less than 2Mb')
      }
    }
  }
  getloc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => { this.getlocation(position) })
    }
  }
  getlocation(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  }
  submittheform() {
    let submit_body = {};
    this.formdata.questions.forEach(element => {

      if (this.dependencyResolver(element)) {

        if (element['type'] == "HIDDEN_LOCATION") {
          var tempAttri = element['attribute_name'].split(',')
          submit_body[tempAttri[0]] = this.lat
          submit_body[tempAttri[1]] = this.lng
        } else {
          submit_body[element.attribute_name] = this.formGroup.value[element.attribute_name] || '';

        }
        if (element['type'] === 'DATE' || element['type'] == 'Date' && element['date_format'] == "yyyy-MM-dd") {
          var temp = JSON.stringify(this.formGroup.value[element.attribute_name]).split('T')[0].substring(1)
          submit_body[element.attribute_name] = temp || '';
        }
        else if (element['type'] === 'DATE' || element['type'] == 'Date' && element['date_format'] == "MM-dd-YYYY") {
          var temp = JSON.stringify(this.formGroup.value[element.attribute_name]).split('T')[0].substring(1)
          submit_body[element.attribute_name] = `${temp.split('-')[1]}-${temp.split('-')[2]}-${temp.split('-')[0]}` || '';
        }
        else if (element['type'] === 'DATE' || element['type'] == 'Date' && element['date_format'] == "YYYY-dd-MM") {
          var temp = JSON.stringify(this.formGroup.value[element.attribute_name]).split('T')[0].substring(1)
          submit_body[element.attribute_name] = `${temp.split('-')[0]}-${temp.split('-')[2]}-${temp.split('-')[2]}` || '';
        }
      }
    });
    if (this.formdata.user_parameters) {
      this.formdata.user_parameters.forEach(element => {
        submit_body[element.lhs] = this.userData[element.rhs] || '';
      });
    }
    if (this.formdata.card_parameters) {
      this.formdata.card_parameters.forEach(element => {
        submit_body[element.lhs] = this.data['card_data'][element.rhs] || '';
      });
    }
    if (this.data.params) {
      this.data.params.forEach(element => {
        submit_body[element.lhs] = this.data['card_data'][element.rhs] || '';
      });
    }
    if (this.formdata.constants) {
      this.formdata.constants.forEach(element => {
        submit_body[element.lhs] = element.rhs || '';
      });
    }
    this.loading = true
    if (this.formdata['endpoint_method'] == 'POST') {
      this.http.postapi(this.http.getcompleteurl(this.formdata['submit_endpoint']), submit_body).subscribe((value) => {
        this.loading = false
        this.showError(value['msg'])
        setTimeout(() => { this.navigatorstack.navigate_popup() }, 1000)
      }, (error) => {
        this.showError(error['error']['msg'])
      })
    } else if (this.formdata['endpoint_method'] == 'PATCH') {
      this.http.patchapi(this.http.getcompleteurl(this.formdata['submit_endpoint']), submit_body).subscribe((value) => {
        this.loading = false
        this.showError(value['msg'])
        setTimeout(() => { this.navigatorstack.navigate_popup() }, 1000)
      }, (error) => {
        this.showError(error['error']['msg'])
      })
    }
  }
  dependencyResolver(question) {
    var dependents = []
    var status = true
    if (question['dependents']) {
      question['dependents'].forEach((element) => {
        this.formdata.questions.forEach(e => {
          if (e['qid'] == element['qid']) {
            dependents.push({
              "dependents": element,
              "dependOn": e
            })
          }
        })
      })
      dependents.forEach((x) => {
        if (this.formGroup.value[x['dependOn']['attribute_name']] != x['dependents']['rhs_array'][0]) {
          status = false
        }
      })
      return status
    } else {
      return true
    }
  }



  getOptions() {
    this.formdata.questions.forEach((question, index) => {
      if (question['type'] == 'CONCATENATEDYNAMICTAGS' && question['on_focus_func'] == 'api') {
        this.options(question, index)
      }
    })
  }
  options(question, index) {
    if (question.options && !(question.url)) {
      return
    } else if (question.url) {
      this.formdata.questions[index]['options'] = []
      var optionUrl = this.http.getcompleteurl(question.url)
      if (this.formdata.questions[index]['params'] && this.formdata.questions[index]['params']['user'] && this.formdata.questions[index]['params']['user'].length != 0) {
        var user = JSON.parse(localStorage.getItem('user'))
        this.formdata.questions[index]['params']['user'].forEach(obj => {
          if (user[obj['rhs']]) {
            optionUrl = optionUrl + `&${obj.lhs}=${user[obj['rhs']]}`
          }
        })
      }
      if (this.formdata.questions[index]['params'] && this.formdata.questions[index]['params']['card'] && this.formdata.questions[index]['params']['card'].length != 0) {
        var card = this.data['card_data']
        this.formdata.questions[index]['params']['card'].forEach(obj => {
          if (card[obj['rhs']]) {
            optionUrl = optionUrl + `&${obj.lhs}=${card[obj['rhs']]}`
          }
        })
      }
      this.http.getapi(optionUrl).subscribe((value) => {
        value['response']['data'].forEach(obj => {
          this.formdata.questions[index]['options'].push({
            [this.formdata.questions[index]['possible_values'][0]]: obj[this.formdata.questions[index]['possible_values'][0]],
            [this.formdata.questions[index]['attribute_rhs']]: obj[this.formdata.questions[index]['attribute_rhs']]
          })
        })
      })
    }
  }

  showError(msg) {
    this.loading = false
    this.errormsg = msg
    this.errorstatus = true
    setTimeout(() => { this.errorstatus = false }, 1500)
  }

}