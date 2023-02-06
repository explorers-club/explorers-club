import { Avatar } from '../atoms/Avatar';
import { thumbs } from '@dicebear/collection';
import { createAvatar, Options, Style } from '@dicebear/core';
import { ComponentProps, forwardRef, useMemo } from 'react';

interface Props {
  thumbStyle: Style<thumbs.Options>;
  options?: Partial<thumbs.Options & Options>;
}

export const DicebarAvatar = forwardRef<
  React.ElementRef<typeof Avatar>,
  Props & ComponentProps<typeof Avatar>
>(({ thumbStyle, options, ...props }, ref) => {
  const avatar = useMemo(() => {
    return createAvatar(thumbStyle, options).toDataUriSync();
  }, [thumbStyle, options]);
  return <Avatar {...props} ref={ref} src={avatar} />;
});
