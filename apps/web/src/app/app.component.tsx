import { Treehouse } from '@3d/treehouse';
import FSpyDataManager, {
  defaultCameraParams,
} from '@3d/utils/FSpyDataManager';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { IconButton } from '@atoms/IconButton';
import { Image } from '@atoms/Image';
import {
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from '@atoms/ScrollArea';
import { Text } from '@atoms/Text';
import { trpc } from '@explorers-club/api-client';
import { styled } from '@explorers-club/styles';
import * as Dialog from '@radix-ui/react-dialog';
import {
  Cross2Icon,
  HamburgerMenuIcon,
  OpenInNewWindowIcon,
} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Environment,
  OrbitControls,
  useContextBridge,
} from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useInterpret } from '@xstate/react';
import {
  createContext,
  FC,
  ReactElement,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { PerspectiveCamera, Vector2 } from 'three';
import { createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { ColyseusContext } from '../state/colyseus.context';
import { useEntityStoreSelector } from '../state/entity.context';
import { fspyCameraJson } from './app.constants';

type AppEvent =
  | {
      type: 'TOGGLE_NAV';
    }
  | {
      type: 'START_NEW';
    };

const appMachine = createMachine({
  id: 'AppMachine',
  initial: 'Idle',
  type: 'parallel',
  schema: {
    events: {} as AppEvent,
  },
  states: {
    MainScene: {
      initial: 'Loading',
      states: {
        Loading: {},
        Loaded: {},
      },
    },
    MainScreen: {
      initial: 'Hovering',
      states: {
        Hidden: {},
        Hovering: {},
        Full: {},
      },
    },
    Navigation: {
      initial: 'Closed',
      states: {
        Closed: {
          on: {
            TOGGLE_NAV: 'Open',
          },
        },
        Open: {
          on: {
            TOGGLE_NAV: 'Closed',
          },
        },
      },
    },
  },
});

type AppMachine = typeof appMachine;
type AppState = StateFrom<AppMachine>;
type AppService = InterpreterFrom<AppMachine>;

const AppServiceContext = createContext({} as AppService);

export const AppComponent = () => {
  const [machine] = useState(appMachine);
  const appService = useInterpret(machine);

  const entitiesById = useEntityStoreSelector((state) => state.entitiesById);
  const roomNameRef = useRef<HTMLInputElement>(null);

  const trpcClient = trpc.useContext().client;

  const handlePressSubmit = useCallback(() => {
    trpcClient.actor.create.mutate({
      actorType: 'staging_room',
      name: 'hello',
    });
  }, [trpcClient]);

  return (
    <AppServiceContext.Provider value={appService}>
      <NavigationDrawer />
      {/* <NavigationContainer /> */}
      <MainContainer>
        <MainScene />
        <MainScreen />
      </MainContainer>
    </AppServiceContext.Provider>
  );
};

// const MainScreenDrawer = () => {
//   return (

//   )
// }

const NavigationDrawer = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <IconButton size="3">
          <HamburgerMenuIcon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <NavigationDrawerOverlay />
        <NavigationDrawerContent />
      </Dialog.Portal>
    </Dialog.Root>
  );
  return <Text>Navigation</Text>;
};

const StyledDialogContent = styled(Dialog.Content, {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: '$primary3',
  '@bp2': {
    maxWidth: '50%',
  },
  '@bp3': {
    maxWidth: '30%',
  },
  '@bp4': {
    maxWidth: '20%',
  },
});

const TabButton = styled(Button, {
  "&[data-state='active']": {
    background: '$primary4',
  },
});
// .TabsTrigger[data-state='active'] {
//   color: var(--violet11);
//   box-shadow: inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;
// }

