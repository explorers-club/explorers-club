import { QuestionScreen } from './question-screen.container';
import { ScoreboardScreen } from './scoreboard-screen.container';
import { useCurrentStates } from './trivia-jam-room.hooks';

// type NonFunctionPropNames<T> = {
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   [K in keyof T]: T[K] extends Function ? never : K;
// }[keyof T];

// function useValue<K extends NonFunctionPropNames<TriviaJamState>>(attr: K): TriviaJamState[K] {

// }

// function useValue<K extends NonFunctionPropNames<TriviaJamState>>(
//   room: Room<TriviaJamState>,
//   attr: K extends NonFunctionPropNames<TriviaJamState>
// ) {
//   const [value, setValue] = useState(room.state[attr]);
//   useEffect(() => {
//     const unsub = room.state.listen(attr, (newValue) => {
//       setValue(newValue);
//     });
//     return unsub;
//   });
//   return value;
// }

// listen<K extends NonFunctionPropNames<this>>(attr: K, callback: (value: this[K], previousValue: this[K]) => void): () => void;

export const PlayScreen = () => {
  const states = useCurrentStates();

  switch (true) {
    case states.includes('Playing.AwaitingQuestion'):
      return <ScoreboardScreen />;
    case states.includes('Playing.Question'):
      return <QuestionScreen />;
    default:
      return null;
  }
};
