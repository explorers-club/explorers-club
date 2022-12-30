import { Box } from './Box';
import { Text } from './Text';

import { Fieldset } from './Fieldset';
import { Input } from './Input';
import { Label } from './Label';
import { Button } from './Button';

export default {
  component: Fieldset,
};

export const Default = {
  render: () => (
    <Box>
      <Fieldset>
        <Input
          type="text"
          placeholder="This is an example of fieldset"
          autoFocus
          css={{ width: '$9' }}
        />
        <Label>Label</Label>
        <Input type="range" />
        <Text>value</Text>
        <Button type="submit">save</Button>
      </Fieldset>
    </Box>
  ),
};
