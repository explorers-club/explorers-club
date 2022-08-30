import { useRef } from 'react';
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import { Lobby } from '../ui/lobby';

export function MainUI() {
  const sheetRef = useRef<BottomSheetRef>(null);

  return (
    <BottomSheet open ref={sheetRef}>
      <Lobby />
    </BottomSheet>
  );
}

export default MainUI;
