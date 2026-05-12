import type { Meta, StoryObj } from '@storybook/angular';
import { InputComponent } from './input.component';

const meta: Meta<InputComponent> = {
  title: 'Shared/UI/Input',
  component: InputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    errorMessage: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<app-ui-input [type]="type" [placeholder]="placeholder" [label]="label" [errorMessage]="errorMessage" />`,
  }),
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: { type: 'text', placeholder: 'Enter text…', label: 'Label' },
};

export const WithError: Story = {
  args: {
    type: 'text',
    label: 'Email',
    placeholder: 'you@example.com',
    errorMessage: 'Invalid email address',
  },
  name: 'With validation error',
};

export const Password: Story = {
  args: { type: 'password', label: 'Password', placeholder: '••••••••' },
};

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search…' },
};
