export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  compactMode: boolean;
  timezone: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  language: 'en',
  notificationsEnabled: true,
  compactMode: false,
  timezone: 'UTC',
};
