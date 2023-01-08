import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { useSelector } from '@xstate/react';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../../state/app.context';

export const ErrorHandler = () => {
  const { modalActor, clubTabActor } = useContext(AppContext);
  const hasError = useSelector(clubTabActor, (state) =>
    state.matches('Room.Error')
  );

  const handlePressReconnect = useCallback(() => {
    clubTabActor.send('RETRY');
    modalActor.send('CLOSE');
  }, [clubTabActor, modalActor]);

  useEffect(() => {
    if (hasError) {
      modalActor.send({
        type: 'SHOW',
        component: (
          <Box css={{ p: '$3' }}>
            <Card css={{ p: '$3' }}>
              <Flex gap="3" direction="column">
                <Caption>Oops!</Caption>
                <Heading>There was an error connecting.</Heading>
                <Button size="3" onClick={handlePressReconnect}>
                  Try Again
                </Button>
              </Flex>
            </Card>
          </Box>
        ),
      });
    }
  }, [hasError, modalActor, handlePressReconnect]);

  return null;
};
