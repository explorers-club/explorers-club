import { SunsetSky } from '@3d/sky';
import { Box } from '@atoms/Box';
import { Sheet, SheetContent } from '@atoms/Sheet';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useInterpret, useSelector } from '@xstate/react';
import { FC, ReactElement, Suspense, useContext, useMemo } from 'react';
import { Leaderboard } from './components/leaderboard.container';
import { Menu } from './components/menu.container';
import { Notifications } from './components/notifications.container';
import { MainContext } from './main.context';
import { MainActor, MainMachine, mainMachine } from './main.machine';
import { EnterNameScreen } from './screens/enter-name-screen.container';
import { GameScreen } from './screens/game-screen.container';

export const MainComponent = () => {
  const { sharedCollectionActor, userId } = useContext(MainContext);
  const machine = useMemo(() => {
    return mainMachine.withContext({
      sharedCollectionActor,
      userId,
    }) as MainMachine;
  }, [sharedCollectionActor, userId]);

  const actor = useInterpret(machine);

  return (
    <>
      {/* TODO move these sheets in to a layout in components/layout */}
      <BottomSheet>
        <MainUIComponent actor={actor} />
      </BottomSheet>
      <LeftSheet>
        <Menu />
      </LeftSheet>
      <RightSheet>
        <Leaderboard />
      </RightSheet>
      <TopSheet>
        <Notifications />
      </TopSheet>
      <MainScene actor={actor} />
    </>
  );
};

interface MainUIProps {
  actor: MainActor;
}

const MainUIComponent: FC<MainUIProps> = ({ actor }) => {
  const state = useSelector(actor, (state) => state);

  switch (true) {
    case state.matches('EnteringName'): {
      return <EnterNameScreen />;
    }
    case state.matches('Playing'): {
      return <GameScreen />;
    }
    default: {
      return null;
    }
  }
};
interface MainSceneProps {
  actor: MainActor;
}

const MainScene: FC<MainSceneProps> = ({ actor }) => {
  // const state = useSelector(actor, (state) => state);
  // const ContextBridge = useContextBridge(MainContext);
  // TODO 3D scene goes here..
  return (
    <Box css={{ background: '$primary1', height: '100vh' }}>
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [20, 10, 20] }}
      >
        <color attach="background" args={['#000']} />
        <Suspense fallback={null}>
          <OrbitControls autoRotate autoRotateSpeed={0.6} enablePan={false} />
          <SunsetSky />
          {/* <Treehouse /> */}
        </Suspense>
      </Canvas>
    </Box>
  );
};

interface BottomSheetProps {
  children: ReactElement;
}

const BottomSheet: FC<BottomSheetProps> = ({ children }) => {
  return (
    <Sheet open={true}>
      <SheetContent css={{ background: '$panel1' }} side="bottom">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface LeftSheetProps {
  children: ReactElement;
}

const LeftSheet: FC<LeftSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="left">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface RightSheetProps {
  children: ReactElement;
}

const RightSheet: FC<RightSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="right">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface TopSheetProps {
  children: ReactElement;
}

const TopSheet: FC<TopSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="top">
        {children}
      </SheetContent>
    </Sheet>
  );
};
