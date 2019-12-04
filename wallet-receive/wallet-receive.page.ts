import { AlertController, ToastController } from '@ionic/angular';
// import { Clipboard } from '@ionic-native/clipboard/ngx';
import { TronwebService } from 'src/app/providers/tronweb.service';
import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Clipboard } = Plugins;

@Component({
  selector: 'app-wallet-receive',
  templateUrl: './wallet-receive.page.html',
  styleUrls: ['./wallet-receive.page.scss'],
})
export class WalletReceivePage implements OnInit {
  userInfo: any;
  constructor(public tronWebService: TronwebService, public alertCtrl: AlertController,
    public toastCtrl: ToastController) { 
    this.tronWebService.getUser().subscribe((user:any) => {
      this.userInfo = user;
    });
  }

  ngOnInit() {
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


