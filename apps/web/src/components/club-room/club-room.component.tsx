import { useSelector } from '@xstate/react';
import { useContext } from 'react';
import { EnterNameScreen } from './enter-name-screen.component';
import { ClubRoomContext } from './club-room.context';
import { MainScreen } from './main-screen.container';

export const ClubRoomComponent = () => {
  const service = useContext(ClubRoomContext);

  const state = useSelector(service, (state) => state);

  switch (true) {
    case state.matches('EnteringName'):
      return <EnterNameScreen />;
    case state.matches('Idle'):
      return <MainScreen />;
    default:
      return null;
  }

  // const nameRef = useRef<HTMLInputElement>(null);

  // const handleSubmitName = useCallback(() => {
  //   room.send('SET_NAME', nameRef.current?.value);
  // }, [nameRef, room]);

  // const handleChooseDiffusionary = useCallback(() => {
  //   room.send('SET_GAME', 'diffusionary');
  // }, [room]);

  // const handleChooseTriviaJam = useCallback(() => {
  //   room.send('SET_GAME', 'trivia_jam');
  // }, [room]);

  // return (
  //   <Flex direction="column">
  //     <Flex direction="column" gap="3" css={{ p: '$3' }}>
  //       <Heading size="3">
  //         {room.name} - {room.id}
  //       </Heading>
  //       <Caption size="2">Enter your name</Caption>
  //       <TextField ref={nameRef} placeholder="inspectorT" />
  //       <Text>Selected Game {room.state.selectedGame}</Text>
  //       <Button size="3" onClick={handleSubmitName}>
  //         Submit name
  //       </Button>
  //       <Button size="3" onClick={handleChooseDiffusionary}>
  //         Choose Diffusionary
  //       </Button>
  //       <Button size="3" onClick={handleChooseTriviaJam}>
  //         Choose Trivia Jam
  //       </Button>
  //     </Flex>
  //   </Flex>
  // );
};
