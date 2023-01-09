import { Card } from '@atoms/Card';
import { Text } from '@atoms/Text';
import { useLittleVigilanteSelector } from '../state/little-vigilante.hooks';

export const LittleVigilanteRoomComponent = () => {
  const states = useLittleVigilanteSelector((state) => state.currentStates);
  console.log(states);

  return (
    <Card css={{ p: '$3' }}>
      <Text>The Little Vigilante</Text>
    </Card>
  );
};
