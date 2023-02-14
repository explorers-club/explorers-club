import { Avatar } from '@atoms/Avatar';
import { Box } from '@atoms/Box';
import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { PlayerColor } from '@explorers-club/styles';
import { ComponentProps, ElementRef, forwardRef, useMemo } from 'react';
import { colorNameToPrimaryColor } from '../../meta/little-vigilante.constants';

interface Props {
  userId: string;
  color: PlayerColor;
}

export const PlayerAvatar = forwardRef<
  ElementRef<typeof Avatar>,
  Props & ComponentProps<typeof Avatar>
>(({ userId, color, ...props }, ref) => {
  const avatar = useMemo(() => {
    return createAvatar(thumbs, {
      seed: userId,
      backgroundColor: [colorNameToPrimaryColor[color]],
    }).toDataUriSync();
  }, [userId, color]);
  return (
    <Box
      css={{
        position: 'relative',
        height: 'fit-content',
        width: 'fit-content',
        borderRadius: '50%',
        // filter: 'drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5))',
        filter: `drop-shadow(0px 3px 2px $colors$${color}8)`,
      }}
    >
      <Avatar
        {...props}
        css={{
          ...props.css,
          border: `3px solid $${color}9`,
          borderRadius: '50%',
        }}
        ref={ref}
        src={avatar}
      />
    </Box>
  );
});
