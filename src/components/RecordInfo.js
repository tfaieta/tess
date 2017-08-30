import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet,StatusBar, ScrollView, TouchableOpacity, Slider} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions } from 'react-native-router-flux';
import { volume } from './Home';
import Sound from 'react-native-sound';
import PlayerBottom from './PlayerBottom';
import {podFile, podTime} from './Record';
import Variables from './Variables';
import {PodcastFile} from './Variables';




class RecordInfo extends Component{

    state = {
        totalTime: PodcastFile.getDuration(),
        title: Variables.state.podcastTitle,
        description: Variables.state.podcastDescription,
    };


    Cancel = () => {
        Actions.pop();
    };


    Upload = () => {
        Variables.setPodcastFile(podFile);
        Variables.state.podcastTitle = this.state.title;
        Variables.state.podcastDescription = this.state.description;
        Actions.RecordSuccess();
    };


    preview = () =>  {
        Variables.setPodcastFile(podFile);
        Variables.state.podcastTitle = this.state.title;
        Variables.state.podcastDescription = this.state.description;

        setTimeout(() => {
            var sound = new Sound(podFile, '', (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
            });

            setTimeout(() => {
                sound.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');

                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            }, 100);
        }, 100);

    };

    _renderTime(){
        var num = (PodcastFile.getDuration() / 60).toString();
        num = num.slice(0,1);
        Number(num);
        var num2 = (PodcastFile.getDuration() % 60).toString();
        num2 = num2.slice(0,2);
        Number(num2);
        if(PodcastFile.getDuration() < 10){
            return (
                <Text style={styles.progressText}>{num2.slice(0,1)}s</Text>
            )
        }
        else if (PodcastFile.getDuration() < 60){
            return (
                <Text style={styles.progressText}>{num2}s</Text>
            )
        }
        else {
            return(
                <Text style={styles.progressText}>{num}m {num2}s</Text>
            )
        }
    }



    render() {
        return (
            <View
                style={styles.container}>

                <TextInput
                    style ={styles.input}
                    placeholder = "Podcast Title"
                    placeholderTextColor='#FFF'
                    returnKeyType='next'
                    label="Title"
                    value={this.state.title}
                    onChangeText={title => this.setState({ title })}
                />



                <TextInput
                    style ={styles.input2}
                    placeholder = "Podcast Description"
                    placeholderTextColor='#FFF'
                    returnKeyType='done'
                    label="Description"
                    value={this.state.description}
                    onChangeText={description => this.setState({ description })}
                />

                <View style={styles.timeContainer}>
                    {this._renderTime()}
                </View>


                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonPreview}  onPress={this.preview}>
                    <Icon style={{textAlign:'center', marginTop: 5, fontSize: 35,color:'#804cc8' }} name="ios-play">
                    <Text  style={styles.contentTitle}> Preview</Text>
                    </Icon>
                </TouchableOpacity>




                <TouchableOpacity style={styles.buttonUpload} onPress={this.Upload}>
                <Text  style={styles.contentTitle}>Upload</Text>
                </TouchableOpacity>



                <TouchableOpacity style={styles.buttonCancel} onPress={this.Cancel}>
                    <Text  style={styles.contentTitle}>Cancel</Text>
                </TouchableOpacity>
                </View>





                <PlayerBottom/>

            </View>




        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#804cc8',
        paddingTop: 80,
    },

    title: {
        color: '#804cc8',
        marginTop: 70,
        flex:1,
        textAlign: 'center',
        opacity: 2,
        fontStyle: 'normal',
        fontFamily: 'Futura',
        fontSize: 25,
        backgroundColor: 'transparent'
    },

    contentTitle: {
        color: '#FFF',
        fontSize: 25,
        paddingBottom: 20,
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Futura',

    },

    input: {
        height: 40,
        backgroundColor: 'rgba(170,170,170,0.4)',
        marginBottom: 10,
        color: '#FFF',
        paddingHorizontal: 10,
    },

    input2: {
        height: 120,
        backgroundColor: 'rgba(170,170,170,0.4)',
        marginBottom: 10,
        color:'#FFF',
        paddingHorizontal: 10,
    },

    buttonPreview: {
        backgroundColor: '#e8952f',
        alignItems: 'center',
        paddingBottom: 15,
    },

    buttonUpload: {
        backgroundColor: '#657ed4',
        alignItems: 'center',
        paddingTop: 15,
    },

    buttonCancel: {
        backgroundColor: '#69bbd9',
        alignItems: 'center',
        paddingTop: 15,
    },

    buttonContainer: {
        marginTop: 50,
    },

    timeContainer: {
        alignItems: 'center',
        marginTop: 20,
    },

    progressText: {
        marginTop: 0,
        fontSize: 20,
        fontFamily: 'Futura',
        color: "#FFF",
    },

});

export default RecordInfo;