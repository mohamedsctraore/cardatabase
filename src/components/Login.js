import React, { Component } from 'react';
import {SERVER_URL} from '../constant.js';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Carlist from './Carlist';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', isAuthenticated: false};
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    login = () => {
        const user = {username: this.state.username, password: this.state.password};
        fetch(SERVER_URL + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
        .then(res => {
            const jwtToken = res.headers.get('Authorization');
            if(jwtToken !== null) {
                sessionStorage.setItem("jwt", jwtToken);
                this.setState({isAuthenticated: true});
            }
        })
        .catch(err => console.log(err))
    }

    render() {
        if(this.state.isAuthenticated === true) {
            return (<Carlist />)
        } else {
            return(
                <div>
                     <TextField name="username" placeholder="username" onChange={this.handleChange} />  <br/>
                     <TextField name="password" placeholder="password" onChange={this.handleChange} />  <br/>
                     <Button variant="raised" color="primary" onClick={this.login}>
                        Login
                     </Button>
                </div>
            );
        }
    }
}

export default Login;