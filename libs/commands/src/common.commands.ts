export const JOIN = 'JOIN';
export const LEAVE = 'LEAVE';
export const CONTINUE = 'CONTINUE';

export type LeaveCommand = {
  type: typeof LEAVE;
  userId: string;
};

export type JoinCommand = {
  type: typeof JOIN;
  userId: string;
};

export type ContinueCommand = {
  type: typeof CONTINUE;
};
