import TextField from '@material-ui/core/TextField';
import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';


class SuggestionDisplay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            suggestions: null
        };
    }

    // async componentDidMount()
    // {
    //     axios.get('/link')
    //         .then(response => this.setState({ suggestions: response.data.output }));
    //
    // }

    componentDidMount()
    {
        axios.get('/suggestions')
            .then(response => this.setState({ suggestions: response.data.output }));
        // fetch('/suggestions')
        //     .then(data => data.json())
        //     .then(data => {
        //         this.setState({ suggestions: data.output });
      //});

    }

    // setTimeout(function(){  }, 5000);
    // const [suggestions, setSuggestions] = useState(0);
    //
    //     useEffect(() => {
    //         fetch('/link').then(res => res.json()).then(data => {
    //             console.log("got here boys!")
    //             setSuggestions(data.suggestions);
    //         });
    //     }, []);

    render() {
        if(this.state.suggestions == null)
        {
            return (
                <div>
                    <br></br>
                    <br></br>
                    <br></br>
                    <CircularProgress />
                </div>
            )
        }
        else
        {
            return (
                <div>
                    <h5></h5>
                    <h4> All Suggested Entities Share 3 properties with the Entity originally mentioned in the Question </h4>
                    <h4> Job / Occupation, Nationality, and a Birthday within 15 years </h4>
                    <TextField
                        InputProps={{ style: { fontSize: 15 } }}
                        id="outlined-multiline-static"
                        label={<span style={{ fontSize: 15 }}>Suggestions</span>}
                        value = {this.state.suggestions}
                        /*onChange={this.handleQuestionChange}*/
                        multiline
                        rows={10}
                        style = {{width: 800}}

                        variant="outlined"
                    />
                </div>
            )
        }
    }

}
export default SuggestionDisplay;
