import { Floor } from '@3d/floor';
import { SunsetSky } from '@3d/sky';
import { Treehouse } from '@3d/treehouse';
import { Box } from '@atoms/Box';
import { Logo } from '@atoms/Logo';
import { GameRoomId } from '@explorers-club/schema';
import { darkTheme } from '@explorers-club/styles';
import {
  NotificationsComponent, notificationsMachine
} from '@organisms/notifications';
import { createTabBarMachine, TabBar } from '@organisms/tab-bar';
import {
  Environment,
  OrbitControls,
  useContextBridge
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useInterpret, useSelector } from '@xstate/react';
import * as Colyseus from 'colyseus.js';
import {
  FC,
  ReactElement,
  Suspense,
  useContext,
  useEffect,
  useState
} from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps
} from 'react-spring-bottom-sheet/dist/types';
import { ModalComponent, modalMachine } from '../components/organisms/modal';
import { environment } from '../environments/environment';
import { AppContext } from '../state/app.context';
import { AuthContext } from '../state/auth.context';
import { ColyseusContext } from '../state/colyseus.context';
import { ClubTab, createClubTabMachine } from '../tabs/club';
import { createGameTabMachine, GameTab } from '../tabs/game';
import { createLobbyTabMachine, LobbyTab } from '../tabs/lobby';
import { createProfileTabMachine, ProfileTab } from '../tabs/profile';
import { getClubNameFromPath } from '../utils';
import { NavigationHelper } from './navigation-helper.component';

const DEFAULT_SNAP_POINTS = ({ minHeight }: SnapPointProps) => [
  minHeight /* height of child contents (will go to full screen then scroll) */,
  // window.innerHeight * 0.4 /* almost halfway up */,
  // 80 /* fixed height of tab bar so you can always see it */,
];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[0];

export const AppComponent = () => {
  const [colyseusClient] = useState(
    new Colyseus.Client(environment.colyseusHost)
  );
  const authContext = useContext(AuthContext);

  const [lobbyTabMachine] = useState(createLobbyTabMachine(colyseusClient));
  const lobbyTabActor = useInterpret(lobbyTabMachine);

  const modalActor = useInterpret(modalMachine);
  const notificationsActor = useInterpret(notificationsMachine);

  const [profileTabMachine] = useState(createProfileTabMachine(authContext));
  const profileTabActor = useInterpret(profileTabMachine);

  const [gameTabMachine] = useState(
    createGameTabMachine(colyseusClient, authContext.userId)
  );
  const gameTabActor = useInterpret(gameTabMachine);

  const clubName = getClubNameFromPath();
  const [clubTabMachine] = useState(
    createClubTabMachine(colyseusClient, authContext.userId, clubName)
  );
  const clubTabActor = useInterpret(clubTabMachine);

  const [machine] = useState(
    createTabBarMachine({
      Game: {
        actor: gameTabActor,
        name: 'Game',
        Component: <GameTab />,
      },
      Club: {
        actor: clubTabActor,
        name: 'Club',
        Component: <ClubTab />,
      },
      Lobby: {
        actor: lobbyTabActor,
        name: 'Lobby',
        Component: <LobbyTab />,
      },
      Profile: {
        actor: profileTabActor,
        name: 'Profile',
        Component: <ProfileTab />,
      },
    })
  );

  const tabBarActor = useInterpret(machine);

  const isShowingModal = useSelector(modalActor, (state) =>
    state.matches('Mounted')
  );

  return (
    <AppContext.Provider
      value={{
        tabBarActor,
        profileTabActor,
        gameTabActor,
        clubTabActor,
        lobbyTabActor,
        notificationsActor,
        modalActor,
      }}
    >
      <NavigationHelper />
      <Box
        css={{
          position: 'absolute',
          top: 0,
          left: '50%',
          zIndex: 1,
          width: '120px',
          marginLeft: '-60px',
          pt: '$2',
        }}
      >
        <Logo />
      </Box>
      <Box
        css={{
          maxWidth: 400,
          background: 'black',
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        <NotificationsComponent actor={notificationsActor} />
      </Box>
      <BottomSheet
        open={true}
        blocking={false}
        defaultSnap={DEFAULT_SNAP}
        snapPoints={DEFAULT_SNAP_POINTS}
        expandOnContentDrag={true}
      >
        <Box className={darkTheme.className}>
          {isShowingModal ? (
            <ModalComponent actor={modalActor} />
          ) : (
            <TabBar actor={tabBarActor} />
          )}
        </Box>
      </BottomSheet>
      <SceneContainer>
        <>
          <OrbitControls maxDistance={80} />
          <Environment preset="sunset" />
          <SunsetSky />
          <Treehouse rotation={[0, -Math.PI / 4, 0]} />
          <Floor />
        </>
      </SceneContainer>
    </AppContext.Provider>
  );
};

interface SceneContainerProps {
  children: ReactElement;
}

const SceneContainer: FC<SceneContainerProps> = ({ children }) => {
  // const state = useSelector(actor, (state) => state);
  const ContextBridge = useContextBridge(ColyseusContext);

  return (
    <Box css={{ background: '$primary1', height: '100vh' }}>
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [-9, 5, 24] }}
      >
        <color attach="background" args={['#000']} />
        <ContextBridge>
          <Suspense fallback={null}>{children}</Suspense>
        </ContextBridge>
      </Canvas>
    </Box>
  );
};
