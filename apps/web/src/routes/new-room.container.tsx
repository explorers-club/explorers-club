import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewRoomComponent } from './new-room.component';

export const NewRoom = () => {
  const navigate = useNavigate();
  const handleSubmitClubName = useCallback((clubName: string) => {
    // todo validation
    navigate(`/${clubName}`);
  }, [navigate]);

  return <NewRoomComponent onSubmitClubName={handleSubmitClubName} />;
};
