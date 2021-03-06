import React, { Component } from 'react';
import { Text, View, LayoutAnimation, TouchableOpacity, Alert, Image, Dimensions, AsyncStorage, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import Variables from "./Variables";
var Analytics = require('react-native-firebase-analytics');

var {height, width} = Dimensions.get('window');




// A single podcast on a list

class ListItem extends Component {

    componentWillMount(){
        const {podcastArtist} = this.props.podcast;
        const {rss} = this.props.podcast;
        let profileImage = '';

        if(rss){
            firebase.database().ref(`users/${podcastArtist}/profileImage`).once("value", function (snapshot) {
                if(snapshot.val()){
                    profileImage = snapshot.val().profileImage
                }
            });
            this.timeout = setTimeout(() => {this.setState({profileImage: profileImage})},1200);
            this.timeout2 = setTimeout(() => {this.setState({profileImage: profileImage})},3400);

        }
        else{
            const storageRef = firebase.storage().ref(`/users/${podcastArtist}/image-profile-uploaded`);
            storageRef.getDownloadURL()
                .then(function(url) {
                    profileImage = url;
                }).catch(function(error) {
                //
            });
            this.timeout = setTimeout(() => {this.setState({profileImage: profileImage})},1200);
            this.timeout2 = setTimeout(() => {this.setState({profileImage: profileImage})},3400);

        }


    }


    componentWillUnmount(){
        clearTimeout(this.timeout);
        clearTimeout(this.timeout2);
    }


    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            profileImage: '',
            username: '',
        };

        const {podcastArtist} = this.props.podcast;
        const {podcastTitle} = this.props.podcast;

        let profileName = '';
        firebase.database().ref(`/users/${podcastArtist}/username`).orderByChild("username").once("value", function (snap) {
            if (snap.val()) {
                profileName = snap.val().username;
            }
            else {
                profileName = podcastArtist;
            }
        });

        setTimeout(() => {
            this.setState({username: profileName});
            this.setState({title: podcastTitle});
        }, 300);

        setTimeout(() => {
            this.setState({username: profileName, loading: false});
            this.setState({title: podcastTitle});
        }, 1000);



    }

    state = {
        favorite: false,
        keyID: 0,
    };


    componentWillUpdate() {
        LayoutAnimation.spring();
    }


    _renderProfileImage(){

        if (this.state.profileImage == ''){
            return(
                <View style={{backgroundColor:'rgba(130,131,147,0.4)', marginLeft: width/37.5, alignSelf: 'center', height: width/7.5, width: width/7.5, borderRadius: 4, borderWidth: 0.1, borderColor:'rgba(320,320,320,0.8)'}}>
                    <Icon style={{
                        textAlign: 'center',
                        fontSize: width/10.71,
                        marginTop: height/83.38,
                        color: 'white',
                    }} name="md-person">
                    </Icon>
                </View>
            )
        }
        else{
            return(
                <View style={{backgroundColor:'transparent', alignSelf: 'center', marginLeft: width/37.5, height: width/7.5, width: width/7.5}}>
                    <Image
                        style={{width: width/7.5, height: width/7.5, position: 'absolute', alignSelf: 'center', opacity: 1, borderRadius: 4, borderWidth: 0.1, borderColor: 'transparent'}}
                        source={{uri: this.state.profileImage}}
                    />
                </View>
            )
        }
    }


    onGarbagePress(){
        Alert.alert(
            'Are you sure you want to delete?',
            '',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Yes', onPress: () => console.warn('delete')
                },
            ],
            { cancelable: false }
        )
    }



    renderItem = () => {
        if(this.state.loading){
            return (

                <View>
                    <View style={styles.container}>

                        <View style={{backgroundColor:'rgba(130,131,147,0.2)', marginLeft: 10, alignSelf: 'center', height: width/7.5, width: width/7.5, borderRadius: 4, borderWidth: 0.1, borderColor:'rgba(320,320,320,0.8)'}}>
                            <Icon style={{
                                textAlign: 'center',
                                fontSize: width/10.71,
                                marginTop: width/46.88,
                                color: 'white',
                            }} name="md-person">
                            </Icon>
                        </View>

                        <View style={styles.leftContainer}>
                            <View style={{backgroundColor: '#82839320', paddingVertical: height/95.3, marginVertical: height/333.5, marginHorizontal: width/37.5, paddingHorizontal: width/3, borderRadius: width/18.75}}/>
                            <View style={{backgroundColor: '#82839320', paddingVertical: height/95.3, marginVertical: height/333.5, marginHorizontal: width/37.5, paddingHorizontal: width/3, borderRadius: width/18.75}}/>
                        </View>

                    </View>
                </View>

            );
        }
        else{
            return (

                <TouchableHighlight underlayColor = '#f5f4f9' onPress={() =>  {

                    const {podcastArtist} = this.props.podcast;
                    const {podcastTitle} = this.props.podcast;
                    const {podcastDescription} = this.props.podcast;
                    const {podcastCategory} = this.props.podcast;
                    const {id} = this.props.podcast;
                    const {rss} = this.props.podcast;
                    const {podcastURL} = this.props.podcast;
                    const {currentUser} = firebase.auth();
                    const user = currentUser.uid;
                    const {podcast} = this.props;
                    Variables.state.highlight = false;


                    Analytics.logEvent('play', {
                        'episodeID': id,
                        'epispdeTitle': podcastTitle,
                        'episodeArtist': podcastArtist,
                        'user_id': user
                    });


                    firebase.database().ref(`users/${currentUser.uid}/tracking/${podcastArtist}/episodes/${id}`).remove();


                    if(rss){

                        AsyncStorage.setItem("currentPodcast", id);
                        AsyncStorage.setItem("currentTime", "0");
                        Variables.state.seekTo = 0;
                        Variables.state.currentTime = 0;


                        firebase.database().ref(`/users/${podcastArtist}/username`).orderByChild("username").on("value", function(snap) {
                            if(snap.val()){
                                Variables.state.currentUsername = snap.val().username;
                            }
                            else {
                                Variables.state.currentUsername = podcastArtist;
                            }
                        });

                        firebase.database().ref(`podcasts/${id}/likes`).on("value", function (snap) {
                            Variables.state.likers = [];
                            Variables.state.liked = false;
                            snap.forEach(function (data) {
                                if (data.val()) {
                                    if(data.val().user == currentUser.uid){
                                        Variables.state.liked = true;
                                    }
                                    Variables.state.likers.push(data.val());
                                }
                            });
                        });


                        firebase.database().ref(`podcasts/${id}/plays`).on("value", function (snap) {
                            Variables.state.podcastsPlays = 0;
                            snap.forEach(function (data) {
                                if (data.val()) {
                                    Variables.state.podcastsPlays++;
                                }
                            });
                        });


                        firebase.database().ref(`podcasts/${id}/plays`).child(user).update({user});



                        firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/`).once("value", function (snap) {
                            snap.forEach(function (data) {
                                if(data.val().id == id){
                                    firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/${data.key}`).remove()
                                }
                            });
                            firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/`).push({id});
                        });


                        Variables.pause();
                        Variables.setPodcastFile(podcastURL);
                        Variables.state.isPlaying = false;
                        Variables.state.podcastTitle = podcastTitle;
                        Variables.state.podcastArtist = podcastArtist;
                        Variables.state.podcastCategory = podcastCategory;
                        Variables.state.podcastDescription = podcastDescription;
                        Variables.state.podcastID = id;
                        Variables.state.favorited = false;
                        Variables.state.userProfileImage = '';
                        Variables.play();
                        Variables.state.isPlaying = true;
                        Variables.state.rss = true;


                        firebase.database().ref(`users/${podcastArtist}/profileImage`).once("value", function (snapshot) {
                            if(snapshot.val()){
                                Variables.state.userProfileImage = snapshot.val().profileImage
                            }
                        });


                        firebase.database().ref(`users/${currentUser.uid}/favorites`).on("value", function (snapshot) {
                            snapshot.forEach(function (data) {
                                if(data.key == id){
                                    Variables.state.favorited = true;
                                }
                            })
                        })



                    }
                    else{
                        if(id){
                            AsyncStorage.setItem("currentPodcast", id);
                            AsyncStorage.setItem("currentTime", "0");

                            firebase.storage().ref(`/users/${podcastArtist}/${id}`).getDownloadURL().catch(() => {console.warn("file not found")})
                                .then(function(url) {


                                    firebase.database().ref(`/users/${podcastArtist}/username`).orderByChild("username").on("value", function(snap) {
                                        if(snap.val()){
                                            Variables.state.currentUsername = snap.val().username;
                                        }
                                        else {
                                            Variables.state.currentUsername = podcastArtist;
                                        }
                                    });

                                    firebase.database().ref(`podcasts/${id}/likes`).on("value", function (snap) {
                                        Variables.state.likers = [];
                                        Variables.state.liked = false;
                                        snap.forEach(function (data) {
                                            if (data.val()) {
                                                if(data.val().user == currentUser.uid){
                                                    Variables.state.liked = true;
                                                }
                                                Variables.state.likers.push(data.val());
                                            }
                                        });
                                    });


                                    firebase.database().ref(`podcasts/${id}/plays`).on("value", function (snap) {
                                        Variables.state.podcastsPlays = 0;
                                        snap.forEach(function (data) {
                                            if (data.val()) {
                                                Variables.state.podcastsPlays++;
                                            }
                                        });
                                    });


                                    firebase.database().ref(`podcasts/${id}/plays`).child(user).update({user});



                                    firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/`).once("value", function (snap) {
                                        snap.forEach(function (data) {
                                            if(data.val().id == id){
                                                firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/${data.key}`).remove()
                                            }
                                        });
                                        firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed/`).push({id});
                                    });


                                    Variables.pause();
                                    Variables.setPodcastFile(url);
                                    Variables.state.isPlaying = false;
                                    Variables.state.podcastTitle = podcastTitle;
                                    Variables.state.podcastArtist = podcastArtist;
                                    Variables.state.podcastCategory = podcastCategory;
                                    Variables.state.podcastDescription = podcastDescription;
                                    Variables.state.podcastID = id;
                                    Variables.state.favorited = false;
                                    Variables.state.userProfileImage = '';
                                    Variables.play();
                                    Variables.state.isPlaying = true;
                                    Variables.state.rss = false;

                                    const storageRef = firebase.storage().ref(`/users/${Variables.state.podcastArtist}/image-profile-uploaded`);
                                    if(storageRef.child('image-profile-uploaded')){
                                        storageRef.getDownloadURL()
                                            .then(function(url) {
                                                if(url){
                                                    Variables.state.userProfileImage = url;
                                                }
                                            }).catch(function(error) {
                                            //
                                        });
                                    }

                                    firebase.database().ref(`users/${currentUser.uid}/favorites`).on("value", function (snapshot) {
                                        snapshot.forEach(function (data) {
                                            if(data.key == id){
                                                Variables.state.favorited = true;
                                            }
                                        })
                                    })


                                });
                        }
                        else{
                            firebase.storage().ref(`/users/${podcastArtist}/${podcastTitle}`).getDownloadURL().catch(() => {console.warn("file not found")})
                                .then(function(url) {


                                    firebase.database().ref(`/users/${podcastArtist}/username`).orderByChild("username").on("value", function(snap) {
                                        if(snap.val()){
                                            Variables.state.currentUsername = snap.val().username;
                                        }
                                        else {
                                            Variables.state.currentUsername = podcastArtist;
                                        }
                                    });

                                    Variables.pause();
                                    Variables.setPodcastFile(url);
                                    Variables.state.isPlaying = false;
                                    Variables.state.podcastTitle = podcastTitle;
                                    Variables.state.podcastArtist = podcastArtist;
                                    Variables.state.podcastCategory = podcastCategory;
                                    Variables.state.podcastDescription = podcastDescription;
                                    Variables.state.podcastID = '';
                                    Variables.state.liked = false;
                                    Variables.state.favorited = false;
                                    Variables.state.likers = [];
                                    Variables.state.userProfileImage = '';
                                    Variables.play();
                                    Variables.state.isPlaying = true;
                                    Variables.state.rss = false;

                                    const storageRef = firebase.storage().ref(`/users/${Variables.state.podcastArtist}/image-profile-uploaded`);
                                    if(storageRef.child('image-profile-uploaded')){
                                        storageRef.getDownloadURL()
                                            .then(function(url) {
                                                if(url){
                                                    Variables.state.userProfileImage = url;
                                                }
                                            }).catch(function(error) {
                                            //
                                        });
                                    }


                                });
                        }

                    }



                }} onLongPress={() => {
                    const {currentUser} = firebase.auth();
                    const {podcast} = this.props;
                    const rowData = podcast;

                    const {navigator} = this.props;

                    this.props.navigator.showLightBox({
                        screen: "PodcastOptions",
                        passProps: {rowData, navigator},
                        style: {
                            backgroundBlur: "dark",
                            backgroundColor: '#3e416430',
                            tapBackgroundToDismiss: true,
                            width: 100,
                            height: 200
                        },
                    });
                }}>
                    <View style={styles.container}>

                        {this._renderProfileImage()}

                        <View style={styles.leftContainer}>
                            <Text style={styles.title}>{this.state.title}</Text>
                            <Text style={styles.artistTitle}>{this.state.username}</Text>
                        </View>


                        <TouchableOpacity onPress={() => {
                            const {currentUser} = firebase.auth();
                            const {podcast} = this.props;
                            const rowData = podcast;

                            const {navigator} = this.props;

                            this.props.navigator.showLightBox({
                                screen: "PodcastOptions",
                                passProps: {rowData, navigator},
                                style: {
                                    backgroundBlur: "dark",
                                    backgroundColor: '#3e416430',
                                    tapBackgroundToDismiss: true,
                                    width: 100,
                                    height: 200
                                },
                            });

                        }} style={styles.rightContainer}>
                            <Icon style={{
                                textAlign: 'left',
                                marginLeft: 0,
                                marginRight: height/44.47,
                                fontSize: height/22.23,
                                color: '#506dcf',
                            }} name="ios-more">
                            </Icon>
                        </TouchableOpacity>


                    </View>
                </TouchableHighlight>

            );
        }

    };


    render() {

        return(
            <View>
                {this.renderItem()}
            </View>
        )

    }


}

const styles = {
    title: {
        color: '#3e4164',
        marginTop: 0,
        flex:1,
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 15,
        
        marginHorizontal: 20,

    },
    artistTitle: {
        color: '#828393',
        marginTop: 0,
        flex:1,
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        
        marginLeft: 20,
    },
    container: {
        paddingHorizontal: 0,
        paddingVertical: 10,
        marginVertical: 1,
        marginHorizontal: 0,
        backgroundColor: '#FFF',
        opacity: 1,
        borderColor: '#FFF',
        borderWidth: 0.5,
        borderRadius: 0,
        borderStyle: 'solid',
        flexDirection: 'row',
    },
    centerContainer: {
        flexDirection: 'row'
    },
    leftContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems:'flex-start',
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',

    },
    middleContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
        marginHorizontal: -100,
    },
};




export default ListItem;
