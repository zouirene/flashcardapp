import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    NavLink as Link,
    Route } from 'react-router-dom';

import Particles from 'react-particles-js';

// 1. set up firebase data base

var config = {
    apiKey: "AIzaSyDTs9Ho-Q_XNUV1sDLUky0G7QZSMMJBFcg",
    authDomain: "flashcard-5bb85.firebaseapp.com",
    databaseURL: "https://flashcard-5bb85.firebaseio.com",
    projectId: "flashcard-5bb85",
    storageBucket: "flashcard-5bb85.appspot.com",
    messagingSenderId: "411220583574"
  };
firebase.initializeApp(config);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const dbRef = firebase.database().ref('/');

// create component for auth
class App extends React.Component {
    constructor () {
        super();
        this.state = {
            loggedIn: false,
            user: null,
            currentDeck: '',
            decks: {},
            currentPage: 'home',
            currentDeckId: null,
            addingDeck: false
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setCurrentPage = this.setCurrentPage.bind(this);
        this.handleDeckClicked = this.handleDeckClicked.bind(this);
        this.toggleAddDeck=this.toggleAddDeck.bind(this)
    }
    login() {
        auth.signInWithPopup(provider)
            .then((results)=>{
                const user = results.user;
                this.setState({
                    user: user,
                    loggedIn: true
                });
            });
    }
    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null,
                    loggedIn: false
                })
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        let userId = this.state.user.uid;
        let userRef = firebase.database().ref(userId)
        userRef.push(
            {
                name: this.state.currentDeck,
                cards: {
                    sampleCard: {
                        front: 'This is a sample card',
                        back:'Try adding your own cards'
                    }
                }
            })
            .then(()=> {
                this.setState({
                    currentDeck: '',
                    addingDeck: !this.state.addingDeck
                });
            })
        // userRef.push({cards:{front: 'Add a Card', back:'did you'}})
    }
    handleChange(e) {
        this.setState({
            currentDeck: e.target.value
        });
    }
    removeDeck(key) {
        let userId = this.state.user.uid;
        let userRef = firebase.database().ref(`${userId}/${key}`);
        userRef.remove();
    }
    setCurrentPage(currentPage){
        this.setState({
            currentPage: currentPage
        })
    }
    handleDeckClicked(e){
        this.setCurrentPage('deckHome');
        this.setState ({
            currentDeckId: e.target.getAttribute('data-id')
        })
    }
    toggleAddDeck(){
        this.setState({
            addingDeck: !this.state.addingDeck
        })
    }
    render() {
        if (this.state.currentPage === 'home') {
            let showHome;
            if (this.state.loggedIn) {
                let addDeck;
                if (this.state.addingDeck) {
                    console.log(this.state.currentDeck)
                    addDeck = (
                            <div className="add-deck-background__darken">
                                <div id="deck-input">
                                    <div className="input-cell">
                                        <input className="enter-deck-name" name="currentDeck" value={this.state.currentDeck} onChange={this.handleChange} type="text" placeholder="Add a new deck" />
                                        <input className="create-btn" type="submit" value="Create" onClick={this.handleSubmit}/>
                                        <button onClick={this.toggleAddDeck}>
                                            <img src="../asset/close.png"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            )
                } else {
                    addDeck = (
                        <div className="add-btn-cell">
                            <button className="add-deck-button"onClick={this.toggleAddDeck}>
                                <img src="../asset/add.png"/>
                            </button>
                        </div>
                    )
                }
                showHome = (
                        <div className="logged-in-home">
                            <Particles
                                params={{
                                    particles: {
                                        number: {
                                            value: 50
                                        },
                                        size: {
                                          value: 4,
                                          random: true,
                                          anim: {
                                            enable: false,
                                            speed: 40,
                                            size_min: 0.1,
                                            sync: false
                                          }
                                        },
                                        opacity: {
                                          value: 0.2,
                                          random: false,
                                          anim: {
                                            enable: false,
                                            speed: 1,
                                            opacity_min: 0.1,
                                            sync: false
                                          }
                                        },
                                        move: {
                                          enable: true,
                                          speed: 2,
                                          direction: "none",
                                          random: false,
                                          straight: false,
                                          out_mode: "out",
                                          bounce: false,
                                          attract: {
                                            enable: false,
                                            rotateX: 600,
                                            rotateY: 1200
                                          }
                                        },
                                        line_linked: {
                                            shadow: {
                                                enable: false,
                                                color: "#3CA9D1",
                                                blur: 5
                                            }
                                        }
                                    }
                                }}
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%"
                                }}
                            />
                            <p>{this.state.user.displayName}'s</p>
                            <h1>Mind Palace</h1>
                            <button className="log-out-button" onClick={this.logout}>Log Out</button>
                            {addDeck}
                            <div className="deck-grid">
                                {Object.keys(this.state.decks).map((key) => {
                                    return (
                                    <div key={key} className="deck-cell">
                                        <div className="deck-content">
                                            <h2 onClick={this.handleDeckClicked} data-id={key}>
                                                {this.state.decks[key].name}
                                            </h2>
                                            <button onClick={() => this.removeDeck(key)}>Delete this deck</button>
                                        </div>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                )
            } else {
                showHome = (
                    <div className="landing-page">
                        <Particles
                        params={{
                            particles: {
                                number: {
                                    value: 90
                                },
                                size: {
                                  value: 3,
                                  random: true,
                                  anim: {
                                    enable: false,
                                    speed: 40,
                                    size_min: 0.1,
                                    sync: false
                                  }
                                },
                                opacity: {
                                  value: 0.3,
                                  random: false,
                                  anim: {
                                    enable: false,
                                    speed: 1,
                                    opacity_min: 0.1,
                                    sync: false
                                  }
                                },
                                move: {
                                  enable: true,
                                  speed: 3,
                                  direction: "none",
                                  random: false,
                                  straight: false,
                                  out_mode: "out",
                                  bounce: false,
                                  attract: {
                                    enable: false,
                                    rotateX: 600,
                                    rotateY: 1200
                                  }
                                },
                                line_linked: {
                                    shadow: {
                                        enable: false,
                                        color: "#3CA9D1",
                                        blur: 5
                                    }
                                }
                            }
                        }}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "1440px",
                            height: "1440px"
                        }}
                    />
                        <p>Create flashcards and store them in your own</p>
                        <div className="logo">
                            <img src="../../asset/logo.png" alt=""/>
                            <h1 className="logo-type">Mind Palac<span>e</span></h1>
                        </div>
                        <button onClick={this.login}>Log I<span>n</span></button>
                    </div>
                )
          }
          return (
            <main>

                {showHome}
            </main>
          )
        } else if (this.state.currentPage === 'deckHome') {
            return (
                <main>
                    <div className="deck-home-wrapper">
                        <p>{this.state.user.displayName}'s</p>
                        <h1>Mind Palace</h1>
                        <DeckHome setCurrentPage={this.setCurrentPage} deck={this.state.decks[this.state.currentDeckId]} deckId={this.state.currentDeckId} currentUser={this.state.user.uid}/>
                    </div>
                </main>
            )
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('user is logged in')
                this.setState({
                    user: user,
                    loggedIn: true
                })
                const userId = user.uid;
                const userRef = firebase.database().ref(userId);
                userRef.on('value', (snapshot) => {
                    this.setState({
                        decks: snapshot.val(),
                    });
                });
                    // console.log(this.state.decks)
                firebase.database().ref(userId+"/"+"sampleDeck").set({
                    name: "Sample Deck",
                    cards: {
                        word1: {
                            front: "spooky",
                            back: "Sinister or ghostly in a way that causes fear and unease"
                        },
                        word2: {
                            front: "hacker",
                            back: "An enthusiastic and skilful computer programmer or user"
                        },
                        word3: {
                            front: "hackeryou",
                            back: "Lorem ipsum dolor sit amet, excepturi molestias voluptatum iure sint numquam velit debitis nostrum dolorem earum ex!"
                        },
                        sampleCard: {
                            front: "This is a sample card",
                            back: "Add a new card!"
                        }

                    }
                })

            } else {
                // this part can be removed because this is the default state which has already been set in the constructor
                console.log('user is not logged in')
                this.setState({
                    user: null,
                    loggedIn: false
                })
            }
        });
    }
}
// 2. create component for deck home

