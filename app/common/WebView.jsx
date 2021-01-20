import React from 'react';
import {StyleSheet, View} from 'react-native';
import {WebView} from 'react-native-webview';
import Footer from './Footer';
import AsyncStorage from '@react-native-community/async-storage';

export default class WebViewScreen extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      screenFrom: navigation.getParam('fromScreen')
        ? navigation.getParam('fromScreen')
        : null,
    };
  }

  render() {
    var webviewUri =
      'http://demos.maxdigi.co/digital-stamp/city-rewards2.0/services/web-view/' +
      this.props.navigation.state.params.webPage +
      '.php';
    // var webviewUri =
    //   'https://digitalstamp.app/city-rewards1.0/services/web-view/' +
    //   this.props.navigation.state.params.webPage +
    //   '.php';
    console.log(webviewUri);
    return (
      <View style={styles.container}>
        <WebView
          source={{uri: webviewUri}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
        />
        {this.state.screenFrom ? (
          <View />
        ) : (
          <Footer navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 0,
  },
});
