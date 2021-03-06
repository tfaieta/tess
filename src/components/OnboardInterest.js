import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Platform, ListView, Text, TouchableOpacity} from 'react-native';
import ListItemPodcast from "./ListItemPodcast";
var {height, width} = Dimensions.get('window');
import AnimatedLinearGradient from 'react-native-animated-linear-gradient'
import PlayerBottom from './PlayerBottom';
import firebase from 'firebase';

// Interests from OnboardInquiry

class OnboardInterest extends Component{
    
    static navigatorStyle = {
        navBarHidden: true,
        tabBarHidden: true,
        statusBarColor: 'transparent'
    }

    constructor(props) {
        super(props);

        var dataSource= new ListView.DataSource({rowHasChanged:(r1, r2) => r1 !== r2});
        this.state = {
            dataSource:  dataSource.cloneWithRows([]),
            loading: true,
        };


        let pods = [];

        const {selectedNews} = this.props;
        const {selectedHealth} = this.props;
        const {selectedPhilosophy} = this.props;
        const {selectedSpiritual} = this.props;
        const {selectedComedy} = this.props;
        const {selectedInspo} = this.props;
        const {selectedScience} = this.props;
        const {selectedTravel} = this.props;
        const {selectedLearning} = this.props;
        const {selectedSports} = this.props;
        const {selectedMusic} = this.props;
        const {selectedTech} = this.props;
        const {selectedGaming} = this.props;
        const {selectedBusiness} = this.props;


        if(selectedNews){

            pods.push('The Daily');
            pods.push('Global News Podcast');
            pods.push('The Ezra Klein Show');
            pods.push('The Tom Woods Show');
            pods.push('The Daily Show With Trevor Noah: Ears Edition');
            pods.push('Innovation Hub');
            pods.push('Pod Save America');
            pods.push('Pod Save the People');

        }
        if(selectedHealth){

            pods.push('Trail Runner Nation');
            pods.push('Ben Greenfield Fitness: Diet, Fat Loss and Performance');
            pods.push('The Rich Roll Podcast');
            pods.push('The Bearded Vegans');
            pods.push('Vegan Warrior Princesses Attack!');

        }
        if(selectedPhilosophy){

            pods.push('The Best Ideas Podcast');
            pods.push('Oprah’s SuperSoul Conversations');
            pods.push('In Our Time');
            pods.push('The Mission Daily');

        }
        if(selectedSpiritual){

            pods.push('On Being with Krista Tippett');
            pods.push('New World Kirtan');
            pods.push('Waking Up with Sam Harris');

        }
        if(selectedComedy){

            pods.push('The Joe Rogan Experience');
            pods.push('VIEWS with David Dobrik and Jason Nash');
            pods.push('Guys We F****d');
            pods.push('WTF with Marc Maron Podcast');
            pods.push('H3 Podcast');
            pods.push('IDK Podcast');
            pods.push('2 Dope Queens');
            pods.push('ID10T with Chris Hardwick');
            pods.push('Comedy Bang Bang: The Podcast');
            pods.push('The Adam Carolla Show');

        }
        if(selectedInspo){

            pods.push('TED Talks');
            pods.push('The GaryVee Audio Experience');
            pods.push('Masters of Scale with Reid Hoffman');
            pods.push('The Blog of Author Tim Ferriss');
            pods.push('The Unbeatable Mind Podcast with Mark Divine');
            pods.push('The Ground Up Show');

        }
        if(selectedScience){

            pods.push('StarTalk Radio');
            pods.push('Radiolab');
            pods.push("Invisibilia");
            pods.push('Sword and Scale');
            pods.push('Why We Do What We Do');
            pods.push("The Struggling Archaeologist's Guide to Getting Dirty");

        }
        if(selectedTravel){

            pods.push('Zero to Travel');
            pods.push('Travel with Rick Steves');
            pods.push('The Budget Minded Traveler: Travel | Adventure | Lifestyle');

        }
        if(selectedLearning){

            pods.push('TED Radio Hour');
            pods.push('Entrepreneurs On Fire | Ignite your Entrepreneurial journey');
            pods.push('Forward Tilt by Praxis');
            pods.push('Quick Talk Podcast - Growing Your Cleaning Or Home Service Business');
            pods.push('RadiusBombcom - Quick Talk Podcast');
            pods.push('The Art of Charm | High Performance Techniques| Cognitive Development | Relationship Advice | Mastery of Human Dynamics');
            pods.push('The Creative Exchange');
            pods.push('The Mixology Talk Podcast: Better Bartending and Making Great Drinks');
            pods.push("The Struggling Archaeologist's Guide to Getting Dirty");
            pods.push('Wow in the World');

        }
        if(selectedSports){

            pods.push('The Bill Simmons Podcast');
            pods.push('The Herd with Colin Cowherd');
            pods.push('Men In Blazers');
            pods.push('The Steve Austin Show');

        }
        if(selectedMusic){

            pods.push('No Jumper');
            pods.push('Song Exploder');
            pods.push('CLUBLIFE');
            pods.push('The Combat Jack Show');

        }
        if(selectedTech){

            pods.push('Reply All');
            pods.push('Y Combinator');
            pods.push('Accidental Tech Podcast');
            pods.push('Recode Decode, hosted by Kara Swisher');
            pods.push('Recode Media with Peter Kafka');
            pods.push('Recode Replay');

        }
        if(selectedGaming){

            pods.push('Game Scoop!');
            pods.push('Triforce!');
            pods.push('The Adventure Zone');
            pods.push('Painkiller Already');
            pods.push('Ask Me Another');

        }
        if(selectedBusiness){

            pods.push('How I Built This with Guy Raz');
            pods.push('Planet Money');
            pods.push('Girlboss Radio with Sophia Amoruso');
            pods.push('HBR IdeaCast');
            pods.push('StartUp Podcast');
            pods.push('The Smart Passive Income Online Business and Blogging Podcast');
            pods.push('The Indie Hackers Podcast');
            pods.push('This Week in Startups - Audio');

        }

        this.timeout = setTimeout(() =>{
            this.setState({dataSource: dataSource.cloneWithRows(pods), loading:false})
        }, 5000)
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    renderRow = (rowData) => {
        return <ListItemPodcast podcast={rowData} navigator={this.props.navigator} />;
    };


    render() {

        if(this.state.loading){
            let bgGradient = {
                bg: ['#3023ae', '#c86dd7']
            };
            let duration = 2000;

            return (
                <AnimatedLinearGradient
                    style={styles.container}
                    customColors={bgGradient.bg}
                    points={{start: {x: 0, y: 0}, end: {x: 1, y: 1}}}
                    speed={duration}
                >
                    <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', }}>
                        <Text style={styles.title} >Generating</Text>
                        <Text style={styles.title} >Recommendations</Text>
                    </View>
                </AnimatedLinearGradient>
            );
        }
        else{
            return (
                <View style={styles.container}>
                    <ScrollView>
                        <View/>
                        <Text style={styles.results}>Here are some recommendations!</Text>
                        <ListView
                            enableEmptySections
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                        />
                        <View style = {{paddingBottom: height/7.41}} />
                    </ScrollView>

                    <PlayerBottom navigator={this.props.navigator}/>

                    <TouchableOpacity onPress={() =>{
                                // Mark user as onboarded and pop back to the home screen
                                const {currentUser} = firebase.auth();
                                const onboarded = true;
                                firebase.database().ref(`users/${currentUser.uid}/onboarded`).update({onboarded});
                                this.props.navigator.popToRoot({
                                    animated: true,
                                    animationType: 'fade',
                                })}}
                                >
                                <View style={styles.nextContainer}>
                                    <Text style={styles.text}>Next</Text>
                                </View>
                    </TouchableOpacity>
                
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
        color: '#fff',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold',
        fontSize: width/18,
        backgroundColor: 'transparent'
    },
    results: {
        color: '#3e4164',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold',
        fontSize: width/16,
        marginTop: height/30,
        marginBottom: height/55,
        marginHorizontal: height/50
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontStyle: 'normal',
        fontFamily: 'Montserrat-Bold',
        fontSize: width/18,
    },
    nextContainer:{
        backgroundColor: '#3e4164',
        paddingVertical: height/50,
        paddingHorizontal: width/50,
    },
});


export default OnboardInterest;
