/**
 * Adds a wrapper around a compoennt to add a close button
 */
import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { IconButton } from '@atoms/IconButton';
import { ArrowDownIcon, Cross2Icon } from '@radix-ui/react-icons';
import { FC, ReactNode, useCallback, useContext } from 'react';
import { AppContext } from '../../../state/app.context';

interface Props {
  component: ReactNode;
}

export const CloseableModal: FC<Props> = ({ component }) => {
  const { modalActor } = useContext(AppContext);
  const onPressClose = useCallback(() => {
    modalActor.send({
      type: 'CLOSE',
    });
  }, [modalActor]);

  return (
    <Box css={{ p: '$3' }}>
      <Flex justify="end" css={{px: "$3"}}>
        <IconButton size="3" onClick={onPressClose}>
          <Cross2Icon />
        </IconButton>
      </Flex>
      {component}
    </Box>
  );
};
