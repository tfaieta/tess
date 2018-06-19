const functions = require('firebase-functions');
const admin = require('firebase-admin');
const _ = require('lodash');
const firebase = require('firebase');
var DomParser = require('react-native-html-parser').DOMParser;


admin.initializeApp(functions.config().firebase);



exports.notificationPOTW = functions.database.ref(`/podcastOfTheWeek`)
    .onUpdate(event => {

        const getValuePromise = admin.database().ref(`podcastOfTheWeek`).once('value');

        return getValuePromise.then(snapshot => {
            console.log(snapshot.val());
            const podOfTheWeek = snapshot.val();

            const payload = {
                notification: {
                    title: "New Podcast of the Week!",
                    body: podOfTheWeek,
                    target: podOfTheWeek
                }
            };

            const topic = 'POTW';
            return admin.messaging()
                .sendToTopic(topic, payload);

        })
    });



exports.notificationNewEp = functions.database.ref(`/podcasts/{podcastKey}`)
    .onWrite((event) => {

        const episode = event.data.val();

            const podcastTitle = episode.podcastTitle;
            const podcastDescription = episode.podcastDescription;
            const podcastCategory = episode.podcastCategory;
            const id = event.key;
            const podcastArtist = episode.podcastArtist;
            const podcastURL = episode.podcastURL;
            const RSSID = episode.RSSID;
            const rss = episode.rss;

            const payload = {
                notification: {
                    title: "New Episode from " + podcastArtist,
                    body: podcastTitle,
                    target: podcastArtist,
                    id: id
                },
                podcast: {
                    podcastTitle: podcastTitle,
                    podcastArtist: podcastArtist,
                    podcastCategory: podcastCategory,
                    podcastDescription: podcastDescription,
                    podcastURL: podcastURL,
                    id: id,
                    RSSID: RSSID,
                    rss: rss
                }
            };

            const topic = `/topics/${podcastArtist}`;

            return admin.messaging()
                .sendToTopic(topic, payload);

    });




exports.notificationFollow = functions.database.ref(`/users/{id}/followers`)
    .onCreate(event => {

        const getValuePromise = admin.database.ref(`users/${event.key}/token`).once('value');

        return getValuePromise.then(snapshot => {
            const token = snapshot.val();
            const podcastArtist = event.val();

            const payload = {
                notification: {
                    title: "New Follow!",
                    body: podcastArtist + " is now following you",
                    target: podcastArtist,
                    id: podcastArtist,
                },
            };

            return admin.messaging()
                .sendToDevice(token, payload)

        })
    });




