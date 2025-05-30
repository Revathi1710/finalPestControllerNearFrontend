import React, { Component } from 'react';
import Navbar from '../components/navbar';
import ImageSlider from '../components/ImageSlider';
import HomeForm from './homeForm';
import './home.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      messageIndex: 0,
    };

    this.messages = [
      "Get Service From Licenced  Pest Control Agencies it is Always Safe.", // English
      "लाइसेंस प्राप्त कीट नियंत्रण एजेंसियों से सेवा प्राप्त करें यह हमेशा सुरक्षित है.",              // Hindi
      "ലൈസൻസുള്ള കീട നിയന്ത്രണ ഏജൻസികളിൽ നിന്ന് സേവനം നേടുക, അത് എല്ലായ്പ്പോഴും സുരക്ഷിതമാണ്.",                     // Malayalam
      "లైసెన్స్ పొందిన తెగులు నియంత్రణ ఏజెన్సీల నుండి సేవ పొందండి, ఇది ఎల్లప్పుడూ సురక్షితం.",                          // Telugu
      "ಪರವಾನಗಿ ಪಡೆದ ಕೀಟ ನಿಯಂತ್ರಣ ಏಜೆನ್ಸಿಗಳಿಂದ ಸೇವೆ ಪಡೆಯಿರಿ, ಅದು ಯಾವಾಗಲೂ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.",                 // Kannada
      "உரிமம் பெற்ற பூச்சி கட்டுப்பாடு நிறுவனங்களிடமிருந்து சேவையைப் பெறுங்கள், அது எப்போதும் பாதுகாப்பானது.",                        // Tamil
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    this.setState({ location: searchLocation });

    // Rotate messages every 1 second
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        messageIndex: (prevState.messageIndex + 1) % this.messages.length,
      }));
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clean up
  }

  handleLocationChange = (e) => {
    this.setState({ location: e.target.value });
  };

  render() {
    const currentMessage = this.messages[this.state.messageIndex];

    return (
      <div>
        <Navbar />
        <div className="desktopbannerbox hero-section position-relative">
          <ImageSlider />

          <div className="overlay-content position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="container">
              <div className="row align-items-center justify-content-center hero-content-box">
                <div className="col-md-7 text-white text-left mb-4">
                  <h3 className="hero-heading">{currentMessage}</h3>
                </div>
                <div className="col-md-5">
                  <div className="">
                    <HomeForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mobilebannerbox">
          <div className='mobileslider'>
            <ImageSlider />
          </div>

          <div className="">
            <h3 className="hero-heading">{currentMessage}</h3>
            <div className="containerbox">
              <HomeForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
