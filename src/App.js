import React, { Component, createRef } from 'react';
import './App.css';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Logo from './assets/littlepigs_logo.svg';
import Twitter from './assets/twitter.svg';
import Discord from './assets/discord.svg';
import Preview from './assets/Pigs_320x320.gif';
import ImagePage1 from './assets/page1.png';
import ImagePage2 from './assets/page2.png';
import ImagePage3 from './assets/rarities_image.jpg';
import ImageTeam1 from './assets/team1.png';
import ImageTeam2 from './assets/team2.png';
import ImageTeam3 from './assets/team3.png';
import ImageTeam4 from './assets/team4.png';
import ImageTeam5 from './assets/team5.png';

const INITIAL_STATE = {
  address: '',
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
};

class App extends Component {
  timerRef = createRef(null);

  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };

    this.web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: this.getProviderOptions(),
    });
  }

  async componentDidMount() {
    //await this.setup();
    this._setRemaining();
    setInterval(() => {
      this._setRemaining();
    }, 10000);
  }

  async componentWillUnmount() {
    this.resetApp(false);
  }

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }

    provider.on('disconnect', () => {
      this.resetApp(false);
    });

    provider.on('accountsChanged', async (accounts) => {
      this.setState({ address: accounts[0] });
    });

    provider.on('chainChanged', async (chainId) => {
      const chainIdInt = parseInt(chainId);
      if (this.state.chainId !== chainIdInt) {
        this.setState({ chainId: chainIdInt });
        console.log('Network changed: ', chainIdInt);
      }
    });
  };

  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };
    return providerOptions;
  };

  setup = async () => {
    const provider = await this.web3Modal.connect();
    await this.subscribeProvider(provider);

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    const chainId = await web3.eth.getChainId();

    console.log('Connected: ', chainId);

    this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      selIndex: -1,
    });
  };

  resetApp = async (clearCache) => {
    const { provider, web3 } = this.state;
    if (provider) provider.removeAllListeners();
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    if (clearCache) {
      this.web3Modal.clearCachedProvider();
    }
    this.setState({ ...INITIAL_STATE });
  };

  _setRemaining = () => {
    let days = 0;
    let hours = 0;
    let minutes = 0;

    let delay = Date.now();
    if (delay < 1638316800000) {
      delay = (1638316800000 - delay) / 1000;
      days = parseInt(delay / 86400);
      delay -= days * 86400;
      hours = parseInt(delay / 3600);
      delay -= hours * 3600;
      minutes = parseInt(delay / 60);
    }
    if (this.timerRef?.current)
      this.timerRef.current.innerHTML = `${days
        .toString()
        .padStart(2, '0')} DAYS ${hours
        .toString()
        .padStart(2, '0')} HOURS ${minutes.toString().padStart(2, '0')} OINKS`;
  };

  render() {
    return (
      <>
        <div id="App">
          <img id="Main-Logo" alt="Little Pigs" src={Logo}></img>
          <div id="App-Content">
            <div id="Social-Container">
              <a
                className="app-btn social-btn"
                target="_blank"
                rel="noreferrer"
                href="http://discord.gg/3bMSc9gwHQ"
              >
                <img className="social-icon" alt="Discord" src={Discord} />
                <div className="social-text">GO HOG-WILD ON DISCORD</div>
              </a>
              <a
                className="app-btn social-btn"
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/LittlePigsNFT"
              >
                <img className="social-icon" alt="Twitter" src={Twitter} />
                <div className="social-text">GET DIRTY AT TWITTER</div>
              </a>
              <div className="app-btn" id="Social-Counter" ref={this.timerRef}>
                12 DAYS 00 HOURS 00 OINKS
              </div>
            </div>
            <div id="Main-Preview">
              <img id="Preview-Image" alt="Preview" src={Preview} />
            </div>
          </div>
        </div>
        <div className="page" id="Page1">
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage1} width="280px" />
          </div>
          <div className="flex-half-text">
            <p className="header">Once Upon a Time …</p>
            <p className="normal">
              Following their bestseller, The Three Pigs spent some time in the
              limelight. They brought a ton of cash back to Pigsville and the
              economy ramped up. Hoove’s Hookers, Ham’s Diner, and other such
              fine establishments began to take off.
            </p>
            <p className="normal">
              The Little Pigs of Pigsville were finally able to afford daily
              necessities like clothing and cocaine. They took a liking to this
              new-found money.
            </p>
            <p className="last">
              They bought swaggy t-shirts and sailor caps; cigars and fancy
              contact lens’ too
            </p>
          </div>
          <div id="Page1-2" />
        </div>
        <div className="page page-even" id="Page2">
          <div className="flex-half-text">
            <p className="header font-32">In Pigsville - a place for pigs</p>
            <p className="normal">
              For those unfamiliar, Pigsville’s population is 10,000.
            </p>
            <p className="normal">
              The road into Pigsville is currently under construction. We’ll be
              able to access the town for visitation beginning December 1st,
              2021. Should you adopt a pig, you’re welcome to stay.
            </p>
            <p className="last">
              Otherwise visitation visas to the general public will be capped at
              30 days.
            </p>
          </div>
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage2} width="280px" />
          </div>
        </div>
        <div className="page" id="Page3">
          <div className="flex-half-image">
            <img alt="Porky" src={ImagePage3} width="280px" />
          </div>
          <div className="flex-half-text">
            <p className="header">Rare piglets</p>
            <p className="normal">
              COMMON&nbsp;PIGLET&nbsp;TRAITS:
              10&nbsp;VARIANTS&nbsp;UP&nbsp;TO&nbsp;80% <br />
              <span className="thin">
                Striped / mohawk / lazer eyes / and much more
              </span>
            </p>
            <p className="normal">
              POSH&nbsp;PIG&nbsp;TRAITS:
              10&nbsp;VARIANTS&nbsp;UP&nbsp;TO&nbsp;70% <br />
              <span className="thin">
                Striped / mohawk / lazer eyes / and much more
              </span>
            </p>
            <p className="normal">
              PORK&nbsp;CHAD&nbsp;TRAITS:
              10&nbsp;VARIANTS&nbsp;UP&nbsp;TO&nbsp;40% <br />
              <span className="thin">
                Striped / mohawk / lazer eyes / and much more
              </span>
            </p>
            <p className="last">
              FLYING&nbsp;PIG&nbsp;TRAITS:
              10&nbsp;VARIANTS&nbsp;UP&nbsp;TO&nbsp;20% <br />
              <span className="thin">
                Striped / mohawk / lazer eyes / and much more
              </span>
            </p>
          </div>
        </div>
        <div className="page" id="Page4">
          <p className="title">Team Swill</p>
          <div id="Bio-Container">
            <div className="bio">
              <img alt="Team" src={ImageTeam1} />
              <p className="header">Chrispy</p>
              <p className="normal">
                -Product Development
                <br />
                -Venture Capitalist
                <br />
                -Self-proclaimed professional NFT collector
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam2} />
              <p className="header">Schlomo</p>
              <p className="normal">
                -Artist & Designer
                <br />
                -10+ years as art director + creative director working on some
                of the world’s top brands
                <br />
                -Likes the pigs
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam3} />
              <p className="header">Peak3d</p>
              <p className="normal">
                - Full Stack Dev
                <br />
                - 25+ years development experience
                <br />- Admires good artists
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam4} />
              <p className="header">DxVert</p>
              <p className="normal">
                - Startup advisor and incubator
                <br />
                - 25 years in DESIGN & development
                <br />- Crypto nut 5 years and still solvent
              </p>
            </div>
            <div className="bio">
              <img alt="Team" src={ImageTeam5} />
              <p className="header">BigPig</p>
              <p className="normal">
                - Public Relations
                <br />
                - E-commerce/retail arbitrage specialist
                <br />- !oink
              </p>
            </div>
          </div>
        </div>
        <div className="page" id="Page5">
          <img id="Main-Logo" alt="Little Pigs" src={Logo}></img>
          <div id="Page5-Buttons">
            <a
              className="app-btn social-btn"
              target="_blank"
              rel="noreferrer"
              href="http://discord.gg/3bMSc9gwHQ"
            >
              <img className="social-icon" alt="Discord" src={Discord} />
              <div className="social-text">GO HOG-WILD ON DISCORD</div>
            </a>
            <a
              className="app-btn social-btn"
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/LittlePigsNFT"
            >
              <img className="social-icon" alt="Twitter" src={Twitter} />
              <div className="social-text">GET DIRTY AT TWITTER</div>
            </a>
          </div>
          <span>COPYRIGHT ALL RIGHTS RESERVED LITTLEPIGS.IO 2021</span>
        </div>
      </>
    );
  }
}

export default App;
