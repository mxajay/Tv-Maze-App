import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import Header from '../common/Header';
import Footer from '../common/Footer';
var commonStyle = require('../assests/styles');
import {API} from '../utils/Api';
import Spinner from '../common/Spinner';
import ImageGrid from '../common/ImageGrid';

const Search = (props) => {
  const [spinner, setSpinner] = useState(false);
  const [imagesArray, setImagesArray] = useState([]);

  async function constructImageGridArray(data) {
    if (data && data.length > 0) {
      let tmpData = [];
      await data.map((item) => {
        if (item.show && item.show.image) {
          tmpData.push({
            id: item.show.id,
            imageUri: item.show.image.original,
          });
        }
      });
      setImagesArray(tmpData);
    }
  }

  function searchShows(keyText = null) {
    if (keyText) {
      setSpinner(true);
      const trendingParamStr = '/search/shows?q=' + keyText;
      API(trendingParamStr, function (response) {
        constructImageGridArray(response);
        setSpinner(false);
      });
      return;
    }
    setImagesArray([]);
  }

  return (
    <SafeAreaView style={[commonStyle.container]}>
      <Header navigation={props.navigation} title="Search" />
      <Spinner spinner={spinner} />
      <ScrollView style={[commonStyle.body]}>
        <View>
          <TextInput
            style={[s.textInput]}
            onChangeText={(text) => searchShows(text)}
            placeholderTextColor="red"
            placeholder="Search here...."
          />
        </View>
        {imagesArray && imagesArray.length > 0 && (
          <View style={[commonStyle.row, {flexWrap: 'wrap', marginTop: 10}]}>
            <ImageGrid
              items={imagesArray}
              style={{height: 100, width: '33.3%', paddingHorizontal: 5}}
              imageStyles={{borderRadius: 10}}
              onPress={(data) =>
                props.navigation.navigate('Details', {
                  showID: data.id,
                })
              }
            />
          </View>
        )}
      </ScrollView>
      <Footer navigation={props} />
    </SafeAreaView>
  );
};
export default Search;

const s = StyleSheet.create({
  textInput: {
    width: '100%',
    alignSelf: 'center',
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    color: 'red',
    paddingHorizontal: 20,
  },
});
