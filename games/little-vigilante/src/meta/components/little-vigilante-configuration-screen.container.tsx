import { LittleVigilanteConfig } from '@explorers-club/schema';
import { FC } from 'react';
import { LittleVigilanteConfigurationScreenComponent } from './little-vigilante-configuration-screen.component';

interface Props {
  initialConfig: LittleVigilanteConfig;
  onSubmitConfig: (config: LittleVigilanteConfig) => void;
}

export const LittleVigilanteConfigurationScreen: FC<Props> = (props) => {
  return <LittleVigilanteConfigurationScreenComponent {...props} />;
};
