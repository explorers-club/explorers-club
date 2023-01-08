import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Heading } from '@atoms/Heading';
import { FC } from 'react';

interface Props {
  displayName: string;
  coverImageUrl: string;
  minPlayers: number;
  maxPlayers: number;
}

export const GameCardComponent: FC<Props> = ({
  displayName,
  coverImageUrl,
  minPlayers,
  maxPlayers,
}) => {
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
        <Heading size="2">{displayName}</Heading>
        <Caption size="2">
          {minPlayers} - {maxPlayers} players
        </Caption>
      </Box>
    </Card>
  );
};
