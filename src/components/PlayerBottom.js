import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet,StatusBar, ScrollView, Modal, TouchableOpacity, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Variables from './Variables';
import {podcastPlayer} from './Variables';
import Slider from 'react-native-slider';
import firebase from 'firebase';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import MusicControl from 'react-native-music-control';

import { Navigation } from 'react-native-navigation';



class PlayerBottom extends Component {
    constructor() {
        super();
        this.tick = this.tick.bind(this);
        this.play=this.play.bind(this);

        setInterval(() => {
            this.setState({profileImage: Variables.state.userProfileImage});
        },500);
    }

    state = {
        isPlaying: true,
        podProgress: Variables.state.podProgress,
        currentTime: Variables.state.currentTime,
        interval: Variables.state.interval,
        podcastTitle: Variables.state.podcastTitle,
        podcastDescription: Variables.state.podcastDescription,
        comment: '',
        modalVisible: false,
        liked: false,
        likes: 12,
        profileImage: '',
    };

    componentDidMount() {
        MusicControl.enableBackgroundMode(true);

        MusicControl.handleAudioInterruptions(true);

        MusicControl.on('play', ()=> {
            this.play();
        });

        MusicControl.on('pause', ()=> {
            this.pause();
        });

        MusicControl.on('skipForward', ()=> {

            MusicControl.updatePlayback({
                elapsedTime: (podcastPlayer.currentTime + 15000)/1000,
            });
            podcastPlayer.seek(podcastPlayer.currentTime + 15000);
        });

        MusicControl.on('skipBackward', ()=> {

            MusicControl.updatePlayback({
                elapsedTime: (podcastPlayer.currentTime - 15000)/1000,
            });
            podcastPlayer.seek(podcastPlayer.currentTime - 15000);

        });

    }



    componentWillMount(){
        if(this.state.isPlaying){
            this.setState({
                interval: setInterval(this.tick, 250)
            });
        }
        else {
            this.setState({
                interval: clearInterval(this.state.interval)
            });
            Variables.pause();
        }
    }

    componentWillUnmount() {
        this.setState({
            interval: clearInterval(this.state.interval)
        });
    }

    tick() {
        if(podcastPlayer.isPlaying){
            this.setState({ currentTime: podcastPlayer.currentTime})
        }
    }

    play = () =>  {
        this.setState({
            isPlaying: true,
            interval: setInterval(this.tick, 250)
        });

        MusicControl.updatePlayback({
            state: MusicControl.STATE_PLAYING,
            elapsedTime: podcastPlayer.currentTime/1000
        });

        Variables.play()

    };


    pause = () =>  {
        this.setState({
            isPlaying: false,
            interval: clearInterval(this.state.interval)
        });

        MusicControl.updatePlayback({
            state: MusicControl.STATE_PAUSED,
            elapsedTime: podcastPlayer.currentTime/1000
        });

       Variables.pause();

    };


    scrubForward = () => {
        podcastPlayer.seek(podcastPlayer.currentTime + 15000)

    };

    scrubBackward = () => {
        podcastPlayer.seek(podcastPlayer.currentTime - 15000)

    };


    _renderSlider(currentTime){
        return(
            <Slider
                minimumTrackTintColor='#5757FF'
                maximumTrackTintColor='#E7E7F0'
                thumbTintColor='#5757FF'
                thumbTouchSize={{width: 20, height: 20}}
                animateTransitions = {true}
                style={styles.sliderContainer}
                step={0}
                minimumValue={0}
                maximumValue= { Math.abs( podcastPlayer.duration)}
                value={ currentTime }
                onValueChange={currentTime => podcastPlayer.seek(currentTime)}
            />
        )
    }

    _renderPodcastImage(){
        if(Variables.state.podcastTitle != ''){

                if (this.state.profileImage == ''){
                    return(
                        <TouchableOpacity onPress={this.ExpandPlayer}>
                            <View style={{backgroundColor:'rgba(130,131,147,0.4)', height: 45, width: 45, borderRadius:4, borderWidth:1, borderColor:'rgba(320,320,320,1)'}}>
                                <Icon style={{
                                    textAlign: 'center',
                                    fontSize: 24,
                                    color: 'white',
                                    marginTop: 10
                                }} name="md-person">
                                </Icon>
                            </View>
                        </TouchableOpacity>
                    )
                }
                else{
                    return(
                        <View style={{backgroundColor:'transparent', alignSelf: 'center', height: 45, width: 45  }}>
                            <Image
                                style={{width: 45, height:45, position: 'absolute', alignSelf: 'center', opacity: 1, borderRadius: 5, borderWidth: 0.1, borderColor: 'transparent'}}
                                source={{uri: Variables.state.userProfileImage}}
                            />
                        </View>
                    )
                }

        }
    }

