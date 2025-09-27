# ☑️ Checkbox Component

## 📌 Description

The `Checkbox` component is a styled alternative to the default HTML checkbox.
It supports labels, required markers, error states, and **light/dark themes**.
Useful for forms such as **agreements, preferences, and feature toggles**.

---

## ⚙️ Props

| Prop        | Type                         | Default     | Description                                                      |
| ----------- | ---------------------------- | ----------- | ---------------------------------------------------------------- |
| `label`     | `string`                     | `undefined` | Optional label displayed next to the checkbox.                   |
| `checked`   | `boolean`                    | `false`     | Controls the checked state of the checkbox.                      |
| `onChange`  | `(checked: boolean) => void` | `undefined` | Callback fired when the checkbox state changes.                  |
| `disabled`  | `boolean`                    | `false`     | Disables the checkbox and makes it non-interactive.              |
| `required`  | `boolean`                    | `false`     | Marks the checkbox as required (adds `*` indicator).             |
| `error`     | `string`                     | `undefined` | Shows an error message when provided, and applies error styling. |
| `theme`     | `"light" \| "dark"`          | `"light"`   | Switches between light and dark mode styles.                     |
| `className` | `string`                     | `undefined` | Additional Tailwind or custom classes for customization.         |

---

## 🎨 Features

* **Custom design** with Lucide `Check` icon.
* **Error styling** with red border + error message.
* **Disabled state** with reduced opacity + no interaction.
* **Theme-aware** → works in both light and dark UIs.

---

## 🖼️ Usage Examples

### Basic Checkbox

```tsx
<Checkbox
  label="Accept Terms & Conditions"
  checked={isChecked}
  onChange={setIsChecked}
/>
```

### Required Checkbox

```tsx
<Checkbox
  label="I agree to the Privacy Policy"
  checked={agree}
  onChange={setAgree}
  required
/>
```

### Error State

```tsx
<Checkbox
  label="Subscribe to newsletter"
  checked={subscribed}
  onChange={setSubscribed}
  error="You must accept to continue"
/>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <Checkbox
    label="Enable reminders"
    checked={reminders}
    onChange={setReminders}
    theme="dark"
  />
</div>
```

---

## ✅ Best Practices

* Always provide a **label** for accessibility.
* Use `required` when the checkbox is a must-have (e.g. Terms of Service).
* Pair with **error messaging** for better form validation feedback.
* Prefer a **switch/toggle** for on/off settings instead of checkboxes.

