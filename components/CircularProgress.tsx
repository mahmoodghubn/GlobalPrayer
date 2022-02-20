import * as React from 'react';
import {memo} from 'react';
import {Dimensions} from 'react-native';
import Svg, {Defs, LinearGradient, Stop, Path, Circle} from 'react-native-svg';
import Animated from 'react-native-reanimated';
import {EasingNode, timing} from 'react-native-reanimated';
const {width} = Dimensions.get('window');
const colors = [
  '#5D4037',
  '#5D4037',
  '#00796B',
  '#00796B',
  '#F2F201',
  '#F2F201',
  '#455A64',
  '#455A64',
  '#F57C00',
  '#F57C00',
  '#0243F1',
  '#0243F1',
];
const size = width / 2 - 64;
const strokeWidth = 18;
const {PI, cos, sin} = Math;
const r = (size - strokeWidth) / 2;
const cx = size / 2;
const cy = size / 2;
interface align {
  direction: boolean;
  prays: string[];
}
const CircularProgress: React.FC<align> = memo(
  arg => {
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    let strokeDashoffset = new Animated.Value(0);
    var x: number[] = new Array(6);
    var y: number[] = new Array(6);
    var theta: number[] = new Array(6);
    var d: string[] = new Array(6);
    let A;
    for (let i = 0; i < 6; i++) {
      A =
        (2 *
          PI *
          (parseInt(arg.prays[i].slice(0, 2)) * 60 +
            parseInt(arg.prays[i].slice(3, 5)))) /
        (24 * 60);
      theta[i] = A;
      x[i] = cx - r * cos(A);
      y[i] = -r * sin(A) + cy;
    }
    for (let i = 0; i < 6; i++) {
      if (i < 5) {
        if (theta[i + 1] - theta[i] < PI) {
          d[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 0 1 ${x[i + 1]} ${y[i + 1]}`;
        } else {
          d[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 1 1 ${x[i + 1]} ${y[i + 1]}`;
        }
      } else {
        if (theta[5] - theta[0] > PI) {
          d[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 0 1 ${x[0]} ${y[0]}`;
        } else {
          d[i] = `M ${x[i]} ${y[i]} A ${r} ${r} 1 1 1 ${x[0]} ${y[0]}`;
        }
      }
    }
    const circumference = r * 2 * PI;
    React.useEffect(() => {
      timing(strokeDashoffset, {
        toValue: 2 * PI * r,
        duration: 4000,
        easing: EasingNode.linear,
      }).start();
    });

    return (
      <Svg width={size + 10} height={size + 10}>
        <Defs>
          {colors.map((element, index) =>
            index < 6 ? (
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
            ) : null,
          )}
        </Defs>
        {d.map((element, index) => (
          <Path
            key={index}
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
    );
  },
  (prevProps, nextProps) => {
    if (
      prevProps.prays === nextProps.prays ||
      prevProps.direction === nextProps.direction
    ) {
      return true; // props are equal
    }
    return false; // props are not equal -> update the component
  },
);
export default CircularProgress;
