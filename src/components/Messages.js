import React, {Component} from 'react';
import {Platform, StyleSheet, SafeAreaView,ScrollView, ImageBackground, Alert, FlatList, TouchableHighlight, Text, TextInput, View, Image, Button, TouchableOpacity,Dimensions} from 'react-native';
import Constants from '../constants/Constants';
import Service from '../services/Service';
import MyView from './MyView';
import Loader from './Loader';
import { addItem } from '../services/ItemService';
import CustomToast from './CustomToast';
import { strings } from '../services/stringsoflanguages';
import { db } from './db';
import {dimensions} from '../styles/base.js'
import OfflineNotice from './OfflineNotice';
import styles from "../styles/styles";
const {width,height} = Dimensions.get('window')
let itemsRef = db.ref('/items');
export default class Messages extends Component {
 constructor(props){
     super(props);
     service = new Service();
     constants = new Constants();
     this.state = {
        userData: { picture_large:{ data:{}}},
        search : true,
        loading:false,
        dummyText : "",
        name: '',
        error: false,
        items: [],
        message : "",
        userResponse: {},
        senderId : "",
        receiverId: "",
        receiverName: "",
        noMessage : " ",
        senderName: " "
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.listHeight = 0
      this.footerY = 0
   
 }
 componentDidMount() {
  
 
    if(this.props.navigation.state.params)
    {
     console.log(this.props.navigation.state.params)
     if(this.props.navigation.state.params.chatDetails.id == undefined)
     {
       console.log('this one working')
     this.setState({ receiverId: this.props.navigation.state.params.chatDetails.receiverId});
     this.setState({ senderId: this.props.navigation.state.params.chatDetails.senderId});
     this.setState({ receiverName: this.props.navigation.state.params.chatDetails.receiverName});
     this.setState({ senderName: this.props.navigation.state.params.chatDetails.senderName});
     }
     else
     {
      
      this.setState({ receiverId: this.props.navigation.state.params.chatDetails.userjob[0].id});
      this.setState({ receiverName: this.props.navigation.state.params.chatDetails.userjob[0].username});
      
      service.getUserData('user').then((keyValue) => {
        //    console.log("local", keyValue);
            var parsedData = JSON.parse(keyValue);
            console.log("userjson", parsedData);
            this.setState({ userResponse: parsedData});
            this.setIds();
         }, (error) => {
            console.log(error) //Display error
          });
       
    //  this.setState({ senderName: this.props.navigation.state.params.chatDetails.user.username});
     }
     }    
    
    this.setState ({ loading: true});
    setTimeout(() => {
    this.setState ({ loading: false});
    this.getFirebaseChat();
    // this.scrollToEndOfList();
    //  setTimeout(() => {
    //   this.flatList.scrollToEnd(); }, 2000);
    this.setState ({  noMessage: strings.NochatFound });
    }, 2000)
 
 
 }

 scrollToEndOfList = () => {
   alert("scrolling not working")
  setTimeout(() => this.refs.scrollView.scrollTo(0), 200)
 }

 setIds = () => {
  this.setState({ senderId: this.state.userResponse.id});
  this.setState({ senderName: this.state.userResponse.username});
 }

 getFirebaseChat = ()=>{

  this.fireBaseUserIds()


 }

 
 NewgetFirebaseChat = (firebaseChatId) => {
   
   console.log("receiverId", this.state.receiverId)
  // console.log("userResponse", this.state.userResponse);
      var receiverId = this.state.receiverId;
      var senderId =   this.state.senderId;
      console.log('receiverId', this.state.receiverId)
      console.log('senderId', this.state.senderId)
     itemsRef.child(firebaseChatId).on('value', (snapshot) => {
      console.log(snapshot.val());
      var messages = [];
      snapshot.forEach(function(childSnapshot) {
      console.log("receiverID",  receiverId);
      console.log(childSnapshot.val());
      if(childSnapshot.val().receiverId == receiverId && childSnapshot.val().senderId == senderId || childSnapshot.val().receiverId == senderId && childSnapshot.val().senderId == receiverId)
      {
      messages.push(childSnapshot.val());
      }
      console.log(childSnapshot.val())
    });
      console.log('messages', messages)
    
      if(messages !== null)
      {  
      this.setState({items: messages});
      if (messages.length < 10) {

      }else{

        setTimeout(() => this.flatList.scrollToEnd(messages.length - 1), 2000)

      }

      }
   });

   
 }

 openMessageList = () => {
  this.props.navigation.navigate('Messages')
}

   
        handleChange(e) {
          this.setState({
            message: e.nativeEvent.text
          });
        }

UserIds = () => 
{
//Check if user1’s id is less than user2'

const FirstString = this.state.senderId + "a" + this.state.receiverId;
const secondString = this.state.receiverId + "a" + this.state.senderId;
var newReturn = "";
var idExist = false;
var idValue = 0

itemsRef.child(FirstString).once('value').then((snapshot) => {

  if (snapshot.val()){

    idExist = true;
    newReturn = FirstString;
  }

});


if (idExist){

this.NewhandleSubmit(newReturn);

}else{

  itemsRef.child(secondString).once('value').then((snapshot) => {

    if (snapshot.val()){

      idExist = true;
      newReturn = secondString;
      this.NewhandleSubmit(newReturn);

    }else{

      console.log(FirstString);
      console.log(secondString);


      newReturn = FirstString;
      this.NewhandleSubmit(newReturn);

    }
  });

 
}

}


fireBaseUserIds = () => 
{
//Check if user1’s id is less than user2'

const FirstString = this.state.senderId + "a" + this.state.receiverId;
const secondString = this.state.receiverId + "a" + this.state.senderId;
var newReturn = "";
var idExist = false;
var idValue = 0

itemsRef.child(FirstString).once('value').then((snapshot) => {

  if (snapshot.val()){

    idExist = true;
    newReturn = FirstString;
  }

});


if (idExist){

this.NewgetFirebaseChat(newReturn);

}else{

  itemsRef.child(secondString).once('value').then((snapshot) => {

    if (snapshot.val()){

      idExist = true;
      newReturn = secondString;
      this.NewgetFirebaseChat(newReturn);

    }else{

      console.log(FirstString);
      console.log(secondString);


      newReturn = FirstString;
      this.NewgetFirebaseChat(newReturn);

    }
  });

 
}

}


handleSubmit() {

  var str = this.state.message;
if (!str.replace(/\s/g, '').length) {

  Alert.alert(
    strings.Alertstring,
    strings.Entermessage,
    [
      
      {text: strings.ok, onPress: () => console.log('OK Pressed')},
    ],
    { cancelable: false }
  )

}else{

  this.UserIds()
}

 // 

}

        NewhandleSubmit=(userChatId)=>{
          if(this.state.message != "" && this.state.message != undefined && this.state.message != " ")
          {

          
          var message  = this.state.message;
          
          console.log(userChatId);
          itemsRef.child(userChatId).push({
            message: this.state.message,
            senderId :this.state.senderId,
            receiverId :this.state.receiverId, 
            senderName : this.state.senderName,
            receiverName : this.state.receiverName,
            time : new Date().toLocaleString()
          
        });
       
        itemsRef.child('users').once('value').then((snapshot) => {
          //  console.log(snapshot.val())
       
           const dataRecieved = snapshot.val();
          // console.log(dataRecieved);

            if(!dataRecieved)
              {
                console.log("users one")
                itemsRef.child('users').push({
                  message: message,
                  senderId :this.state.senderId,
                  receiverId :this.state.receiverId, 
                  senderName : this.state.senderName,
                  receiverName : this.state.receiverName,
                  time : new Date().toLocaleString()
              });
              
             }
          else
           {
           
            console.log("mymessagesss", this.state.message);
            var receiverId = this.state.receiverId;
            var senderId =   this.state.senderId;
            var senderName = this.state.senderName;
            var receiverName = this.state.receiverName;
            
            var data = "";
            itemsRef.child('users').once('value').then((snapshot) => {
            // itemsRef.child('users').on('value', (snapshot) => {
              
       //     console.log("users", snapshot.val());
           var messages = [];
            snapshot.forEach(function(childSnapshot) {
          //    console.log("user", childSnapshot.val())
             
              if(childSnapshot.val().receiverId == receiverId && childSnapshot.val().senderId == senderId || childSnapshot.val().receiverId == senderId && childSnapshot.val().senderId == receiverId)
               {
                messages.push(childSnapshot.val());
               }
              // console.log('messagesUsers', messages.length);
            
            })
            console.log("messagelength", messages.length)
           
              
              
           if (messages.length == 0 )
           {
            console.log("this messages")
            itemsRef.child('users').push({
              message : message,
              senderId : senderId,
              receiverId :receiverId, 
              senderName : senderName,
              receiverName : receiverName,
              time : "21323231"
            }); 
           }
           else{
            console.log("other messages")
           }
           
             });
             console.log("data", data)
            
              }
            });
   
           
            
    
            setTimeout(() => this.flatList.scrollToEnd(), 200)
          // Alert.alert(
          //   'Message Send successfully'
          //  );
           this.setState({
             message: ""
           });
        //   this.props.navigation.navigate('ListItemScreen')
          }
          
        }
      
  

  render() {
   
    return (
        
      <SafeAreaView source={constants.loginbg} style={styles.MainContainer}>
       
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => this.openMessageList()}>
            <Image source={constants.backicon} style={styles.hamburgerIcon} />
          </TouchableOpacity>
          <Text style={styles.toolbarTitle}>{strings.Messages}</Text>
          <TouchableOpacity>
            <Image source={constants.fgggf} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
   
     
      
        {/* <ScrollView 
         style={{width:width,height:height}} 
     > */}
        {
        this.state.items.length > 0
                    ?  <View style={{width:width,marginBottom:120}}><FlatList
          data={this.state.items}
          style = {{width:width }}
          ref={(flatList) => { this.flatList = flatList }}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) =>
          <View style={[ item.senderId == this.state.senderId ? styles.sender : styles.receiver]}>
           <View style={[ item.senderId == this.state.senderId ? styles.senderBackground : styles.receiverBackground]}>
      
<Text style={[ item.senderId == this.state.senderId ? styles.senderText : styles.receiverText]}>{item.message}</Text>
 </View> 
          </View>
          }
          keyExtractor={item => item.email}
        /></View>
      : <Text style={styles.centerText}>{this.state.noMessage}</Text>
                }
                {/* </ScrollView> */}
               
               
                <Text style={styles.title}></Text>
                <View style={{position:"absolute", bottom:0, width:'100%',  backgroundColor: '#fb913b',}}>
                <View style={{flexDirection:'row',   width:'90%', marginLeft:10,  borderRadius:10}}>

                <TextInput
                    style={styles.chatInput}
                    onChangeText={(text)=>this.setState({ message:text})}
                    value={this.state.message}
                    placeholder={strings.typeamessage}
                    returnKeyType="done"
                    paddingLeft={5}
                    multiline
                    />


                <TouchableHighlight
                        style = {styles.button}
                        underlayColor= "white"
                        onPress = {this.handleSubmit}
                    >
                    <Image
                    style={{width:40, height:50 , marginTop:8}}
                    source={require('../images/chat.png')}
                    resizeMode="contain"
                    />
                    </TouchableHighlight>
                    </View>
                    </View>
     <Loader
              loading={this.state.loading} />
 </SafeAreaView>
      
     
    );
  }
}


