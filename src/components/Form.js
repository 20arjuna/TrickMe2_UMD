import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { sizing } from '@material-ui/system';
import SuggestionDisplay from '../components/SuggestionDisplay'


/*{loading}
// {!loading && "Submit"}*/

function ButtonComponent(props) {
  const { loading } = props;
  return (
    <Button variant="contained"
            color="primary"
            size="large"
            type="submit"
            >
     Submit

    </Button>
  );
}



class Form extends Component {



    constructor(props)
    {
        super(props)

        this.state = {
            question: '',
            loading: false,
            showing: false,
            suggestions: '',
            suggestionKey: Math.random()
        };
    }

    // function GetSuggestions()
    // {
    //     // const [suggestions, setSuggestions] = useState(0);
    //     //
    //     //     useEffect(() => {
    //     //         fetch('/link').then(res => res.json()).then(data => {
    //     //             setSuggestions(data.suggestions);
    //     //         });
    //     //     }, []);
    //
    //     console.log(suggestions);
    //     return suggestions;
    // }

    handleQuestionChange = (event) => {
        this.setState({question: event.target.value})
    }

    submitHandler = (event) => {
        event.preventDefault()
        this.setState({ suggestionKey: Math.random() });
        this.setState({ loading: true });
         //3 seconds
        //console.log(this.state)
        console.log(this.state)
        axios.post('/link', this.state)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log("ERROR!!")
            })
        setTimeout(() => this.setState({ loading: false }), 3000);
        this.setState({ showing: true });

        // this.setState({ suggestions: GetSuggestions()});
        // this.setState({ showing: true});
    }


    render() {
        if(this.state.showing === false)
        {
            return(
                    <div>
                    <form onSubmit={this.submitHandler}>

                        <TextField
                            InputProps={{ style: { fontSize: 15 } }}
                            id="outlined-multiline-static"
                            label={<span style={{ fontSize: 15 }}>Enter Question Here</span>}
                            value = {this.state.question}
                            onChange={this.handleQuestionChange}
                            multiline
                            rows={10}
                            style = {{width: 500}}

                            variant="outlined"
                        />
                        <h5></h5>

                        <ButtonComponent loading={this.state.loading} />



                        <h5></h5>

                    </form>
                </div>

            )
        }
        else if(this.state.showing === true)
        {

            return(
                    <div>
                    <form onSubmit={this.submitHandler}>
                        <TextField
                            InputProps={{ style: { fontSize: 15 } }}
                            id="outlined-multiline-static"
                            label={<span style={{ fontSize: 15 }}>Enter Question Here</span>}
                            value = {this.state.question}
                            onChange={this.handleQuestionChange}
                            multiline
                            rows={10}
                            style = {{width: 500}}

                            variant="outlined"
                        />
                        <h5></h5>

                        <ButtonComponent loading={this.state.loading} />

                        <SuggestionDisplay key={this.state.suggestionKey} />


                        <h5></h5>

                    </form>
                </div>

            )
        }
    }
}
export default Form
