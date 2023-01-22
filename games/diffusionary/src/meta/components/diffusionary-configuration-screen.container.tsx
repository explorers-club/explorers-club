import { FC } from 'react';
import { DiffusionaryConfig } from '@explorers-club/schema';
import { DiffusionaryConfigurationScreenComponent } from './diffusionary-configuration-screen.component';

interface Props {
  initialConfig: DiffusionaryConfig;
  onSubmitConfig: (config: DiffusionaryConfig) => void;
}

export const DiffusionaryConfigurationScreen: FC<Props> = () => {
  return <DiffusionaryConfigurationScreenComponent />;
};
