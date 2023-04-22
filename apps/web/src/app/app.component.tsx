import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { IconButton } from '@atoms/IconButton';
import { Logo } from '@atoms/Logo';
import { HamburgerMenuIcon, PersonIcon } from '@radix-ui/react-icons';
import { useCallback } from 'react';
import { MainScene } from '../scenes/main-scene.component';
import { MainScreen } from '../screens/main-screen.component';
import { useAppSend, useServiceSelector } from '../services';
import { AppState } from '../state/app.machine';
import { selectLoginIsOpen, selectNavIsOpen } from './app.selectors';
import { Login } from './login.component';
import { Navigation } from './navigation.component';

// inspect({
//   // options
//   // url: 'https://stately.ai/viz?inspect', // (default)
//   iframe: false, // open in new window
// });

export const AppComponent = () => {
  const isFocusMainScreen = useServiceSelector('appService', (state) =>
    state.matches('Focus.MainScreen')
  );

  return (
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
  );
};

const MainScreenContainer = () => {
  const isMainScreenFocused = useServiceSelector('appService', (state) =>
    state.matches('Focus.MainScreen')
  );
  const loginIsOpen = useServiceSelector('appService', selectLoginIsOpen);

  return (
    <Flex
      direction="column"
      css={{
        p: '$3',
        ...(isMainScreenFocused ? { height: '100vh', paddingTop: '76px' } : {}),
      }}
    >
      {!loginIsOpen ? <MainScreen /> : <Login />}
    </Flex>
  );
};

const FloatingHeader = () => {
  const send = useAppSend();
  const navIsOpen = useServiceSelector('appService', selectNavIsOpen);

  const handlePressMenu = useCallback(() => {
    if (navIsOpen) {
      send({ type: 'CLOSE_NAV' });
    } else {
      send({ type: 'OPEN_NAV' });
    }
  }, [send, navIsOpen]);

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
      <IconButton variant="raised" size="3" css={{ visibility: 'hidden' }}>
        <PersonIcon />
      </IconButton>
    </Flex>
  );
};

// const Navigation = () => {
//   const send = useSend();
//   const isOpen = useServiceSelector('appService', selectNavIsOpen);

//   const handleOpenChange = useCallback(
//     (open: boolean) => {
//       if (!open) {
//         send({ type: 'CLOSE_NAV' });
//       }
//     },
//     [send]
//   );

//   return (
//     <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
//       <Dialog.Portal>
//         <NavigationDrawerOverlay />
//         <NavigationDrawerContent />
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// .TabsTrigger[data-state='active'] {
//   color: var(--violet11);
//   box-shadow: inset 0 -1px 0 0 currentColor, 0 1px 0 0 currentColor;
// }

// const MainScreen = () => {
//   const send = useSend();
//   const handleStartNew = useCallback(() => {
//     send({ type: 'START_ROOM' });
//   }, [send]);

//   return (
//     <ScrollAreaRoot css={{ background: 'red', width: '100%' }}>
//       <ScrollAreaViewport>
//         <Heading>Main Screen</Heading>
//         <Flex direction="column" gap="3">
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card css={{ p: '$3', minHeight: '200px' }} variant="interactive">
//             Hello
//           </Card>
//           <Card
//             css={{
//               p: '$3',
//               minHeight: '200px',
//               position: 'sticky',
//               bottom: 0,
//             }}
//             color="success"
//             variant="interactive"
//             onClick={handleStartNew}
//           >
//             Start New Game
//           </Card>
//         </Flex>
//       </ScrollAreaViewport>
//       <ScrollAreaScrollbar orientation="vertical">
//         <ScrollAreaThumb />
//       </ScrollAreaScrollbar>
//     </ScrollAreaRoot>
//   );
// };

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
      }}
    >
      <FloatingHeader />
      <MainScene />
    </Flex>
  );
};
