import React, { Component } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Platform, TouchableOpacity} from 'react-native';
import Variables from "./Variables";

var {height, width} = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';

class InterestList extends Component{

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <View>
                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('news')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#06beb6', '#48b1bf']} style={styles.linearGradient}>
                            <Text style={styles.text}>news</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('business')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#0f2027', '#2c5364']} style={styles.linearGradient}>
                            <Text style={styles.text}>business</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('inspo')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#f953c6', '#b91d73']} style={styles.linearGradient}>
                            <Text style={styles.text}>inspo</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('learning')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#00b4db', '#0083b0']} style={styles.linearGradient}>
                            <Text style={styles.text}>learning</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('comedy')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#11998e', '#38ef7d']} style={styles.linearGradient}>
                            <Text style={styles.text}>comedy</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('health')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#7f00ff', '#e100ff']} style={styles.linearGradient}>
                            <Text style={styles.text}>health</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('spiritual')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#396afc', '#2948ff']} style={styles.linearGradient}>
                            <Text style={styles.text}>spiritual</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('philosophy')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#f2994a', '#f2c94c']} style={styles.linearGradient}>
                            <Text style={styles.text}>philosophy</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('sports')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#41295a', '#2f0743']} style={styles.linearGradient}>
                            <Text style={styles.text}>sports</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('tech')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#00c6ff', '#0072ff']} style={styles.linearGradient}>
                            <Text style={styles.text}>tech</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('travel')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#f2709c', '#ff9472']} style={styles.linearGradient}>
                            <Text style={styles.text}>travel</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('music')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#606c88', '#0072ff']} style={styles.linearGradient}>
                            <Text style={styles.text}>music</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row', marginHorizontal: width/20}}>
                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('science')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#4e54c8', '#8f94fb']} style={styles.linearGradient}>
                            <Text style={styles.text}>science</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.smallContainer} onPress={() => {
                        Variables.state.interest.push('gaming')
                    }}>
                        <LinearGradient  start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#ec008c', '#fc6767']} style={styles.linearGradient}>
                            <Text style={styles.text}>gaming</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    smallContainer:{
        flex: 1,
        backgroundColor: 'transparent',
        paddingVertical: height/70,
        paddingHorizontal: width/50,
        borderRadius: height/120
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold',
        fontSize: width/18,
    },
    linearGradient: {
        flex: 1,
        paddingHorizontal: width/25,
        paddingVertical: height/44.47,
        borderRadius: width/75
    },
});


export default InterestList;
