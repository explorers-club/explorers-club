import { FC } from 'react';
import { Flex } from '../atoms/Flex';
import { Sheet } from '../atoms/Sheet';
import { Text } from '../atoms/Text';
import { Heading } from '../atoms/Heading';
import { Caption } from '../atoms/Caption';

type SideSheetProps = {
  open: boolean;
  fullScreen: boolean;
};

interface Props {
  leftSheet: SideSheetProps;
  rightSheet: SideSheetProps;
}

export const BigScreenLayout: FC<Props> = ({ leftSheet, rightSheet }) => {
  return (
    <Flex css={{ background: '$primary3', height: '100vh' }}>
      {leftSheet.open && (
        <SheetContainer fullScreen={leftSheet.fullScreen}>
          <Heading>Left Sheet</Heading>
          <Text>Left Sheet</Text>
          <Caption>My Left Caption</Caption>
        </SheetContainer>
      )}
      {rightSheet.open && (
        <SheetContainer fullScreen={rightSheet.fullScreen}>
          <Heading>Header!</Heading>
          <Text>Right SHeet</Text>
          <Caption>My Caption</Caption>
        </SheetContainer>
      )}
    </Flex>
  );
};

interface SheetContainerProps {
  fullScreen: boolean;
  children?: React.ReactNode;
}

const SheetContainer: FC<SheetContainerProps> = ({ children, fullScreen }) => (
  <Sheet>{children}</Sheet>
);
