import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../../state/app.context';

export const DisconnectHandler = () => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  const isDisconnected = useSelector(clubTabActor, (state) =>
    state.matches('Room.Disconnected')
  );

  const handlePressReconnect = useCallback(() => {
    clubTabActor.send('RECONNECT');
    modalActor.send('CLOSE');
  }, [clubTabActor, modalActor]);

  useEffect(() => {
    if (isDisconnected) {
      modalActor.send({
        type: 'SHOW',
        component: (
          <Box css={{ p: '$3' }}>
            <Card css={{ p: '$3' }}>
              <Flex gap="3" direction="column">
                <Caption>Oops!</Caption>
                <Heading>You've been disconnected</Heading>
                <Button size="3" onClick={handlePressReconnect}>
                  Reconnect
                </Button>
              </Flex>
            </Card>
          </Box>
        ),
      });
    }
  }, [isDisconnected, modalActor, handlePressReconnect]);

  return null;
};
