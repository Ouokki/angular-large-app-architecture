import type { Meta, StoryObj } from '@storybook/angular';
import { ModalComponent } from './modal.component';

const meta: Meta<ModalComponent> = {
  title: 'Shared/UI/Modal',
  component: ModalComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<ModalComponent>;

export const Default: Story = {
  args: {
    title: 'Are you sure?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-ui-modal
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
      >
        <p>This action cannot be undone. Proceed?</p>
      </app-ui-modal>
    `,
  }),
};

export const DestructiveAction: Story = {
  name: 'Destructive action',
  args: {
    title: 'Delete account',
    confirmLabel: 'Delete permanently',
    cancelLabel: 'Keep my account',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-ui-modal
        [title]="title"
        [confirmLabel]="confirmLabel"
        [cancelLabel]="cancelLabel"
      >
        <p>Your data will be permanently removed and cannot be recovered.</p>
      </app-ui-modal>
    `,
  }),
};
