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
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    this.setState({ location: searchLocation });
  }

  handleLocationChange = (e) => {
    this.setState({ location: e.target.value });
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="desktopbannerbox hero-section position-relative">
          <ImageSlider />

          <div className="overlay-content position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="container">
              <div className="row align-items-center justify-content-center hero-content-box">
                <div className="col-md-7 text-white text-left mb-4">
                  <h3 className="hero-heading">Non Licenced Pest Control Companies Services are Dangerous Then Diseases Spreading Pest</h3>
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
    <h3 className="hero-heading">
    Non Licensed Pest Control Services are Dangerous Then Diseases Spreading Pest
    </h3>
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
