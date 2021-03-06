import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, ListView, Platform, Dimensions, RefreshControl} from 'react-native';
import PlayerBottom from './PlayerBottom';
import Variables from "./Variables";
import firebase from 'firebase';
import ListItem from "./ListItem";

var {height, width} = Dimensions.get('window');

let topMargin = 0;
if(Platform.OS === 'ios'){
    topMargin = height/10.26
}



// displays recently played podcasts


class RecentlyPlayed extends Component{

    componentWillMount(){
        const {currentUser} = firebase.auth();

        firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed`).limitToLast(25).once("value", function (snapshot) {
            snapshot.forEach(function (snap) {
                firebase.database().ref(`podcasts/${snap.val().id}`).once("value", function (data) {
                    if(data.val()){
                        this.state.recentlyPlayed = [data.val(), ...this.state.recentlyPlayed];
                    }

                }.bind(this))
            }.bind(this));
        }.bind(this));

    }


    componentWillUnmount(){
        clearTimeout(this.timeout);
    }


    constructor(props){
        super(props);

        this.props.navigator.setStyle({
               statusBarHidden: false,
               statusBarTextColorScheme: 'light',
               navBarHidden: false,
               navBarTextColor: '#3e4164', // change the text color of the title (remembered across pushes)
               navBarTextFontSize: 18, // change the font size of the title
               navBarTextFontFamily: 'Montserrat-SemiBold', // Changes the title font
               drawUnderTabBar: false,
               navBarHideOnScroll: false,
               navBarBackgroundColor: '#fff',
               topBarElevationShadowEnabled: false,
               statusBarColor: '#fff',
               drawUnderNavBar: Platform.OS === 'ios',
               navBarTranslucent: Platform.OS === 'ios',
               navBarNoBorder: true,

         });

        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.state = {
            recentlyPlayed: [],
            dataSource: dataSource.cloneWithRows([]),
            refreshing: false
        };
        this.timeout = setTimeout(() => {
            this.setState({dataSource: dataSource.cloneWithRows(this.state.recentlyPlayed)})
        },2000);
    };


    _onRefresh = () => {
        this.setState({refreshing: true});

        const {currentUser} = firebase.auth();

        firebase.database().ref(`users/${currentUser.uid}/recentlyPlayed`).limitToLast(25).once("value", function (snapshot) {
            snapshot.forEach(function (snap) {
                firebase.database().ref(`podcasts/${snap.val().id}`).once("value", function (data) {
                    if(data.val()){
                        this.state.recentlyPlayed = [data.val(), ...this.state.userRecentlyPlayed];
                    }

                }.bind(this))
            }.bind(this));
        }.bind(this));


        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.timeout = setTimeout(() => {
            this.setState({dataSource: dataSource.cloneWithRows(this.state.recentlyPlayed), refreshing: false})
        },3000);
    };


    _pressBack = () => {
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        });
    };


    renderRow = (rowData) => {
        return <ListItem podcast={rowData} navigator={this.props.navigator} />;
    };


    render() {
        return (
            <View
                style={styles.container}>


                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />}
                >

                    <ListView
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                    />


                    <View style={{paddingBottom:120}}>

                    </View>

                </ScrollView>



                <PlayerBottom navigator={this.props.navigator}/>


            </View>




        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f4f9',
        marginTop: topMargin,
    },


});

export default RecentlyPlayed;