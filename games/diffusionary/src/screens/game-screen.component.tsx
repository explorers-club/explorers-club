import React, { MouseEventHandler, useCallback } from 'react';
import { Flex } from '@atoms/Flex';
import { Card } from '@atoms/Card';
import { Button } from '@atoms/Button';

export const GameScreenComponent = () => {

  // If it's your turn, show the text input prompt
  // If it's guessing, show the guessing input prompt

  const handlePressCard: MouseEventHandler = useCallback((e) => {
    console.log('PRESS!');
  }, []);
  return (
    <Flex>
      <Card
        variant="interactive"
        onClick={handlePressCard}
        css={{ p: '$3', width: '100%' }}
      >
        Hello
      </Card>
    </Flex>
  );
};
