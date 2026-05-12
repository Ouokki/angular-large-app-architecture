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
    hint: { control: 'text' },
  },
  render: (args) => ({
    props: args,
    template: `<app-ui-input [type]="type" [placeholder]="placeholder" [label]="label" [hint]="hint" />`,
  }),
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {
  args: { type: 'text', placeholder: 'Enter text…', label: 'Label' },
};

export const WithHint: Story = {
  args: {
    type: 'text',
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'Validation errors appear below the field.',
  },
  name: 'With hint text',
};

export const Password: Story = {
  args: { type: 'password', label: 'Password', placeholder: '••••••••' },
};

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search…' },
};
