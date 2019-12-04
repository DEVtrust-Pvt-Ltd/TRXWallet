import { TronwebService } from 'src/app/providers/tronweb.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../providers/common/common.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-send',
  templateUrl: './wallet-send.page.html',
  styleUrls: ['./wallet-send.page.scss'],
})
export class WalletSendPage implements OnInit {
  userInfo: any;
  submitted = false;
  payment: FormGroup;

  constructor(public tronWebService: TronwebService, public formBuilder: FormBuilder,
    public commonFn: CommonService, public alertController: AlertController, public router: Router) {
    this.tronWebService.getUser().subscribe((user:any) => {
      this.userInfo = user;
    });
   }

  ngOnInit() {
    this.payment = this.formBuilder.group({
      paymentAccount: ['', [Validators.required]],
      receiveAccount: ['', [Validators.required]],
      transferAmount: ['', [Validators.required, Validators.min(1)]]
    });
    this.payment.get('paymentAccount').setValue(this.userInfo.address);
  }

  // convenience getter for easy access to form fields
  get f() { return this.payment.controls; }

  doPayment = () => {
    this.submitted = true;

    // stop here if form is invalid
    if (this.payment.invalid) {
      return;
    }

    console.log(this.payment);
    this.presentAlertConfirm();
  }

  maxAmt = () => {
    this.payment.get('transferAmount').setValue(this.userInfo.balance);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you want to send the entered amount?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.transferAmount();
          }
        }
      ]
    });

    await alert.present();
  }

  transferAmount = async () => {
    // no validation error
    try {
      await this.commonFn.showLoader();
      this.tronWebService.sendTransaction(this.payment.value.receiveAccount, this.payment.value.transferAmount).then( async (result:any) => {
        await this.commonFn.hideLoader();
        const alert = await this.alertController.create({
          header: 'Success!',
          message: 'You have transfered amount successfully.',
          buttons: [
            {
              text: 'Ok',
              role: 'Ok',
              handler: () => {
                this.router.navigateByUrl('/wallet');
              }
            }          
          ]
        });
        await alert.present();
      }).catch(error => {
        this.commonFn.showAlert('Error!', error);
      });
    } catch (error) {
      this.commonFn.showAlert('Error!', error);
    }
  }
}