    _renderPlayButton(isPlaying) {
        if(Variables.state.podcastTitle != ''){
            if (isPlaying) {
                return (
                    <TouchableOpacity onPress={this.pause}>
                        <Icon style={{
                            textAlign: 'right',
                            marginRight: 0,
                            marginLeft: 0,
                            paddingTop: 0,
                            paddingRight:5,
                            fontSize: 30,
                            color: '#fff',
                        }} name="md-pause">
                        </Icon>
                    </TouchableOpacity>
                );
            }
            else {
                return (
                    <TouchableOpacity onPress={this.play}>
                        <Icon style={{
                            textAlign: 'right',
                            marginRight: 0,
                            marginLeft: 0,
                            paddingTop: 0,
                            paddingRight:5,
                            fontSize: 30,
                            color: '#fff',
                        }} name="md-play">
                        </Icon>
                    </TouchableOpacity>
                );
            }
        }

    }



    _renderPodcastInfo(){
        let profileName = Variables.state.currentUsername;

        if(Variables.state.podcastTitle =='') {
            //return nothing
        }
        else{

            var fixedTitle = '';
            if(Variables.state.podcastTitle.toString().length > 18 ){
                fixedTitle = (Variables.state.podcastTitle.slice(0,18)+"...")
            }
            else{
                fixedTitle = Variables.state.podcastTitle;
            }

            var fixedUsername = '';
            if(profileName > 18){
                fixedUsername =  (profileName.slice(0,18)+"...");
            }
            else{
                fixedUsername = profileName;
            }



            return (
                <View style={{marginTop:4}}>
                    <Text style={styles.playingText}>{fixedTitle}</Text>
                    <Text style={styles.playingText2}>by {fixedUsername}</Text>
                </View>
            )
        }

}


