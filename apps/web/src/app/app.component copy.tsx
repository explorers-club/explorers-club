// import { Floor } from '@3d/floor';
// import { SunsetSky } from '@3d/sky';
// import { Treehouse } from '@3d/treehouse';
// import { Box } from '@atoms/Box';
// import { trpc } from '@explorers-club/api-client';
// import { Label } from '@atoms/Label';
// import { Flex } from '@atoms/Flex';
// import { Logo } from '@atoms/Logo';
// import { Text } from '@atoms/Text';
// import { TextField } from '@atoms/TextField';
// import { darkTheme } from '@explorers-club/styles';
// import {
//   NotificationsComponent,
//   notificationsMachine,
// } from '@organisms/notifications';
// import { createTabBarMachine, TabBar } from '@organisms/tab-bar';
// import {
//   Environment,
//   OrbitControls,
//   useContextBridge,
// } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { useInterpret, useSelector } from '@xstate/react';
// import * as Colyseus from 'colyseus.js';
// import { Entity } from 'libs/api/src/ecs/schema';
// import {
//   FC,
//   ReactElement,
//   Suspense,
//   useCallback,
//   useContext,
//   useRef,
//   useState,
// } from 'react';
// import { BottomSheet } from 'react-spring-bottom-sheet';
// import {
//   defaultSnapProps,
//   SnapPointProps,
// } from 'react-spring-bottom-sheet/dist/types';
// import { ModalComponent, modalMachine } from '../components/organisms/modal';
// import { environment } from '../environments/environment';
// import { AppContext } from '../state/app.context';
// import { AuthContext } from '../state/auth.context';
// import { ColyseusContext } from '../state/colyseus.context';
// import { useEntityStoreSelector } from '../state/entity.context';
// import { ClubTab, createClubTabMachine } from '../tabs/club';
// import { createGameTabMachine, GameTab } from '../tabs/game';
// import { createLobbyTabMachine, LobbyTab } from '../tabs/lobby';
// import { createProfileTabMachine, ProfileTab } from '../tabs/profile';
// import { getClubNameFromPath } from '../utils';
// import { NavigationHelper } from './navigation-helper.component';
// import { Button } from '@atoms/Button';

// const DEFAULT_SNAP_POINTS = ({ minHeight }: SnapPointProps) => [
//   minHeight /* height of child contents (will go to full screen then scroll) */,
//   // window.innerHeight * 0.4 /* almost halfway up */,
//   // 80 /* fixed height of tab bar so you can always see it */,
// ];

// const DEFAULT_SNAP = ({ snapPoints }: defaultSnapProps) => snapPoints[0];

// const EntityComponent: FC<{ entity: Entity }> = ({ entity }) => {
//   return (
//     <Flex>
//       <Text>Hello</Text>
//     </Flex>
//   );
// };

// export const AppComponent = () => {
//   const entitiesById = useEntityStoreSelector((state) => state.entitiesById);
//   const roomNameRef = useRef<HTMLInputElement>(null);

//   const trpcClient = trpc.useContext().client;

//   const handlePressSubmit = useCallback(() => {
//     trpcClient.actor.create.mutate({
//       actorType: 'staging_room',
//       name: 'hello',
//     });
//   }, [trpcClient]);

//   return (
//     <Flex direction="column">
//       <Text>Hello</Text>
//       {Array.from(entitiesById.values()).map((entity) => (
//         <EntityComponent entity={entity} />
//       ))}
//       <Label htmlFor="roomName">Room Name</Label>
//       <TextField id="roomName" ref={roomNameRef} />
//       <Button onClick={handlePressSubmit}>Submit</Button>
//     </Flex>
//   );

//   // const [colyseusClient] = useState(
//   //   new Colyseus.Client(environment.colyseusHost)
//   // );
//   // const authContext = useContext(AuthContext);

//   // const [lobbyTabMachine] = useState(createLobbyTabMachine(colyseusClient));
//   // const lobbyTabActor = useInterpret(lobbyTabMachine);

//   // // const chatActor = useInterpret(chatMachine);

//   // const modalActor = useInterpret(modalMachine);
//   // const notificationsActor = useInterpret(notificationsMachine);

//   // const [profileTabMachine] = useState(createProfileTabMachine(authContext));
//   // const profileTabActor = useInterpret(profileTabMachine);

//   // const [gameTabMachine] = useState(
//   //   createGameTabMachine(colyseusClient, authContext.userId)
//   // );
//   // const gameTabActor = useInterpret(gameTabMachine);

//   // const clubName = getClubNameFromPath();
//   // const [clubTabMachine] = useState(
//   //   createClubTabMachine(
//   //     colyseusClient,
//   //     authContext.userId,
//   //     notificationsActor,
//   //     clubName
//   //   )
//   // );
//   // const clubTabActor = useInterpret(clubTabMachine);

//   // const [machine] = useState(
//   //   createTabBarMachine({
//   //     Game: {
//   //       actor: gameTabActor,
//   //       name: 'Game',
//   //       Component: <GameTab />,
//   //     },
//   //     Club: {
//   //       actor: clubTabActor,
//   //       name: 'Club',
//   //       Component: <ClubTab />,
//   //     },
//   //     Lobby: {
//   //       actor: lobbyTabActor,
//   //       name: 'Lobby',
//   //       Component: <LobbyTab />,
//   //     },
//   //     Profile: {
//   //       actor: profileTabActor,
//   //       name: 'Profile',
//   //       Component: <ProfileTab />,
//   //     },
//   //   })
//   // );

//   // const tabBarActor = useInterpret(machine);

//   // const isShowingModal = useSelector(modalActor, (state) =>
//   //   state.matches('Mounted')
//   // );

//   // return (
//   //   <AppContext.Provider
//   //     value={{
//   //       tabBarActor,
//   //       profileTabActor,
//   //       gameTabActor,
//   //       clubTabActor,
//   //       lobbyTabActor,
//   //       notificationsActor,
//   //       modalActor,
//   //     }}
//   //   >
//   //     <NavigationHelper />
//   //     <Box
//   //       css={{
//   //         position: 'absolute',
//   //         top: 0,
//   //         left: '50%',
//   //         zIndex: 1,
//   //         width: '120px',
//   //         marginLeft: '-60px',
//   //         pt: '$2',
//   //       }}
//   //     >
//   //       <Logo />
//   //     </Box>
//   //     <Box
//   //       css={{
//   //         maxWidth: 400,
//   //         background: 'black',
//   //         position: 'absolute',
//   //         top: 0,
//   //         right: 0,
//   //         zIndex: 100,
//   //       }}
//   //     >
//   //       <NotificationsComponent actor={notificationsActor} />
//   //     </Box>
//   //     <BottomSheet
//   //       open={true}
//   //       blocking={false}
//   //       defaultSnap={DEFAULT_SNAP}
//   //       snapPoints={DEFAULT_SNAP_POINTS}
//   //     >
//   //       <Box className={darkTheme.className}>
//   //         {isShowingModal ? (
//   //           <ModalComponent actor={modalActor} />
//   //         ) : (
//   //           <TabBar actor={tabBarActor} />
//   //         )}
//   //       </Box>
//   //     </BottomSheet>
//   //     <SceneContainer>
//   //       <>
//   //         <OrbitControls maxDistance={80} />
//   //         <Environment preset="sunset" />
//   //         <SunsetSky />
//   //         <Treehouse rotation={[0, -Math.PI / 4, 0]} />
//   //         <Floor />
//   //       </>
//   //     </SceneContainer>
//   //   </AppContext.Provider>
//   // );
// };

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
