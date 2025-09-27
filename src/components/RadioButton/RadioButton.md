# 🔘 RadioButton Component

## 📌 Description

The `RadioButton` component is a styled alternative to the native HTML radio input.
It allows users to select **one option from a group** (e.g., gender, appointment type).
It supports labels, required state, error messages, and **light/dark themes**.

---

## ⚙️ Props

| Prop        | Type                      | Default     | Description                                                   |
| ----------- | ------------------------- | ----------- | ------------------------------------------------------------- |
| `label`     | `string`                  | `undefined` | Optional label displayed next to the radio button.            |
| `name`      | `string`                  | **(req)**   | Group name. Radios with the same `name` are grouped together. |
| `value`     | `string`                  | **(req)**   | Value assigned to the radio button.                           |
| `checked`   | `boolean`                 | `false`     | Whether this radio button is selected.                        |
| `onChange`  | `(value: string) => void` | `undefined` | Callback fired when the radio button is selected.             |
| `disabled`  | `boolean`                 | `false`     | Disables the radio button (non-interactive).                  |
| `required`  | `boolean`                 | `false`     | Marks the radio as required (adds `*` indicator).             |
| `error`     | `string`                  | `undefined` | Displays an error message and applies error styling.          |
| `theme`     | `"light" \| "dark"`       | `"light"`   | Switches between light and dark theme styling.                |
| `className` | `string`                  | `undefined` | Additional Tailwind/custom classes for customization.         |

---

## 🎨 Features

* **Custom styled radio button** with filled inner dot when checked.
* **Grouped behavior** → radios sharing the same `name` allow only one selection.
* **Error state** → red border + message.
* **Disabled state** → reduced opacity and no interaction.
* **Light/Dark theme support**.

---

## 🖼️ Usage Examples

### Basic Radio Group

```tsx
<RadioButton
  name="appointment"
  value="online"
  label="Online Consultation"
  checked={appointmentType === "online"}
  onChange={setAppointmentType}
/>

<RadioButton
  name="appointment"
  value="clinic"
  label="Clinic Visit"
  checked={appointmentType === "clinic"}
  onChange={setAppointmentType}
/>
```

### Required Radio Group

```tsx
<RadioButton
  name="gender"
  value="male"
  label="Male"
  checked={gender === "male"}
  onChange={setGender}
  required
/>
<RadioButton
  name="gender"
  value="female"
  label="Female"
  checked={gender === "female"}
  onChange={setGender}
  required
/>
```

### Error State

```tsx
<RadioButton
  name="payment"
  value="card"
  label="Credit Card"
  checked={payment === "card"}
  onChange={setPayment}
  error="Please select a payment method"
/>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <RadioButton
    name="appointment"
    value="online"
    label="Online"
    checked={appointmentType === "online"}
    onChange={setAppointmentType}
    theme="dark"
  />
</div>
```

---

## ✅ Best Practices

* Always group radios with the **same `name`** to enforce single selection.
* Use `required` for mandatory questions.
* Use radios for **mutually exclusive options** (use checkboxes for multi-select).
* Pair with `error` messages for **form validation**.

