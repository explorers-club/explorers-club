// Routing setup inspired by https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
import { useCallback, useContext, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { RoutesContainer } from './routes';
import { GlobalStateContext } from './state/global.provider';

export function MainUI() {
  const { sheetRef } = useContext(GlobalStateContext);

  const [open, setOpen] = useState(true);
  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <BottomSheet
      open={open}
      onDismiss={handleDismiss}
      blocking={false}
      snapPoints={({ minHeight }) => [minHeight + 96]}
      ref={sheetRef}
    >
      <RoutesContainer />
    </BottomSheet>
  );
}

export default MainUI;
