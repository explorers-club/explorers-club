import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { IconButton } from '@atoms/IconButton';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { FC, ReactNode, useCallback, useContext } from 'react';
import { CloseableModal } from '../../../components/organisms/modal/modal-wrapper.component';
import { AppContext } from '../../../state/app.context';

interface Props {
  displayName: string;
  coverImageUrl: string;
  minPlayers: number;
  maxPlayers: number;
  GameInfoScreenComponent?: ReactNode;
}

export const GameCardComponent: FC<Props> = ({
  displayName,
  coverImageUrl,
  minPlayers,
  maxPlayers,
  GameInfoScreenComponent,
}) => {
  const { modalActor } = useContext(AppContext);
  const handlePressInfo = useCallback(() => {
    if (GameInfoScreenComponent) {
      modalActor.send({
        type: 'SHOW',
        component: <CloseableModal component={GameInfoScreenComponent} />,
      });
    }
  }, [modalActor, GameInfoScreenComponent]);

  return (
    <Card
      css={{
        aspectRatio: 1,
        backgroundSize: 'contain',
        backgroundImage: `url(${coverImageUrl})`,
      }}
    >
      <Box
        css={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          p: '$4',
          pt: '$8',
          background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))',
        }}
      >
        <Flex justify="between">
          <Box>
            <Heading size="2">{displayName}</Heading>
            <Caption size="2">
              {minPlayers} - {maxPlayers} players
            </Caption>
          </Box>
          {GameInfoScreenComponent && (
            <IconButton size="3" onClick={handlePressInfo}>
              <InfoCircledIcon />
            </IconButton>
          )}
        </Flex>
      </Box>
    </Card>
  );
};
