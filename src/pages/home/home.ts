import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	images = [];
	grid: Array<Array<string>>;
  lat: any;
  lon: any;
  watchID: any;
  x: string;
  y: string;
  z: string;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    public imagePicker: ImagePicker, public camera: Camera,
    public geo: Geolocation, public deviceMotion: DeviceMotion) {
  	//this.images = this.navParams.get('images');
  	this.grid = Array(Math.ceil(this.images.length/2));
  }

  ionViewDidLoad(){
  	this.preencheGrid();
  }

  preencheGrid(){
    let rowNumber = 0;
    //inserir duas imagens por linha
    for(let i = 0; i < this.images.length; i+= 2){
      this.grid[rowNumber] = Array(2);
      if(this.images[i]){
        this.grid[rowNumber][0] = this.images[i]
      }
      if(this.images[i+1]){
        this.grid[rowNumber][1] = this.images[i+1]
      }
      rowNumber++;
    }
  }

  async tiraFoto(): Promise<any>{
    try{
      this.images.push(await this.camera.getPicture(this.options));
      this.preencheGrid();
    }
    catch(err){
      alert("Erro " + err);
    }
  }
  
  obterGeo(){
    let geoOption = {enableHighAccuracy: true};
    try{
      this.watchID = this.geo.watchPosition(geoOption).subscribe(data =>{
        this.lat = data.coords.latitude;
        this.lon = data.coords.longitude;
      })
    }
    catch(err){
      alert("Erro " + err);
    }
  }

  obterAcc(){
    try{
      var option = {frequency: 200};
      this.watchID = this.deviceMotion.watchAcceleration(option).subscribe((acc: DeviceMotionAccelerationData) => {
        this.x = "" + acc.x;
        this.y = "" + acc.y;
        this.z = "" + acc.z;
      });
    }
    catch(err){
      alert("Erro " + err);
    }
  }
}
