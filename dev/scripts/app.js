import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    NavLink as Link,
    Route } from 'react-router-dom';

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
        const userId = this.state.user.uid;
        const userRef = firebase.database().ref(userId)
        userRef.push({name: this.state.currentDeck})
            .then(()=> {
                this.setState({
                    currentDeck: '',
                    addingDeck: !this.state.addingDeck
                });
            })
        userRef.push({cards:{}})
    }
    handleChange(e) {
        this.setState({
            currentDeck: e.target.value
        });
    }
    removeDeck(key) {
        const userId = this.state.user.uid;
        const userRef = firebase.database().ref(`${userId}/${key}`);
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
                            <p>{this.state.user.displayName}'s</p>
                            <h1>mindpalace</h1>
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
                        <p>Create flashcards and store them in your own</p>
                        <h1 className="logo">mindpalac<span>e</span></h1>
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
                        <h1>mindpalace</h1>
                        <DeckHome setCurrentPage={this.setCurrentPage} deck={this.state.decks[this.state.currentDeckId]} deckId={this.state.currentDeckId} currentUser={this.state.user.uid}/>
                    </div>
                </main>
            )
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            // to remember the user has logged in after refreshing the page
            console.log(user);
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
            // cards: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBackChange = this.handleBackChange.bind(this);
        this.removeCard = this.removeCard.bind(this)
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

    handleSubmit(e) {
        e.preventDefault();
        const userId = this.props.currentUser;
        const deckId = this.props.deckId;
        console.log(deckId);
        const deckRef = firebase.database().ref(`${userId}/${deckId}/cards`);
        deckRef.push({
            front:this.state.currentCard,
            back:this.state.currentBack
        }).then(()=> {
            this.setState({
                currentCard: '',
                currentBack: ''
            });
        });
    }
    removeCard(key) {
        const userId = this.props.currentUser;
        const deckId = this.props.deckId;
        console.log(deckId);
        const deckRef = firebase.database().ref(`${userId}/${deckId}/cards/${key}`);
        deckRef.remove();
    }

    render() {
        // console.log(this.props.deck.cards);
        let deckHomeHeader = (
            <div className="deck-home-header">
                <button onClick={()=>this.props.setCurrentPage('home')}>HOME</button>
                <h2>{this.props.deck.name}</h2>
                <div className="add-card-cell">
                    <input type="text" value={this.state.currentCard} onChange={this.handleChange} placeholder="Add a new card" />
                    <input type="text" value={this.state.currentBack} onChange={this.handleBackChange} placeholder="Enter notes here" />
                    <input type="submit" value="Add" onClick={this.handleSubmit}/>
                </div>
            </div>
            )
        if (typeof this.props.deck.cards !== "undefined") {

            console.log(this.props.deck);
            return(
                <div>
                    {deckHomeHeader}
                    <div className="card-display-container">
                        {Object.keys(this.props.deck.cards).map((key)=>{
                                return(
                                    <div key={key} className="card-cell">
                                        <div className="front">
                                            <h2>{this.props.deck.cards[key].front}</h2>
                                        </div>
                                        <div className="back hidden">
                                            <h2>{this.props.deck.cards[key].front}</h2>
                                            <h3>{this.props.deck.cards[key].back}</h3>
                                        </div>
                                        <button onClick={()=>{this.removeCard(key)}}>Remove this card</button>
                                    </div>
                                )
                            })}
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


        // return(
        // )
                            // { if (typeOf this.props.deck.cards !== "undefined"||"null")

                            // }



                            // this is for sample deck rendering






ReactDOM.render(<App />, document.getElementById('app'));

