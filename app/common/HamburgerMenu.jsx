import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {HAMBERGUR_MENU} from '../utils/Constants';
var commonStyle = require('../assests/styles');

const HamburgerMenu = ({navigation}) => {
  return (
    <View style={[commonStyle.hambergurContainer]}>
      <View style={[commonStyle.hambergurTopSection]}>
        <View style={[commonStyle.row, commonStyle.hambergurProfileContainer]}>
          <Image
            style={commonStyle.hambergurProfileImage}
            width={130}
            height={130}
            source={require('../assests/images/user.png')}
          />
          <View style={commonStyle.hambergurProfileInfo}>
            <Text style={{fontSize: 20, textTransform: 'capitalize'}}>
              Ajay Kumar
            </Text>
          </View>
        </View>
      </View>
      <View style={[commonStyle.hambergurBottomSection]}>
        {HAMBERGUR_MENU.map((menu) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(menu.screen)}
              style={[commonStyle.hambergurBottomMenu]}
              key={menu.id}>
              <View style={[commonStyle.row, {alignItems: 'center'}]}>
                <Image
                  style={[commonStyle.drawerTogglerImage, {marginTop: 0}]}
                  source={menu.image}
                />
                <Text style={[commonStyle.hambergurBottomMenuText]}>
                  {menu.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default HamburgerMenu;
