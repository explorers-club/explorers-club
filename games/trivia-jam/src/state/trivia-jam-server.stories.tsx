// import { Story } from '@storybook/react';
// import { useInterpret } from '@xstate/react';
// import { useMemo } from 'react';
// import { RenderMachine } from 'storybook-xstate-addon/RenderMachine';
// import {
//   createTriviaJamServerMachine,
//   TriviaJamServerContext,
// } from './trivia-jam-server.machine';

// export default {
//   title: 'State/Trivia Jam Server',
// };

// // Test entry id dSX6kC0PNliXTl7qHYJLH

// const Template: Story<{ serverContext: TriviaJamServerContext }> = (args) => {
//   const sharedCollectionMachine = useMemo(() => {

//   }, [args.sharedCollectionContext])
//   const sharedCollectionActor = useInterpret(sharedCollectionMachine);
//   const machine = useMemo(
//     () => createTriviaJamServerMachine({ sharedCollectionActor }).withContext(args.context),
//     [args]
//   );
//   return <RenderMachine machine={machine} />;
// };

// export const Default = Template.bind({});

// Default.args = {
//   context: {
//     playerName: 'Foobar',
//   },
// };
