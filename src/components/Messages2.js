import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  ImageBackground,
  Button,
  TextInput, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert
} from "react-native";
import Constants from "../constants/Constants";
import Service from "../services/Service";
import styles from "../styles/styles";
import MyView from './MyView';
import Loader from './Loader';
import SideMenu from './SideMenu';
import firebase  from './Config';
import OfflineNotice from './OfflineNotice';
import { strings } from "../services/stringsoflanguages";
import { db } from './db';
let itemsRef = db.ref('/items');
export default class Messages2 extends Component {
  constructor(props) {
    super(props);
    service = new Service();
    constants = new Constants();
    this.state = {
      userResponse: {},
      jobs: [],
      failed: false,
      search : true,
      loading:false,
      noProject : " ",
      modalVisible: false,
      senderId : " ", 
      noMessage : " ",
      items: []
    };
    this.arrayholder = []
   
   
  }

  

  componentDidMount() {
    console.log("this one")
    service.getUserData('user').then((keyValue) => {
      console.log("local", keyValue);
      var parsedData = JSON.parse(keyValue);
      console.log("json", parsedData);
      this.setState({ userResponse: parsedData});
      this.setState({ senderId: parsedData.id});
      this.chat();
   }, (error) => {
      console.log(error) //Display error
    });
    
   }

   chat = () => {
    console.log("senderId", this.state.senderId);
    var messagesList = [];
    var senderId = this.state.senderId;
    itemsRef.child("users").on('value', (snapshot) => {
      console.log("usevalue", snapshot.val());
      snapshot.forEach(function(childSnapshot) {
       
        console.log("receiverID",  childSnapshot.val());
     //   console.log(this.state.receiverId);
        if(childSnapshot.val().senderId == senderId || childSnapshot.val().receiverId == senderId)
        {
         messagesList.push(childSnapshot.val());
        }
        console.log(childSnapshot.val())
      });
      console.log('messagesList', messagesList.length)
     // console.log(snapshot.val())
      if(messagesList.length !== 0)
      {    
      this.setState({items: messagesList});
      }
      else 
      {
      // alert('this obeee')
      this.setState ({  noMessage: strings.NomessagesFound });
      }
   });
   }
  
    
   openDrawer = () => {
    this.props.navigation.openDrawer()}

 checkLanguage=()=>{
  service.getUserData("language").then(
    keyValue => {
     if(keyValue == "true")
     {
      strings.setLanguage("en");
    }else{
      strings.setLanguage("ar");
    }
        
    },
    error => {
      console.log(error); //Display error
    }
  );

 }
    
 openChat = (val) => {
   console.log()
   if(val.senderId !== this.state.userResponse.id)
   {
    var Ids = val.senderId;
    val.senderId = val.receiverId ;
    val.receiverId = Ids;
   }
  this.props.navigation.navigate('Chat', { chatDetails: val})
 }

  render() {
    return (
      <SafeAreaView source={constants.loginbg} style={styles.container}>
      <OfflineNotice/>
        <View style={styles.topView}>
        <MyView style={styles.tabsToolbar}>
        <TouchableOpacity onPress={() => this.openDrawer()}>
        <Image source={constants.menuicon} style={styles.hamburgerIcon} />
        </TouchableOpacity>
         <Text style={styles.toolbarTitle}>{strings.Messages}</Text>
         <TouchableOpacity onPress={() => this.goToNotification()}>
        </TouchableOpacity>
         <TouchableOpacity onPress={() => this.goToPostproject()}>
         <Image  style={styles.searchIcon} />
        </TouchableOpacity>
        </MyView>
       </View>
       
      
       <Text style={styles.centerTextMessage}>{this.state.noMessage}</Text>
        <View style={styles.listCenter}>
      
        <FlatList
              data={this.state.items}
              keyExtractor={(item, index) => index}
              style={styles.listCardWidth}
              extraData={this.state.items}
              renderItem={({ item, index }) => (
                <View  style={styles.spaceFromTop}>
                    <TouchableOpacity style={styles.listCard}  onPress={() => this.openChat(item)}>
                     <View style={styles.rowAlignSideMenuRequest}>
                          <View style={styles.firstText}> 
                          <Text style={styles.textWrap}> {item.senderName == this.state.userResponse.username ? item.receiverName : item.senderName  } 
                          </Text>
                          </View>
                          <View style={styles.emptyText}> 
                          </View>
                          <View style={styles.secondText}> 
                          <Text style={styles.textWrap2}> {item.start_date}
                          </Text>
                          </View>
                      </View>
                      <View style={styles.rowAlignSideMenuRequest}>
                          {/* <View style={styles.firstText2}> 
                              <View style={styles.textInRow}> 
                                <View >
                                    <Text style={styles.priceText}>{strings.FixedPrice}</Text>
                                  </View>
                                  <View style={styles.contPadding}>
                                    <Text >-</Text>
                                  </View>
                                  <View >
                                    <Text style={styles.date}> {item.budget} SAR </Text>
                                  </View>
                                </View>
                              </View> */}
                          <View style={styles.emptyText2}> 
                          </View>
                          <View style={styles.secondText2}> 
                         
                          </View>
                      </View>
                        </TouchableOpacity>
                </View>
              )}
            />
        </View>
        <Loader
              loading={this.state.loading} />
      </SafeAreaView>
    );
  }
}
