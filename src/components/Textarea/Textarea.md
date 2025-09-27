# 📝 Textarea Component

## 📌 Description

The `Textarea` component is a styled multi-line text input used for capturing longer text entries, such as **patient notes, comments, or feedback**.
It supports labels, required fields, error states, and **light/dark themes**.

---

## ⚙️ Props

| Prop          | Type                                                  | Default     | Description                                           |
| ------------- | ----------------------------------------------------- | ----------- | ----------------------------------------------------- |
| `label`       | `string`                                              | `undefined` | Optional label displayed above the textarea.          |
| `placeholder` | `string`                                              | `undefined` | Placeholder text shown when empty.                    |
| `value`       | `string`                                              | `undefined` | Current value of the textarea.                        |
| `onChange`    | `(e: React.ChangeEvent<HTMLTextAreaElement>) => void` | `undefined` | Callback fired when the text value changes.           |
| `disabled`    | `boolean`                                             | `false`     | Disables the textarea, making it read-only.           |
| `error`       | `string`                                              | `undefined` | Displays an error message and applies error styling.  |
| `required`    | `boolean`                                             | `false`     | Marks the field as required (adds `*` indicator).     |
| `rows`        | `number`                                              | `4`         | Number of visible text rows.                          |
| `theme`       | `"light" \| "dark"`                                   | `"light"`   | Switches between light and dark theme styling.        |
| `className`   | `string`                                              | `undefined` | Additional Tailwind/custom classes for customization. |

---

## 🎨 Features

* **Multi-line input** with customizable row size.
* **Error state** with red border + error message + icon.
* **Disabled state** with reduced opacity and no interaction.
* **Light/Dark theme support**.
* **Required indicator** (`*`) when marked as mandatory.

---

## 🖼️ Usage Examples

### Basic Textarea

```tsx
<Textarea
  label="Patient Notes"
  placeholder="Enter symptoms or remarks..."
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
/>
```

### Required Field

```tsx
<Textarea
  label="Description"
  placeholder="Provide details..."
  required
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

### Error State

```tsx
<Textarea
  label="Feedback"
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  error="Feedback is required"
/>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <Textarea
    label="Doctor's Notes"
    placeholder="Enter confidential notes..."
    theme="dark"
  />
</div>
```

---

## ✅ Best Practices

* Use for **long-form text**; for single-line input, use `Input` instead.
* Always provide a **label** for clarity and accessibility.
* Limit `rows` to a reasonable number (3–6) for compact UI; allow scrolling for long entries.
* Pair with **form validation** to display `error` messages when required.
