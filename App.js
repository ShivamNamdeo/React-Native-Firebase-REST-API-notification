import React ,{useEffect,useState} from 'react';
import Providers from './navigation';
import {View,Text,Platform,Linking} from "react-native";
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import notifee ,{AndroidStyle,AndroidColor} from '@notifee/react-native';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';


async function saveTokenToDatabase(token) {


  // Assume user is already signed in
  const userId = auth().currentUser.uid;

  // Add the token to the users datastore
  await firestore()
    .collection('users')
    .doc(userId)
    .set({

      //This will generate thr array of tokens in users id
      tokens: firestore.FieldValue.arrayUnion(token),
    },{merge:true});
}

async function onDisplayNotification(payload) {

    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });


  // Display a notification
   await notifee.displayNotification({



        // I used moment to convert timestamp to user readable format if you posting in user readable format don't install moment.
       title: moment(parseInt(payload.data.timestamp)).fromNow()+ " " +payload.data.title,
       body: payload.data.body,
       android: {
         channelId,
         largeIcon:payload.data.user_pic,
         smallIcon:'ic_launcher',
         color:'#2e81f5',
         colorized: true,
       },
   });
  }


async function bootstrap() {
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification) {
    console.log('Notification caused application to open', initialNotification.notification);
    console.log('Press action used to open the app', initialNotification.pressAction);
  }
}

const App = () => {



 useEffect(() => {



    //Getting the request of the notification 
 	  messaging().onMessage((payload) => {
          console.log('Message received. ', payload);
          onDisplayNotification(payload);
    },[]);

     bootstrap();


     // Generate the token
     messaging()
       .getToken()
       .then(token => {
         return saveTokenToDatabase(token);
       });
     return messaging().onTokenRefresh(token => {
       saveTokenToDatabase(token);
     });
   }, []);



  //Your navigation content or optional any component you want return.
  return <Providers />;
}

export default App;
