export interface UserSettings {
  displayName: string;
  email: string;
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Demo User',
  email: 'demo@example.com',
  theme: 'light',
  language: 'en',
  timezone: 'UTC',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};
