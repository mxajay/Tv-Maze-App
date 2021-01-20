import * as React from 'react';
import {Alert} from 'react-native';
export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (name) {
    navigationRef.current?.navigate(name, params);
  } else {
    Alert.alert('Notice', 'Currently Not Available');
  }
}

export function DateFormatter(date) {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var yyyy = date.getFullYear();
  date = yyyy + '-' + mm + '-' + dd;
  return date;
}
