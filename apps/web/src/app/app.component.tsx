import { Floor } from '@3d/floor';
import { SunsetSky } from '@3d/sky';
import { Treehouse } from '@3d/treehouse';
import { Box } from '@atoms/Box';
import { Sheet, SheetContent } from '@atoms/Sheet';
import { Text } from '@atoms/Text';
import { darkTheme } from '@explorers-club/styles';
import {
  Environment,
  OrbitControls,
  useContextBridge,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, ReactElement, Suspense } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import {
  defaultSnapProps,
  SnapPointProps,
} from 'react-spring-bottom-sheet/dist/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@atoms/Tabs';
import { Routes } from '../routes/routes.container';
import { ColyseusContext } from '../state/colyseus.context';

const DEFAULT_SNAP_POINTS = ({ minHeight }: SnapPointProps) => [minHeight];

const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[0];

export const AppComponent = () => {
  return (
    <>
      <BottomSheet
        open={true}
        blocking={false}
        defaultSnap={DEFAULT_SNAP}
        snapPoints={DEFAULT_SNAP_POINTS}
        expandOnContentDrag={true}
      >
        <Box className={darkTheme.className}>
          <Tabs defaultValue="party">
            <TabsList>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
              <TabsTrigger value="party">Party</TabsTrigger>
            </TabsList>
            <TabsContent value="party">
              <Routes />
            </TabsContent>
            <TabsContent value="map">
              <Text>Map</Text>
            </TabsContent>
            <TabsContent value="objectives">
              <Text>Objectives</Text>
            </TabsContent>
          </Tabs>
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
    </>
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

interface LeftSheetProps {
  children: ReactElement;
}

export const LeftSheet: FC<LeftSheetProps> = ({ children }) => {
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

export const RightSheet: FC<RightSheetProps> = ({ children }) => {
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

export const TopSheet: FC<TopSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="top">
        {children}
      </SheetContent>
    </Sheet>
  );
};
