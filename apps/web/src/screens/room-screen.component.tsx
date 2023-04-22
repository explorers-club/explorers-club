import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { Text } from '@atoms/Text';
import { trpc } from '@explorers-club/api-client';
import { Machine } from '@molecules/Machine';
import { useInterpret } from '@xstate/react';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { createMachine, InterpreterFrom } from 'xstate';
import { useServiceSelector } from '../services';
import { WorldContext } from '../state/world.context';
// Think of it as the room system
// You can join a room
// That room as a type
// That type determines then which data is set then as it relates to the room

// Is a better thing to focus on the spectating experience flow at this point?

const RoomServiceContext = createContext({} as RoomScreenService);

export const RoomScreen = () => {
  const machine = useRoomScreenMachine();
  const service = useInterpret(machine);

  // What are the different things we need to render?
  // If you're in a room, we might want to render.....
  // on...
  //   chat: render the chat module
  //   play: render the chat module, and the game module

  return (
    <RoomScreenRoot service={service}>
      <Machine service={service}>
        <Machine.State value="Initializing">
          <Text>Initializing</Text>
        </Machine.State>
        <Machine.State value="lobby">
          <GameSelection />
          <PlayerList />
        </Machine.State>
      </Machine>
    </RoomScreenRoot>
  );
};

const RoomScreenRoot: FC<{
  children: ReactNode;
  service: InterpreterFrom<ReturnType<typeof useRoomScreenMachine>>;
}> = ({ children, service }) => {
  return (
    <RoomServiceContext.Provider value={service}>
      {children}
    </RoomServiceContext.Provider>
  );
};

const PlayerList = () => {
  const { client } = trpc.useContext();
  // How would I show a player list using archetypes?

  return (
    <Flex direction="column">
      <Heading>Players</Heading>
      <Card css={{ p: '$3', flex: 1 }}>Jon</Card>
    </Flex>
  );
};

const GameSelection = () => {
  return (
    <Flex>
      <Card css={{ p: '$3', flex: 1 }}>Jon</Card>
    </Flex>
  );
};

export const useRoomScreenMachine = () => {
  const name = useServiceSelector(
    'appService',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => state.context.activeRoom!
  );

  const { client } = trpc.useContext();

  const [roomScreenMachine] = useState(() => {
    return createMachine({
      id: 'RoomMachine',
      type: 'parallel',
      context: {
        name,
      },
      schema: {
        context: {} as { name: string },
        events: {} as { type: 'JOIN' },
      },
      states: {},
    });
  });

  return roomScreenMachine;
};

export type RoomScreenService = InterpreterFrom<
  ReturnType<typeof useRoomScreenMachine>
>;
