# ⬇️ Dropdown Component

## 📌 Description

The `Dropdown` component provides a styled select menu for choosing from a list of options.
It supports labels, placeholders, disabled state, and **light/dark themes**.
It automatically closes when clicking outside the dropdown.

---

## ⚙️ Props

| Prop          | Type                                  | Default       | Description                                                                |
| ------------- | ------------------------------------- | ------------- | -------------------------------------------------------------------------- |
| `label`       | `string`                              | `undefined`   | Optional label displayed above the dropdown.                               |
| `options`     | `{ label: string; value: string; }[]` | **(req)**     | List of options to display. Each option has a `label` (shown) and `value`. |
| `value`       | `string`                              | `undefined`   | Currently selected option’s value.                                         |
| `onChange`    | `(value: string) => void`             | `undefined`   | Callback fired when a new option is selected.                              |
| `placeholder` | `string`                              | `"Select..."` | Text shown when no option is selected.                                     |
| `disabled`    | `boolean`                             | `false`       | Disables the dropdown (non-interactive).                                   |
| `theme`       | `"light" \| "dark"`                   | `"light"`     | Switches between light and dark mode styles.                               |
| `className`   | `string`                              | `undefined`   | Additional Tailwind/custom classes for styling.                            |

---

## 🎨 Features

* Click to open/close menu.
* Closes automatically when clicking outside.
* Highlights the selected option.
* Supports **light/dark themes**.
* Disabled state with reduced opacity.

---

## 🖼️ Usage Examples

### Basic Dropdown

```tsx
<Dropdown
  label="Speciality"
  options={[
    { label: "Cardiologist", value: "cardio" },
    { label: "Urologist", value: "uro" },
    { label: "Dermatologist", value: "derma" },
  ]}
  value={speciality}
  onChange={setSpeciality}
/>
```

### With Placeholder

```tsx
<Dropdown
  placeholder="Choose a doctor"
  options={[
    { label: "Dr. Smith", value: "smith" },
    { label: "Dr. Lee", value: "lee" },
  ]}
  value={selectedDoctor}
  onChange={setSelectedDoctor}
/>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <Dropdown
    label="Appointment Type"
    options={[
      { label: "Online", value: "online" },
      { label: "Clinic Visit", value: "clinic" },
    ]}
    value={appointmentType}
    onChange={setAppointmentType}
    theme="dark"
  />
</div>
```

### Disabled Dropdown

```tsx
<Dropdown
  label="Doctor"
  options={[]}
  placeholder="No doctors available"
  disabled
/>
```

---

## ✅ Best Practices

* Always provide a **placeholder** when no value is selected.
* Use `disabled` when no valid options are available.
* For **large option sets**, consider a searchable dropdown.
* Wrap with a `label` prop for better form accessibility.