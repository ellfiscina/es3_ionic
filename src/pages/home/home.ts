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
	grid: Array<Array<string>>;
  images = [];
  lat = [];
  lon = [];
  x = [];
  y = [];
  z = [];
  watchID: any;

  //Configuração da camera
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

    //definição do tamanho do grid
  	this.grid = Array(Math.ceil(this.images.length/2));
  }

  ionViewDidLoad(){
    this.carregar();
  }

  //função para preenchimento do grid
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

  //função para captura da foto
  async tiraFoto(): Promise<any>{
    try{
      //objeto para salvar todas as informações da imagem
      let image = {'Imagem': this.images, 'Latitude': this.lat, 
        'Longitude': this.lon, 'X': this.x, 'Y': this.y, 'Z': this.z};
      
      this.obterGeo(); //obter a localização no momento da captura
      this.obterAcc(); //obter a inclinação

      //salva a foto na lista de imagens
      this.images.push(await this.camera.getPicture(this.options));
      
      //salva o objeto no armazenamento interno
      this.nativeStorage.setItem(
        'obj', image).then(
            () => console.log('Guardado'),
            error => console.log('Erro', error)
        );

      //coloca a foto na galeria
      this.preencheGrid();
    }
    catch(err){
      alert("Erro " + err);
    }
  }
  
  //obter a localização
  obterGeo(){
    //melhor localização possível
    let geoOption = {enableHighAccuracy: true};
    try{
      this.watchID = this.geo.getCurrentPosition(geoOption).subscribe(data =>{
        //salva a localização atual na lista de latitude e longitude
        this.lat.push(data.coords.latitude);
        this.lon.push(data.coords.longitude);
      })
    }
    catch(err){
      alert("Erro " + err);
    }
  }

  //obter a inclinação do aparelho
  obterAcc(){
    try{
      //período de chamada do acelerômetro
      var option = {frequency: 200};

      this.watchID = this.deviceMotion.watchAcceleration(option)
      .subscribe((acc: DeviceMotionAccelerationData) => {
        //salva os valores x, y e z nas listas
        this.x.push("" + acc.x);
        this.y.push("" + acc.y);
        this.z.push("" + acc.z);
      });
    }
    catch(err){
      alert("Erro " + err);
    }
  }

  //Função para chamar a página com a imagem selecionada
  imageClick(img){
    //pega o index da imagem selecionada no array
    let index = this.images.indexOf(img);
    
    //Pega o valor de cada uma das listas com o index
    //da imagem e passa como parâmetro para a próxima página
    this.navCtrl.push(ImagePage, {
      imagem: img,
      X: this.x[index],
      Y: this.y[index], 
      Z: this.z[index], 
      lat: this.lat[index],
      lon: this.lon[index]
    });
  }

  //Carrega as informações salvas no aparelho e coloca nos
  //arrays. Em seguida preenche a galeria
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
