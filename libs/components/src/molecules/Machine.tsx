import { useSelector } from '@xstate/react';
import React, { ReactNode, useContext } from 'react';
import { AnyInterpreter, StateValue } from 'xstate';

/**
 * A compound React component that provides an interface for interacting with an xstate interpreter.
 * It exports two nested components: `Machine.Root` and `Machine.State`.
 * The `Machine.Root` component is responsible for starting the xstate interpreter and rendering its children components.
 * The `Machine.State` component conditionally renders its children components based on whether its `state` prop matches the current state of the xstate interpreter.
 * The `Machine` component itself takes in an xstate interpreter as a prop and renders its children components.
 * This component is written in TypeScript and uses the `useSelector` hook from `@xstate/react` to interact with the current state of the interpreter.
 */

interface MachineProps {
  service: AnyInterpreter;
  children: ReactNode;
}

const MachineContext = React.createContext({} as AnyInterpreter);

const MachineState: React.FC<{ value: StateValue; children: ReactNode }> = ({
  value,
  children,
}) => {
  const service = useContext(MachineContext);
  const match = useSelector(service, (state) => state.matches(value));

  return <>{match ? children : null}</>;
};

const MachineRoot: React.FC<MachineProps> = ({ service, children }) => {
  return (
    <MachineContext.Provider value={service}>
      {children}
    </MachineContext.Provider>
  );
};

const Machine: React.FC<MachineProps> & {
  Root: typeof MachineRoot;
  State: typeof MachineState;
} = ({ service, children }) => {
  return <MachineRoot service={service}>{children}</MachineRoot>;
};

Machine.Root = MachineRoot;
Machine.State = MachineState;

export { Machine };
