import type { Meta, StoryObj } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  name: 'With hint text',
  args: {
    type: 'text',
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'We will never share your email.',
  },
};

export const Password: Story = {
  args: { type: 'password', label: 'Password', placeholder: '••••••••' },
};

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search…' },
};

export const WithValidationError: Story = {
  name: 'Validation error (touched + invalid)',
  render: () => {
    const ctrl = new FormControl('not-an-email', [Validators.required, Validators.email]);
    ctrl.markAsTouched();
    return {
      moduleMetadata: { imports: [ReactiveFormsModule] },
      props: { ctrl },
      template: `
        <form>
          <app-ui-input
            label="Email"
            placeholder="you@example.com"
            type="email"
            [formControl]="ctrl"
          />
        </form>`,
    };
  },
};

export const Disabled: Story = {
  name: 'Disabled',
  render: () => {
    const ctrl = new FormControl({ value: 'read-only value', disabled: true });
    return {
      moduleMetadata: { imports: [ReactiveFormsModule] },
      props: { ctrl },
      template: `
        <form>
          <app-ui-input label="Locked field" [formControl]="ctrl" />
        </form>`,
    };
  },
};

export const AllTypes: Story = {
  name: 'All input types',
  render: () => ({
    template: `
      <div style="display:flex;flex-direction:column;gap:16px;max-width:400px;padding:16px">
        <app-ui-input label="Text"     type="text"     placeholder="Enter text…" />
        <app-ui-input label="Email"    type="email"    placeholder="you@example.com" />
        <app-ui-input label="Password" type="password" placeholder="••••••••" />
        <app-ui-input label="Number"   type="number"   placeholder="42" />
        <app-ui-input label="Search"   type="search"   placeholder="Search…" />
        <app-ui-input label="Tel"      type="tel"      placeholder="+33 6 00 00 00 00" />
        <app-ui-input label="URL"      type="url"      placeholder="https://example.com" />
      </div>
    `,
  }),
};
