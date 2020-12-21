import React, { useState, useEffect } from 'react';

import '../mystyle.css';

function Form()
{
    const [suggestions, setSuggestions] = useState(0);

    useEffect(() => {
        fetch('/reverse_string').then(res => res.json()).then(data => {
            setSuggestions(data.string);
        });
    }, []);
    return(
            <div>
                <form className = "center" id="myForm" action ="/link" method ="POST" enctype="multipart/form-data">
                    <input type="textarea" className = "center" placeholder="Enter question here" id="textInput" name ="textInput" rows="4" cols="50"/>
                    <h5></h5>
                    <input className = "center" type="submit" name="my-form" value="Link Entities"></input>
                </form>
                <h5></h5>
                <input type="textarea" className = "center" placeholder = "Linked Entities will display here" rows="4" cols="50" id="entityDisplay"> {suggestions}</input>
            </div>
    );
}
export default Form
