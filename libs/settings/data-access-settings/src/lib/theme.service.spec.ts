import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    service = new ThemeService();
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.body.removeAttribute('data-theme');
  });

  it('applies the theme to html and body', () => {
    service.apply('dark');

    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.body.dataset['theme']).toBe('dark');
  });
});
