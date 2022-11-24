import { BottomSheet } from 'react-spring-bottom-sheet';
import { HomeScreen } from '../screens/home';

export const HomeRoute = () => {
  return (
    <BottomSheet
      open={true}
      blocking={false}
      defaultSnap={({ maxHeight }) => maxHeight / 4}
      snapPoints={({ maxHeight }) => [
        maxHeight - maxHeight / 10,
        maxHeight / 4,
        maxHeight * 0.6,
      ]}
      expandOnContentDrag={true}
    >
      <HomeScreen />
    </BottomSheet>
  );
};
