import * as ScrollArea from '@radix-ui/react-scroll-area';
import { styled } from '../stitches.config';

export const ScrollAreaRoot = styled(ScrollArea.Root, {
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  '--scrollbar-size': '10px',
});

export const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  width: '100%',
  height: '100%',
  borderRadius: 'inherit',
});

export const ScrollAreaScrollbar = styled(ScrollArea.ScrollAreaScrollbar, {
  display: 'flex',
  userSelect: 'none',
  touchAction: 'none',
  padding: '$1',
  background: '$primary6',
  transition: 'background 160ms ease-out',
  '&:hover': {
    background: '$primary8',
  },

  "&[data-orientation='vertical']": {
    width: '$2',
  },
  "&[data-orientation='horizontal']": {
    flexDirection: 'column',
    height: '$2',
  },
});

export const ScrollAreaThumb = styled(ScrollArea.ScrollAreaThumb, {
  flex: 1,
  background: '$primary9',
  borderRadius: '$1',
  position: 'relative',

  '&:before': {
    content: '',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: '44px',
    minHeight: '44px',
  },
});
