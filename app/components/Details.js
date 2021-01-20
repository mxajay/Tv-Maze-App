import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import HTML from 'react-native-render-html';

import Header from '../common/Header';
import Footer from '../common/Footer';
var commonStyle = require('../assests/styles');
import {API} from '../utils/Api';
import Spinner from '../common/Spinner';

const Details = (props) => {
  const [spinner, setSpinner] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    const paramStr = '/shows/' + props.route.params.showID;
    API(paramStr, async function (response) {
      setShowDetails(response);
      setSpinner(false);
    });
  }, [props.route.params]);

  return (
    <SafeAreaView style={[commonStyle.container]}>
      <Header navigation={props.navigation} title="Details" />
      <Spinner spinner={spinner} />
      {showDetails && (
        <ScrollView style={[commonStyle.body]}>
          <View style={{height: 200}}>
            {showDetails.image && (
              <Image
                style={{width: '100%', height: '100%', borderRadius: 10}}
                source={{
                  uri: showDetails.image.original,
                }}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={[s.detailContainer]}>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title, {fontSize: 18}]}>{`Name : `}</Text>
              <Text style={[s.titleDescription, {fontSize: 18}]}>
                {showDetails.name}
              </Text>
            </View>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Type : `}</Text>
              <Text style={[s.titleDescription]}>{showDetails.type}</Text>
            </View>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Language : `}</Text>
              <Text style={[s.titleDescription]}>{showDetails.language}</Text>
            </View>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Type : `}</Text>
              <Text style={[s.titleDescription]}>
                {showDetails.genres.join(' | ')}
              </Text>
            </View>

            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Status : `}</Text>
              <Text style={[s.titleDescription]}>{showDetails.status}</Text>
            </View>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Premiered : `}</Text>
              <Text style={[s.titleDescription]}>{showDetails.premiered}</Text>
            </View>
            <View style={[commonStyle.row, s.detailContainer]}>
              <Text style={[s.title]}>{`Official Site : `}</Text>
              <Text style={[s.titleDescription]}>
                {showDetails.officialSite}
              </Text>
            </View>
            <View style={[commonStyle.row]}>
              <Text style={[s.title]}>{`Air Timing : `}</Text>
              <Text style={[s.titleDescription]}>
                {`At ` +
                  showDetails.schedule.time +
                  ` On these days ` +
                  showDetails.schedule.days.toString()}
              </Text>
            </View>
            <View style={{paddingBottom: 30}}>
              <Text style={[s.title]}>{`Summary : `}</Text>
              <HTML
                source={{html: showDetails.summary}}
                tagsStyles={{
                  p: {
                    fontStyle: 'italic',
                    color: 'red',
                  },
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
      <Footer navigation={props} />
    </SafeAreaView>
  );
};
export default Details;

const s = StyleSheet.create({
  detailContainer: {
    paddingVertical: 4,
  },
  title: {
    color: '#FFF',
    fontSize: 14,
  },
  titleDescription: {
    color: 'red',
    fontStyle: 'italic',
  },
});
