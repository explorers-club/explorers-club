export type LeaderboardEvent = {
  type: 'REFRESH';
};

export type LeaderboardContext = {
  questionIndex: number;
};

export type LeaderboardServices = {
  loadLeaderboard: {
    data: {
      players: string[];
    };
  };
};
