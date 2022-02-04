import * as React from 'react';
import {memo} from 'react';
// import {Dimensions, StyleSheet} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Path} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {EasingNode, timing, withTiming} from 'react-native-reanimated';
const width = 300;
const size = width - 32;
const strokeWidth = 50;
const AnimatedPath = Animated.createAnimatedComponent(Path);
const {PI, cos, sin} = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const startAngle = PI + PI * 0.2;
const endAngle = 2 * PI - PI * 0.2;

let strokeDashoffset = new Animated.Value(0);
const CircularProgress = memo(() => {
  const A = PI + PI * 0.4;
  const x1 = cx - r * cos(startAngle);
  const y1 = -r * sin(startAngle) + cy;
  const x2 = cx - r * cos(endAngle);
  const y2 = -r * sin(endAngle) + cy;
  const d = `M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`;
  const circumference = r * A;
  React.useEffect(() => {
    timing(strokeDashoffset, {
      toValue: A * r,
      duration: 5000,
      easing: EasingNode.linear,
    }).start();
  }, []);

  return (
    <Svg width={size} height={size}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
          <Stop offset="0" stopColor="#f7cd46" />
          <Stop offset="1" stopColor="#ef9837" />
        </LinearGradient>
      </Defs>
      <Path
        stroke="white"
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{d, strokeWidth}}
      />
      <AnimatedPath
        stroke="url(#grad)"
        fill="none"
        strokeDasharray={`${circumference}, ${circumference}`}
        {...{d, strokeDashoffset, strokeWidth}}
      />
    </Svg>
  );
});
export default CircularProgress;

// const clock = new Clock();

// const config = {
//   duration: 10 * 1000,
//   toValue: 1,
//   easing: EasingNode.linear,
// };
// const frameTime = new Animated.Value(0);
// const finished = new Animated.Value(0);
// const position = new Animated.Value(0);
// const time = new Animated.Value(0);

// const state = {
//   frameTime: frameTime,
//   finished: finished,
//   position: position,
//   time: time,
// };
// let progress1 = timing(clock, state, config);

// const α = interpolateNode(progress, {
//   inputRange: [0, 1],
//   outputRange: [0, A],
// });
// const strokeDashoffset = multiply(α, r);

// interface CircularPogressProps {
//   progress: Animated.Value<number>; //change to Node
// }
// const {Clock} = Animated;

// const {interpolateNode, multiply} = Animated;

// interface TimingParams {
//   clock?: Animated.Clock;
//   from?: Animated.Adaptable<number>;
//   to?: Animated.Adaptable<number>;
//   duration?: Animated.Adaptable<number>;
//   easing?: Animated.EasingFunction;
// }
// const clock = new Clock();
// const config = {
//   duration: 10 * 1000,
//   to: 1,
//   easing: EasingNode.linear,
// };
