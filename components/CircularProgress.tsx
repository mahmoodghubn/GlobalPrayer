import * as React from 'react';
import {memo} from 'react';
import {Dimensions} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Path, Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {EasingNode, timing} from 'react-native-reanimated';
const {width} = Dimensions.get('window');
const colors = [
  '#5D4037',
  '#6D5047',
  '#00796B',
  '#00796B',
  '#F2e201',
  '#F2F201',
  '#455A64',
  '#455A64',
  '#F57C00',
  '#F57C00',
  '#0253F1',
  '#0243F1',
];
const size = width / 2 - 64;
const strokeWidth = 15;
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
          {colors.map((element, index) => (
            <LinearGradient
              key={index}
              id={index.toString()}
              x1="0"
              y1="0"
              x2="100%"
              y2="0">
              <Stop offset="0" stopColor={colors[index * 2]} />
              <Stop offset="1" stopColor={colors[index * 2 + 1]} />
            </LinearGradient>
          ))}
        </Defs>
        {d_string.map((element, index) => (
          <Path
            stroke={`url(#${index})`}
            fill="none"
            strokeDasharray={`${circumference}, ${circumference}`}
            d={element}
            {...{strokeWidth}}
          />
        ))}
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
