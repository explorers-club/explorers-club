import { Box } from './Box';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from './Sheet';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Sheet,
} as ComponentMeta<typeof Sheet>;

export const Default: ComponentStory<typeof Sheet> = (props) => (
  <Box>
    <Sheet>
      <SheetTrigger>trigger</SheetTrigger>
      <SheetContent>
        <SheetTitle>TItle</SheetTitle>
        <SheetDescription>This is sheet description</SheetDescription>
        <SheetClose>close</SheetClose>
      </SheetContent>
    </Sheet>
  </Box>
);
