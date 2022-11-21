import { Box } from '@atoms/Box';
import {
  useLobbyScreenActor,
  useSharedCollectionActor,
} from './lobby-screen.hooks';

export const LobbyScreenComponent = () => {
  //   const actor = useLobbyScreenActor();
  const actor = useSharedCollectionActor();
  console.log({ actor });
  return <Box>Lobby21</Box>;
};
