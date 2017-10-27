import React, { Component } from 'react';
import { Text, View, TouchableOpacity  } from 'react-native';
import { Spinner } from './common';
import { connect } from 'react-redux';
import { emailChanged, passwordChanged, loginUser, createUser, usernameChanged } from '../actions';
import {Sae } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from "react-native-linear-gradient/index.android";


export let profileName='';

class CreateAccount extends Component {
    state = {
        confirmPassword: '',
        confirmPasswordError: '',
    };


    onUsernameChange(text){
        this.props.usernameChanged(text);
    }

    onEmailChange(text){
        this.props.emailChanged(text);
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text);
    }



    onButtonPress() {

        const { email, password, username } = this.props;

        this.props.createUser({ email, password, username });



    }



    renderButton() {
        if (this.props.loading) {
            return(
            <View style={{paddingTop: 30}} >
                <Spinner size="large" />
            </View>
            )
        }
        return(

            <TouchableOpacity onPress={this.onButtonPress.bind(this)} style={styles.buttonContainer}>
                <Text style={styles.textStyle}>
                Sign Up
                </Text>
            </TouchableOpacity>
        );

    }

    render() {
        return (
            <LinearGradient

                colors={['#5555FF', '#9787FF' ]}
                style={styles.container}>

                <TouchableOpacity style={{backgroundColor: 'rgba(300,300,300,0.2)', borderRadius: 30, borderWidth: 0.1,  width: 60, height: 60, alignItems: 'center', alignSelf:'center', marginBottom: 20 }}>
                    <Icon style={{
                        textAlign: 'center',
                        marginTop: 12,
                        fontSize: 30,
                        color: '#FFF'
                    }} name="md-camera">
                    </Icon>
                </TouchableOpacity>



                <View style={styles.inputContainer}>
                <Sae
                    label={'Username'}
                    labelStyle={{
                        color: 'rgba(300,300,300,0.7)',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 15,}}
                    iconClass={Icon}
                    iconName={'md-person'}
                    iconColor={'white'}
                    inputStyle={{
                        color: '#FFF',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 18,}}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    returnKeyType='next'
                    value={this.props.username}
                    onChangeText={this.onUsernameChange.bind(this)}
                    onSubmitEditing={(event) => {
                        this.refs.FirstInput.focus();
                    }}
                />
                </View>


                <View style={styles.inputContainer}>
                <Sae
                    ref='FirstInput'
                    label={'Email Address'}
                    labelStyle={{
                        color: 'rgba(300,300,300,0.7)',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 15,}}
                    iconClass={Icon}
                    iconName={'md-mail'}
                    iconColor={'white'}
                    inputStyle={{
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
                    labelStyle={{
                        color: 'rgba(300,300,300,0.7)',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 15,}}
                    iconClass={Icon}
                    iconName={'md-lock'}
                    iconColor={'white'}
                    inputStyle={{
                        color: '#FFF',
                        fontStyle: 'normal',
                        fontFamily: 'Helvetica',
                        fontSize: 18,}}
                    // TextInput props
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    secureTextEntry
                    returnKeyType="next"
                    value={this.props.password}
                    onChangeText={this.onPasswordChange.bind(this)}
                    onSubmitEditing={(event) => {
                        this.onButtonPress()
                    }}
                />
                </View>






                <Text style={styles.errorTextStyle}>
                    {this.props.error}
                </Text>
                <Text style={styles.errorTextStyle}>
                    {this.state.confirmPasswordError}
                </Text>

                <View >
                    {this.renderButton()}
                </View>


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
        backgroundColor: 'rgba(1,170,170,1)',
        padding: 20,
        paddingTop: 80
    },

    input: {
        height: 40,
        backgroundColor: 'rgba(170,170,170,0.7)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10
    },


    buttonContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: -10,
        marginBottom:5,
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 10,
        borderColor: '#FFF',
        backgroundColor: '#fff'
    },

    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    },

    formContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
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


};

const mapStateToProps = ({ auth }) => {
    const { email, password, username, error } = auth;

    return { email, password, username, error};
};

export default connect(mapStateToProps, { emailChanged, passwordChanged, loginUser, createUser, usernameChanged })(CreateAccount);