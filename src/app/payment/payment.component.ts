import { Component, OnInit } from '@angular/core';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  amount: any;
  message: any;
  loading: any;
  status: any;
  errorstatus: any;
  errormsg: any;
  confirmation: any
  constructor(private webIntent: WebIntent, private router: Router, public http: HttpService) { }
  proceed() {
    if (this.amount > 0) {

      this.paymentActivity()
      this.loading = true
    }

  }
  ngOnInit() {
    this.errorstatus = false;
    this.errormsg = ''
  }
  paymentActivity() {
    // https://stackoverflow.com/questions/59211720/what-is-the-alternative-to-webintent-on-ios-in-ionic-4
    // A simple alternative is to use capacitor API
    // https://capacitor.ionicframework.com/docs/apis/app

    //   App.addListener('appUrlOpen', (data: any) => {
    //     // data.url contains the url that is opening your app
    //     // so you can use it to check what to do
    // });

    // const canOpen = await App.canOpenUrl({ url: 'app://url' });
    // if (canOpen.value === true) {
    //     // can open 'app://url'
    // }
    // const open = await App.openUrl({ url: 'app://url' });
    // if (!open.completed) {
    //     // app not opened, custom logic like ask to install the app or redirect to the store
    // }




    let user = JSON.parse(JSON.stringify(localStorage.getItem('user')))
    let pa = JSON.parse(localStorage.getItem('user'))['company_upi']['upi_handle']
    let pn = JSON.parse(localStorage.getItem('user'))['company_upi']['name']
    const options = {
      action: this.webIntent.ACTION_VIEW,
      url: `upi://pay?pa=${pa}&pn=${pn}&am=${this.amount}&mode=00&orgid=000000&sign=0033748f3acc2704142effdc9af1ed5983816a2996cc87559929a6bae84a0b4e&tn=${JSON.parse(user)['username']} ${JSON.parse(user)['name']}`
    }
    this.webIntent.startActivityForResult(options).then(
      (value) => {
        if (value['extras']['resultCode'] == '0' && value['extras']['resultCode'] == 0) { 
          this.loading = false

          return }
        this.loading = true
        this.status = JSON.parse(JSON.stringify(value))['extras']
        let temp = {}
        temp = { ...value }
        temp['amountSent'] = this.amount
        let obj = {
          "amount": this.amount,
          "tag": this.status['Status'] == 'SUCCESS' ? `PaymentDetail` : 'UpiTxnFailure',
          "metadata": temp['extras'],
          "txn_number": temp['extras']['response'],
          "notify_this_mobile": this.confirmation
        }
        this.loading = true
        if (this.status['Status'] == 'FAILURE' || this.status['resultCode'] == -1 || this.status['resultCode'] == 0) {
          this.errormsg = this.status['Status'] || 'FAILED'
        }
        this.http.postapi(this.http.getcompleteurl('custom/UpiTxn'), obj).subscribe((res) => {
          this.loading = false
          this.errorstatus = true
          this.errormsg = this.status['Status'] || 'Successful'
          if (this.status['Status'] == 'FAILURE' || this.status['resultCode'] == -1 || this.status['resultCode'] == 0) {
            this.errormsg = this.status['Status'] || 'FAILED'
          }
          setTimeout(() => {
            this.loading = false
            this.errorstatus = false
            this.router.navigateByUrl('/home')
          }, 1500);
        }, (error) => {
          this.loading = false
          this.errormsg = error['error']['msg']
          this.errorstatus = true
        })
      }, (error) => {
        if (error['extras']['resultCode'] == '0' && error['extras']['resultCode'] == 0) { 
          this.loading = false

          return }
        this.loading = true
        this.errormsg = 'Failed'
        this.status = JSON.parse(JSON.stringify(error))['extras']
        let temp = {}
        temp = { ...error }
        temp['amountSent'] = this.amount
        let obj = {
          "amount": this.amount,
          "tag": this.status['Status'] == 'SUCCESS' ? `PaymentDetail` : 'UpiTxnFailure',
          "metadata": temp['extras'],
          "txn_number": temp['extras']['response'],
          "notify_this_mobile": this.confirmation
        }
        this.loading = true
        try {
          if (this.status['Status'] == 'FAILURE' || this.status['resultCode'] == -1 || this.status['resultCode'] == 0) {
            this.errormsg = this.status['Status'] || 'FAILED'
          }
        } catch{
          this.loading = false
          this.errormsg = 'Something went wrong'
          this.errorstatus = true
          setTimeout(() => {
            this.loading = false
            this.errorstatus = false
            this.router.navigateByUrl('/home')
          }, 1000);
          return

        }
        this.http.postapi(this.http.getcompleteurl('custom/UpiTxn'), obj).subscribe((res) => {
          this.loading = false
          this.errorstatus = true
          this.errormsg = this.status['Status'] || 'Failed'
          if (this.status['Status'] == 'FAILURE' || this.status['resultCode'] == -1 || this.status['resultCode'] == 0) {
            this.errormsg = this.status['Status'] || 'FAILED'
          }
          setTimeout(() => {
            this.loading = false
            this.errorstatus = false
            this.router.navigateByUrl('/home')
          }, 1500);
        }, (error) => {
          this.loading = false
        })
      });
  }


}
