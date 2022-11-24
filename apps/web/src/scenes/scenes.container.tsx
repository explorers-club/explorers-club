import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { ClubScreenActor } from '../screens/club';
import { Treehouse } from './treehouse.component';

export const Scenes = () => {
  return (
    <>
      <color attach="background" args={['#CCEECC']} />
      <Suspense fallback={null}>
        <OrbitControls autoRotate autoRotateSpeed={0.6} enablePan={false} />
        <Environment preset="sunset" />
        <Treehouse />
      </Suspense>
    </>
  );
};

const AllScenes = ({
  clubScreenActor,
}: {
  clubScreenActor: ClubScreenActor;
}) => {
  // TODO add back in to get scene back when we update how the actors are selected
  // const partyActor = useSelector(clubScreenActor, selectPartyActor);
  const partyActor = undefined;
  // const actorManager = useSelector(clubScreenActor, selectActorManager);

  if (!partyActor) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return null;
  // <ConnectedContext.Provider value={{ partyActor, actorManager }}>
  //   <Lobby />
  //   <Game />
  // </ConnectedContext.Provider>
};
