import * as React from 'react';
import {memo} from 'react';
import {Dimensions} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Path, Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {EasingNode, timing} from 'react-native-reanimated';
const {width} = Dimensions.get('window');

const size = width / 2 - 32;
const strokeWidth = 10;
const {PI, cos, sin} = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface align {
  direction: boolean;
  prays: string[];
}
let strokeDashoffset = new Animated.Value(0);
const CircularProgress: React.FC<align> = memo(arg => {
  const direction = arg.direction;
  var theta: number[] = new Array(6);
  var x: number[] = new Array(6);
  var y: number[] = new Array(6);
  var d_string: string[] = new Array(6);
  for (let i = 0; i < 6; i++) {
    let A =
      (2 * PI * parseInt(arg.prays[i].slice(0, 2)) * 60 +
        parseInt(arg.prays[i].slice(3, 5))) /
      (24 * 60);
    theta[i] = A;
    x[i] = cx - r * cos(A);
    y[i] = -r * sin(A) + cy;
  }
  for (let i = 0; i < 6; i++) {
    if (i < 5) {
      d_string[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 0 1 ${x[i + 1]} ${
        y[i + 1]
      }`;
    } else {
      d_string[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 0 1 ${x[0]} ${y[0]}`;
    }
  }
  let align = direction ? 'flex-start' : 'flex-end';
  const circumference = r * 2 * PI;
  React.useEffect(() => {
    timing(strokeDashoffset, {
      toValue: 2 * PI * r,
      duration: 5000,
      easing: EasingNode.linear,
    }).start();
  }, []);

  return (
    <Animated.View style={{alignItems: align}}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#9E3C44" />
            <Stop offset="1" stopColor="#9E1C44" />
          </LinearGradient>
          <LinearGradient id="sunrise" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#ECa31C" />
            <Stop offset="1" stopColor="#EC931C" />
          </LinearGradient>
          <LinearGradient id="dhuhr" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#F2e201" />
            <Stop offset="1" stopColor="#F2F201" />
          </LinearGradient>
          <LinearGradient id="asr" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#02d302" />
            <Stop offset="1" stopColor="#02C302" />
          </LinearGradient>
          <LinearGradient id="maghrib" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#0253F1" />
            <Stop offset="1" stopColor="#0243F1" />
          </LinearGradient>
          <LinearGradient id="isha" x1="0" y1="0" x2="100%" y2="0">
            <Stop offset="0" stopColor="#608d8b" />
            <Stop offset="1" stopColor="#607d8b" />
          </LinearGradient>
        </Defs>
        <Path
          stroke="url(#grad)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[0]}
          {...{strokeWidth}}
        />
        <Path
          stroke="url(#sunrise)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[1]}
          {...{strokeWidth}}
        />
        <Path
          stroke="url(#dhuhr)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[2]}
          {...{strokeWidth}}
        />
        <Path
          stroke="url(#asr)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[3]}
          {...{strokeWidth}}
        />
        <Path
          stroke="url(#maghrib)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[4]}
          {...{strokeWidth}}
        />
        <Path
          stroke="url(#isha)"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          d={d_string[5]}
          {...{strokeWidth}}
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          fill="transparent"
          strokeDasharray={`${circumference}, ${circumference}`}
          stroke="white"
          r={r}
          {...{strokeDashoffset, strokeWidth}}
        />
      </Svg>
    </Animated.View>
  );
});
export default CircularProgress;
