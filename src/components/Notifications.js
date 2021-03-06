import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Platform, AsyncStorage, AppState, ListView, ActivityIndicator, Dimensions, RefreshControl} from 'react-native';
import PlayerBottom from './PlayerBottom';
import Icon from 'react-native-vector-icons/FontAwesome';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType, NotificationActionType, NotificationActionOption, NotificationCategoryOption} from 'react-native-fcm';
import firebase from 'firebase';
import Variables from "./Variables";


var {height, width} = Dimensions.get('window');

AsyncStorage.getItem('lastNotification').then(data=>{
    if(data){
        // if notification arrives when app is killed, it should still be logged here
        console.log('last notification', JSON.parse(data));
        AsyncStorage.removeItem('lastNotification');
    }
});

AsyncStorage.getItem('lastMessage').then(data=>{
    if(data){
        // if notification arrives when app is killed, it should still be logged here
        console.log('last message', JSON.parse(data));
        AsyncStorage.removeItem('lastMessage');
    }
});


class Notifications extends Component{


    async componentDidMount(){

        if (Platform.OS === 'ios') {
        // request permission for notifications
                try {
                    let result = await FCM.requestPermissions({
                        badge: true,
                        sound: true,
                        alert: true
                    });
                } catch (e) {
                    console.error(e);
                }


                // check if user is subscribed to notifications, if so add listeners
                const {currentUser} = firebase.auth();
                firebase.database().ref(`users/${currentUser.uid}/notificationsOn`).once("value", function (snapshot) {
                    if(snapshot.val()){
                        if(snapshot.val() == true){
                            console.log("Notifications on");
                            //add listeners for incoming notifications
                            this.registerAppListener(this.props.navigation);

                            //get initial notifications when booting up
                            FCM.getInitialNotification().then(notif => {
                                if(notif){
                                    console.log(notif)
                                }
                            });

                            //topic for custom messages
                            FCM.subscribeToTopic(`custom`);

                            //topic for podcast of the week
                            FCM.subscribeToTopic(`POTW`);

                            //topics for tracking
                            firebase.database().ref(`users/${currentUser.uid}/tracking`).once('value', function (snapshot) {
                                snapshot.forEach(function (data) {
                                    if(data.val()){
                                        let topic = data.key.replace(/\s/g, "_");
                                        console.log("Subscribed to: " + topic);
                                        FCM.subscribeToTopic(`/topics/${topic}`);
                                    }
                                })
                            });

                            //give firebase the user's token
                            FCM.getFCMToken().then(token => {
                                console.log("My TOKEN: ", token);
                                this.setState({ token: token || "" });
                                firebase.database().ref(`users/${currentUser.uid}/`).update({token});
                            });

                            if (Platform.OS === "ios") {
                                FCM.getAPNSToken().then(token => {
                                    console.log("APNS TOKEN (getFCMToken)", token);
                                });
                            }
                        }
                        else if(snapshot.val() == false){
                            console.warn("Not subscribed to notifications");
                            console.log("Not subscribed to notifications");
                        }
                    }
                    else if(snapshot.val() == false){
                        console.warn("Not subscribed to notifications");
                        console.log("Not subscribed to notifications");
                    }
                    else{
                        console.log("Notifications on");
                        //add listeners for incoming notifications
                        this.registerAppListener(this.props.navigation);

                        //get initial notifications when booting up
                        FCM.getInitialNotification().then(notif => {
                            if(notif){
                                console.log(notif)
                            }
                        });

                        //topic for custom messages
                        FCM.subscribeToTopic(`custom`);

                        //topic for podcast of the week
                        FCM.subscribeToTopic(`POTW`);

                        //topics for tracking
                        firebase.database().ref(`users/${currentUser.uid}/tracking`).once('value', function (snapshot) {
                            snapshot.forEach(function (data) {
                                if(data.val()){
                                    let topic = data.key.replace(/\s/g, "_");
                                    console.log("Subscribed to: " + topic);
                                    FCM.subscribeToTopic(`/topics/${topic}`);
                                }
                            })
                        });

                        //give firebase the user's token
                        FCM.getFCMToken().then(token => {
                            console.log("My TOKEN: ", token);
                            this.setState({ token: token || "" });
                            firebase.database().ref(`users/${currentUser.uid}/`).update({token});
                        });

                        if (Platform.OS === "ios") {
                            FCM.getAPNSToken().then(token => {
                                console.log("APNS TOKEN (getFCMToken)", token);
                            });
                        }
                    }

                }.bind(this));

        }


    }



