import { NotificationsActor } from '@organisms/notifications';
import { TabBarActor } from '@organisms/tab-bar';
import { createContext } from 'react';
import { ModalActor } from '../components/organisms/modal/modal.machine';
import { ClubTabActor } from '../tabs/club';
import { GameTabActor } from '../tabs/game';
import { LobbyTabActor } from '../tabs/lobby';
import { ProfileTabActor } from '../tabs/profile';

export const AppContext = createContext({
  gameTabActor: {} as GameTabActor,
  clubTabActor: {} as ClubTabActor,
  lobbyTabActor: {} as LobbyTabActor,
  profileTabActor: {} as ProfileTabActor,
  tabBarActor: {} as TabBarActor,
  notificationsActor: {} as NotificationsActor,
  modalActor: {} as ModalActor,
});
