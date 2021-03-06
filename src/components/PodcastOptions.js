import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    Dimensions,
    Clipboard,
    Platform,
    AlertIOS,
    ToastAndroid,
    ActionSheetIOS,
} from 'react-native';
import firebase from 'firebase';
import Variables from "./Variables";
import Icon from 'react-native-vector-icons/Ionicons';
import Share, {ShareSheet, Button} from 'react-native-share';

var Analytics = require('react-native-firebase-analytics');
import { Navigation } from 'react-native-navigation';

var {height, width} = Dimensions.get('window');



// options popup for podcasts on a list

class PodcastOptions extends Component {

    constructor(props){
        super(props);
        this.state = {
            favorite: false,
            visible: false,
            podTitle: '',
            profileName: ''
        };

        const rowData = this.props.rowData;
        const id  = rowData.id;
        const {currentUser} = firebase.auth();
        if(id){
            if (firebase.database().ref(`users/${currentUser.uid}/favorites`).child(rowData.id)){
                this.setState({favorite: true})
            }
            else{
                this.setState({favorite: false})
            }
        }


        const podcastArtist = rowData.podcastArtist;

        let podTitle = rowData.podcastTitle;
        if(rowData.podcastTitle.toString().length > width/10 ){
            podTitle = (rowData.podcastTitle.slice(0,width/10)+"...")
        }
        else{
            podTitle = rowData.podcastTitle;
        }

        let profileName = '';
        firebase.database().ref(`/users/${rowData.podcastArtist}/username`).orderByChild("username").on("value", function (snap) {
            if (snap.val()) {
                profileName = snap.val().username;
            }
            else {
                profileName = rowData.podcastArtist;
            }
        });

        this.timeout = setTimeout(() => {
            this.setState({podTitle: podTitle, profileName: profileName})

        },500)


    }


    componentWillUnmount(){
        clearTimeout(this.timeout);
    }


    onCancel() {
        console.log("CANCEL");
        this.setState({visible:false});
    }
    onOpen() {
        console.log("OPEN");
        this.setState({visible:true});
    }


