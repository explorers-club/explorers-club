export const getClubNameFromPath = () => {
  const pathTokens = window.location.pathname.split('/');
  const clubName = pathTokens[1] !== '' ? pathTokens[1] : undefined;
  return clubName;
};