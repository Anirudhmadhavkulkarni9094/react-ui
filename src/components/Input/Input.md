# 📘 Input Component Documentation

## Overview

`Input` is a reusable text field component that supports:

* Labels with optional required indicator
* Built-in required validation (on blur)
* External error handling (`error`, `errorStatus`)
* Leading/trailing icons
* Disabled state

---

## ✨ Props

| Prop           | Type                                               | Default     | Description                                                    |
| -------------- | -------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `label`        | `string`                                           | `undefined` | Label text shown above the input.                              |
| `placeholder`  | `string`                                           | `undefined` | Placeholder text inside the input.                             |
| `type`         | `string`                                           | `"text"`    | Input type (`text`, `email`, `password`, etc.).                |
| `value`        | `string`                                           | `undefined` | Current input value (controlled).                              |
| `onChange`     | `(e: React.ChangeEvent<HTMLInputElement>) => void` | `undefined` | Callback fired when value changes.                             |
| `disabled`     | `boolean`                                          | `false`     | Disables the input.                                            |
| `required`     | `boolean`                                          | `false`     | Marks field as required. Shows error if left empty after blur. |
| `error`        | `string`                                           | `undefined` | External error message (from parent validation).               |
| `errorStatus`  | `boolean`                                          | `undefined` | External error flag. Must be `true` for `error` to show.       |
| `icon`         | `React.ReactNode`                                  | `undefined` | Adds an icon (e.g. from `lucide-react`).                       |
| `iconPosition` | `"left" \| "right"`                                | `"left"`    | Position of icon inside the input.                             |
| `className`    | `string`                                           | `undefined` | Extend or override Tailwind classes.                           |

---

## 🛠 Features

* **Built-in required validation** → shows “Field is required” after blur.
* **External validation support** → parent form can pass `error` + `errorStatus`.
* **Icons** → supports left/right placement.
* **Error styling** → red border, focus ring, and error message with `CircleAlert`.

---

## ✅ Usage Examples

### 1. Basic Input

```tsx
<Input
  label="Full Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

---

### 2. Required Field (internal validation)

```tsx
<Input
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
// Shows "Email is required" after blur if empty
```

---

### 3. With Icon

```tsx
import { Mail } from "lucide-react";

<Input
  label="Email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  icon={<Mail size={18} />}
  iconPosition="left"
/>
```

---

### 4. External Error from Parent

```tsx
<Input
  label="Password"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="Password must be at least 8 characters long"
  errorStatus={true}
  required
/>
```

---

### 5. Disabled Input

```tsx
<Input
  label="Username"
  value="john_doe"
  disabled
/>
```

---

## ⚡ Best Practices

* Use `required` for simple “field cannot be empty” checks.
* Use `error` + `errorStatus` for external validations (e.g. regex, API errors).
* Always make inputs controlled (`value` + `onChange`).
* Pair with `Button` for forms.
