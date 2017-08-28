import React, { Component } from 'react';
import Sound from 'react-native-sound';
import {podFile, podTime} from './Record';


export var PodcastFile = new Sound(podFile, '', (error) => {
    if (error) {
        console.log('failed to load the sound', error);
        return;
    }
});



class Variables extends Component{
    constructor() {
        super();
        this.tick = this.tick.bind(this);
        this.play=this.play.bind(this);
    }
    static state = {
        isPlaying: false,
        podProgress: 0,
        currentTime: 0,
        interval: null,
        podcastTitle: '',
        podcastDescription: '',
};


    static tick() {
        PodcastFile.getCurrentTime((seconds) => {
            Variables.state.currentTime = seconds;
        })
    }

    static setPodcastFile(podFile){
        PodcastFile = new Sound(podFile, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
        });
    }


    componentWillMount()   {

        PodcastFile = new Sound(podFile, '', (error) => {


            if (error) {
                console.log('failed to load the sound', error);
            }
        });


    }


    componentWillUnmount() {

    }


    static play()   {

        Variables.state.isPlaying = true;
        Variables.state.interval = setInterval(this.tick, 500);
        PodcastFile.play();


    };


    static pause()   {

        Variables.state.isPlaying = false;
        Variables.state.interval = clearInterval(Variables.state.interval);
        PodcastFile.pause();


    };


}

export default Variables;

