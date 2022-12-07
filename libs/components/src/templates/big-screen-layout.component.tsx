import { FC } from 'react';
import { Caption } from '../atoms/Caption';
import { Flex } from '../atoms/Flex';
import { Heading } from '../atoms/Heading';
import { Sheet, SheetContent } from '../atoms/Sheet';
import { Text } from '../atoms/Text';

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
      <Sheet open={leftSheet.open}>
        <SheetContent side="left">
          <Heading>Left Sheet</Heading>
          <Text>Left Sheet</Text>
          <Caption>My Left Caption</Caption>
        </SheetContent>
      </Sheet>
      <Sheet open={rightSheet.open}>
        <SheetContent side="right">
          <Heading>Header!</Heading>
          <Text>Right SHeet</Text>
          <Caption>My Caption</Caption>
        </SheetContent>
      </Sheet>
    </Flex>
  );
};
