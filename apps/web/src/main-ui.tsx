import { useCallback, useRef, useState } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './routes/home';
import { Party } from './routes/party';
import { NewParty } from './routes/new-party';

export function MainUI() {
  const sheetRef = useRef<BottomSheetRef>(null);
  const [open, setOpen] = useState(true);

  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <BottomSheet
      open={open}
      onDismiss={handleDismiss}
      blocking={false}
      snapPoints={({ maxHeight }) => [maxHeight / 4, maxHeight * 0.6]}
      ref={sheetRef}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="party/new" element={<NewParty />} />
          <Route path="party/:code" element={<Party />} />
        </Routes>
      </BrowserRouter>
    </BottomSheet>
  );
}

export default MainUI;
