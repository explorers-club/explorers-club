import { useContext } from 'react';
import { useQuery } from 'react-query';
import { AppContext } from '../../state/app.context';
import { DatabaseContext } from '../../state/database.context';
import { ProfileTabComponent } from './profile-tab.component';

export const ProfileTab = () => {
  const { profileTabActor } = useContext(AppContext);
  const db = useContext(DatabaseContext);

  const session = useQuery('session', db.auth.getSession);
  console.log(session);
  return <ProfileTabComponent actor={profileTabActor} />;
};
