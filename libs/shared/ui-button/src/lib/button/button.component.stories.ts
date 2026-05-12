import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'Shared/UI/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<app-ui-button [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Click me</app-ui-button>`,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary', size: 'md', disabled: false, loading: false },
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md' },
};

export const Danger: Story = {
  args: { variant: 'danger', size: 'md' },
};

export const Loading: Story = {
  args: { variant: 'primary', size: 'md', loading: true },
  name: 'Loading state',
};

export const Disabled: Story = {
  args: { variant: 'primary', size: 'md', disabled: true },
  name: 'Disabled state',
};

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap;padding:16px">
        <app-ui-button variant="primary" size="sm">Primary SM</app-ui-button>
        <app-ui-button variant="primary" size="md">Primary MD</app-ui-button>
        <app-ui-button variant="primary" size="lg">Primary LG</app-ui-button>
        <app-ui-button variant="secondary">Secondary</app-ui-button>
        <app-ui-button variant="ghost">Ghost</app-ui-button>
        <app-ui-button variant="danger">Danger</app-ui-button>
        <app-ui-button [disabled]="true">Disabled</app-ui-button>
        <app-ui-button [loading]="true">Loading</app-ui-button>
      </div>
    `,
  }),
};
