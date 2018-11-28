// About Us Page
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  ImageBackground,
  Button,
  TouchableOpacity
} from "react-native";
import Constants from "../constants/Constants";
import Service from "../services/Service";
import { strings } from "../services/stringsoflanguages";
import OfflineNotice from './OfflineNotice';

export default class About extends Component {
  constructor(props) {
    super(props);
    service = new Service();
    constants = new Constants();
    this.state = {
      userData: { picture_large: { data: {} } },
      stt : 0
    };
  }

  componentDidMount() {
    this.checkStatus();
  }

  openDrawer = () => {
    this.props.navigation.openDrawer();
  };

  goToProfile = () => {
    this.props.navigation.navigate("Profile");
  };

  checkStatus=()=>{
    
     service.getUserData('firstStatus').then((keyValue) => {
  
     console.log("local", keyValue);
    
     if (keyValue == "none"){
    
     this.setState({stt:0});
    
    
     }else{
    
     this.setState({stt:1});
    
     }
     
    
     
    }, (error) => {
     console.log(error) //Display error
    });
    
    
    }

  render() {
    return (
      <SafeAreaView source={constants.loginbg} style={styles.MainContainer}>
       <OfflineNotice/>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => this.openDrawer()}>
            <Image source={constants.menuicon} style={styles.hamburgerIcon} />
          </TouchableOpacity>
          <Text style={styles.toolbarTitle}>{strings.About}</Text>
          <TouchableOpacity>
            <Image source={constants.fgggf} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{ width: "90%", paddingTop: 30 }}>
            <Text style={{ fontSize: 20 }}>
              Every Individual Deserves a Website We believe every individual
              should have the power to create their own website or online store.
              If you can point and click, you can create a professional website
              or online store using our free and intuitive tools.
            </Text>
          </View>
          <View style={{ width: "90%", paddingTop: 20 }}>
            <Text style={{ fontSize: 20 }}>
              Our Customers Mean the World At Website.com, we strive to provide
              exactly what our customers are looking for. A huge part of our
              brainstorming process is looking at our client feedback to make
              sure you're well taken care of.
            </Text>
          </View>
          <View style={{ width: "90%", paddingTop: 20 }}>
            <Text style={{ fontSize: 20 }}>
              We are personally committed to delivering the very best
            </Text>
          </View>
        </ScrollView>

        {this.state.stt == 0 ? <TouchableOpacity
          style={styles.bottomViewAbout}
          onPress={() => this.goToProfile()}
        >
          <Text style={styles.textStyle}>{strings.Gotoprofile}</Text>
        </TouchableOpacity> : null}
      </SafeAreaView>
    );
  }
}
