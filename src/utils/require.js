import React from 'react';

const Require = () => {

    //gonna have to make several requirements depending on the text field
    const validPassword = (password) => {
        return (password.length >= 5);
    }

    const validUsername = (username) => {
        //going to have to check if username exists in firebase
        return true;
    }
}

export default Require;