    render(){

        const rowData = this.props.rowData;
        const navigator = this.props.navigator;
        const {currentUser} = firebase.auth();
        const id  = rowData.id;
        const podcastArtist = rowData.podcastArtist;
        const podcastTitle = rowData.podcastTitle;
        const podcastDescription = rowData.podcastDescription;
        const podcastCategory = rowData.podcastCategory;
        const key = rowData.key;
        const rss = rowData.rss;


        let shareOptions = {
            title: podcastTitle,
            message: podcastTitle + " - " + this.state.profileName + "\n\nListen on Tess!\n",
            url: `https://tessopen.page.link/listen?${id}`,
            subject: podcastTitle + " - " + this.state.profileName  //  for email
        };

        let shareOptionsHighlight = {
            title: podcastTitle,
            message: podcastTitle + ": " + podcastDescription + " - highlight from " + this.state.profileName + "\n\nListen on Tess!\n",
            url: `https://tessopen.page.link/highlight?${currentUser.uid}~${key}`,
            subject: podcastTitle //  for email
        };

        let shareImageBase64 = {
            title: podcastTitle,
            message: podcastTitle,
            url: `tess://listen/${id}`,
            subject: "Share Link" //  for email
        };

        const linkToString = shareOptionsHighlight.url;


        if(rowData.highlight){

                return(
                    <View style={styles.container} >
                        <View>
                            <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                            <Text style={styles.textArtist}>{this.state.profileName}</Text>
                        </View>

                        <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>


                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                            this.onOpen();

                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-share-outline" />
                            </View>

                            <View style={{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Share</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity  style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                            Alert.alert(
                                'Are you sure you want to delete?',
                                '',
                                [
                                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'Yes', onPress: () => {

                                        firebase.database().ref(`users/${currentUser.uid}/highlights/${key}`).remove();
                                        navigator.dismissLightBox();

                                    }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-trash-outline" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Delete</Text>
                            </View>
                        </TouchableOpacity>



                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                            navigator.dismissLightBox();
                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-close" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </View>
                        </TouchableOpacity>



                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                            <Button iconSrc={{ uri: TWITTER_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareTwitter', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptionsHighlight, {
                                                "social": "twitter"
                                            }));
                                        },300);
                                    }}>Twitter</Button>
                            <Button iconSrc={{ uri: FACEBOOK_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareFacebook', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptionsHighlight, {
                                                "social": "facebook"
                                            }));
                                        },300);
                                    }}>Facebook</Button>
                            <Button iconSrc={{ uri: WHATSAPP_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareWhatsapp', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptionsHighlight, {
                                                "social": "whatsapp"
                                            }));
                                        },300);
                                    }}>Whatsapp</Button>
                            <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareGooglePlus', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptionsHighlight, {
                                                "social": "googleplus"
                                            }));
                                        },300);
                                    }}>Google +</Button>
                            <Button iconSrc={{ uri: EMAIL_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareEmail', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptionsHighlight, {
                                                "social": "email"
                                            }));
                                        },300);
                                    }}>Email</Button>
                            <Button
                                iconSrc={{ uri: CLIPBOARD_ICON }}
                                onPress={()=>{
                                    this.onCancel();
                                    setTimeout(() => {
                                        var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                        ref.once("value", function(snapshot) {
                                            if(snapshot.val()){
                                                if(snapshot.val().shares){
                                                    ref.update({shares: snapshot.val().shares + 1})
                                                }
                                                else{
                                                    ref.update({shares: 1})
                                                }
                                            }
                                        });
                                        const {currentUser} = firebase.auth();
                                        const user = currentUser.uid;
                                        Analytics.logEvent('shareCopyLink', {
                                            'episodeID': id,
                                            'user_id': user
                                        });
                                        if(typeof shareOptionsHighlight["url"] !== undefined) {
                                            Clipboard.setString(shareOptionsHighlight["url"]);
                                            if (Platform.OS === "android") {
                                                ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                                            } else if (Platform.OS === "ios") {
                                                AlertIOS.alert('Link Copied');
                                            }
                                        }
                                    },300);
                                }}>Copy Link</Button>
                            <Button iconSrc={{ uri: MORE_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareMore', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            if (typeof shareOptionsHighlight["url"] !== undefined) {
                                                Share.open(shareOptionsHighlight).then((res) =>
                                                    {
                                                        console.log(res)
                                                    }).catch((err) =>
                                                    {
                                                        console.log(err)
                                                    });
                                            }

                                        },300);
                                    }}>More</Button>
                        </ShareSheet>


                    </View>
                )

        }
        else{

            if(rowData.podcastArtist == currentUser.uid){
                return(
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                            <Text style={styles.textArtist}>by {this.state.profileName}</Text>
                        </View>

                        <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>


                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                            this.onOpen();

                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-share-outline" />
                            </View>

                            <View style={{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Share</Text>
                            </View>
                        </TouchableOpacity>



                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                            Analytics.logEvent('addToQueue', {
                                'episodeID': id,
                                'user_id': currentUser.uid
                            });

                            firebase.database().ref(`users/${currentUser.uid}/queue/`).once("value", function (snap) {
                                snap.forEach(function (data) {
                                    if(data.val().id == id){
                                        firebase.database().ref(`users/${currentUser.uid}/queue/${data.key}`).remove()
                                    }
                                });
                                firebase.database().ref(`users/${currentUser.uid}/queue/`).push({id});
                            });

                            navigator.dismissLightBox();

                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                            </View>

                            <View style={{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Add to Queue</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}  onPress = {() => {
                            this.props.navigator.showModal({
                                screen: 'MyQueue',
                            });
                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-list-box-outline" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Go to Queue</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                            Navigation.showModal({
                                screen: 'PlaylistList',
                                passProps: {navigator, id}
                            })

                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                            </View>

                            <View style={{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Add to Playlist</Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}  onPress={() => {
                            navigator.showModal({
                                screen: 'EditPodcast',
                                passProps: {rowData, navigator},
                            })

                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-create-outline" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Edit</Text>
                            </View>
                        </TouchableOpacity>





                        <TouchableOpacity  style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                            Alert.alert(
                                'Are you sure you want to delete?',
                                '',
                                [
                                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                    {text: 'Yes', onPress: () => {

                                        if(rowData.id){
                                            firebase.storage().ref(`/users/${rowData.podcastArtist}/${rowData.id}`).delete();
                                            firebase.database().ref(`/podcasts/${rowData.id}`).remove();
                                            firebase.database().ref(`/users/${rowData.podcastArtist}/podcasts/${rowData.id}`).remove();
                                            navigator.dismissLightBox();
                                        }
                                        else{
                                            firebase.storage().ref(`/users/${rowData.podcastArtist}/${rowData.podcastTitle}`).delete();
                                            firebase.database().ref(`/podcasts`).on("value", function (snapshot) {
                                                snapshot.forEach(function (data) {
                                                    if(data.val().podcastTitle == rowData.podcastTitle && data.val().podcastArtist == rowData.podcastArtist){
                                                        data.ref.remove()
                                                    }
                                                })
                                            });
                                            navigator.dismissLightBox();
                                        }

                                    }
                                    },
                                ],
                                { cancelable: false }
                            )
                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-trash-outline" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Delete</Text>
                            </View>
                        </TouchableOpacity>





                        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                            navigator.dismissLightBox();
                        }}>
                            <View style={{alignContent: 'center'}}>
                                <Icon style={styles.iconStyle} name="ios-close" />
                            </View>
                            <View style = {{alignContent: 'center'}}>
                                <Text style={styles.textStyle}>Cancel</Text>
                            </View>
                        </TouchableOpacity>



                        <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                            <Button iconSrc={{ uri: TWITTER_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareTwitter', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptions, {
                                                "social": "twitter"
                                            }));
                                        },300);
                                    }}>Twitter</Button>
                            <Button iconSrc={{ uri: FACEBOOK_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareFacebook', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptions, {
                                                "social": "facebook"
                                            }));
                                        },300);
                                    }}>Facebook</Button>
                            <Button iconSrc={{ uri: WHATSAPP_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareWhatsapp', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptions, {
                                                "social": "whatsapp"
                                            }));
                                        },300);
                                    }}>Whatsapp</Button>
                            <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareGooglePlus', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptions, {
                                                "social": "googleplus"
                                            }));
                                        },300);
                                    }}>Google +</Button>
                            <Button iconSrc={{ uri: EMAIL_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareEmail', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.shareSingle(Object.assign(shareOptions, {
                                                "social": "email"
                                            }));
                                        },300);
                                    }}>Email</Button>
                            <Button
                                iconSrc={{ uri: CLIPBOARD_ICON }}
                                onPress={()=>{
                                    this.onCancel();
                                    setTimeout(() => {
                                        var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                        ref.once("value", function(snapshot) {
                                            if(snapshot.val()){
                                                if(snapshot.val().shares){
                                                    ref.update({shares: snapshot.val().shares + 1})
                                                }
                                                else{
                                                    ref.update({shares: 1})
                                                }
                                            }
                                        });
                                        const {currentUser} = firebase.auth();
                                        const user = currentUser.uid;
                                        Analytics.logEvent('shareCopyLink', {
                                            'episodeID': id,
                                            'user_id': user
                                        });
                                        if(typeof shareOptions["url"] !== undefined) {
                                            Clipboard.setString(shareOptions["url"]);
                                            if (Platform.OS === "android") {
                                                ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                                            } else if (Platform.OS === "ios") {
                                                AlertIOS.alert('Link Copied');
                                            }
                                        }
                                    },300);
                                }}>Copy Link</Button>
                            <Button iconSrc={{ uri: MORE_ICON }}
                                    onPress={()=>{
                                        this.onCancel();
                                        setTimeout(() => {
                                            var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                            ref.once("value", function(snapshot) {
                                                if(snapshot.val()){
                                                    if(snapshot.val().shares){
                                                        ref.update({shares: snapshot.val().shares + 1})
                                                    }
                                                    else{
                                                        ref.update({shares: 1})
                                                    }
                                                }
                                            });
                                            const {currentUser} = firebase.auth();
                                            const user = currentUser.uid;
                                            Analytics.logEvent('shareMore', {
                                                'episodeID': id,
                                                'user_id': user
                                            });
                                            Share.open(shareOptions).then((res) =>
                                            {
                                                console.log(res)
                                            }).catch((err) =>
                                            {
                                                console.log(err)
                                            });
                                        }, 300);
                                    }}>More</Button>
                        </ShareSheet>


                    </View>
                )
            }
            else{
                if(id){
                    if(this.state.favorite){

                        return(
                            <View style={styles.container}>
                                <View>
                                    <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                                    <Text style={styles.textArtist}>{this.state.profileName}</Text>
                                </View>

                                <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>



                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                                    this.onOpen();

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-share-outline" />
                                    </View>

                                    <View style={{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Share</Text>
                                    </View>
                                </TouchableOpacity>



                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}  onPress = {() => {

                                    Analytics.logEvent('addToQueue', {
                                        'episodeID': id,
                                        'user_id': currentUser.uid
                                    });

                                    firebase.database().ref(`users/${currentUser.uid}/queue/`).once("value", function (snap) {
                                        snap.forEach(function (data) {
                                            if(data.val().id == id){
                                                firebase.database().ref(`users/${currentUser.uid}/queue/${data.key}`).remove()
                                            }
                                        });
                                        firebase.database().ref(`users/${currentUser.uid}/queue/`).push({id});
                                    });

                                    navigator.dismissLightBox();

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                                    </View>

                                    <View style={{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Queue</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}  onPress = {() => {
                                    this.props.navigator.showModal({
                                        screen: 'MyQueue',
                                    });
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-list-box-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Queue</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                                    Navigation.showModal({
                                        screen: 'PlaylistList',
                                        passProps: {navigator, id}
                                    })

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                                    </View>

                                    <View style={{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Playlist</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}  onPress={() => {

                                    firebase.database().ref(`users/${currentUser.uid}/favorites/${id}`).remove();
                                    this.setState({favorite: false})

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-heart" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Remove from Favorites</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {
                                    Variables.state.browsingArtist = rowData.podcastArtist;

                                    setTimeout(() => {
                                        navigator.push({
                                            screen: 'UserProfile',
                                            title: this.state.profileName,
                                            passProps: {rowData, navigator, rss},
                                        })
                                    }, 450)
                                     navigator.dismissLightBox();

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-contact-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Profile</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                                    navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-close" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>

                                <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                                    <Button iconSrc={{ uri: TWITTER_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareTwitter', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "twitter"
                                                    }));
                                                },300);
                                            }}>Twitter</Button>
                                    <Button iconSrc={{ uri: FACEBOOK_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareFacebook', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "facebook"
                                                    }));
                                                },300);
                                            }}>Facebook</Button>
                                    <Button iconSrc={{ uri: WHATSAPP_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareWhatsapp', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "whatsapp"
                                                    }));
                                                },300);
                                            }}>Whatsapp</Button>
                                    <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareGooglePlus', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "googleplus"
                                                    }));
                                                },300);
                                            }}>Google +</Button>
                                    <Button iconSrc={{ uri: EMAIL_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareEmail', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "email"
                                                    }));
                                                },300);
                                            }}>Email</Button>
                                    <Button
                                        iconSrc={{ uri: CLIPBOARD_ICON }}
                                        onPress={()=>{
                                            this.onCancel();
                                            setTimeout(() => {
                                                var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                ref.once("value", function(snapshot) {
                                                    if(snapshot.val()){
                                                        if(snapshot.val().shares){
                                                            ref.update({shares: snapshot.val().shares + 1})
                                                        }
                                                        else{
                                                            ref.update({shares: 1})
                                                        }
                                                    }
                                                });
                                                const {currentUser} = firebase.auth();
                                                const user = currentUser.uid;
                                                Analytics.logEvent('shareCopyLink', {
                                                    'episodeID': id,
                                                    'user_id': user
                                                });
                                                if(typeof shareOptions["url"] !== undefined) {
                                                    Clipboard.setString(shareOptions["url"]);
                                                    if (Platform.OS === "android") {
                                                        ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                                                    } else if (Platform.OS === "ios") {
                                                        AlertIOS.alert('Link Copied');
                                                    }
                                                }
                                            },300);
                                        }}>Copy Link</Button>
                                    <Button iconSrc={{ uri: MORE_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareMore', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });

                                                    Share.open(shareOptions).then((res) =>
                                                    {
                                                        console.log(res)
                                                    }).catch((err) =>
                                                    {
                                                        console.log(err)
                                                    });
                                                },300);
                                            }}>More</Button>
                                </ShareSheet>

                            </View>
                        )

                    }

                    else{

                        return(
                            <View style={styles.container}>
                                <View>
                                    <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                                    <Text style={styles.textArtist}>{this.state.profileName}</Text>
                                </View>

                                <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                                    this.onOpen();

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-share-outline" />
                                    </View>

                                    <View style={{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Share</Text>
                                    </View>
                                </TouchableOpacity>



                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                                    firebase.database().ref(`users/${currentUser.uid}/queue/`).once("value", function (snap) {

                                        Analytics.logEvent('addToQueue', {
                                            'episodeID': id,
                                            'user_id': currentUser.uid
                                        });

                                        snap.forEach(function (data) {
                                            if(data.val().id == id){
                                                firebase.database().ref(`users/${currentUser.uid}/queue/${data.key}`).remove()
                                            }
                                        });
                                        firebase.database().ref(`users/${currentUser.uid}/queue/`).push({id});
                                    });

                                    navigator.dismissLightBox();

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Queue</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                                    this.props.navigator.showModal({
                                        screen: 'MyQueue',
                                    });
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-list-box-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Queue</Text>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {

                                    Navigation.showModal({
                                        screen: 'PlaylistList',
                                        passProps: {navigator, id}
                                    })

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-add-circle-outline" />
                                    </View>

                                    <View style={{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Playlist</Text>
                                    </View>
                                </TouchableOpacity>



                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {

                                    firebase.database().ref(`users/${currentUser.uid}/favorites/`).child(id).update({id});
                                    this.setState({favorite: true})

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-heart-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Favorites</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {
                                    Variables.state.browsingArtist = rowData.podcastArtist;
                                    setTimeout(() => {
                                        navigator.push({
                                            screen: 'UserProfile',
                                            title: this.state.profileName,
                                            passProps: {rowData, navigator, rss},
                                        })
                                    }, 450);
                                     navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-contact-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Profile</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                                    navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-close" />
                                    </View>
                                    <View style= {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>

                                <ShareSheet visible={this.state.visible} onCancel={this.onCancel.bind(this)}>
                                    <Button iconSrc={{ uri: TWITTER_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareTwitter', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "twitter"
                                                    }));
                                                },300);
                                            }}>Twitter</Button>
                                    <Button iconSrc={{ uri: FACEBOOK_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareFacebook', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "facebook"
                                                    }));
                                                },300);
                                            }}>Facebook</Button>
                                    <Button iconSrc={{ uri: WHATSAPP_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareWhatsapp', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "whatsapp"
                                                    }));
                                                },300);
                                            }}>Whatsapp</Button>
                                    <Button iconSrc={{ uri: GOOGLE_PLUS_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareGooglePlus', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "googleplus"
                                                    }));
                                                },300);
                                            }}>Google +</Button>
                                    <Button iconSrc={{ uri: EMAIL_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareEmail', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.shareSingle(Object.assign(shareOptions, {
                                                        "social": "email"
                                                    }));
                                                },300);
                                            }}>Email</Button>
                                    <Button
                                        iconSrc={{ uri: CLIPBOARD_ICON }}
                                        onPress={()=>{
                                            this.onCancel();
                                            setTimeout(() => {
                                                var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                ref.once("value", function(snapshot) {
                                                    if(snapshot.val()){
                                                        if(snapshot.val().shares){
                                                            ref.update({shares: snapshot.val().shares + 1})
                                                        }
                                                        else{
                                                            ref.update({shares: 1})
                                                        }
                                                    }
                                                });
                                                const {currentUser} = firebase.auth();
                                                const user = currentUser.uid;
                                                Analytics.logEvent('shareCopyLink', {
                                                    'episodeID': id,
                                                    'user_id': user
                                                });
                                                if(typeof shareOptions["url"] !== undefined) {
                                                    Clipboard.setString(shareOptions["url"]);
                                                    if (Platform.OS === "android") {
                                                        ToastAndroid.show('Link Copied', ToastAndroid.SHORT);
                                                    } else if (Platform.OS === "ios") {
                                                        AlertIOS.alert('Link Copied');
                                                    }
                                                }
                                            },300);
                                        }}>Copy Link</Button>
                                    <Button iconSrc={{ uri: MORE_ICON }}
                                            onPress={()=>{
                                                this.onCancel();
                                                setTimeout(() => {
                                                    var ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/stats`);
                                                    ref.once("value", function(snapshot) {
                                                        if(snapshot.val()){
                                                            if(snapshot.val().shares){
                                                                ref.update({shares: snapshot.val().shares + 1})
                                                            }
                                                            else{
                                                                ref.update({shares: 1})
                                                            }
                                                        }
                                                    });
                                                    const {currentUser} = firebase.auth();
                                                    const user = currentUser.uid;
                                                    Analytics.logEvent('shareMore', {
                                                        'episodeID': id,
                                                        'user_id': user
                                                    });
                                                    Share.open(shareOptions).then((res) =>
                                                    {
                                                        console.log(res)
                                                    }).catch((err) =>
                                                    {
                                                        console.log(err)
                                                    });
                                                },300);
                                            }}>More</Button>
                                </ShareSheet>

                            </View>
                        )

                    }

                }
                else{
                    if(this.state.favorite){

                        return(
                            <View style={styles.container}>
                                <View>
                                    <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                                    <Text style={styles.textArtist}>{this.state.profileName}</Text>
                                </View>

                                <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {

                                    /*
                                    firebase.database().ref(`users/${currentUser.uid}/favorites/${podcastTitle}`).remove();
                                    this.setState({favorite: false})
                                    */

                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-heart" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Remove from Favorites</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {
                                    Variables.state.browsingArtist = rowData.podcastArtist;
                                    setTimeout(() => {
                                        navigator.push({
                                            screen: 'UserProfile',
                                            title: this.state.profileName,
                                            passProps: {rowData, navigator, rss},
                                        })
                                    }, 450)
                                     navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-contact-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Profile</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                                    navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-close" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )

                    }

                    else{

                        return(
                            <View style={styles.container}>
                                <View>
                                    <Text style={styles.textTitle}>{this.state.podTitle}</Text>
                                    <Text style={styles.textArtist}>{this.state.profileName}</Text>
                                </View>

                                <View style = {{width: width - 40, height: 1, backgroundColor: '#fff', marginHorizontal: 20, alignSelf: 'center'}}/>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {

                                    /*
                                    firebase.database().ref(`users/${currentUser.uid}/favorites/`).child(podcastTitle).update({podcastArtist, podcastTitle});
                                    this.setState({favorite: true})
                                    */


                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-heart-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Add to Favorites</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {
                                    Variables.state.browsingArtist = rowData.podcastArtist;
                                    setTimeout(() => {
                                        navigator.push({
                                            screen: 'UserProfile',
                                            title: this.state.profileName,
                                            passProps: {rowData, navigator, rss},
                                        })
                                    }, 450);
                                     navigator.dismissLightBox();
                                }}>

                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-contact-outline" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Go to Profile</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress = {() => {
                                    navigator.dismissLightBox();
                                }}>
                                    <View style={{alignContent: 'center'}}>
                                        <Icon style={styles.iconStyle} name="ios-close" />
                                    </View>
                                    <View style = {{alignContent: 'center'}}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )

                    }

                }






            }

        }




    }


}




const styles = StyleSheet.create({

    container:{
        flex: 1,
        paddingTop: height/7.59,
        backgroundColor: '#3e416495',
        height: height,
        width: width
    },
    textStyle:{
        color: '#fff',
        textAlign: 'center',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: height/41.69,
        
        marginVertical: height/33.35,
    },
    textTitle:{
        color: '#fff',
        textAlign: 'center',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: height/51.3,
        
        marginVertical: 5,
        marginHorizontal: 20,
    },
    textArtist:{
        color: '#fff',
        textAlign: 'center',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: height/51.3,
        
        marginBottom: 20,
        marginHorizontal: 20,
    },
    iconStyle: {
        textAlign: 'center',
        fontSize: height/26.68,
        color: 'white',
        marginTop: height/41.69,
        marginRight: 12,
    }

});



//  twitter icon
const TWITTER_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABvFBMVEUAAAAA//8AnuwAnOsAneoAm+oAm+oAm+oAm+oAm+kAnuwAmf8An+0AqtUAku0AnesAm+oAm+oAnesAqv8An+oAnuoAneoAnOkAmOoAm+oAm+oAn98AnOoAm+oAm+oAmuoAm+oAmekAnOsAm+sAmeYAnusAm+oAnOoAme0AnOoAnesAp+0Av/8Am+oAm+sAmuoAn+oAm+oAnOoAgP8Am+sAm+oAmuoAm+oAmusAmucAnOwAm+oAmusAm+oAm+oAm+kAmusAougAnOsAmukAn+wAm+sAnesAmeoAnekAmewAm+oAnOkAl+cAm+oAm+oAmukAn+sAmukAn+0Am+oAmOoAmesAm+oAm+oAm+kAme4AmesAm+oAjuMAmusAmuwAm+kAm+oAmuoAsesAm+0Am+oAneoAm+wAmusAm+oAm+oAm+gAnewAm+oAle0Am+oAm+oAmeYAmeoAmukAoOcAmuoAm+oAm+wAmuoAneoAnOkAgP8Am+oAm+oAn+8An+wAmusAnuwAs+YAmegAm+oAm+oAm+oAmuwAm+oAm+kAnesAmuoAmukAm+sAnukAnusAm+oAmuoAnOsAmukAqv9m+G5fAAAAlHRSTlMAAUSj3/v625IuNwVVBg6Z//J1Axhft5ol9ZEIrP7P8eIjZJcKdOU+RoO0HQTjtblK3VUCM/dg/a8rXesm9vSkTAtnaJ/gom5GKGNdINz4U1hRRdc+gPDm+R5L0wnQnUXzVg04uoVSW6HuIZGFHd7WFDxHK7P8eIbFsQRhrhBQtJAKN0prnKLvjBowjn8igenQfkQGdD8A7wAAAXRJREFUSMdjYBgFo2AUDCXAyMTMwsrGzsEJ5nBx41HKw4smwMfPKgAGgkLCIqJi4nj0SkhKoRotLSMAA7Jy8gIKing0KwkIKKsgC6gKIAM1dREN3Jo1gSq0tBF8HV1kvax6+moG+DULGBoZw/gmAqjA1Ay/s4HA3MISyrdC1WtthC9ebGwhquzsHRxBfCdUzc74Y9UFrtDVzd3D0wtVszd+zT6+KKr9UDX749UbEBgULIAbhODVHCoQFo5bb0QkXs1RAvhAtDFezTGx+DTHEchD8Ql4NCcSyoGJYTj1siQRzL/JKeY4NKcSzvxp6RmSWPVmZhHWnI3L1TlEFDu5edj15hcQU2gVqmHTa1pEXJFXXFKKqbmM2ALTuLC8Ak1vZRXRxa1xtS6q3ppaYrXG1NWjai1taCRCG6dJU3NLqy+ak10DGImx07LNFCOk2js6iXVyVzcLai7s6SWlbnIs6rOIbi8ViOifIDNx0uTRynoUjIIRAgALIFStaR5YjgAAAABJRU5ErkJggg==";

//  facebook icon
const FACEBOOK_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEUAAAAAQIAAWpwAX5kAX5gAX5gAX5gAXJwAXpgAWZ8AX5gAXaIAX5gAXpkAVaoAX5gAXJsAX5gAX5gAYJkAYJkAXpoAX5gAX5gAX5kAXpcAX5kAX5gAX5gAX5YAXpoAYJijtTrqAAAAIHRSTlMABFis4vv/JL0o4QvSegbnQPx8UHWwj4OUgo7Px061qCrcMv8AAAB0SURBVEjH7dK3DoAwDEVRqum9BwL//5dIscQEEjFiCPhubziTbVkc98dsx/V8UGnbIIQjXRvFQMZJCnScAR3nxQNcIqrqRqWHW8Qd6cY94oGER8STMVioZsQLLnEXw1mMr5OqFdGGS378wxgzZvwO5jiz2wFnjxABOufdfQAAAABJRU5ErkJggg==";

//  whatsapp icon
const WHATSAPP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACzVBMVEUAAAAArQAArgAArwAAsAAAsAAAsAAAsAAAsAAAsAAAsAAAsAAArwAAtgAAgAAAsAAArwAAsAAAsAAAsAAAsAAAsgAArwAAsAAAsAAAsAAAsQAAsAAAswAAqgAArQAAsAAAsAAArwAArwAAsAAAsQAArgAAtgAAsQAAuAAAtAAArwAAsgAAsAAArAAA/wAAsQAAsAAAsAAAsAAAzAAArwAAsAAAswAAsAAAsAAArQAAqgAAsAAAsQAAsAAAsAAAsAAAqgAAsQAAsAAAsAAArwAAtAAAvwAAsAAAuwAAsQAAsAAAsAAAswAAqgAAswAAsQAAswAAsgAAsAAArgAAsAAAsAAAtwAAswAAsAAAuQAAvwAArwAAsQAAsQAAswAAuQAAsAAAsAAArgAAsAAArgAArAAAsAAArgAArgAAsAAAswAArwAAsAAAsQAArQAArwAArwAAsQAAsAAAsQAAsQAAqgAAsAAAsAAAsAAAtAAAsAAAsQAAsAAAsAAAsAAArgAAsAAAsQAAqgAAsAAAsQAAsAAAswAArwAAsgAAsgAAsgAApQAArQAAuAAAsAAArwAAugAArwAAtQAArwAAsAAArgAAsAAAsgAAqgAAsAAAsgAAsAAAzAAAsQAArwAAswAAsAAArwAArgAAtwAAsAAArwAAsAAArwAArwAArwAAqgAAsQAAsAAAsQAAnwAAsgAArgAAsgAArwAAsAAArwAArgAAtAAArwAArwAArQAAsAAArwAArwAArwAAsAAAsAAAtAAAsAAAswAAsgAAtAAArQAAtgAAsQAAsQAAsAAAswAAsQAAsQAAuAAAsAAArwAAmQAAsgAAsQAAsgAAsAAAsgAAsAAArwAAqgAArwAArwAAsgAAsQAAsQAArQAAtAAAsQAAsQAAsgAAswAAsQAAsgAAsQAArwAAsQAAsAAArQAAuQAAsAAAsQAArQCMtzPzAAAA73RSTlMAGV+dyen6/vbfvIhJBwJEoO//1oQhpfz98Or0eQZX5ve5dkckEw4XL1WM0LsuAX35pC0FVuQ5etFEDHg+dPufFTHZKjOnBNcPDce3Hg827H9q6yax5y5y7B0I0HyjhgvGfkjlFjTVTNSVgG9X3UvNMHmbj4weXlG+QfNl4ayiL+3BA+KrYaBDxLWBER8k4yAazBi28k/BKyrg2mQKl4YUipCYNdR92FBT2hhfPd8I1nVMys7AcSKfoyJqIxBGSh0shzLMepwjLsJUG1zhErmTBU+2RtvGsmYJQIDN69BREUuz65OCklJwpvhdFq5BHA9KmUcAAALeSURBVEjH7Zb5Q0xRFMdDNZZU861EyUxk7IRSDY0piSJLiSwJpUTM2MlS2bdERskSWbLva8qWNVv2new7f4Pz3sw09eq9GT8395dz7jnzeXc5554zFhbmYR41bNSqXcfSylpUt179BjYN/4u0tbMXwzAcHJ1MZ50aObNQ4yYurlrcpambics2k9DPpe7NW3i0lLVq3aZtOwZv38EUtmMnWtazcxeDpauXJdHe3UxgfYj19atslHenK/DuYRT2VwA9lVXMAYF08F5G2CBPoHdwNQ6PPoBlX0E2JBToF0JKcP8wjmvAQGCQIDwYCI8gqRziHDmU4xsGRA0XYEeMBEYx0Yqm6x3NccaMAcYKwOOA2DiS45kkiedmZQIwQSBTE4GJjJzEplUSN4qTgSn8MVYBakaZysLTuP7pwAxeeKYUYltGmcWwrnZc/2xgDi88FwjVvoxkQDSvij9Cgfm8sBewQKstJNivil/uAikvTLuN1mopqUCanOtftBgiXjgJWKJTl9Khl9lyI20lsPJyYIX+4lcSvYpN8tVr9P50BdbywhlSROlXW7eejm2fSQfdoEnUPe6NQBZ/nH2BbP1kUw6tvXnL1m0kNLnbGdMOII8/w3YCPuWTXbuZaEtEbMLsYTI+H9jLD+8D9svKZwfcDQX0IM0PAYfl/PCRo8CxCsc4fkLHnqRPup0CHIXe82l6VmcqvlGbs7FA8rkC0s8DqYVCcBFV3YTKprALFy8x8nI4cEWwkhRTJGXVegquAiqlIHwNuF6t44YD7f6mcNG+BZSQvJ3OSeo7dwFxiXDhDVAg516Q/32NuDTbYH3w8BEFW/LYSNWmCvLkqbbJSZ89V78gU9zLVypm/rrYWKtJ04X1DfsBUWT820ANawjPLTLWatTWbELavyt7/8G5Qn/++KnQeJP7DFH+l69l7CbU376rrH4oXHOySn/+MqW7/s77U6mHx/zNyAw2/8Myjxo4/gFbtKaSEfjiiQAAAABJRU5ErkJggg==";

//  gplus icon
const GOOGLE_PLUS_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAACQ1BMVEUAAAD/RDP/STX9Sjb+STT+SjX+SjX+SjX+STT/SzP/Sjb/SzX/VVX/SDb+SDP+SjX9RzT9STT9SjT+STX+SjT9SjT/SST/TTP+SjX+SjX/RDP/RzP+SjX+SjX/STf9SDX/SjX/TU3+Sjb+SjX/Qyz/Szb+SjX/TTP+SjX9STX+SjP/TTX9Szb+Szb/YCD/SzX/SzX+Sjb+STX/TTX/SzX/Szb/TDT+SjX9SzX/STf+TDX/SjT9SzX9Szb+SjX/SjX/SzX/STT9SjT9TDT+SDT/VQD9STX/STX9SjX+SjX9STX+SzT/UDD9Sjb+SjX9RzT/QED+SjT+SjX/XS7+SjX/Ui7/RC3+SjX/TTz/RzP+SjX/TTP/STf+SjX/STT/RjP+Sjb/SzX/Szz/Rjr/RzL+RzP+SjX/Szf/SjX9Sjb+SjX+Sjb+SjX+SjX+SjX/STf/SjT/SjT9SjX9SzT+RzT+STT/STT+SjX/STP/Tjf+SjX/Szb/SjX/STX9SjX/SjT/AAD/SjH/STb+SzX+Sjb+SjT9SDT+Sjb+SjX9STf9STT/SDX/TDf+STb/TjT/TjH+SjX+SDT/Sjb9SzX9RzX+TDT/TUD/STX+SjX+STX/VTn/QjH/SjX+SjX/Ri7+Szb/TTP+SjX/SDX/STT9SjX+SjX/SDL/TjT9Sjb/RjL+SjX9SzX/QED/TDT+SjX+SjX9STX/RjX/VSv/Rzb/STX/ORz/UDD9SzX+Sjb/STT9SzP+SzX+SjX+SjX9Szb/Ti//ZjPPn7DtAAAAwXRSTlMAD1uiy+j5/8FBZHQDY9zvnYSc5dGhBwr+1S0Zqu44mz4KtNkXY7Yo8YLcfp3bCGZ+sLhWaks2z4wO6VOklrtWRFSXos4DoD+D/ZnoEKasjwS7+gvfHC3kHmjtMlTXYjfZXBEWa+/nQRiK5u7c8vVGRWepp6+5eulQF/dfSHSQdQEfdrzguZzm+4KSQyW1JxrAvCaCiLYUc8nGCR9h6gvzFM41MZHhYDGYTMejCEDi3osdBj1+CSCWyGyp1PC3hUEF/yhErwAAAjFJREFUSMft1tdfE0EQB/ADJD+JKAomHoqKxhJLFCnSpdgIxobYgqhYaJKIHVQUsSFiBSuCvWPv3T/N2ZPD3EucvVcyL3sz2W8+l73ZvShKKEIxcCIsPGJQpAV9MThK1KzAEAaNHjosZviI2DgBR9psVrvCx6Ni1fjRNI5JIDx2nF5m4ejxsCRqVxMmknZMksGTVUzpu5zqJD1NAodNB2boyUzCrlnK7CSKOUCyGJOC4BSan6onaWLN5irpCIwgOAMBt5eZRVk2H+fQx7n92TzK8pT8AopCwCbGgiB4Pk1fsFDPFlG2mL9gRTTdnahnxcASDx/nq6SX6tkyYLnEo1qxknBJ2t9kVSlcq2WaZM1a0qXrtOv18Jbp9Q3l5Rv/39ubHKQ3V2xRtm7bXlkluyGra2qJ76jzwb/TxH721O9K3U1fsMfsgbCXcLFZvI+wL8ok3i/6+ECDOdxYJ/TBQ9Kw+nDTkRyHtodKjjbLyGMtx304cTKi8NRpoVutfJp5xgtv21ntxGw/J7T3PNdeuAhcuqxn9o5W0p1Ma78CpF/9lzdfI3ydiStobrjhIL4BRN7k4WRa3i5D5RbQ3cPDMcDtO4ZKGXCXedtuQL1nqNwHHjDxQ/rNGYbKI/gfM/ETwv6ngafSM3RwH3O7eK86Wzz9L582PO9lN9iLl6KpXr2uf9P7tvHde4e75oNEZ3/85NQ2hKUyzg/1c57klur68vXbd9XtdP34+et36C9WKAZo/AEHHmXeIIIUCQAAAABJRU5ErkJggg==";

//  email icon
const EMAIL_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABC1BMVEUAAAA/Pz8/Pz9AQEA/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz8/Pz8+Pj4+Pj4/Pz8/Pz8/Pz9AQEA+Pj5AQEA/Pz87Ozs7Ozs/Pz8+Pj47OztAQEA/Pz89PT01NTVBQUFBQUE/Pz8/Pz8+Pj4/Pz9BQUE+Pj4/Pz8/Pz89PT0+Pj4/Pz9BQUFAQEA9PT09PT0/Pz87Ozs9PT05OTk/Pz8+Pj4/Pz9AQEA/Pz8/Pz8/Pz8/Pz+AgIA+Pj4/Pz8/Pz9AQEA/Pz8/Pz8/Pz8/Pz8+Pj4/Pz8/Pz8/Pz9AQEA+Pj4/Pz8+Pj4/Pz85OTk/Pz8/Pz8/Pz8/Pz88PDw9PT0/Pz88PDw8PDw+Pj45OTlktUJVAAAAWXRSTlMA/7N4w+lCWvSx8etGX/XlnmRO7+1KY/fjOGj44DU7UvndMec/VvLbLj7YKyiJdu9O7jZ6Um1w7DnzWQJz+tpE6uY9t8D9QehAOt7PVRt5q6duEVDwSEysSPRjqHMAAAEfSURBVEjH7ZTXUgIxGEa/TwURUFyKYgMURLCvbe2gYAV7ff8nMRksgEDiKl7lXOxM5p8zO3s2CWAwGAx/CjXontzT25Y+pezxtpv2+xTygJ+BYOvh4BBDwx1lKxxhNNZqNjLK+JjVWUYsykj4+2h8gpNTUMkIBuhPNE+SKU7PQC3D62E60ziYzXIuBx0Z+XRTc9F5fgF6MhKNzWXnRejKWGJdc9GZy8AP3kyurH52Ju01XTkjvnldNN+Qi03RecthfFtPlrXz8rmzi739Ax7mUCjy6FhH/vjPonmqVD6pdT718excLX/tsItLeRAqtc7VLIsFlVy/t6+ub27v7t8XD490niy3p+rZpv3i+jy/Or+5SUrdvcNcywaDwfD/vAF2TBl+G6XvQwAAAABJRU5ErkJggg==";

//  clipboard icon
const CLIPBOARD_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAB5lBMVEUAAAA8PDw+Pj4/Pz8/Pz8/Pz8/Pz8+Pj47OzsAAAA5OTk+Pj4/Pz8/Pz8+Pj49PT0/Pz8/Pz85OTlAQEA/Pz87Ozs+Pj4+Pj4/Pz8/Pz8/Pz8zMzNBQUE/Pz8/Pz8/Pz9AQEA7Ozs9PT0/Pz9AQEA+Pj4/Pz8+Pj4AAABAQEA/Pz87OztBQUE/Pz8+Pj4zMzNDQ0M/Pz89PT03Nzc/Pz8/Pz8/Pz8/Pz88PDw8PDwAAABCQkI7Ozs9PT0/Pz9AQEA/Pz8uLi4rKytAQEA/Pz89PT0+Pj4/Pz8/Pz8/Pz9CQkJAQEA/Pz9CQkI/Pz8/Pz8/Pz8+Pj49PT0/Pz8yMjI/Pz88PDw/Pz9BQUE8PDw/Pz9AQEA/Pz8/Pz8/Pz89PT0/Pz9CQkI9PT1EREQ9PT08PDw4ODg+Pj6AgIA/Pz8/Pz82NjZVVVU7Ozs/Pz81NTVAQEA/Pz8+Pj49PT1BQUE/Pz8/Pz8/Pz8vLy8/Pz87OztAQEA3Nzc9PT0+Pj4/Pz89PT0/Pz8/Pz89PT1AQEA9PT04ODgzMzM/Pz8/Pz9AQEA/Pz9AQEA/Pz83Nzc9PT0/Pz9AQEA/Pz8+Pj4+Pj5AQEA/Pz89PT1FRUU5OTk/Pz8/Pz8+Pj47Ozs/Pz89PT08PDw+Pj6z1Mg0AAAAonRSTlMAEXTG8/7pslICKMn//J0u2LcSLNu9Y0523KoKL9b7hggauZsEOuJ/ARS7VifkiwUX0bEq1f1p6KGQAz4NpnpY8AsGtMIyb46NbSOMcRuh+fGTFc0z1yKFKy/dpKff1CqKMoYPp+lAgAKd6kIDhdorJJExNjflktMr3nkQDoXbvaCe2d2EijIUn3JsbjDDF1jjOOdWvIDhmhoJfWrAK7bYnMgx8fGWAAACNUlEQVRIx+2W6V8SURSGBxEVeydMbVER1DCwRNTCEhMNsywqExXcUrNVU9NK2wy1fd9sMyvrP+1cmYH5eK5f5f3APef85hnuvfPeM6MoaaW1dWXKMGdasrJzrJtgc7dhQ+p2kzRry4OuHfmSbEEhUTt37d5TRGNxiRRrLwUczjKKyiuI3uuSYCv3ARa3ZyOu2k/xAT5b7aXra3xaVlsH1LPZg4cAvzM10wbgMBs+QqtsDKTyJroXGz7a7AgandECtPLXfKzFY8hCbcBxFudpP3Gy49RpQ8UXtgBnOOzZc53CU+e7Ism7uYnt5ji0p1e3pDmqzTnmAEr7GGz/AGEDg0MXaBgeERXrKIWFBQz2IvlYHbtEh/EycOUqVQLXVCDPxvGz+MPYdRGWjE/coGFyyg9M32SwM8PkydlQIim7JX6DxHpvM9g7c+SjoLESmqd9vjvDYO9NEzs1aahYY7SK+3Zm31Ddmp8jDx4qysIj2qt4O6dviH4xqvk5soj40vJjqjzh7HOf6BtPtb1SnulG6X3O6bHdqb5BejHbKtDOl+UcQ78iNuwzFKKvwx1v3npYJ+kd0BYynqz3Eu2OZvnB+IyCRVE+TD5qSmWBRuDjJzb8GWhIJq4xv36kWKoH6mr1vlFDnvRW86e9Qtd/qUrs1VeKv1VKbJjrOz3Wih8UrTpF37ArMlotFmfg58raLxrjvyXfifl/ku/TdZsiK9NfNcH+y93Ed4A1JzvLkmnOMClppbV19R+iQFSQ2tNASwAAAABJRU5ErkJggg==";

//  more icon
const MORE_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAQlBMVEUAAABEREQ9PT0/Pz8/Pz9AQEA7OzszMzM/Pz8/Pz9FRUU/Pz8/Pz9VVVUAAAA/Pz8+Pj4/Pz8/Pz9BQUFAQEA/Pz+e9yGtAAAAFnRSTlMAD5bv9KgaFJ/yGv+zAwGltPH9LyD5QNQoVwAAAF5JREFUSMft0EkKwCAQRFHHqEnUON3/qkmDuHMlZlVv95GCRsYAAAD+xYVU+hhprHPWjDy1koJPx+L63L5XiJQx9PQPpZiOEz3n0qs2ylZ7lkyZ9oyXzl76MAAAgD1eJM8FMZg0rF4AAAAASUVORK5CYII=";



export default PodcastOptions;
