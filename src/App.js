import React from 'react';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers';
import StartUp from './components/StartUp';

import { Navigation } from 'react-native-navigation';
import InitialScreen from "./components/InitialScreen";
import Home from "./components/Home";
import Discover from "./components/Discover";
import RecordFirstPage from "./components/RecordFirstPage";
import Library from "./components/Library";
import Account from "./components/Account";
import Fitness from "./components/Categories/Fitness";
import CurrentEvents from "./components/Categories/CurrentEvents";
import SearchPage from "./components/SearchPage";
import Record from "./components/Record";
import RecordInfo from "./components/RecordInfo";
import RecordSuccess from "./components/RecordSuccess";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Queue from "./components/Queue";
import Favorites from "./components/Favorites";
import MyContent from "./components/MyContent";
import FollowedContent from "./components/FollowedContent";
import Settings from "./components/Settings";
import UserProfile from "./components/UserProfile";
import Comedy from "./components/Categories/Comedy";
import Entertainment from "./components/Categories/Entertainment";
import Gaming from "./components/Categories/Gaming";
import LearnSomething from "./components/Categories/LearnSomething";
import LifeStyle from "./components/Categories/LifeStyle";
import ScienceNature from "./components/Categories/ScienceNature";
import SocietyCulture from "./components/Categories/SocietyCulture";
import Sports from "./components/Categories/Sports";
import StoryTelling from "./components/Categories/StoryTelling";
import Tech from "./components/Categories/Tech";
import Travel from "./components/Categories/Travel";
import Categories from "./components/DiscoverBar/Categories";
import Following from "./components/DiscoverBar/Following";
import NewPodcasts from "./components/DiscoverBar/NewPodcasts";
import TopCharts from "./components/DiscoverBar/TopCharts";
import MyFollowersPage from "./components/MyFollowersPage";
import UserFollowing from "./components/UserFollowing";
import UserFollowers from "./components/UserFollowers";
import PodcastOptions from "./components/PodcastOptions";
import EditPodcast from "./components/EditPodcast";
import ViewAll from "./components/ViewAll";
import Music from "./components/Categories/Music";
import PlayerInfo from "./components/PlayerInfo";
import PopupCategory from "./components/Categories/PopupCategory";
import UserProfileModal from "./components/UserProfileModal";
import RecentlyPlayed from "./components/RecentlyPlayed";
import InfoDiagram from "./components/InfoDiagram";
import ReligionSpirituality from "./components/Categories/ReligionSpirituality";
import SetPlayerSpeed from "./components/SetPlayerSpeed";
import MyQueue from "./components/MyQueue";
import PlayerOptions from "./components/PlayerOptions";
import CustomNavbar from "./components/CustomNavbar";
import Notifications from "./components/Notifications";
import Playlists from "./components/Playlists";
import AddWidget from "./components/AddWidget";
import Search from "./components/Search";
import Highlights from "./components/Highlights";
import Highlight from "./components/Highlight";
import Tracking from "./components/Tracking";
import Achievement from "./components/Achievement";
import PlayerBottom from "./components/PlayerBottom";
import CatchUp from "./components/CatchUp";




const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

Navigation.registerComponent('Initial', () => InitialScreen, store, Provider);
Navigation.registerComponent('Startup', () => StartUp, store, Provider);
Navigation.registerComponent('Login', () => Login, store, Provider);
Navigation.registerComponent('CreateAccount', () => CreateAccount, store, Provider);

Navigation.registerComponent('CustomNavbar', () => CustomNavbar, store, Provider);

Navigation.registerComponent('Home', () => Home, store, Provider);
Navigation.registerComponent('ViewAll', () => ViewAll, store, Provider);
Navigation.registerComponent('AddWidget', () => AddWidget, store, Provider);

Navigation.registerComponent('Discover', () => Discover, store, Provider);
Navigation.registerComponent('Categories', () => Categories, store, Provider);
Navigation.registerComponent('Following', () => Following, store, Provider);
Navigation.registerComponent('NewPodcasts', () => NewPodcasts, store, Provider);
Navigation.registerComponent('TopCharts', () => TopCharts, store, Provider);
Navigation.registerComponent('Search', () => Search, store, Provider);
Navigation.registerComponent('SearchPage', () => SearchPage, store, Provider);

Navigation.registerComponent('Notifications', () => Notifications, store, Provider);

