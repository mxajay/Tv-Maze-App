'use strict';
var React = require('react-native');
var {StyleSheet} = React;

module.exports = StyleSheet.create({
  horizontalScrollTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#e2322e',
  },
  carouselView: {
    padding: 10,
  },
  latestUpdatesImageContainer: {
    height: 130,
    width: 150,
    marginRight: 5,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 15,
  },
  latestUpdatesImage: {
    height: '100%',
    width: '100%',
  },
  gridImageTextWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
  },
  gridImageText: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
});
