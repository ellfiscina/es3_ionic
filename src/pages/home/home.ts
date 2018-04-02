import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';
import { NativeStorage } from '@ionic-native/native-storage';
import { ImagePage } from '../image/image';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	images = [];
	grid: Array<Array<string>>;
  lat = [];
  lon = [];
  watchID: any;
  x = [];
  y = [];
  z = [];

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  constructor(
    public navCtrl: NavController, public navParams: NavParams, 
    public imagePicker: ImagePicker, public camera: Camera,
    public geo: Geolocation, public deviceMotion: DeviceMotion,
    private nativeStorage: NativeStorage) {

  	this.grid = Array(Math.ceil(this.images.length/2));
  }

  ionViewDidLoad(){
    this.carregar();
  	//this.preencheGrid();
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
      let image = {'Imagem': this.images, 'Latitude': this.lat, 'Longitude': this.lon, 'X': this.x, 'Y': this.y, 'Z': this.z};
      this.obterGeo();
      this.obterAcc();
      this.images.push(await this.camera.getPicture(this.options));
      this.nativeStorage.setItem(
        'obj', image).then(
            () => console.log('Guardado'),
            error => console.log('Erro', error)
        );
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
        this.lat.push(data.coords.latitude);
        this.lon.push(data.coords.longitude);
      })
    }
    catch(err){
      alert("Erro " + err);
    }
  }

  obterAcc(){
    try{
      var option = {frequency: 200};
      this.watchID = this.deviceMotion.watchAcceleration(option)
      .subscribe((acc: DeviceMotionAccelerationData) => {
        this.x.push("" + acc.x);
        this.y.push("" + acc.y);
        this.z.push("" + acc.z);
      });
    }
    catch(err){
      alert("Erro " + err);
    }
  }

  imageClick(img){
    let index = this.images.indexOf(img);
    this.navCtrl.push(ImagePage, {
      imagem: img,
      X: this.x[index],
      Y: this.y[index], 
      Z: this.z[index], 
      lat: this.lat[index],
      lon: this.lon[index]
    });
  }

  carregar(){
    this.nativeStorage.getItem('obj').then(
      data => {
        this.images = data.Imagem;
        this.lat = data.Latitude;
        this.lon = data.Longitude;
        this.x = data.X;
        this.y = data.Y;
        this.z = data.Z;
        this.preencheGrid();
      },
      error => console.error(error)
    );
  }
}
