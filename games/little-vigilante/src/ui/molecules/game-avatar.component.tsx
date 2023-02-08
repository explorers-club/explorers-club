import { Avatar } from '@atoms/Avatar';
import { bottts } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { lime } from '@radix-ui/colors';
import { ComponentProps, ElementRef, forwardRef, useMemo } from 'react';

export const GameAvatar = forwardRef<
  ElementRef<typeof Avatar>,
  ComponentProps<typeof Avatar>
>(({ ...props }, ref) => {
  const avatar = useMemo(() => {
    return createAvatar(bottts, {
      seed: 'little_vigilante',
      backgroundColor: ['6F6E77'],
    }).toDataUriSync();
  }, []);
  return <Avatar {...props} ref={ref} src={avatar} />;
});
