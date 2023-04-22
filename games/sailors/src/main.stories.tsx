import { Story } from '@storybook/react';

export default {
    parameters: {
        layout: "fullscreen"
    }
}

const Template: Story<{ numbPlayers: number }> = () => {
    return <div>Hello world</div>
}

export const Default = Template.bind({});