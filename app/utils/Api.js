import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {API_BASE_URL} from '../utils/Constants';

export async function API(paramStr, callback) {
  if (NetInfo != null) {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        console.log(API_BASE_URL + paramStr);
        fetch(API_BASE_URL + paramStr, {method: 'GET'})
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson) {
              callback(responseJson);
            } else {
              callback(responseJson);
            }
          })
          .catch((error) => {
            console.warn(error);
          });
      } else {
        Alert.alert('Notice', 'You are not connected to internet.');
      }
    });
  }
}
