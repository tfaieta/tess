import React, { Component } from 'react';
import { Text, View, StyleSheet, ListView, TouchableOpacity, Alert, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import PlayerBottom from './PlayerBottom';
import Variables from "./Variables";
import firebase from 'firebase';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import ListItem from "./ListItem";


class SearchPage extends Component{

static navigatorStyle = {
        statusBarHidden: false,
        navBarHidden: true
    };


    componentWillMount(){
        Variables.state.mySearches = [];
        const refMy = firebase.database().ref(`podcasts/`);


        refMy.once("value", function (snapshot) {
            Variables.state.mySearches = [];
            snapshot.forEach(function (data) {

                if(data.val().podcastTitle.toLowerCase().includes(Variables.state.searchWord.toLowerCase())) {
                    Variables.state.mySearches.push(data.val());
                }
                else {
                    firebase.database().ref(`/users/${data.val().podcastArtist}/username`).orderByChild("username").on("value", function(snap) {
                        if(snap.val().username.toLowerCase().includes(Variables.state.searchWord.toLowerCase())){
                            Variables.state.mySearches.push(data.val())
                        }
                    });
                }

            })
        });


    }


    componentWillUnmount(){
        clearTimeout(this.timeout);
        clearTimeout(this.timeout2);
    }


    searchActivate = () => {
        Variables.state.searchWord = this.state.search;
        this.props.navigator.push({
            screen: 'Search',
            animated: true,
            animationType: 'fade',
        });
    };

    constructor(props) {
        super(props);
        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.state = {
            dataSource: dataSource.cloneWithRows(Variables.state.mySearches),
            search: Variables.state.searchWord
        };
        this.timeout = setTimeout(() => {this.setState({dataSource: dataSource.cloneWithRows(Variables.state.mySearches)})},1000);
        this.timeout2 = setTimeout(() => {this.setState({dataSource: dataSource.cloneWithRows(Variables.state.mySearches)})},3500);
    }

    _renderResults(mySearches){
        if(mySearches > 0){
            return(
                <View style={{flex:1}}>
                    <ListView
                        enableEmptySections
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                    />
                </View>
            )
        }
        else{
           return(
               <View >
                   <Text style={styles.title2}>No results found...</Text>
               </View>
           )
        }
    }



    renderRow = (rowData) => {
        return <ListItem podcast={rowData} navigator={this.props.navigator} />;
    };







    Back= () => {
        this.props.navigator.pop({
            animated: true,
            animationType: 'fade',
        });
    };

    render() {
        return (
            <View style={styles.container}>


                <View style={styles.backColor}>

                    <View style={styles.backButtonContainer}>
                        <TouchableOpacity onPress={this.Back}>
                            <Icon style={{textAlign:'left', marginRight:0,marginLeft: 0,paddingTop: 0, fontSize: 30,color: '#007aff', }} name="ios-arrow-back">
                            </Icon>
                        </TouchableOpacity>
                    </View>

                    <SearchBar
                        lightTheme
                        round
                        inputStyle={{backgroundColor: '#fff', color: '#2A2A30', marginLeft: 20}}
                        containerStyle= {styles.containerSearch}
                        placeholder={this.state.search}
                        placeholderTextColor = '#2A2A30'
                        icon = {{ color: '#5757FF', name: 'search', paddingRight: 20 }}
                        clearIcon = {{ color: '#BBBCCD', name: 'close' }}
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={this.state.search}
                        onChangeText={search => this.setState({ search })}
                        returnKeyType='search'
                        onSubmitEditing={this.searchActivate}
                    />

                </View>

                <ScrollView>
                    {this._renderResults(Variables.state.mySearches.length)}

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
        backgroundColor: 'transparent',
    },

    title: {
        color: '#2A2A30',
        marginTop: 0,
        flex:1,
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W6',
        fontSize: 15,
        backgroundColor: 'transparent',
        marginHorizontal: 20,

    },
    backColor:{
        backgroundColor:  '#fff',
        flexDirection: 'row',
    },

    containerSearch:{
        marginLeft: 10,
        marginTop: 20,
        width: 343.5,
        backgroundColor: '#fff',
        borderColor:'#fff',
        borderWidth: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#fff',
        borderBottomColor: '#fff',
    },
    backButtonContainer:{
        paddingTop: 28,
        paddingLeft: 10,
    },

    containerList: {
        paddingHorizontal: 0,
        paddingVertical: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        backgroundColor: '#FFF',
        opacity: 1,
        borderColor: '#FFF',
        borderWidth: 0.5,
        borderRadius: 0,
        borderStyle: 'solid',
        flexDirection: 'row',
    },


    containerMain:{
        flex: 1,
        backgroundColor: 'transparent',
    },

    contentTitle: {
        color: 'rgba(1,170,170,1)',
        fontSize: 25,
        paddingBottom: 20,
        marginLeft: 20,

    },

    container2: {
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 10,
        marginVertical: 0,
        marginHorizontal: 0,
        backgroundColor: '#FFF',
        opacity: 1,
        borderColor: '#FFF',
        borderWidth: 0.5,
        borderRadius: 0,
        borderStyle: 'solid',
        flexDirection: 'row',
    },

    title2: {
        color: '#2A2A30',
        flex:1,
        marginTop:20,
        textAlign: 'center',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Hiragino Sans',
        fontSize: 20,
        backgroundColor: 'transparent'
    },
    titleOther: {
        color: '#2A2A30',
        marginTop: 0,
        flex:1,
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W6',
        fontSize: 15,
        backgroundColor: 'transparent',
        marginHorizontal: 20,

    },
    artistTitle: {
        color: '#828393',
        marginTop: 0,
        flex:1,
        textAlign: 'left',
        opacity: 1,
        fontStyle: 'normal',
        fontFamily: 'Hiragino Sans',
        fontSize: 15,
        backgroundColor: 'transparent',
        marginLeft: 20,
    },

    header: {
        marginTop:25,
        marginLeft: -35,
        color: '#2A2A30',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Hiragino Sans',
        fontSize: 18,
        backgroundColor: 'transparent',

    },

    containerOther: {
        paddingHorizontal: 0,
        paddingVertical: 10,
        marginVertical: 0,
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
        paddingLeft: 2,
        justifyContent: 'center',
        alignItems:'flex-start',
    },
    rightContainer: {
        flex: 1,
        paddingRight: 2,
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


});

export default SearchPage;