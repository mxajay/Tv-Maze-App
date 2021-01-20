import React, {Fragment} from 'react';
import {View, ScrollView, Text, Image, ActivityIndicator} from 'react-native';
import {carousel, slider, stats} from '../assests/styles/Caroucel';
import {COLORS} from '../utils/Constants';

export const Slider = (props) => {
  const {item} = props;
  return (
    <View style={[slider.slide, {}]}>
      <Image
        style={{width: '100%', height: '100%'}}
        source={{
          uri: item._embedded.show.image.original,
        }}
      />
      <View
        style={[
          slider.slideTextWrap,
          {borderTopLeftRadius: 15, borderTopRightRadius: 15},
        ]}>
        <Text style={[slider.slideText, {}]}>{item.name}</Text>
        {/* <Text style={[slider.slideText, {}]}>{item.overview}</Text> */}
      </View>
    </View>
  );
};

export const BannerSlider = (props) => {
  const {style, item} = props;
  return (
    <View style={[stats.stat]}>
      <View style={[stats.statHold]}>
        <Image
          style={{width: '100%', height: 70, ...style}}
          source={{
            uri: item._embedded.show.image.original,
          }}
        />
      </View>
    </View>
  );
};

export const Carousel = (props) => {
  const {style, items, type} = props;
  const itemsPerInterval =
    props.itemsPerInterval === undefined ? 1 : props.itemsPerInterval;

  const [interval, setInterval] = React.useState(1);
  const [intervals, setIntervals] = React.useState(1);
  const [width, setWidth] = React.useState(0);

  const init = (width) => {
    // initialise width
    setWidth(width);
    // initialise total intervals
    const totalItems = items.length;
    setIntervals(Math.ceil(totalItems / itemsPerInterval));
  };

  const getInterval = (offset) => {
    for (let i = 1; i <= intervals; i++) {
      if (offset + 1 < (width / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        return i;
      }
    }
  };

  let bullets = [];
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...carousel.bullet,
          opacity: interval === i ? 0.5 : 0.1,
        }}>
        &bull;
      </Text>,
    );
  }

  return (
    <View style={[carousel.container, {}]} {...props}>
      {items && items.length > 0 ? (
        <Fragment>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              ...carousel.scrollView,
              width: `${100 * intervals}%`,
            }}
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={(w, h) => init(w)}
            onScroll={(data) => {
              setWidth(data.nativeEvent.contentSize.width);
              setInterval(getInterval(data.nativeEvent.contentOffset.x));
            }}
            scrollEventThrottle={200}
            pagingEnabled
            decelerationRate="fast">
            {items.map((item, index) => {
              switch (type) {
                case 'stats':
                  return <BannerSlider key={index} style={style} item={item} />;
                default:
                  return <Slider key={index} item={item} />;
              }
            })}
          </ScrollView>
          <View style={[carousel.bullets, {}]}>{bullets}</View>
        </Fragment>
      ) : (
        <View style={[slider.slide, {alignSelf: 'center'}]}>
          <ActivityIndicator size="large" color={COLORS.APP_COLOR} />
        </View>
      )}
    </View>
  );
};
export default Carousel;
