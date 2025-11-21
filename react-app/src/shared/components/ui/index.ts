/**
 * UI Components - Base Design System
 *
 * This module contains the foundational UI components used throughout the app.
 * All components follow Tailwind CSS styling and dark theme design.
 */

// Button
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Input
export { Input } from './Input';
export type { InputProps, InputType } from './Input';

// Card
export { Card } from './Card';
export type { CardProps } from './Card';

// Alert
export { Alert } from './Alert';
export type { AlertProps, AlertVariant } from './Alert';

// Modal
export { Modal } from './Modal';
export type { ModalProps, ModalSize } from './Modal';

// Dropdown
export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption, DropdownMode } from './Dropdown';

// Table
export { Table } from './Table';
export type { TableProps, TableColumn, SortDirection } from './Table';

// Badge
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge';

// Spinner
export { Spinner } from './Spinner';
export type { SpinnerProps, SpinnerVariant, SpinnerSize } from './Spinner';

// Toast
// Sonner reemplaza el sistema custom de Toast

// Tabs
export { Tabs, TabPanel } from './Tabs';
export type { TabsProps, TabPanelProps, TabItem } from './Tabs';

// Checkbox
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

// Radio
export { RadioGroup } from './Radio';
export type { RadioGroupProps, RadioOption } from './Radio';

// Switch
export { Switch } from './Switch';
export type { SwitchProps } from './Switch';

// Textarea
export { Textarea } from './Textarea';
export type { TextareaProps } from './Textarea';

// Divider
export { Divider } from './Divider';
export type { DividerProps, DividerOrientation } from './Divider';