exports.feedFetcher = functions.database.ref(`/feedFetcher`)
    .onUpdate(event => {


        // loop for every rss feed in database
        const getValuePromise = admin.database().ref('feeds').on("value", function (snapshot) {
            snapshot.forEach(function (snap) {
                console.log(snap.val());

                void fetch(snap.val())
                    .then((response) => response.text())
                    .then((responseData) => {

                        var doc = new DomParser().parseFromString(responseData,'text/html');
                        var items = doc.getElementsByTagName('item');
                        var channel = doc.getElementsByTagName("title");


                        // profile bio
                        var userBio = "";
                        let bio = "";
                        if(doc.getElementsByTagName("description").length > 0){
                            userBio = doc.getElementsByTagName("description");
                            bio = userBio[0].textContent;
                            bio = bio.replace("<p>", " ");
                            bio = bio.replace("</p>", " ");
                            bio = bio.replace("<a", " ");
                            bio = bio.replace("</a>", " ");
                            bio = bio.replace("href=", " ");
                            bio = bio.replace("rel=", " ");
                            bio = bio.replace("target=", " ");
                            bio = bio.replace("<em/>", " ");
                            bio = bio.replace("<em>", " ");
                            bio = bio.replace("&nbsp", " ");
                        }


                        // profile image
                        let profileImage = '';
                        if(doc.getElementsByTagName("image").length >0){
                            const image = doc.getElementsByTagName("image");
                            const pI = image[0].getElementsByTagName('url');
                            profileImage = pI[0].textContent;

                            console.log(profileImage);

                        }

                        // profile username
                        let username = channel[0].textContent;
                        let usernameData = channel[0].textContent;
                        usernameData = usernameData.replace("#", " ");
                        usernameData = usernameData.replace("$", " ");
                        usernameData = usernameData.replace("[", " ");
                        usernameData = usernameData.replace("]", " ");
                        usernameData = usernameData.replace(".", "");
                        usernameData = usernameData.replace("http://", "");


                        // category
                        let category = '';
                        if(doc.getElementsByTagName('itunes:category').length > 0){
                            category = doc.getElementsByTagName('itunes:category')[0].getAttribute('text');
                        }
                        const podcastCategory = category;
                        console.log(podcastCategory);



                        // create account for user if it doesn't exist
                        // reserve username & create user if needed
                        admin.database().ref(`users`).child(usernameData).once("value", function (snapshot) {
                            if(snapshot.val()){
                                console.log("Account Exists: " + usernameData)
                            }
                            else{
                                admin.database().ref(`users`).child(usernameData).child("/username").update({username});
                                admin.database().ref(`users`).child(usernameData).child("/bio").update({bio});
                                admin.database().ref(`users`).child(usernameData).child("/profileImage").update({profileImage});
                                admin.database().ref(`usernames`).child(usernameData.toLowerCase()).update({username: usernameData.toLowerCase()});
                            }
                        });



                        // get info for each episode
                        // items.length gets max size of rss feed, 0 is most recent
                        let size = 0;
                        if(items.length >= 4){
                            size = 4;
                        }
                        else{
                            size = items.length-1
                        }
                        for (var i=size; i >= 0; i--) {

                            //artist
                            let podcastArtist = usernameData;

                            //title
                            const title = items[i].getElementsByTagName('title');
                            console.log(title[0].textContent);
                            let podcastTitle = title[0].textContent;

                            //description
                            const description = items[i].getElementsByTagName('description');
                            console.log(description[0].textContent);
                            let podcastDescription = description[0].textContent;
                            podcastDescription = podcastDescription.replace("<p>", " ");
                            podcastDescription = podcastDescription.replace("</p>", " ");
                            podcastDescription = podcastDescription.replace("<a", " ");
                            podcastDescription = podcastDescription.replace("&amp", " ");
                            podcastDescription = podcastDescription.replace("href=", " ");
                            podcastDescription = podcastDescription.replace("<em>", " ");
                            podcastDescription = podcastDescription.replace("</em>", " ");
                            podcastDescription = podcastDescription.replace("</a>", " ");
                            podcastDescription = podcastDescription.replace("<h2", " ");
                            podcastDescription = podcastDescription.replace("id=", " ");
                            podcastDescription = podcastDescription.replace("</h2>", " ");
                            podcastDescription = podcastDescription.replace("</p>", " ");
                            podcastDescription = podcastDescription.replace("<br>", " ");
                            podcastDescription = podcastDescription.replace("<div>", " ");
                            podcastDescription = podcastDescription.replace("</div>", " ");
                            podcastDescription = podcastDescription.replace("<ul>", " ");
                            podcastDescription = podcastDescription.replace("<li>", " ");
                            podcastDescription = podcastDescription.replace("</li>", " ");
                            podcastDescription = podcastDescription.replace("<strong>", " ");
                            podcastDescription = podcastDescription.replace("</strong>", " ");
                            podcastDescription = podcastDescription.replace("<sup>", " ");
                            podcastDescription = podcastDescription.replace("</sup>", " ");
                            podcastDescription = podcastDescription.replace("<br><br>", " ");
                            podcastDescription = podcastDescription.replace("<br>", " ");



                            //length
                            let length = '';
                            if(items[i].getElementsByTagName('itunes:duration').length > 0){
                                length = "itunes duration:" + items[i].getElementsByTagName('itunes:duration');
                                length = length.replace("itunes duration:", "");
                                length = length.replace("<itunes:duration>", "");
                                length = length.replace("</itunes:duration>", "");
                            }
                            const podcastLength = length;
                            console.log(podcastLength);



                            //rss = true, need to tell firebase it's an rss podcast
                            const rss = true;



                            //likes = 0
                            const likes = 0;

                            //joint title (for database)
                            let jointTitle = podcastArtist + podcastTitle;
                            if(jointTitle.length > 60 ){
                                jointTitle = (jointTitle.slice(0,60))
                            }
                            jointTitle = jointTitle.replace("#", "_");
                            jointTitle = jointTitle.replace("$", "_");
                            jointTitle = jointTitle.replace("[", "_");
                            jointTitle = jointTitle.replace("]", "_");
                            jointTitle = jointTitle.replace(".", "_");
                            const RSSID = jointTitle;

                            // get url -> upload
                            if(items[i].getElementsByTagName('enclosure').length > 0){
                                var link = items[i].getElementsByTagName('enclosure')[0].getAttribute('url');
                                console.log(link);
                                const podcastURL = link;


                                // upload to database if doesn't exist (follow podcastCreate)
                                admin.database().ref(`podcasts`).orderByChild("RSSID").equalTo(jointTitle.toString()).once("value", function (snapshot) {
                                    if(snapshot.val()){
                                        console.log("EXISTS")
                                    }
                                    else{
                                        let item = admin.database().ref(`podcasts`).push({podcastTitle, podcastDescription, podcastURL, podcastArtist, rss, podcastCategory, likes, RSSID, podcastLength})
                                        const ref = item.ref;
                                        const id = item.key;
                                        ref.update({id});
                                        admin.database().ref(`/users/${podcastArtist}`).child('podcasts').child(id).update({id});

                                    }

                                });


                            }
                            // another way of getting url -> upload
                            else if(items[i].getElementsByTagName('link').length > 0){
                                var link2 = items[i].getElementsByTagName('link');
                                console.log(link2[0].textContent);
                                const podcastURL = link2[0].textContent;


                                // upload to database if doesn't exist (follow podcastCreate)
                                admin.database().ref(`podcasts`).orderByChild("RSSID").equalTo(jointTitle.toString()).once("value", function (snapshot) {
                                    if(snapshot.val()){
                                        console.log("EXISTS")
                                    }
                                    else{
                                        let item = admin.database().ref(`podcasts`).push({podcastTitle, podcastDescription, podcastURL, podcastArtist, rss, podcastCategory, likes, RSSID, podcastLength});
                                        const ref = item.ref;
                                        const id = item.key;
                                        ref.update({id});
                                        admin.database().ref(`/users/${podcastArtist}`).child('podcasts').child(id).update({id});

                                    }

                                });

                            }
                            else{
                                console.log("Error: no download url")
                            }
                        }

                        throw (promise);

                    });


            });


            throw (promise);

        });

        return getValuePromise;



    });