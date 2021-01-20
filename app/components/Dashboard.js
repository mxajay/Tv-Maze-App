import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import Header from '../common/Header';
import Footer from '../common/Footer';
var commonStyle = require('../assests/styles');
var s = require('../assests/styles/Dashboard');
import {API} from '../utils/Api';
import {useDeviceOrientation} from '../utils/Hooks';
import {DateFormatter} from '../utils/Functions';
import {Carousel} from '../common/Carousel';
import ImageGrid from '../common/ImageGrid';

const Dashboard = (props) => {
  const [showsArray, setShowsArray] = useState([]);
  const [allImagesArray, setAllImagesArray] = useState([]);
  const [resetSliderLayout, setResetSliderLayout] = useState();
  const deviceOrientation = useDeviceOrientation();

  useEffect(() => {
    setResetSliderLayout(Math.random());
  }, [deviceOrientation]);

  useEffect(() => {
    const paramStr =
      '/schedule/web?date=' + DateFormatter(new Date()) + '&country=US';
    API(paramStr, async function (response) {
      if (response) {
        let tmpSlideData = [];
        await response.map((item) => {
          tmpSlideData.push(item._embedded.show.image.original);
        });
      }
      setShowsArray(response);
    });

    const allShowParamStr = '/shows?page=1';
    API(allShowParamStr, async function (response) {
      if (response) {
        let tmpData = [];
        await response.slice(0, 12).map((item) => {
          tmpData.push({id: item.id, imageUri: item.image.original});
        });
        setAllImagesArray(tmpData);
      }
    });
  }, []);

  const renderShows = ({item}) => (
    <TouchableOpacity
      style={[s.latestUpdatesImageContainer]}
      onPress={() =>
        props.navigation.navigate('Details', {showID: item._embedded.show.id})
      }>
      <Image
        style={[s.latestUpdatesImage]}
        source={{uri: item._embedded.show.image.original}}
      />
      <View style={[s.gridImageTextWrap]}>
        <Text style={{width: '100%', textAlign: 'center'}}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[commonStyle.container]}>
      <StatusBar backgroundColor={'transparent'} translucent={true} />
      <Header navigation={props.navigation} title="Home" />
      <ScrollView style={[commonStyle.body]}>
        <Carousel
          type="slide"
          items={showsArray.reverse()}
          key={resetSliderLayout}
        />
        <View style={{marginTop: 10}}>
          <Text style={[s.horizontalScrollTitle]}>ALL SHOWS</Text>
          <View style={[commonStyle.row]}>
            <FlatList
              data={showsArray}
              renderItem={renderShows}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Text style={[s.horizontalScrollTitle]}>IMAGE GRID</Text>
          <View style={[commonStyle.row, {flexWrap: 'wrap'}]}>
            <ImageGrid
              items={allImagesArray}
              style={{height: 100, width: '33.3%', paddingHorizontal: 5}}
              imageStyles={{borderRadius: 10}}
              onPress={(data) =>
                props.navigation.navigate('Details', {showID: data.id})
              }
            />
          </View>
        </View>

        <View style={{paddingBottom: 30, marginTop: 10}}>
          <Text style={[s.horizontalScrollTitle]}>POPULAR SHOWS</Text>
          <View>
            <Carousel type="slide" items={showsArray} />
          </View>
        </View>
      </ScrollView>
      <Footer navigation={props} />
    </SafeAreaView>
  );
};
export default Dashboard;
