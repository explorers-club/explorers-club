import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Text } from './Text';

export default {
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

export const Default: ComponentStory<typeof Tabs> = (props) => (
  <Tabs defaultValue="party">
    <TabsList>
      <TabsTrigger value="objectives">Objectives</TabsTrigger>
      <TabsTrigger value="map">Map</TabsTrigger>
      <TabsTrigger value="party">Party</TabsTrigger>
    </TabsList>
    <TabsContent value="objectives">
      <Text>Objectives</Text>
    </TabsContent>
    <TabsContent value="map">
      <Text>Map</Text>
    </TabsContent>
    <TabsContent value="party">
      <Text>Party</Text>
    </TabsContent>
  </Tabs>
);
