import logo from './logo.svg';
import './App.css';
import './mystyle.css'
import Header from './components/Header'
import IntroText from './components/IntroText'
import Form from './components/Form'
import SuggestionDisplay from './components/SuggestionDisplay'
import React, { Component } from 'react'

class App extends Component
{
    render()
    {
        return (
                <div className="App">
                    <Header />
                    <IntroText />
                    <Form />
                    
                </div>
        );
    }
}

export default App