const NavigationDrawerContent = () => {
  const appService = useContext(AppServiceContext);
  const handlePressStart = useCallback(() => {
    appService.send('START_NEW');
  }, [appService]);

  return (
    <StyledDialogContent>
      <Tabs.Root defaultValue="play" style={{ height: '100%' }}>
        <Flex direction="column" gap="3" style={{ height: '100%' }}>
          <Flex justify={'between'} css={{ p: '$3' }}>
            <Tabs.List>
              <Tabs.Trigger value="play" asChild>
                <TabButton ghost size="3">
                  Play
                </TabButton>
              </Tabs.Trigger>
              <Tabs.Trigger value="shop" asChild>
                <TabButton ghost size="3">
                  Shop
                </TabButton>
              </Tabs.Trigger>
              <Tabs.Trigger value="account" asChild>
                <TabButton ghost size="3">
                  Account
                </TabButton>
              </Tabs.Trigger>
            </Tabs.List>
            <Dialog.Close asChild>
              <IconButton size="3">
                <Cross2Icon />
              </IconButton>
            </Dialog.Close>
          </Flex>
          <ScrollAreaRoot css={{ background: 'red' }}>
            <ScrollAreaViewport>
              <Tabs.Content value="play">
                <Flex direction="column" gap="3">
                  <Card
                    css={{ p: '$3', minHeight: '200px' }}
                    variant="interactive"
                  >
                    Hello
                  </Card>
                  <Card
                    css={{ p: '$3', minHeight: '200px' }}
                    variant="interactive"
                  >
                    Hello
                  </Card>
                  <Card
                    css={{
                      p: '$3',
                      minHeight: '200px',
                      position: 'sticky',
                      bottom: 0,
                    }}
                    color="success"
                    variant="interactive"
                    onClick={handlePressStart}
                  >
                    Start New Game
                  </Card>
                </Flex>
              </Tabs.Content>
              <Tabs.Content value="shop">
                <Flex direction="column" gap="3">
                  <Card
                    css={{
                      background: `linear-gradient($primary4, $primary7)`,
                      border: '2px solid $primary6',
                    }}
                  >
                    <Image
                      css={{ aspectRatio: 1, width: '100%' }}
                      src="https://cdn.discordapp.com/attachments/1039255735390978120/1082663770159071272/pigment-dyed-cap-black-stone-front-640601d4ccad3.png"
                    />
                  </Card>
                  <a href="https://merch.explorers.club" target="_blank">
                    <Card
                      css={{ p: '$3', minHeight: '200px' }}
                      variant="interactive"
                    >
                      <Text>
                        Open Merch Store <OpenInNewWindowIcon />
                      </Text>
                    </Card>
                  </a>
                </Flex>
              </Tabs.Content>
              <Tabs.Content value="account">
                <Card
                  css={{ p: '$3', minHeight: '200px' }}
                  variant="interactive"
                >
                  Create Account
                </Card>
              </Tabs.Content>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollAreaRoot>
        </Flex>
      </Tabs.Root>
    </StyledDialogContent>
  );
};

const NavigationDrawerOverlay = styled(Dialog.Overlay, {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,.7)',
});

// animateable div
const MainContainer = styled('div', {
  display: 'flex',
  position: 'absolute',

  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  flexDirection: 'column',

  '@bp2': {
    flexDirection: 'row',
  },

  '& .main-screen': {
    flexBasis: '30%',
    background: 'yellow',
  },

  '& .main-scene': {
    flexBasis: '70%',
    background: 'red',
  },
});

const MainScreen = () => {
  return <Flex className="main-screen">Main Screen</Flex>;
};

const MainScene = () => {
  return (
    <Canvas
      className="main-scene"
      style={{
        backgroundImage: `url('${SCENE_URL}')`,
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
        backgroundPositionY: 'center',
      }}
    >
      <axesHelper />
      {/* <Treehouse /> */}
      <FSpyCamera />
      <Environment preset="sunset" />
      {/* <Treehouse /> */}
      <OrbitControls />
      <gridHelper />
    </Canvas>
  );
};

const FSpyCamera = () => {
  const [targetCanvasSize] = useState(new Vector2());
  const [dataManager] = useState(() => {
    const dataManager = new FSpyDataManager();
    dataManager.setData(fspyCameraJson);
    return dataManager;
  });

  const three = useThree();

  const onResize = useCallback(() => {
    const camera = three.camera as unknown as PerspectiveCamera;
    const fSpyImageRatio: number = dataManager.imageRatio;

    targetCanvasSize.setX(three.size.width);
    targetCanvasSize.setY(three.size.height);

    if (targetCanvasSize.x / targetCanvasSize.y <= fSpyImageRatio) {
      camera.aspect = targetCanvasSize.x / targetCanvasSize.y;
      camera.zoom = defaultCameraParams.zoom;
    } else {
      camera.aspect = targetCanvasSize.x / targetCanvasSize.y;
      camera.zoom = targetCanvasSize.x / targetCanvasSize.y / fSpyImageRatio;
    }

    camera.updateProjectionMatrix();
  }, [dataManager, three, targetCanvasSize]);

  useLayoutEffect(() => {
    const camera = three.camera as unknown as PerspectiveCamera;

    // set fov
    camera.fov = dataManager.cameraFov;

    // set aspect
    // if (this.targetCanvasSize != null) {
    //   this.camera.aspect = this.targetCanvasSize.x / this.targetCanvasSize.y;
    // } else {
    //   this.camera.aspect = this.dataManager.imageRatio;
    // }
    camera.aspect = dataManager.imageRatio;

    // set position
    camera.position.set(
      dataManager.cameraPosition.x,
      dataManager.cameraPosition.y,
      dataManager.cameraPosition.z
    );

    camera.updateProjectionMatrix();

    // set rotation
    camera.setRotationFromMatrix(dataManager.cameraMatrix);

    onResize();
  }, [three, dataManager, onResize]);

  // if (
  //   this.targetCanvasSize.x / this.targetCanvasSize.y <=
  //   fSpyImageRatio
  // ) {
  //   this.camera.aspect =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y;
  //   this.camera.zoom = defaultCameraParams.zoom;
  // } else {
  //   this.camera.aspect =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y;
  //   this.camera.zoom =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y / fSpyImageRatio;
  // }

  // this.onResize();

  return null;
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

const SCENE_URL =
  'https://media.discordapp.net/attachments/1039255735390978120/1082021840878321774/InspectorT_line_art_deck_of_an_outdoorsy_social_club_in_2023_ov_ed9d3f35-fc97-4202-ad03-214ca6ecd9db.png';
