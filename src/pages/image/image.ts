import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {
	imagem: any;
	x: any;
	y: any;
	z: any;
	lat: any;
	lon: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.imagem = this.navParams.get('imagem');
    this.x = this.navParams.get('X');
    this.y = this.navParams.get('Y');
    this.z = this.navParams.get('Z');
    this.lat = this.navParams.get('lat');
    this.lon = this.navParams.get('lon');
  }

}
