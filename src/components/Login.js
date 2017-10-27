import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StatusBar, Image  } from 'react-native';
import { Spinner } from './common';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser } from '../actions';
import {Sae } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from "react-native-linear-gradient/index.android";
import { Actions } from 'react-native-router-flux';


export let profileNameL='';

class Login extends Component {

    onEmailChange(text){
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }




    onButtonPress() {
        const { email, password } = this.props;

        this.props.loginUser({ email, password });


    }

    _handleButtonPressCreate = () => {
        Actions.CreateAccount();
    };



    renderButton() {
        if (this.props.loading) {
            return (
                <View style={{paddingTop: 30}} >
                    <Spinner size="large" />
                </View>
            )
        }

        return (
            <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonContainer}>
                <Text style={styles.textStyle}>
                    Sign in
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <LinearGradient

                colors={['#5555FF', '#9787FF' ]}
                style={styles.container}>

                <StatusBar hidden={false} barStyle="light-content" />


                <Image
                    style={{marginTop:-15, width: 137, height: 154, marginBottom: 30, alignSelf: 'center',}}
                    source={require('tess/src/images/White_Logo.png')}
                />

                <View  style={styles.inputContainer}>
                <Sae
                    label={'Email Address'}
                    labelStyle={{
                        color: 'rgba(300,300,300,0.7)',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 15,}}
                    iconClass={Icon}
                    iconName={'md-mail'}
                    iconColor={'white'}
                    inputStyle= {{
                        color: '#FFF',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 18,}}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    returnKeyType='next'
                    keyboardType="email-address"
                    value={this.props.email}
                    onChangeText={this.onEmailChange.bind(this)}
                    onSubmitEditing={(event) => {
                        this.refs.SecondInput.focus();
                    }}
                />
                </View>

                <View style={styles.inputContainer}>
                <Sae
                    ref='SecondInput'
                    label={'Password'}
                    iconClass={Icon}
                    labelStyle={{
                        color: 'rgba(300,300,300,0.7)',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 15,}}
                    iconName={'md-lock'}
                    iconColor={'white'}
                    inputStyle= {{
                        color: '#FFF',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 18,}}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry
                    returnKeyType="go"
                    value={this.props.password}
                    onChangeText={this.onPasswordChange.bind(this)}
                    onSubmitEditing={() => this.onButtonPress()}

                />
                </View>


                <Text style={styles.errorTextStyle}>
                    {this.props.error}
                </Text>

                <View >
                    {this.renderButton()}
                </View>


                <Text onPress={this._handleButtonPressCreate} style={styles.textBottomStyle}>Don't have an account? Sign Up</Text>

            </LinearGradient>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontStyle: 'normal',
        fontFamily: 'Helvetica',
        fontSize: 18,
        alignSelf: 'center',
        color: 'rgba(300,10,10,1)',
        marginTop: 15,
        backgroundColor: 'transparent'
    },

    container: {
        flex: 1,
        backgroundColor: '#856cff',
        padding: 20,
        paddingTop: 80
    },

    input: {
        height: 40,
        backgroundColor: 'rgba(170,170,170,0.5)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
    },

    buttonContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 30,
        marginBottom:5,
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 10,
        borderColor: '#FFF',
        backgroundColor: '#fff'
    },

    buttonText: {
        textAlign: 'center',
        color: '#5555FF',
    },

    formContainer4: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#5555FF'
    },

    textStyle: {
        textAlign: 'center',
        color: '#5555FF',
        fontStyle: 'normal',
        fontFamily: 'Helvetica',
        fontSize: 18,
    },
    inputContainer: {
        backgroundColor:"rgba(300,300,300,0.2)",
        marginVertical: 5,
        paddingBottom: 10,
        paddingHorizontal: 10,
        borderWidth:0.1,
        borderRadius:10
    },
    textBottomStyle: {
        marginTop: 20,
        textAlign: 'center',
        color: 'rgba(300,300,300,0.8)',
        fontStyle: 'normal',
        fontFamily: 'Helvetica',
        fontSize: 15,
        backgroundColor: 'transparent'
    }


};

const mapStateToProps = ({ auth }) => {
    const { email, password, error, loading } = auth;

    return { email, password, error, loading};
};

export default connect(mapStateToProps, { emailChanged, passwordChanged, loginUser })(Login);