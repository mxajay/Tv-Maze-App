import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
var commonStyle = require('../assests/styles');

const Header = (props) => {
  const {navigation} = props;
  return (
    <View style={[commonStyle.header]}>
      <TouchableOpacity
        style={[
          commonStyle.drawerTogglerContainer,
          commonStyle.row,
          {paddingVertical: 10},
        ]}
        onPress={() => navigation.toggleDrawer()}>
        <Image
          style={[commonStyle.drawerTogglerImage]}
          source={require('../assests/icons/menu.png')}
        />
        <Text
          style={{color: 'red', marginLeft: 30, marginTop: 25, fontSize: 24}}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;
