import { AlertController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TronwebService } from '../providers/tronweb.service';
// import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Plugins } from '@capacitor/core';
const { Clipboard } = Plugins;


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  userInfo: any;
  accountName: string = '';
  bandWidthPer: any = 0;
  constructor(public router: Router, 
    public tronWebService: TronwebService, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) { 
    this.tronWebService.updateUserInfo();
    this.tronWebService.getUser().subscribe((user) => {
      this.userInfo = user;
      this.bandWidthPer = this.userInfo.bandwidth / 5000;
      console.log('this.bandWidthPer', this.bandWidthPer);
    });
    this.accountName = localStorage.getItem('accountName');
  }

  ngOnInit() {
  }

  receive = () => {
    this.router.navigateByUrl('/wallet-receive');
  }

  send = () => {
    this.router.navigateByUrl('/wallet-send');
  }

  copyAddress = async () => {
    Clipboard.write({
      string: this.userInfo.address 
    });
    const toast = await this.toastCtrl.create({
      message: 'Copied',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}