    registerKilledListener(){
    // these callback will be triggered even when app is killed
        FCM.on(FCMEvent.Notification, notif => {
            AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
            if(notif.opened_from_tray){
                setTimeout(()=>{
                    if(notif._actionIdentifier === 'reply'){
                        if(AppState.currentState !== 'background'){
                            console.log('User replied '+ JSON.stringify(notif._userText));
                            alert('User replied '+ JSON.stringify(notif._userText));
                        } else {
                            AsyncStorage.setItem('lastMessage', JSON.stringify(notif._userText));
                        }
                    }
                    if(notif._actionIdentifier === 'view'){
                        alert("User clicked View in App");
                    }
                    if(notif._actionIdentifier === 'dismiss'){
                        alert("User clicked Dismiss");
                    }
                }, 1000)
            }
        });
    }




    // these callback will be triggered only when app is foreground or background
    registerAppListener(navigation) {
        FCM.on(FCMEvent.Notification, notif => {
            console.log("Notification", notif);

            if (Platform.OS === 'ios') {
                // this notification is only to decide if you want to show the notification when user if in foreground.
                // usually you can ignore it. just decide to show or not.
                switch (notif._notificationType){
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData);
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All);
                        break;
                }
                setTimeout(() => {
                    if(notif){
                        this.showLocalNotification(notif);
                    }
                }, 1000)
            }

            if(notif.local_notification){
                console.log("Notification recived local", "local notification");
                console.log(JSON.stringify(notif));
                if(notif.opened_from_tray){
                    if(notif.notification){
                        if(notif.notification.target){
                            if(notif.notification.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(notif.notification.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = notif.notification.target;
                                const rss = true;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                        else if (notif.target){
                            if(notif.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(notif.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = notif.target;
                                const rss = true;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                    }
                }
                return;
            }
            if(notif.opened_from_tray){
                console.log("Notification recived local", "local notification");
                console.log(JSON.stringify(notif));
                if(notif.opened_from_tray){
                    if(notif.notification){
                        if(notif.notification.target){
                            if(notif.notification.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(notif.notification.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = notif.notification.target;
                                const rss = true;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                        else if (notif.target){
                            if(notif.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(notif.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = notif.target;
                                const rss = true;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                    }
                }
                return;
            }

        });

        FCM.on(FCMEvent.RefreshToken, token => {
            console.log("TOKEN (refreshUnsubscribe)", token);
        });

        FCM.enableDirectChannel();
        FCM.on(FCMEvent.DirectChannelConnectionChanged, (data) => {
            console.log('direct channel connected' + data);
        });
        setTimeout(function() {
            FCM.isDirectChannelEstablished().then(d => console.log(d));
        }, 1000);
    }


    showLocalNotification(notif) {
        if(notif.notification){
            console.log(JSON.stringify(notif));
            const {currentUser} = firebase.auth();
            if(notif.notification.title && notif.notification.body && notif.notification.target){
                firebase.database().ref(`users/${currentUser.uid}/notifications`).push({title: notif.notification.title, body: notif.notification.body, target: notif.notification.target, time: firebase.database.ServerValue.TIMESTAMP});
            }
            else if(notif.notification.title && notif.notification.body && notif.target){
                firebase.database().ref(`users/${currentUser.uid}/notifications`).push({title: notif.notification.title, body: notif.notification.body, target: notif.target, time: firebase.database.ServerValue.TIMESTAMP});
            }
            else if(notif.notification.title && notif.notification.body){
                firebase.database().ref(`users/${currentUser.uid}/notifications`).push({title: notif.notification.title, body: notif.notification.body, target: '', time: firebase.database.ServerValue.TIMESTAMP});
            }
            else if(notif.notification.body){
                firebase.database().ref(`users/${currentUser.uid}/notifications`).push({title: '', body: notif.notification.body, target: '', time: firebase.database.ServerValue.TIMESTAMP});
            }

            FCM.presentLocalNotification({
                title: notif.notification.title,
                body: notif.notification.body,
                priority: "high",
                click_action: notif.click_action,
                show_in_foreground: true,
                vibrate: true,
                local: true,
                wake_screen: true,
            });
        }
    }


    componentWillUnmount(){
        clearTimeout(this.timeout2);
    }


    constructor(props) {
        super(props);

        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.state = {
            loading: true,
            dataSource: dataSource.cloneWithRows([]),
            refreshing: false,
        };

        const {currentUser} = firebase.auth();
        let notifications = [];

        firebase.database().ref(`users/${currentUser.uid}/notifications`).limitToLast(30).once("value", function (snapshot) {
            snapshot.forEach(function (data) {
                if(data.val()){
                    notifications.push(data.val());
                }
            })
        });

        this.timeout2 = setTimeout(() => {this.setState({dataSource: dataSource.cloneWithRows(notifications.reverse()), loading: false})},3000);


    }


    _onRefresh() {
        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.setState({
            refreshing: true,
            loading: false,
            dataSource: dataSource.cloneWithRows([]),
        });

        const {currentUser} = firebase.auth();
        let notifications = [];

        firebase.database().ref(`users/${currentUser.uid}/notifications`).limitToLast(20).once("value", function (snapshot) {
            snapshot.forEach(function (data) {
                if(data.val()){
                    notifications.push(data.val());
                }
            })
        });

        this.timeout2 = setTimeout(() => {this.setState({dataSource: dataSource.cloneWithRows(notifications.reverse()), refreshing: false, loading: false})},3000);


    }


    renderTime = (time) => {
        if(time){
            if(((time/1000)/86400).toFixed(0) >= 2 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/86400).toFixed(0)} days ago</Text>
                )
            }
            if(((time/1000)/86400).toFixed(0) > 1 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/86400).toFixed(0)} day ago</Text>
                )
            }
            else if(((time/1000)/3600).toFixed(0) >= 2 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/3600).toFixed(0)} hours ago</Text>
                )
            }
            else if(((time/1000)/3600).toFixed(0) > 1 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/3600).toFixed(0)} hour ago</Text>
                )
            }
            else if(((time/1000)/60).toFixed(0) >= 2 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/60).toFixed(0)} minutes ago</Text>
                )
            }
            else if(((time/1000)/60).toFixed(0) > 1 ){
                return(
                    <Text style={styles.titleTime}>{((time/1000)/60).toFixed(0)} minute ago</Text>
                )
            }
            else{
                return(
                    <Text style={styles.titleTime}>{((time/1000)).toFixed(0)} seconds ago</Text>
                )
            }

        }
    };


    renderRow = (podcast) => {
        if(podcast.title){
            return(
                <View >
                    {this.renderTime(new Date().getTime() - podcast.time)}
                    <TouchableOpacity style={{flex:1, flexDirection:'row', backgroundColor: '#fff',  paddingVertical: height/60, marginVertical: 1}} onPress={() => {
                        if(podcast.target){
                            if(podcast.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(podcast.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = podcast.target;
                                const {rss} = this.state;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                    }}>
                        <View style={{alignSelf:'center'}}>
                            <Icon style={{
                                fontSize: width/18.75,
                                
                                color: '#79797970',
                                marginHorizontal: width/25,
                            }} name="bell-o">
                            </Icon>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', marginRight: width/18.75}}>
                            <View>
                                <Text style = {styles.title}>{podcast.body}</Text>
                            </View>
                            <View>
                                <Text style = {styles.titleBody}>{podcast.title}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        else{
            return(
                <View >
                    {this.renderTime(new Date().getTime() - podcast.time)}
                    <TouchableOpacity style={{flex:1, flexDirection:'row', backgroundColor: '#fff',  paddingVertical: height/60, marginVertical: 1}} onPress={() => {
                        if(podcast.target){
                            if(podcast.target == 'Browse'){
                                this.props.navigator.switchToTab({
                                    tabIndex: 1
                                });
                            }
                            else if(podcast.target != ''){
                                const {navigator} = this.props;
                                Variables.state.browsingArtist = podcast.target;
                                const {rss} = this.state;
                                this.props.navigator.push({
                                    screen: "UserProfile",
                                    title: "Podcast",
                                    passProps: {navigator, rss},
                                });
                            }
                        }
                    }}>
                        <View style={{alignSelf:'center'}}>
                            <Icon style={{
                                fontSize: width/18.75,
                                
                                color: '#79797970',
                                marginHorizontal: width/25,
                            }} name="bell-o">
                            </Icon>
                        </View>
                        <View style={{flex: 1, justifyContent: 'center', marginRight: width/18.75}}>
                            <View>
                                <Text style = {styles.title}>{podcast.body}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    renderList = () => {
        if(this.state.dataSource.getRowCount() > 0){
            return(
                <ListView
                    enableEmptySections
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                />
            )
        }
        else{
            return(
                <View style={styles.container}>
                    <Text style = {styles.titleTop}>No Notifications Yet...</Text>
                </View>
            )
        }
    };

    render() {
        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style={{paddingVertical: height/33.35, alignSelf:'center'}} color='#3e4164' size ="large" />
                </View>
            )
        }
        else{
            return (
                <View
                    style={styles.container}>

                    <StatusBar
                        barStyle="dark-content"
                    />

                    <ScrollView  refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }>
                        {this.renderList()}
                        <View style = {{paddingBottom: height/11.12}} />
                    </ScrollView>

                    <PlayerBottom navigator={this.props.navigator}/>

                </View>

            );
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f4f9',
    },

    title: {
        flex: 1,
        color: '#3e4164',
        textAlign: 'left',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: width/20.83,
        
    },
    titleTime: {
        color: '#797979',
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        marginLeft: width/18.75,
        marginRight: width/37.5,
        fontSize: width/26.79,
        marginVertical: height/133.4,
        
    },
    titleBody: {
        flex: 1,
        color:  '#797979',
        textAlign: 'left',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: width/26.79,
        
        justifyContent: 'center'
    },

    titleTop: {
        
        color: '#506dcf',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: width/20.83,
        paddingVertical: height/66.7,
        marginBottom: height/667,
    },



});

export default Notifications;