Navigation.registerComponent('Fitness', () => Fitness, store, Provider);
Navigation.registerComponent('News', () => CurrentEvents, store, Provider);
Navigation.registerComponent('Comedy', () => Comedy, store, Provider);
Navigation.registerComponent('Entertainment', () => Entertainment, store, Provider);
Navigation.registerComponent('Gaming', () => Gaming, store, Provider);
Navigation.registerComponent('LearnSomething', () => LearnSomething, store, Provider);
Navigation.registerComponent('Lifestyle', () => LifeStyle, store, Provider);
Navigation.registerComponent('ReligionSpirituality', () => ReligionSpirituality, store, Provider);
Navigation.registerComponent('ScienceNature', () => ScienceNature, store, Provider);
Navigation.registerComponent('SocietyCulture', () => SocietyCulture, store, Provider);
Navigation.registerComponent('Sports', () => Sports, store, Provider);
Navigation.registerComponent('Storytelling', () => StoryTelling, store, Provider);
Navigation.registerComponent('Tech', () => Tech, store, Provider);
Navigation.registerComponent('Travel', () => Travel, store, Provider);
Navigation.registerComponent('Music', () => Music, store, Provider);
Navigation.registerComponent('PopupCategory', () => PopupCategory, store, Provider);

Navigation.registerComponent('RecordFirst', () => RecordFirstPage, store, Provider);
Navigation.registerComponent('Record', () => Record, store, Provider);
Navigation.registerComponent('RecordInfo', () => RecordInfo, store, Provider);
Navigation.registerComponent('RecordSuccess', () => RecordSuccess, store, Provider);
Navigation.registerComponent('InfoDiagram', () => InfoDiagram, store, Provider);

Navigation.registerComponent('Library', () => Library, store, Provider);
Navigation.registerComponent('Queue', () => Queue, store, Provider);
Navigation.registerComponent('Favorites', () => Favorites, store, Provider);
Navigation.registerComponent('MyContent', () => MyContent, store, Provider);
Navigation.registerComponent('Followed', () => FollowedContent, store, Provider);
Navigation.registerComponent('RecentlyPlayed', () => RecentlyPlayed, store, Provider);
Navigation.registerComponent('Playlists', () => Playlists, store, Provider);
Navigation.registerComponent('Highlights', () => Highlights, store, Provider);
Navigation.registerComponent('CatchUp', () => CatchUp, store, Provider);

Navigation.registerComponent('Account', () => Account, store, Provider);
Navigation.registerComponent('MyFollowersPage', () => MyFollowersPage, store, Provider);
Navigation.registerComponent('UserFollowing', () => UserFollowing, store, Provider);
Navigation.registerComponent('UserFollowers', () => UserFollowers, store, Provider);
Navigation.registerComponent('Tracking', () => Tracking, store, Provider);
Navigation.registerComponent('Settings', () => Settings, store, Provider);
Navigation.registerComponent('Achievement', () => Achievement, store, Provider);

Navigation.registerComponent('UserProfile', () => UserProfile, store, Provider);
Navigation.registerComponent('UserProfileModal', () => UserProfileModal, store, Provider);

Navigation.registerComponent('PlayerBottom', () => PlayerBottom, store, Provider);
Navigation.registerComponent('PodcastOptions', () => PodcastOptions, store, Provider);
Navigation.registerComponent('EditPodcast', () => EditPodcast, store, Provider);
Navigation.registerComponent('PlayerInfo', () => PlayerInfo, store, Provider);
Navigation.registerComponent('SetPlayerSpeed', () => SetPlayerSpeed, store, Provider);
Navigation.registerComponent('MyQueue', () => MyQueue, store, Provider);
Navigation.registerComponent('PlayerOptions', () => PlayerOptions, store, Provider);
Navigation.registerComponent('Highlight', () => Highlight, store, Provider);


const config = {
    apiKey: 'AIzaSyCMCsGc-foyjeiknZt9Nw5Sh8NrC2azZUg',
    authDomain: 'tess-36c94.firebaseapp.com',
    databaseURL: 'https://tess-36c94.firebaseio.com',
    projectId: 'tess-36c94',
    storageBucket: 'tess-36c94.appspot.com',
    messagingSenderId: '1071246914359'

};

firebase.initializeApp(config);


Navigation.startSingleScreenApp({
    screen:{
        screen: 'Initial',
        navBarHidden: true,
        navigatorStyle: { screenBackgroundColor: '#fff' },
        navigatorButtons: {backgroundColor: 'white'},
    },
    appStyle: {
        navBarHidden: true,
        orientation: 'portrait',
        bottomTabBadgeTextColor: 'white',
        bottomTabBadgeBackgroundColor: 'white',
        hideBackButtonTitle: true/false
    },

});