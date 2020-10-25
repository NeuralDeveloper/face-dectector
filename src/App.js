import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js'; 
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
  apiKey: '7049d785285f4800888481c454874b08'
  });

const particlesBackground ={
    "particles": {
        "number": {
            "value": 100
        },
        "size": {
            "value": 4
        }
    },
    "interactivity": {
        "events": {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            }
        }
    }
}

class App extends Component {
  constructor() {
    super();
    this.state ={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      userSignedIn: false
    }
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value}); //this is how you get value from the Imagelinkform

  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displatFaceBox = (box) => {
    this.setState({box: box});
  }

  onButtonSubmit = () =>{
    console.log('click');
    this.setState({imageUrl: this.state.input}); //this will forward the url from the input to FaceRecognition
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response => this.displatFaceBox(this.calculateFaceLocation(response))
        .catch(err => console.log(err))
        );
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({userSignedIn: false})
    } else if (route === 'home'){
      this.setState({userSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    const {userSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
          <Particles className='particles'
            params={particlesBackground} 
          />
          <Navigation userSignedIn={userSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        : (
          this.state.route ==='signin'
          ?<Signin onRouteChange={this.onRouteChange}/>    
          :<Register onRouteChange={this.onRouteChange}/>    
        )}        
      </div>
    );
  }
}

export default App;