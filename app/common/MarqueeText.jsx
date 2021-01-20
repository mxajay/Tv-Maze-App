import React from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  Text,
  View,
  ScrollView,
  NativeModules,
  findNodeHandle,
} from 'react-native';

const {UIManager} = NativeModules;

//  USAGE IN RENDER
/* <MarqueeText
  style={[s.marqueBlock]}
  duration={2000}
  marqueeOnStart
  loop
  marqueeDelay={1000}
  marqueeResetDelay={1000}>
  <Text>{this.state.marqueeTag}</Text>
</MarqueeText>; */

export default class MarqueeText extends React.Component {
  static defaultProps = {
    style: {},
    duration: 3000,
    easing: Easing.inOut(Easing.ease),
    loop: false,
    marqueeOnStart: false,
    marqueeDelay: 0,
    marqueeResetDelay: 0,
    onMarqueeComplete: () => {},
    useNativeDriver: true,
  };

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.contentFits = false;
    this.distance = null;
    this.textRef = null;
    this.containerRef = null;

    this.state = {
      animating: false,
    };

    this.invalidateMetrics();
  }

  componentDidMount() {
    const {marqueeDelay} = this.props;
    if (this.props.marqueeOnStart) {
      this.startAnimation(marqueeDelay);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.children !== nextProps.children) {
      this.invalidateMetrics();
      this.resetAnimation();
    }
  }

  componentWillUnmount() {
    if (this.state.animating) {
      this.stopAnimation();
    }
    this.clearTimeout();
  }

  startAnimation(timeDelay) {
    if (this.state.animating) {
      return;
    }
    this.start(timeDelay);
  }

  stopAnimation() {
    this.stop();
  }

  resetAnimation() {
    const {marqueeDelay} = this.props;
    const marqueeResetDelay = Math.max(100, this.props.marqueeResetDelay);
    this.setTimeout(() => {
      this.animatedValue.setValue(0);
      this.setState({animating: false}, () => {
        this.startAnimation(marqueeDelay);
      });
    }, marqueeResetDelay);
  }

  start(timeDelay) {
    const {
      duration,
      easing,
      loop,
      onMarqueeComplete,
      useNativeDriver,
    } = this.props;

    const callback = () => {
      this.setState({animating: true});

      this.setTimeout(() => {
        this.calculateMetrics();

        if (!this.contentFits) {
          Animated.timing(this.animatedValue, {
            toValue: -this.distance,
            duration: duration,
            easing: easing,
            useNativeDriver,
          }).start(({finished}) => {
            if (finished) {
              if (loop) {
                this.resetAnimation();
              } else {
                this.stop();
                onMarqueeComplete();
              }
            }
          });
        }
      }, 100);
    };
    this.setTimeout(callback, timeDelay);
  }

  stop() {
    this.animatedValue.setValue(0);
    this.setState({animating: false});
  }

  shouldAnimate(distance) {
    return distance > 0;
  }

  async calculateMetrics() {
    try {
      const measureWidth = node =>
        new Promise(resolve => {
          UIManager.measure(findNodeHandle(node), (x, y, w) => {
            // console.log('Width: ' + w);
            return resolve(w);
          });
        });

      const [containerWidth, textWidth] = await Promise.all([
        measureWidth(this.containerRef),
        measureWidth(this.textRef),
      ]);

      this.distance = textWidth - containerWidth;
      this.contentFits = !this.shouldAnimate(this.distance);

      return [];
    } catch (error) {
      console.warn(error);
    }
  }

  invalidateMetrics() {
    this.distance = null;

    this.contentFits = false;
  }

  clearTimeout() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setTimeout(fn, time = 0) {
    this.clearTimeout();
    this.timer = setTimeout(fn, time);
  }

  render() {
    const {children, style, ...rest} = this.props;
    const {animating} = this.state;
    const {width, height} = StyleSheet.flatten(style);

    return (
      <View style={[styles.container, {width, height}]}>
        <Text
          numberOfLines={1}
          {...rest}
          style={[style, {opacity: animating ? 0 : 1}]}>
          {children}
        </Text>
        <ScrollView
          ref={c => (this.containerRef = c)}
          style={StyleSheet.absoluteFillObject}
          display={animating ? 'flex' : 'none'}
          showsHorizontalScrollIndicator={false}
          horizontal
          scrollEnabled={false}
          onContentSizeChange={() => this.calculateMetrics()}>
          <Animated.Text
            ref={c => (this.textRef = c)}
            numberOfLines={1}
            {...rest}
            style={[
              style,
              {transform: [{translateX: this.animatedValue}], width: null},
            ]}>
            {children}
          </Animated.Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
