import FSpyDataManager, {
  defaultCameraParams,
} from '@3d/utils/FSpyDataManager';
import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
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
  PersonIcon,
} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Environment,
  OrbitControls,
  useContextBridge,
} from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useInterpret, useSelector } from '@xstate/react';
import {
  createContext,
  FC,
  ReactElement,
  Suspense,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { PerspectiveCamera, Vector2, Vector3 } from 'three';
import { createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { ColyseusContext } from '../state/colyseus.context';
import { useEntityStoreSelector } from '../state/entity.context';
import { fspyCameraJson } from './app.constants';
import { inspect } from '@xstate/inspect';
import { Logo } from '@atoms/Logo';
import { SnowflakeId } from 'libs/api/src/ecs/schema';
import { CharacterComponent } from '../components/3d/coconut-model/character-main';

// inspect({
//   // options
//   // url: 'https://stately.ai/viz?inspect', // (default)
//   iframe: false, // open in new window
// });

type AppEvent =
  | {
      type: 'FOCUS_SCENE';
    }
  | {
      type: 'FOCUS_SCREEN';
    }
  | {
      type: 'FOCUS_NAV';
    }
  | {
      type: 'CLOSE_NAV';
    }
  | {
      type: 'OPEN_NAV';
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
    Focus: {
      initial: 'MainScene',
      states: {
        Navigation: {
          on: {
            CLOSE_NAV: 'MainScene',
            FOCUS_SCREEN: 'MainScreen',
          },
        },
        MainScene: {
          on: {
            FOCUS_NAV: 'Navigation',
            FOCUS_SCREEN: 'MainScreen',
          },
        },
        MainScreen: {
          on: {
            FOCUS_NAV: 'Navigation',
            FOCUS_SCENE: 'MainScene',
          },
        },
      },
    },
    MainScene: {
      initial: 'Loading',
      states: {
        Loading: {},
        Loaded: {},
      },
    },
    MainScreen: {
      type: 'parallel',
      states: {
        Layout: {
          initial: 'Docked',
          states: {
            Docked: {},
            Overlay: {},
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
  const appService = useInterpret(machine, { devTools: true });

  const entitiesById = useEntityStoreSelector((state) => state.entitiesById);
  const roomNameRef = useRef<HTMLInputElement>(null);

  const trpcClient = trpc.useContext().client;

  const handlePressSubmit = useCallback(() => {
    trpcClient.actor.create.mutate({
      actorType: 'staging_room',
      name: 'hello',
    });
  }, [trpcClient]);

  const isFocusMainScreen = useSelector(appService, (state) =>
    state.matches('Focus.MainScreen')
  );

  return (
    <AppServiceContext.Provider value={appService}>
      <Flex
        css={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'column',

          '@bp2': {
            flexDirection: 'row',
          },
        }}
      >
        <Navigation />
        <Box
          css={{
            background: 'yellow',
            flexGrow: isFocusMainScreen ? 0 : 1,
            position: 'relative',
            transition: 'flex-grow 150ms',

            '@bp2': {
              flexGrow: 1,
              flexBasis: '70%',
            },
          }}
        >
          <MainSceneContainer />
        </Box>
        <Box
          css={{
            background: 'blue',
            width: '100%',
            flexShrink: 3,
            flexGrow: isFocusMainScreen ? 1 : 0,

            '@bp2': {
              ...(!isFocusMainScreen
                ? {
                    position: 'absolute',
                    right: '$3',
                    bottom: '$3',
                    maxWidth: '30%',
                  }
                : {
                    height: '100%',
                    flexBasis: '30%',
                    flexGrow: 1,
                  }),
            },
          }}
        >
          <MainScreenContainer />
        </Box>
      </Flex>
      {/* <NavigationDrawer /> */}
      {/* <MainContainer>
        <NavigationContainer />
        <MainSceneContainer />
        <MainScreenContainer />
      </MainContainer> */}
    </AppServiceContext.Provider>
  );
};

const NavigationContainer = () => {
  const navIsOpen = useAppSelector(selectNavIsOpen);

  return (
    <Flex css={{ flexBasis: navIsOpen ? '35%' : '5%', background: 'oragne' }}>
      <Navigation />
    </Flex>
  );
};

// const MainSceneContainer = () => {
//   return (
//     <Flex
//       css={{
//         background: 'blue',
//         '@bp0': {
//           width: '100%',
//         },
//         '@bp1': {
//           width: '100%',
//         },
//         '@bp2': {
//           flexBasis: '65%',
//         },
//       }}
//     >
//       <Flex css={{ aspectRatio: 3 / 2, width: '100%' }}>
//         <FloatingHeader />
//         <MainScene />
//       </Flex>
//     </Flex>
//   );
// };

const lobbyService = createMachine({
  id: 'LobbyService',
  schema: {
    events: {} as
      | { type: 'CREATE_ROOM' }
      | { type: 'JOIN_GAME'; roomId: SnowflakeId },
  },
  states: {
    Idle: {
      on: {
        CREATE_ROOM: 'Configuring',
        JOIN_GAME: 'Joining,',
      },
    },
    Configuring: {},
    Creating: {},
    Joining: {},
  },
});

const roomService = createMachine({
  id: 'RoomService',
});

const MainScreenContainer = () => {
  const appService = useContext(AppServiceContext);
  const isMainScreenFocused = useAppSelector((state) =>
    state.matches('Focus.MainScreen')
  );
  return (
    <Flex
      direction="column"
      css={{
        p: '$3',
        ...(isMainScreenFocused ? { height: '100vh', paddingTop: '76px' } : {}),
      }}
    >
      <Card
        onClick={() => {
          // lobbyService.send("")
          // appService.send("")
          // appService.send('FOCUS_SCREEN');
        }}
      >
        <Button size="3" fullWidth>
          New Game Room
        </Button>
      </Card>
    </Flex>
  );
  // return (
  //   <Flex
  //     css={{
  //       background: 'yellow',
  //       '@bp0': {
  //         width: '100%',
  //       },
  //       '@bp1': {
  //         width: '100%',
  //       },
  //       '@bp2': {
  //         flexBasis: '30%',
  //       },
  //     }}
  //   >
  //     <MainScreen />
  //   </Flex>
  // );
};

const FloatingHeader = () => {
  const appService = useContext(AppServiceContext);
  const navIsOpen = useSelector(appService, (state) => {
    console.log(state, 'hi');
    return state.matches('Focus.Navigation');
  });

  const handlePressMenu = useCallback(() => {
    if (navIsOpen) {
      appService.send('CLOSE_NAV');
    } else {
      appService.send('FOCUS_NAV');
    }
  }, [appService, navIsOpen]);

  return (
    <Flex
      justify="between"
      align="center"
      css={{
        position: 'absolute',
        top: '$2',
        left: '$2',
        right: '$2',
        zIndex: 30,
      }}
    >
      <IconButton variant="raised" size="3" onClick={handlePressMenu}>
        <HamburgerMenuIcon />
      </IconButton>
      <Logo />
      <IconButton variant="raised" size="3">
        <PersonIcon />
      </IconButton>
    </Flex>
  );
};

// const MainScreenDrawer = () => {
//   return (

//   )
// }

const Navigation = () => {
  const appService = useContext(AppServiceContext);
  const isOpen = useSelector(appService, (state) =>
    state.matches('Focus.Navigation')
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      console.log({ open });
      if (!open) {
        appService.send('CLOSE_NAV');
      }
    },
    [appService]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <NavigationDrawerOverlay />
        <NavigationDrawerContent />
      </Dialog.Portal>
    </Dialog.Root>
  );
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
  position: 'fixed',

  top: 0,
  left: 0,
  right: 0,
  bottom: 0,

  flexWrap: 'wrap',
  flexDirection: 'row',
});

const MainScreen = () => {
  return (
    <ScrollAreaRoot css={{ background: 'red', width: '100%' }}>
      <ScrollAreaViewport>
        <Heading>Main Screen</Heading>
        <Flex direction="column" gap="3">
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
            Hello
          </Card>
          <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
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
          >
            Start New Game
          </Card>
        </Flex>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
};

const MainSceneContainer = () => {
  return (
    <Flex
      justify="center"
      align="center"
      css={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // background: 'pink',
        // backgroundImage: `url(${SCENE_URL})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center bottom',
        // width: '100%',
        // aspectRatio: 5 / 4,
        // position: 'relative',

        // '@bp1': {
        //   aspectRatio: 3 / 2,
        // },
      }}
    >
      <FloatingHeader />
      {/* <Box css={{ paddingTop: '66.67%', background: 'orange' }}> */}
      {/* <Box
        css={{
          minHeight: '100%',
          minWidth: '100%',
          aspectRatio: 3 / 2,
          background: 'yellow',
        }}
      ></Box> */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // background: 'green',
          backgroundImage: `url('${SCENE_URL}')`,
          backgroundSize: 'cover',
          backgroundPositionX: 'center',
          backgroundPositionY: 'bottom',
        }}
      >
        <MainScene />
      </Box>
      {/* </Box> */}
    </Flex>
  );
};

const MainScene = () => {
  return (
    <Canvas
      className="main-scene"
      style={{
        position: 'absolute',
        // top: '60%',
        left: 0,
        right: 0,
        bottom: '-45%',
        margin: 'auto',
        height: '100%',
        width: '100%',
        maxWidth: '500',

        // opacity: '50%',
        // background: 'green',
        // backgroundImage: `url('${SCENE_URL}')`,
        // backgroundSize: 'cover',
        // backgroundPositionX: 'center',
        // backgroundPositionY: 'bottom',
      }}
    >
      <axesHelper />
      <FSpyCamera />
      <Environment preset="sunset" />
      <OrbitControls />
      <gridHelper />
      <CharacterComponent />
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
      dataManager.cameraPosition.y + 5,
      dataManager.cameraPosition.z - 25
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

// interface SceneContainerProps {
//   children: ReactElement;
// }

// const SceneContainer: FC<SceneContainerProps> = ({ children }) => {
//   // const state = useSelector(actor, (state) => state);
//   const ContextBridge = useContextBridge(ColyseusContext);

//   return (
//     <Box css={{ background: '$primary1', height: '100vh' }}>
//       <Canvas
//         gl={{ physicallyCorrectLights: true }}
//         camera={{ position: [-9, 5, 24] }}
//       >
//         <color attach="background" args={['#000']} />
//         <ContextBridge>
//           <Suspense fallback={null}>{children}</Suspense>
//         </ContextBridge>
//       </Canvas>
//     </Box>
//   );
// };

const SCENE_URL =
  'https://media.discordapp.net/attachments/1039255735390978120/1082021840878321774/InspectorT_line_art_deck_of_an_outdoorsy_social_club_in_2023_ov_ed9d3f35-fc97-4202-ad03-214ca6ecd9db.png';

const useAppSelector = <T,>(selector: (state: AppState) => T) => {
  const appService = useContext(AppServiceContext);
  return useSelector(appService, selector);
};

const selectNavIsOpen = (state: AppState) => state.matches('Focus.Navigation');
