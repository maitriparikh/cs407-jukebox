import React from 'react';

const Require = () => {

    const regex = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$";
    //gonna have to make several requirements depending on the text field
    const validPassword = (password) => {
        return (password.length >= 6);
    }

    const validUsername = (username) => {
        //going to have to check if username exists in firebase
        return true;
    }
}

export default Require;