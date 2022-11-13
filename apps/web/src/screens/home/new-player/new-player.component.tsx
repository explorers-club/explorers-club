import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import { FormEvent, FormEventHandler, useCallback, useRef } from 'react';

export function NewPlayerComponent() {
  const playerNameRef = useRef<HTMLInputElement>(null);
  const handleChangePartyCode = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      console.log(playerNameRef.current?.value);
    },
    [playerNameRef]
  );

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    console.log('SUBMIT!', playerNameRef.current);
    e.preventDefault();
  }, []);

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ aspectRatio: 1, bc: '$crimson9' }}>
        <Flex
          css={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Flex
            css={{
              p: '$3',
              height: '100%',
              justifyContent: 'flex-end',
              fd: 'column',
            }}
          >
            <Heading css={{ color: '$gray1' }} size="2">
              Start Your
              <br />
              Explorers Club
            </Heading>
          </Flex>
          <form onSubmit={handleSubmit}>
            <Flex
              css={{
                p: '$2',
                bc: 'white',
                justifyContent: 'flex-end',
                width: '100%',
                alignItems: 'center',
                gap: '$1',
              }}
            >
              <Text css={{ color: '$gray10' }}>explorers.club/</Text>

              <TextField
                ref={playerNameRef}
                size="1"
                css={{
                  width: '160px',
                  border: '1px solid $gray6',
                  borderRadius: '$1',
                }}
                variant="ghost"
                type="text"
                id="playerName"
                placeholder="your_name_here"
                pattern="^[a-zA-Z0-9_-]*$"
                fullWidth={false}
                onChange={handleChangePartyCode}
              />
            </Flex>
          </form>
        </Flex>
      </Card>
    </Box>
  );
}
