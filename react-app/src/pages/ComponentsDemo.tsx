import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Alert,
  Modal,
  Dropdown,
  Table,
  Badge,
  Spinner,
  ToastContainer,
  ToastProvider,
  useToast,
  Tabs,
  TabPanel,
  Checkbox,
  RadioGroup,
  Switch,
  Textarea,
  Divider,
} from '@shared/components/ui';
import type { DropdownOption, TableColumn, RadioOption, TabItem } from '@shared/components/ui';
import { Plus, User, Settings, Bell } from 'lucide-react';

interface DemoUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

function ComponentsDemoContent() {
  const { addToast } = useToast();

  // State for components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | string[]>('football');
  const [selectedSports, setSelectedSports] = useState<string[]>(['football']);
  const [activeTab, setActiveTab] = useState('buttons');
  const [isChecked, setIsChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('option1');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Demo data
  const dropdownOptions: DropdownOption[] = [
    { value: 'football', label: 'Fútbol', icon: '⚽' },
    { value: 'basketball', label: 'Baloncesto', icon: '🏀' },
    { value: 'tennis', label: 'Tenis', icon: '🎾' },
    { value: 'baseball', label: 'Béisbol', icon: '⚾', disabled: true },
  ];

  const demoUsers: DemoUser[] = [
    { id: '1', name: 'Juan Pérez', email: 'juan@example.com', status: 'active' },
    { id: '2', name: 'María García', email: 'maria@example.com', status: 'active' },
    { id: '3', name: 'Carlos López', email: 'carlos@example.com', status: 'inactive' },
  ];

  const tableColumns: TableColumn<DemoUser>[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'status',
      label: 'Estado',
      render: (user: DemoUser) => (
        <Badge variant={user.status === 'active' ? 'success' : 'error'}>
          {user.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  const radioOptions: RadioOption[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3', disabled: true },
  ];

  const demoTabs: TabItem[] = [
    { key: 'buttons', label: 'Buttons & Inputs', icon: <Plus className="h-4 w-4" /> },
    { key: 'cards', label: 'Cards & Alerts', icon: <Bell className="h-4 w-4" /> },
    { key: 'modals', label: 'Modals & Dropdowns', icon: <Settings className="h-4 w-4" /> },
    { key: 'tables', label: 'Tables & Badges', icon: <User className="h-4 w-4" /> },
    { key: 'forms', label: 'Form Controls' },
  ];

  const handleLoadingButton = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Acción completada!', 'success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-100">
            🎨 Components Demo - Phase 2 Complete
          </h1>
          <p className="text-slate-400">
            Prueba todos los 16 componentes del Design System
          </p>
          <div className="flex gap-2 justify-center">
            <Badge variant="success">16 Componentes</Badge>
            <Badge variant="info">TypeScript</Badge>
            <Badge variant="default">Tailwind CSS</Badge>
          </div>
        </div>

        <Divider />

        {/* Toast Demo Buttons */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-100">🔔 Toast Notifications</h2>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => addToast('Info message', 'default')}>
                Toast Default
              </Button>
              <Button variant="secondary" onClick={() => addToast('Success!', 'success')}>
                Toast Success
              </Button>
              <Button variant="outline" onClick={() => addToast('Error occurred', 'error')}>
                Toast Error
              </Button>
              <Button variant="danger" onClick={() => addToast('Warning!', 'warning')}>
                Toast Warning
              </Button>
              <Button onClick={() => addToast('Info message', 'info')}>Toast Info</Button>
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <Card>
          <div className="p-6">
            <Tabs tabs={demoTabs} activeTab={activeTab} onChange={setActiveTab} />

            <div className="mt-6">
              {/* Tab 1: Buttons & Inputs */}
              <TabPanel tabKey="buttons" activeTab={activeTab}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Buttons</h3>
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="danger">Danger</Button>
                      <Button variant="primary" size="sm">
                        Small
                      </Button>
                      <Button variant="primary" size="lg">
                        Large
                      </Button>
                      <Button variant="primary" loading={loading} onClick={handleLoadingButton}>
                        {loading ? 'Loading...' : 'Click Me'}
                      </Button>
                      <Button variant="secondary" icon={<Plus className="h-4 w-4" />}>
                        With Icon
                      </Button>
                      <Button variant="primary" disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Inputs</h3>
                    <div className="space-y-4 max-w-md">
                      <Input
                        type="text"
                        label="Text Input"
                        placeholder="Enter text..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Input
                        type="email"
                        label="Email Input"
                        placeholder="email@example.com"
                      />
                      <Input type="password" label="Password Input" placeholder="••••••••" />
                      <Input
                        type="text"
                        label="Error State"
                        error="This field is required"
                        placeholder="With error"
                      />
                      <Input type="text" label="Disabled" disabled placeholder="Disabled input" />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Spinner</h3>
                    <div className="flex gap-4 items-center">
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                      <Spinner variant="dots" />
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Tab 2: Cards & Alerts */}
              <TabPanel tabKey="cards" activeTab={activeTab}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Cards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-100 mb-2">Simple Card</h4>
                          <p className="text-slate-400 text-sm">
                            This is a basic card with padding.
                          </p>
                        </div>
                      </Card>
                      <Card>
                        <div className="p-4 border-b border-slate-700">
                          <h4 className="font-semibold text-slate-100">Card with Header</h4>
                        </div>
                        <div className="p-4">
                          <p className="text-slate-400 text-sm">Card body content goes here.</p>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Alerts</h3>
                    <div className="space-y-3">
                      <Alert variant="success">Success! Operation completed successfully</Alert>
                      <Alert variant="error">Error! Something went wrong</Alert>
                      <Alert variant="warning">Warning! Please review your input</Alert>
                      <Alert variant="info">Info: Here's some helpful information</Alert>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Badges</h3>
                    <div className="flex gap-2 flex-wrap items-center">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="error">Error</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                      <Badge variant="success" size="sm">
                        Small
                      </Badge>
                      <Badge variant="success" size="lg">
                        Large
                      </Badge>
                      <Badge
                        variant="error"
                        dismissible
                        onDismiss={() => addToast('Badge dismissed', 'info')}
                      >
                        Dismissible
                      </Badge>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Dividers</h3>
                    <div className="space-y-4">
                      <Divider />
                      <Divider text="OR" />
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-800 rounded">Content</div>
                        <Divider orientation="vertical" className="h-16" />
                        <div className="p-4 bg-slate-800 rounded">Content</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              {/* Tab 3: Modals & Dropdowns */}
              <TabPanel tabKey="modals" activeTab={activeTab}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Modal</h3>
                    <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                    <Modal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      title="Demo Modal"
                      size="md"
                      footer={
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setIsModalOpen(false);
                              addToast('Action confirmed!', 'success');
                            }}
                          >
                            Confirm
                          </Button>
                        </div>
                      }
                    >
                      <div className="space-y-4">
                        <p className="text-slate-300">
                          This is a modal dialog with portal rendering, backdrop blur, and
                          animations.
                        </p>
                        <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                          <li>Click outside to close (try it!)</li>
                          <li>Press ESC to close</li>
                          <li>Click X button to close</li>
                        </ul>
                      </div>
                    </Modal>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      Dropdown - Single Select
                    </h3>
                    <Dropdown
                      options={dropdownOptions}
                      value={selectedSport}
                      onChange={setSelectedSport}
                      placeholder="Select a sport..."
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Selected: {selectedSport || 'None'}
                    </p>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      Dropdown - Multi Select with Search
                    </h3>
                    <Dropdown
                      mode="multi"
                      searchable
                      searchPlaceholder="Search sports..."
                      options={dropdownOptions}
                      value={selectedSports}
                      onChange={(val) => setSelectedSports(val as string[])}
                      placeholder="Select sports..."
                      fullWidth
                    />
                    <p className="text-slate-400 text-sm mt-2">
                      Selected: {selectedSports.length > 0 ? selectedSports.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </TabPanel>

              {/* Tab 4: Tables & Data */}
              <TabPanel tabKey="tables" activeTab={activeTab}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      Table with Sorting
                    </h3>
                    <Table<DemoUser>
                      columns={tableColumns}
                      data={demoUsers}
                      keyExtractor={(user) => user.id}
                      hoverable
                      onRowClick={(user) => addToast(`Clicked: ${user.name}`, 'info')}
                    />
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      Table - Loading State
                    </h3>
                    <Table<DemoUser>
                      columns={tableColumns}
                      data={[]}
                      keyExtractor={(user) => user.id}
                      loading
                      loadingRows={3}
                    />
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">
                      Table - Empty State
                    </h3>
                    <Table<DemoUser>
                      columns={tableColumns}
                      data={[]}
                      keyExtractor={(user) => user.id}
                      emptyMessage="No hay usuarios para mostrar"
                    />
                  </div>
                </div>
              </TabPanel>

              {/* Tab 5: Form Controls */}
              <TabPanel tabKey="forms" activeTab={activeTab}>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Checkbox</h3>
                    <div className="space-y-3">
                      <Checkbox
                        checked={isChecked}
                        onChange={setIsChecked}
                        label="Accept terms and conditions"
                      />
                      <Checkbox
                        checked={false}
                        onChange={() => setIsIndeterminate(!isIndeterminate)}
                        indeterminate={isIndeterminate}
                        label="Indeterminate state (click to toggle)"
                      />
                      <Checkbox
                        checked={false}
                        onChange={() => {}}
                        label="Disabled checkbox"
                        disabled
                      />
                      <Checkbox
                        checked={false}
                        onChange={() => {}}
                        label="Error state"
                        error
                        errorMessage="This field is required"
                      />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Radio Group</h3>
                    <RadioGroup
                      options={radioOptions}
                      value={selectedRadio}
                      onChange={setSelectedRadio}
                      name="demo-radio"
                      layout="vertical"
                    />
                    <p className="text-slate-400 text-sm mt-2">Selected: {selectedRadio}</p>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Switch / Toggle</h3>
                    <div className="space-y-3">
                      <Switch
                        checked={isSwitchOn}
                        onChange={setIsSwitchOn}
                        label="Enable notifications"
                      />
                      <Switch checked={true} onChange={() => {}} label="Disabled switch" disabled />
                      <Switch checked={false} onChange={() => {}} loading label="Loading state" />
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-4">Textarea</h3>
                    <div className="space-y-4">
                      <Textarea
                        value={textareaValue}
                        onChange={setTextareaValue}
                        label="Comments"
                        placeholder="Enter your comments..."
                        rows={3}
                        fullWidth
                      />
                      <Textarea
                        value={textareaValue}
                        onChange={setTextareaValue}
                        label="With Counter"
                        placeholder="Type something..."
                        autoResize
                        showCounter
                        maxLength={200}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </TabPanel>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <Card>
          <div className="p-6 text-center space-y-2">
            <p className="text-slate-400 text-sm">
              ✅ Phase 2 Complete - Design System with 16 Components
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Badge variant="success" size="sm">
                Button
              </Badge>
              <Badge variant="success" size="sm">
                Input
              </Badge>
              <Badge variant="success" size="sm">
                Card
              </Badge>
              <Badge variant="success" size="sm">
                Alert
              </Badge>
              <Badge variant="info" size="sm">
                Modal
              </Badge>
              <Badge variant="info" size="sm">
                Dropdown
              </Badge>
              <Badge variant="info" size="sm">
                Table
              </Badge>
              <Badge variant="info" size="sm">
                Badge
              </Badge>
              <Badge variant="info" size="sm">
                Spinner
              </Badge>
              <Badge variant="info" size="sm">
                Toast
              </Badge>
              <Badge variant="info" size="sm">
                Tabs
              </Badge>
              <Badge variant="info" size="sm">
                Checkbox
              </Badge>
              <Badge variant="info" size="sm">
                Radio
              </Badge>
              <Badge variant="info" size="sm">
                Switch
              </Badge>
              <Badge variant="info" size="sm">
                Textarea
              </Badge>
              <Badge variant="info" size="sm">
                Divider
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ComponentsDemo() {
  return (
    <ToastProvider>
      <ToastContainer position="top-right" />
      <ComponentsDemoContent />
    </ToastProvider>
  );
}
