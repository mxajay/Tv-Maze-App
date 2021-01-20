'use strict';
var React = require('react-native');
var {StyleSheet} = React;

module.exports = StyleSheet.create({
  container: {flex: 1, position: 'relative', backgroundColor: '#000'},
  body: {flex: 1, backgroundColor: '#000', padding: 15},
  row: {flexDirection: 'row'},
  primaryColor: {color: '#e2322e'},
  // HEADER STYLE
  header: {
    width: '100%',

    backgroundColor: '#000',
  },
  drawerTogglerContainer: {
    width: '100%',
  },
  drawerTogglerImage: {
    height: 25,
    width: 28,
    marginTop: 30,
    marginLeft: 10,
  },
  hambergurContainer: {flex: 1, backgroundColor: '#000'},
  hambergurTopSection: {
    justifyContent: 'center',
    height: '20%',
    backgroundColor: '#e2322e',
  },
  hambergurProfileContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  hambergurProfileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginLeft: 10,
    marginTop: 20,
  },
  hambergurProfileInfo: {
    justifyContent: 'center',
    height: '90%',
    marginRight: 20,
  },
  hambergurBottomSection: {padding: 10},
  hambergurBottomMenu: {
    height: 38,
    width: '100%',
    marginVertical: 5,
    justifyContent: 'center',
  },
  hambergurBottomMenuText: {
    fontSize: 20,
    color: '#e2322e',
    marginLeft: 30,
    fontStyle: 'italic',
  },
  hambergurCopyrightSection: {
    color: '#e2322e',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    fontStyle: 'italic',
  },
  // FOOTER STYLE
  footer: {
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  footerIconContainer: {
    width: '25%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    height: 30,
    width: 30,
  },

  // COMMON ALL OVER APP
});
