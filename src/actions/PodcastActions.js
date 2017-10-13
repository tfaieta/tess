import React, { Component  } from 'react';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import RNFetchBlob from 'react-native-fetch-blob';
import {AudioUtils} from 'react-native-audio';
import {
    PODCAST_UPDATE,
    PODCAST_CREATE,
    PODCAST_FETCH_SUCCESS, PODCAST_FETCH_SUCCESS_NEW
} from './types';

let podFile = AudioUtils.DocumentDirectoryPath + '/test.aac';


export const podcastUpdate = ({prop, value}) => {
    return {
        type: PODCAST_UPDATE,
        payload: {prop, value}
    };
};

export const podcastCreate = ({ podcastTitle, podcastDescription, podcastCategory, podcastArtist }) => {
    const {currentUser} = firebase.auth();
    const {user} = currentUser.uid;
    this.state = {
        loading: false,
        dp: null
    };

    return (dispatch) => {


        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        const uid = firebase.auth().uid;
        const podcastPath = podFile;
        let uploadBlob = null;
        const podcastRef = firebase.storage().ref(`/users/${currentUser.uid}/${podcastTitle}`);
        let mime = 'audio/aac';

        fs.readFile(podcastPath, 'base64')
            .then((data) => {
                return Blob.build(data, {type: `${mime};BASE64`})
            })
            .then((blob) => {
                uploadBlob = blob;
                return podcastRef.put(blob, {contentType: mime})
            })
            .then(() => {
                uploadBlob.close();
                return podcastRef.getDownloadURL()
            })
            .then((url) => {
                let obj = {};
                obj["loading"] = false;
                obj["dp"] = url;
                this.setState(obj);
            })
            .catch((error) => {
                console.log(error)
            });


        let userID = currentUser.uid;
        let likes = 0;


        firebase.database().ref(`/users/${currentUser.uid}/podcast`)
            .push({podcastTitle, podcastDescription, podcastCategory, podcastArtist, likes })
            .then(() => {
                dispatch({type: PODCAST_CREATE});


                    firebase.database().ref(`/podcasts`)
                        .push({podcastTitle, podcastDescription, podcastCategory, podcastArtist, likes})
                        .then(() => {
                            Actions.RecordSuccess();
                        });




            });

    }
};



export const podcastFetch = () => {
    const { currentUser } = firebase.auth();

    return (dispatch) => {
        firebase.database().ref(`/users/${currentUser.uid}/podcast`)
            .on('value', snapshot => {
                dispatch({ type: PODCAST_FETCH_SUCCESS, payload: snapshot.val() });
            });
    };
};


export const podcastFetchNew = () => {

    return (dispatch) => {
        firebase.database().ref('/podcasts')
            .on('value', snapshot => {
                dispatch({ type: PODCAST_FETCH_SUCCESS_NEW, payload: snapshot.val() });
            });
    };
};


export const podcastFetchUser = (podcastArtist) => {

    return (dispatch) => {
        firebase.database().ref(`/users/${podcastArtist}/podcast`)
            .on('value', snapshot => {
                dispatch({ type: PODCAST_FETCH_SUCCESS_NEW, payload: snapshot.val() });
            });
    };
};