class DeckHome extends React.Component {

    constructor() {
        super();
        this.state = {
            currentCard: '',
            currentBack:'',
            addingCard: false,

            // card states
            currentKey: 'sampleCard',
            showFront: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBackChange = this.handleBackChange.bind(this);
        // card binds
        this.removeCard=this.removeCard.bind(this);
        this.nextCard=this.nextCard.bind(this);
        this.showCurrentBack=this.showCurrentBack.bind(this);
        this.showCurrentFront=this.showCurrentFront.bind(this);
        this.toggleCard=this.toggleCard.bind(this);
        this.toggleAddCard=this.toggleAddCard.bind(this)
    }


    handleChange(e) {
        this.setState({
            currentCard: e.target.value
        });
    }

    handleBackChange(e) {
        this.setState({
            currentBack: e.target.value
        });
    }
    componentDidMount(){
        let userId = this.props.currentUser;
        let deckId = this.props.deckId;
        let deckRef = firebase.database().ref(`${userId}/${deckId}/cards`);
        deckRef.on('value', (snapshot) => {
            // this.setState({
            //     decks: snapshot.val(),
            // });
            let flatKeyList = [].concat.apply([],Object.keys(snapshot.val()));
            // console.log(flatKeyList[flatKeyList.length-2]);
            // console.log(flatKeyList[flatKeyList.length-1])
            if (flatKeyList.length > 1) {
                console.log('there is not a new deck');
                let currentKey = flatKeyList[flatKeyList.length-2];
                this.setState({
                    currentKey: currentKey
                })
            } else {
                this.setState({
                    currentKey: 'sampleCard'
                })
            }
        });

    }
    handleSubmit(e) {
        e.preventDefault();
        let userId = this.props.currentUser;
        let deckId = this.props.deckId;
        console.log(deckId);
        let deckRef = firebase.database().ref(`${userId}/${deckId}/cards`);
        deckRef.push({
            front:this.state.currentCard,
            back:this.state.currentBack
        }).then(()=> {
            let keyList = Object.keys(this.props.deck.cards);
            let flatKeyList = [].concat.apply([], keyList);
            let newKey = flatKeyList[flatKeyList.length-2];
            this.setState({
                currentCard: '',
                currentBack: '',
                currentKey: newKey,
                showFront: true,
                addingCard: !this.state.addingCard
                // currentKey: currentKey
            });
        });
    }

    removeCard(key) {
        let userId = this.props.currentUser;
        let deckId = this.props.deckId;
        console.log(deckId);
        if (key !== "sampleCard") {
            let cardRef = firebase.database().ref(`${userId}/${deckId}/cards/${key}`);
            cardRef.remove();
        }
        this.setState({
            showFront: true
        })
    }
    nextCard(){
        console.log('go to next card')
    }
    showCurrentFront(){
        console.log('go to front of this card');
        this.setState({
            showFront: !this.state.showFront
        })
    }
    showCurrentBack(){
        console.log('go to back of this card');
        this.setState({
            showFront: !this.state.showFront
        })
    }
    toggleCard(){
        let keyList = Object.keys(this.props.deck.cards);
        for (var i=keyList.length; i>0; i--) {
            keyList.push((keyList.splice(Math.floor(Math.random()*i),1)))
        }
        // console.log(keyList);
        let flatKeyList = [].concat.apply([], keyList);
        let currentKey = flatKeyList[0];
        console.log('sup')
        console.log(currentKey);

        this.setState({
            currentKey: currentKey,
            showFront: !this.state.showFront
        })
    }
    toggleAddCard() {
        this.setState({
            addingCard: !this.state.addingCard
        })
    }

    render() {
        // console.log(this.props.deck.cards);

        let addCard;
        if (this.state.addingCard) {
            addCard = (
                <div className="add-card-background__darken">
                    <div className="add-card-cell">
                        <h3>Create a new card</h3>
                        <input className="add-card-front" type="text" value={this.state.currentCard} onChange={this.handleChange} placeholder="Front of card" />
                        <textarea className="add-card-back" type="text" value={this.state.currentBack} onChange={this.handleBackChange} placeholder="Enter notes for the back of the card"></textarea>
                        <div className="buttons">
                            <input type="submit" value="Add" onClick={this.handleSubmit}/>
                            <button onClick={this.toggleAddCard}>Discard</button>
                        </div>
                    </div>
                </div>
            )
        } else {
            addCard = (
                <div className="add-card-button-cell">
                    <button className="add-card-button"onClick={this.toggleAddCard}>
                        <img src="../asset/add.png"/>
                    </button>
                </div>
            )
        }

        let deckHomeHeader = (
            <div className="deck-home-header">

                <button className="home-btn" onClick={()=>this.props.setCurrentPage('home')}>HOME</button>
                <div className="deck-name-cell">
                    <p>Currently in:</p>
                    <h2>{this.props.deck.name}</h2>
                </div>
                {addCard}
            </div>
            )

        // let remainingCards = this.props.deck.cards


        if (typeof this.props.deck.cards !== "undefined") {

            let sideUp;

            if (this.state.showFront === true) {
                sideUp = (key)=>{
                // console.log(key)
                    return (
                        <div className="front">
                            <h2>{this.props.deck.cards[key].front}</h2>
                            <button className="show-back-btn" onClick={this.showCurrentBack}>see meaning</button>
                        </div>
                    )
                }
            } else {
                sideUp = (key) => {
                    return (
                        <div className="back">
                            <h3>{this.props.deck.cards[key].front}</h3>
                            <h4>{this.props.deck.cards[key].back}</h4>
                            <div className="buttons">
                                <button className="show-front-btn" onClick={this.showCurrentFront}>show front</button>
                                <button className="next-card-btn" onClick={this.toggleCard}>next card</button>
                            </div>
                        </div>
                    )
                }
            }


            return(
                <div>
                <Particles
                    params={{
                        particles: {
                            number: {
                                value: 60
                            },
                            size: {
                              value: 3,
                              random: true,
                              anim: {
                                enable: false,
                                speed: 40,
                                size_min: 0.1,
                                sync: false
                              }
                            },
                            opacity: {
                              value: 0.1,
                              random: false,
                              anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false
                              }
                            },
                            move: {
                              enable: true,
                              speed: 1,
                              direction: "none",
                              random: false,
                              straight: false,
                              out_mode: "out",
                              bounce: false,
                              attract: {
                                enable: false,
                                rotateX: 600,
                                rotateY: 1200
                              }
                            },
                            line_linked: {
                                shadow: {
                                    enable: false,
                                    color: "#3CA9D1",
                                    blur: 5
                                }
                            }
                        }
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }}
                />
                    {deckHomeHeader}
                    <div className="card-display-container">
                            <div key={this.state.currentKey} className="card-cell">
                                {sideUp(this.state.currentKey)}
                                <button className="remove-card-btn" onClick={()=>{this.removeCard(this.state.currentKey)}}>Remove this card</button>
                            </div>
                    </div>
                </div>
            )
        } else {
            return(
                <div>
                    {deckHomeHeader}
                </div>
            )
        }
    }
}



// static particles param
// move: {
//   enable: false,
//   speed: 6,
//   direction: "none",
//   random: false,
//   straight: false,
//   out_mode: "out",
//   bounce: false,
//   attract: {
//     enable: false,
//     rotateX: 600,
//     rotateY: 1200
//   }
// }

ReactDOM.render(<App />, document.getElementById('app'));

