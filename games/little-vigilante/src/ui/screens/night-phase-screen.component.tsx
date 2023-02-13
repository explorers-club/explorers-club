import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { AbilityGroupCarousel } from '../organisms/ability-group-carousel.component';
import { Chat } from '../organisms/chat.component';
import { NightActions } from '../organisms/night-actions';

export const NightPhaseScreenComponent = () => {
  return (
    <Flex
      direction="column"
      gap="1"
      css={{ minHeight: '100%', maxHeight: '100%' }}
    >
      <Card css={{ flex: '0 0 120px' }}>
        <Flex>
          <AbilityGroupCarousel />
        </Flex>
      </Card>
      <Card>
        <NightActions />
      </Card>
      <Card css={{ flexGrow: 1, display: 'flex' }}>
        <Chat disabled />
      </Card>
    </Flex>
  );
};
