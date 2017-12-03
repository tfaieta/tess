import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Variables from "./Variables";
import DropdownAlert from 'react-native-dropdownalert';



class RecordFirstPage extends Component{

    componentWillMount(){
        this.props.navigator.toggleTabs({
            to: 'false',
            animated: true,
        });

        if(Variables.state.isPlaying){
            Variables.pause();
            Variables.state.isPlaying = false;
        }
    }


    info = () =>{
        this.dropdown.alertWithType("custom", "", "Just tap 'Get Started' and hit that big button to start your recording. You can pause and resume at anytime.")
    };


    recordNewPodcast =() => {
        this.props.navigator.push({
            screen: 'Record',
            animated: true,
            animationType: 'fade',
            navigatorStyle: {
                tabBarHidden: true,
            },
        });
    };



    render() {
        return (
            <View
                style={styles.container}>


                <View style={{flexDirection: 'row', paddingVertical:5, borderWidth: 2, marginBottom: 20, borderColor: 'rgba(187,188,205,0.3)',   }}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex:10, marginLeft:30, marginTop:20}}>
                        <Text style={styles.header}>Create a Podcast</Text>
                    </View>

                    <View style={{justifyContent: 'center', alignItems: 'flex-end', marginTop: 16, marginRight: 10, flex:1}}>
                        <TouchableOpacity onPress={this.info} >
                            <Icon style={{
                                textAlign: 'right',
                                fontSize: 24,
                                color: '#5757FF'
                            }} name="md-information-circle">
                            </Icon>
                        </TouchableOpacity>
                    </View>

                </View>



                <View style={{flex:1}}>
                    <Image
                        style={{width: 147, height:151, alignSelf: 'center', opacity: 1}}
                        source={require('tess/src/images/record-icon.png')}
                    />

                    <Text style={styles.title}>Record New Podcast</Text>

                    <Text style={styles.title2}>Let people know what you have to say.</Text>




                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.buttonPreview}  onPress={this.recordNewPodcast}>
                                <Text style={styles.contentTitle}>Get Started</Text>
                        </TouchableOpacity>
                </View>

                </View>





                <DropdownAlert titleStyle={{color:'#fff'}} messageStyle={{color: '#fff'}} containerStyle={{backgroundColor: '#5757FF'}} ref={ref => this.dropdown = ref} showCancel={true} />
            </View>




        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
    },

    title: {
        color: '#2A2A30',
        textAlign: 'left',
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W6',
        fontSize: 36,
        marginTop: 20,
        paddingLeft: 20,
        backgroundColor: 'transparent',
    },

    title2: {
        color: '#828393',
        textAlign: 'left',
        fontStyle: 'normal',
        fontFamily: 'HiraginoSans-W3',
        fontSize: 18,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: 'transparent',
    },

    contentTitle: {
        color: '#fff',
        fontSize: 18,
        paddingVertical: 16,
        marginTop: 10,
        textAlign: 'left',
        fontStyle: 'normal',
        fontFamily: 'Hiragino Sans',

    },

    buttonPreview: {
        marginHorizontal: 20,
        backgroundColor: '#5757FF',
        alignItems: 'center',
        borderWidth: 0.1,
        borderRadius: 10,
    },


    buttonContainer: {
        flex:1,
        marginTop: 10
    },

    header: {
        marginTop:10,
        color: '#2A2A30',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Hiragino Sans',
        fontSize: 18,
        backgroundColor: 'transparent',

    }


});

export default RecordFirstPage;