    _renderFillBar(isPlaying){
        if(isPlaying) {
            return (
                <View style = {{
                    width: (Variables.state.currentTime / podcastPlayer.duration) * 340,
                    height: 6,
                    backgroundColor: 'rgba(170,170,170,0.7)',}}
                >
                </View>
            )
        }


    }


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }


    ExpandPlayer = () => {
        this.setModalVisible(true)
    };

    Close = () => {
        this.setModalVisible(!this.state.modalVisible)
    };




    _renderPlayButton2(isPlaying) {

        if (isPlaying) {
            return (
                <TouchableOpacity onPress={this.pause}>
                    <Icon style={{textAlign:'center', fontSize: 50, color:'#2A2A30' }}  name="ios-pause">
                    </Icon>
                </TouchableOpacity>
            );
        }
        else {
            return (
                <TouchableOpacity onPress={this.play}>
                    <Icon style={{textAlign:'center', fontSize: 50, color:'#2A2A30' }}  name="md-play">
                    </Icon>
                </TouchableOpacity>
            );
        }
    }


    _renderPodcastTitle(isPlaying) {
        if (isPlaying) {
            return (
                <Text style={styles.podcastText}>{Variables.state.podcastTitle}</Text>
            );
        }
        if (Variables.state.podcastTitle =='') {
            return (
                <Text style={styles.podcastText}> </Text>
            );
        }
        else{
            return (
                <Text style={styles.podcastText}>{Variables.state.podcastTitle}</Text>
            );
        }
    }



    _renderPodcastImageBig(){
        if(Variables.state.podcastTitle != ''){

            if (this.state.profileImage == ''){
                return(
                    <View style={{backgroundColor:'rgba(130,131,147,0.4)', alignSelf: 'center', marginBottom: 10, height: 140, width: 140, borderRadius:10, borderWidth:8, borderColor:'rgba(320,320,320,0.8)',  shadowOffset:{  width: 0,  height: 10}, shadowOpacity: 0.5, shadowRadius: 10,  }}>
                        <Icon style={{
                            textAlign: 'center',
                            fontSize: 90,
                            color: 'white',
                            marginTop: 20,
                        }} name="md-person">
                        </Icon>
                    </View>
                )
            }
            else{
                return(
                    <View style={{backgroundColor:'transparent', alignSelf: 'center', marginBottom: 10, height: 140, width: 140,  shadowOffset:{  width: 0,  height: 10}, shadowOpacity: 0.5, shadowRadius: 10,  }}>
                        <Image
                            style={{width: 140, height:140,  alignSelf: 'center', opacity: 1, borderRadius: 10, borderWidth: 0.1, borderColor: 'transparent'}}
                            source={{uri: this.state.profileImage}}
                        />
                    </View>
                )
            }

        }
    }



    _renderDescription(){
        if (Variables.state.podcastTitle == ''){
            return(
                <View style={{ marginTop: 10}}>
                <ScrollView style={{height: 70, marginHorizontal: 20, backgroundColor: '#c1cde0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth:0.1,}} showsVerticalScrollIndicator= {false} showsHorizontalScrollIndicator= {false}>
                    <Text style={{ color:'#fff', fontSize: 16, paddingBottom: 15, fontFamily: 'HiraginoSans-W6', textAlign: 'center'  }}>Select a Podcast to start listening....</Text>
                </ScrollView>
                </View>
            )
        }
        else{
            return(
                <View style={{ marginTop: 10}}>
                <ScrollView style={{height: 70, marginHorizontal: 20, backgroundColor:'#c1cde0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth:0.1}} showsVerticalScrollIndicator= {false} showsHorizontalScrollIndicator= {false}>
                    <Text style={{ color:'#fff', fontSize: 16, paddingBottom: 15, fontFamily: 'HiraginoSans-W6' }}>{Variables.state.podcastDescription}</Text>
                </ScrollView>
                </View>
            )
        }
    }

    _renderCategory(){

        return(
            <TouchableOpacity onPress={this.onCategoryPress}>
                <Text style={styles.podcastTextCat}>{Variables.state.podcastCategory}</Text>
            </TouchableOpacity>
        );

    }


    _renderPodcastArtist(isPlaying) {
        let profileName = Variables.state.currentUsername;
        if(Variables.state.podcastTitle == '') {
            return (
                <Text style={styles.podcastTextArtist}> </Text>
            );
        }
        else{
            return (
                <Text onPress = {this.onProfilePress} style={styles.podcastTextArtist}>by {profileName}</Text>
            );
        }

    }

    _renderFav(faved){
        if(Variables.state.podcastID){

            if(faved){
                return(
                    <TouchableOpacity>
                        <Icon style={{textAlign:'center', fontSize: 28,color: '#5757FF' }} name="md-add" onPress={()=>{
                            const {currentUser} = firebase.auth();
                            const podcastTitle = Variables.state.podcastTitle;
                            const podcastDescription = Variables.state.podcastDescription;
                            const podcastCategory = Variables.state.podcastCategory;
                            const podcastArtist = Variables.state.podcastArtist;
                            const id = Variables.state.podcastID;

                            if(podcastTitle != ''){
                                if(podcastArtist != currentUser.uid){
                                    if(id){

                                        Alert.alert(
                                            'Remove from favorites?',
                                            '',
                                            [
                                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                {
                                                    text: 'Yes', onPress: () => {
                                                    firebase.database().ref(`users/${currentUser.uid}/favorites/${id}`).remove();
                                                    Variables.state.favorited = false;
                                                }
                                                },
                                            ],
                                            {cancelable: false}
                                        )

                                    }
                                    else{

                                        Alert.alert(
                                            'Remove from favorites?',
                                            '',
                                            [
                                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                {
                                                    text: 'Yes', onPress: () => {
                                                    firebase.database().ref(`users/${currentUser.uid}/favorites/${podcastTitle}`).remove();
                                                    Variables.state.favorited = false;
                                                }
                                                },
                                            ],
                                            {cancelable: false}
                                        )

                                    }

                                }
                                else{
                                    Alert.alert(
                                        'Cannot favorite your own podcast',
                                        '',
                                        [
                                            {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},

                                        ],
                                        {cancelable: false}
                                    )
                                }
                            }

                        }}>
                        </Icon>
                    </TouchableOpacity>
                )
            }
            else{
                return(
                    <TouchableOpacity>
                        <Icon style={{textAlign:'center', fontSize: 28,color:'#BBBCCD' }} name="md-add" onPress={()=>{
                            const {currentUser} = firebase.auth();
                            const podcastTitle = Variables.state.podcastTitle;
                            const podcastDescription = Variables.state.podcastDescription;
                            const podcastCategory = Variables.state.podcastCategory;
                            const podcastArtist = Variables.state.podcastArtist;
                            const id = Variables.state.podcastID;

                            if(podcastTitle != ''){
                                if(podcastArtist != currentUser.uid){
                                    if(id){

                                        Alert.alert(
                                            'Add to favorites?',
                                            '',
                                            [
                                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                                {
                                                    text: 'Yes', onPress: () => {
                                                    firebase.database().ref(`users/${currentUser.uid}/favorites/`).child(id).update({id});
                                                    Variables.state.favorited = true;
                                                }
                                                },
                                            ],
                                            {cancelable: false}
                                        )

                                    }


                                }
                                else{
                                    Alert.alert(
                                        'Cannot favorite your own podcast',
                                        '',
                                        [
                                            {text: 'OK', onPress: () => console.log('OK Pressed'), style: 'cancel'},

                                        ],
                                        {cancelable: false}
                                    )
                                }
                            }

                        }}>
                        </Icon>
                    </TouchableOpacity>
                )
            }

        }

    }

    _renderLikes(likers, liked){

        if(Variables.state.podcastTitle == ''){
            return;
        }
        if(Variables.state.podcastID != ''){

            if (liked) {
                return (
                    <TouchableOpacity onPress = {this.pressLike}>
                        <Icon style={{textAlign: 'center', fontSize: 28, color: '#5757FF', marginRight: 25}} name="ios-happy-outline">
                        </Icon>
                    </TouchableOpacity>
                )
            }
            else{
                return(
                    <TouchableOpacity onPress = {this.pressLike}>
                        <Icon style={{textAlign: 'center', fontSize: 28, color: '#BBBCCD', marginRight: 25}} name="ios-happy-outline">
                        </Icon>
                    </TouchableOpacity>
                )
            }

        }

    }

    _renderComments(){
        if(Variables.state.podcastTitle == ''){
            return;
        }

        return(
            <View>
                <Text style={styles.podcastText}> comments </Text>


                <View style={{marginHorizontal: 20, marginBottom: 2, backgroundColor: '#6e89e7', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10}}>
                    <Icon style={{textAlign:'center', fontSize: 40, paddingHorizontal: 10, color:'#fff' }} name="md-contact">
                        <Text style={styles.podcastText}> nice! </Text>
                    </Icon>
                </View>

                <View style={{marginHorizontal: 20, marginBottom: 2, backgroundColor: '#6e89e7', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10}}>
                    <Icon style={{textAlign:'center', fontSize: 40, paddingHorizontal: 10, color:'#fff' }} name="md-contact">
                        <Text style={styles.podcastText}> i love you </Text>
                    </Icon>
                </View>

                <View style={{marginHorizontal: 20, marginBottom: 2, backgroundColor: '#6e89e7', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10}}>
                    <TextInput style={styles.input}
                               placeholder = "write a comment..."
                               placeholderTextColor='#FFF'
                               returnKeyType='send'
                               multiline={true}
                               onChangeText={text => this.setState({ comment: text})}
                               onSubmitEditing={() => this.onCommentSubmit()}

                    />
                </View>
            </View>

        )


    }


    _renderEndTime() {

        var num = ((podcastPlayer.duration / 1000) % 60).toString();
        var num2 = ((podcastPlayer.duration / 1000) / 60).toString();
        var minutes = num2.slice(0,1);
        Number(minutes.slice(0,1));


        if (Variables.state.podcastTitle == '') {
            return (
                <Text style={styles.podcastTextNum}></Text>
            );
        }
        else if(Number(num2) < 10){
            var minutes = num2.slice(0,1);
            Number(minutes.slice(0,1));
            if(Number(num) < 10){
                var seconds = num.slice(0,1);
                Number(seconds.slice(0,1));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:0{seconds}</Text>
                )
            }
            else{
                var seconds = num.slice(0,2);
                Number(seconds.slice(0,2));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:{seconds}</Text>
                );
            }
        }
        else if(Number(num2) < 100){
            var minutes = num2.slice(0,2);
            Number(minutes.slice(0,2));
            if(Number(num) < 10){
                var seconds = num.slice(0,1);
                Number(seconds.slice(0,1));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:0{seconds}</Text>
                )
            }
            else{
                var seconds = num.slice(0,2);
                Number(seconds.slice(0,2));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:{seconds}</Text>
                );
            }
        }
        else{
            var minutes = num2.slice(0,3);
            Number(minutes.slice(0,3));
            if(Number(num) < 10){
                var seconds = num.slice(0,1);
                Number(seconds.slice(0,1));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:0{seconds}</Text>
                )
            }
            else{
                var seconds = num.slice(0,2);
                Number(seconds.slice(0,2));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:{seconds}</Text>
                );
            }
        }

    }

    _renderCurrentTime() {

        var num = ((Variables.state.currentTime / 1000) % 60).toString();
        var num2 = ((Variables.state.currentTime / 1000) / 60).toString();
        var minutes = num2.slice(0,1);
        Number(minutes.slice(0,1));


        if (Variables.state.podcastTitle == '') {
            return (
                <Text style={styles.podcastTextNum}></Text>
            );
        }
        else if (Variables.state.currentTime == -1){
            return (
                <Text style={styles.podcastTextNum}>0:00</Text>
            )
        }
        else if(Number(num2) < 10){
            var minutes = num2.slice(0,1);
            Number(minutes.slice(0,1));
            if(Number(num) < 10){
                var seconds = num.slice(0,1);
                Number(seconds.slice(0,1));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:0{seconds}</Text>
                )
            }
            else{
                var seconds = num.slice(0,2);
                Number(seconds.slice(0,2));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:{seconds}</Text>
                );
            }
        }
        else{
            var minutes = num2.slice(0,2);
            Number(minutes.slice(0,2));
            if(Number(num) < 10){
                var seconds = num.slice(0,1);
                Number(seconds.slice(0,1));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:0{seconds}</Text>
                )
            }
            else{
                var seconds = num.slice(0,2);
                Number(seconds.slice(0,2));
                return (
                    <Text style={styles.podcastTextNum}>{minutes}:{seconds}</Text>
                );
            }
        }



    }


    onCommentSubmit(){
        const comment = this.state.comment;
        const currentUser = firebase.auth().uid;
        firebase.database().ref(`${Variables.state.currentRef}/comments`).push(comment, currentUser);
        this.state.comment = '';
    }

    onProfilePress = () => {
        const {navigator} = this.props;
        Variables.state.browsingArtist = Variables.state.podcastArtist;
        Navigation.showModal({
            screen: 'UserProfileModal',
            animated: true,
            animationType: 'fade',
            passProps: {navigator},
        });
    };

    pressLike = () => {
        const {currentUser} = firebase.auth();
        const user = currentUser.uid;

        if(Variables.state.podcastID != ''){

            if(Variables.state.liked){

                firebase.database().ref(`podcasts/${Variables.state.podcastID}/likes/${user}`).remove();

                this.setState({ liked: false, likes: Variables.state.likers.length})
            }
            else if (!Variables.state.liked){

                firebase.database().ref(`podcasts/${Variables.state.podcastID}/likes`).child(user).update({user});


                this.setState({ liked: true, likes: Variables.state.likers.length})
            }

        }
    };


    onCategoryPress = () => {
        const {navigator} = this.props;

        if(Variables.state.podcastCategory == 'Fitness'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'News'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Gaming'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Society & Culture'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Sports'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Entertainment'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Comedy'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Learn Something'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Lifestyle'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Science & Nature'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Storytelling'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Tech'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Travel'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else if(Variables.state.podcastCategory == 'Music'){
            const category = Variables.state.podcastCategory;

            Navigation.showModal({
                screen: 'PopupCategory',
                passProps: {navigator, category},
            });
        }
        else console.warn("Category not yet supported");
    };


    onSwipeUp(gestureState) {
        this.setModalVisible(true)
    }

    onSwipeDown(gestureState) {
        this.setModalVisible(!this.state.modalVisible)
    }

    onSwipeDelete(gestureState) {
        Variables.state.podcastTitle = '';
        Variables.state.podcastCategory = '';
        Variables.state.podcastArtist = '';
        Variables.state.podcastDescription = '';
        Variables.state.podcastCategory = '';
        podcastPlayer.destroy();
        MusicControl.resetNowPlaying();
    }



    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };

        return (

            <View style={styles.barContainer}>


                <GestureRecognizer
                    onSwipeUp={(state) => this.onSwipeUp(state)}
                    onSwipeLeft={(state) => this.onSwipeDelete(state)}
                    onSwipeRight={(state) => this.onSwipeDelete(state)}
                    config={config}
                >

                    <TouchableOpacity style={styles.centerContainer} onPress={this.ExpandPlayer}>

                        <View style={styles.leftContainer}>
                            {this._renderPodcastImage()}
                        </View>

                        <View onPress={this.ExpandPlayer}>
                            {this._renderPodcastInfo()}
                        </View>

                        <View style={styles.rightContainer}>
                            <TouchableOpacity style={{marginRight: 10}}>
                                {this._renderPlayButton(Variables.state.isPlaying)}
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity>

                </GestureRecognizer>







                <GestureRecognizer
                    onSwipeDown={(state) => this.onSwipeDown(state)}
                    config={config}
                >

                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {alert("Modal has been closed.")}}
                >

                    <View style = {styles.containerOutsideModal}>
                    <View
                        style={styles.containerModal}>

                        <StatusBar
                            hidden={true}
                        />

                        <TouchableOpacity onPress={this.Close} style={{alignItems:'center', flex:1}}>
                            <Icon style={{textAlign:'center', fontSize: 40,color:'#BBBCCD' }} name="ios-arrow-down">
                            </Icon>
                        </TouchableOpacity>


                        {this._renderPodcastImageBig()}


                        <TouchableOpacity style={{marginTop:20}} onPress={() => {
                            const navigator = this.props.navigator;

                            Navigation.showModal({
                                screen: "PlayerInfo",
                                passProps: {navigator},
                            });

                        }}>
                            <Icon style={{textAlign:'center', fontSize: 16,color:'#5757FF', }} name="md-add-circle">
                            </Icon>
                            <Text style={styles.seeMore}>View More</Text>

                        </TouchableOpacity>



                        <View style={{marginTop: 10, flex:1}}>
                                {this._renderPodcastTitle(Variables.state.isPlaying)}
                                <TouchableOpacity style={{alignSelf: 'center'}}>
                                    {this._renderPodcastArtist(Variables.state.isPlaying)}
                                </TouchableOpacity>
                                {this._renderCategory()}
                        </View>





                        <View style={styles.centerContainerButtons}>

                            <View style={styles.leftContainerP}>
                                <TouchableOpacity onPress={this.scrubBackward}>
                                    <Icon style={{flex:1, textAlign:'center', fontSize: 50,color:'#2A2A30' }} name="ios-undo">
                                    </Icon>
                                    <Text style={{textAlign: 'center',  color: '#2A2A30', fontSize: 10, backgroundColor: 'transparent', fontFamily: 'HiraginoSans-W6',}}>15</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.middleContainer}>
                                <TouchableOpacity>
                                    {this._renderPlayButton2(Variables.state.isPlaying)}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.rightContainerP}>
                                <TouchableOpacity onPress={this.scrubForward}>
                                    <Icon style={{flex:1, textAlign:'center', fontSize: 50,color:'#2A2A30' }} name="ios-redo">
                                    </Icon>
                                    <Text style={{textAlign: 'center',  color: '#2A2A30', fontSize: 10, backgroundColor: 'transparent', fontFamily: 'HiraginoSans-W6',}}>15</Text>
                                </TouchableOpacity>
                            </View>


                        </View>


                        <View style={styles.centerContainerPlayer}>

                            <View style={styles.leftContainer}>
                                {this._renderCurrentTime()}
                            </View>

                            <View style={styles.rightContainer}>
                                {this._renderEndTime()}
                            </View>

                        </View>


                        {this._renderSlider(Variables.state.currentTime)}


                        <View style={{flexDirection: 'row', flex: 1, marginTop: 0}}>

                            <View style={{alignItems:'flex-start', flex:1}}>
                              
                            </View>

                            <View style={{alignItems: 'center', flex:1}}>

                                {this._renderFav(Variables.state.favorited)}

                            </View>

                            <View style={{alignItems: 'flex-end', flex:1}}>
                                {this._renderLikes(Variables.state.likers, Variables.state.liked)}
                            </View>


                        </View>




                    </View>
                    </View>



                </Modal>

                </GestureRecognizer>



            </View>



        )
    }

}


    const styles = StyleSheet.create({
    barContainer:{
        flex: 1,
        backgroundColor: '#5757FF',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 0.3,
        borderColor: '#5757FF',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: 30,
    },
    playingText:{
        color: '#fff',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W6',
        fontSize: 13,
        textAlign: 'left',
        paddingLeft: 10
    },
    playingText2:{
        color: '#fff',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W6',
        fontSize: 11,
        textAlign: 'left',
        paddingLeft: 10
    },
    listView: {
        paddingTop: 20,
        backgroundColor: '#F5FCFF',
    },
    sliderContainer: {
        width: 280,
        alignSelf: 'center'
    },
    audioProgress: {
        marginTop: 0,
        flexDirection: 'row'
    },
    fillProgress: {
        width: podcastPlayer.currentTime / podcastPlayer.duration * 250,
        height: 8,
        backgroundColor: 'rgba(1,170,170,1)',
        borderWidth:0.1,
        borderRadius:10
    },
    emptyProgress: {
        width: 280,
        height: 8,
        backgroundColor: '#575757',
    },
    leftContainer: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems:'flex-start',
    },
        leftContainerP: {
            flex:1,
            marginTop:10,
            paddingLeft: 0,
            justifyContent: 'center',
            alignItems:'flex-end',
        },
    centerContainer: {
        marginTop:5,
        flexDirection: 'row',
    },

    centerContainerPlayer: {
        flexDirection: 'row',
    },
    centerContainerButtons: {
        flex:1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 50
    },
    rightContainer: {
        flex: 1,
        paddingRight: 0,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
        rightContainerP: {
            flex: 1,
            marginTop:10,
            paddingRight: 0,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },

        container:{
            flex: 1,
            backgroundColor: '#fff',
            marginTop: 0,
        },

        containerModal:{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: '#fff',
            marginTop: 5,
            marginHorizontal: 5,
            borderColor: 'rgba(170,170,170,0.2)',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 2
        },

        containerOutsideModal:{
            flex: 1,
            backgroundColor: '#5757FF',

        },


        homeContainer:{
            marginTop: -15,
        },

        title: {
            color: '#2A2A30',
            marginTop: 70,
            flex:1,
            textAlign: 'center',
            fontStyle: 'normal',
            fontFamily: 'Hiragino Sans',
            fontSize: 25,
            backgroundColor: 'transparent',
            paddingBottom:10
        },
        title2: {
            color: 'rgba(1,170,170,1)',
            flex:1,
            textAlign: 'center',
            fontSize: 20,
        },

        podcastText:{
            color: '#2A2A30',
            fontSize: 15,
            marginTop: 5,
            marginHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'HiraginoSans-W6',
        },

        seeMore:{
            color: '#5757FF',
            fontSize: 14,
            marginTop:5,
            marginBottom:5,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            alignSelf: 'center',
            textAlign: 'center',
            fontFamily: 'HiraginoSans-W6',
        },
        podcastTextNum:{
            color: '#BBBCCD',
            fontSize: 12,
            marginTop: 5,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginHorizontal: 10,
            fontFamily: 'Hiragino Sans',
        },

        middleContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        podcastTextLikes:{
            color: '#BBBCCD',
            fontSize: 14,
            backgroundColor: 'transparent',
            textAlign: 'center'
        },
        podcastTextLikesActive:{
            color: '#BBBCCD',
            fontSize: 14,
            backgroundColor: 'transparent',
            textAlign: 'center'
        },
        podcastTextArtist:{
            color:'#2A2A30',
            fontSize: 15,
            marginHorizontal: 10,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            alignSelf: 'center',
            fontFamily: 'HiraginoSans-W3',
            marginTop: 6,
        },

        podcastTextCat:{
            color:'#828393',
            fontSize: 14,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            alignSelf: 'center',
            fontFamily: 'Hiragino Sans',
            marginTop: 6,
        },

        input: {
            height: 40,
            width: 300,
            marginBottom: 10,
            color:'#FFF',
            paddingHorizontal: 10,
            fontSize: 22,
            alignSelf: 'center',
            textAlign: 'center'
        },


});


    export default PlayerBottom;