// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserMetadata = {
  hasPassword: 'hasPassword',
};

export type UserMetadata = typeof UserMetadata[keyof typeof UserMetadata];
