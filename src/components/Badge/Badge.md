# 🔖 Badge Component

## 📌 Description

The `Badge` component is a small pill-shaped label used to indicate statuses, categories, or highlights.
It supports multiple **variants** (success, warning, danger, info, default) and adapts to **light/dark themes**.

---

## ⚙️ Props

| Prop        | Type                                                        | Default     | Description                                                       |
| ----------- | ----------------------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| `children`  | `React.ReactNode`                                           | **(req)**   | The text or content displayed inside the badge.                   |
| `variant`   | `"success" \| "warning" \| "danger" \| "info" \| "default"` | `"default"` | Defines the style/color of the badge.                             |
| `theme`     | `"light" \| "dark"`                                         | `"light"`   | Switches the badge style between light and dark mode.             |
| `className` | `string`                                                    | `undefined` | Additional Tailwind or custom classes to override/extend styling. |

---

## 🎨 Variants

* **default** → Neutral (gray).
* **success** → Green (confirmed, completed).
* **warning** → Yellow (pending, caution).
* **danger** → Red (error, cancelled).
* **info** → Blue (in-progress, informational).

---

## 🖼️ Usage Examples

### Basic Badges

```tsx
<Badge variant="success">Confirmed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Cancelled</Badge>
<Badge variant="info">In Progress</Badge>
<Badge>Default</Badge>
```

### Dark Theme Badges

```tsx
<div className="bg-gray-900 p-4 space-x-2">
  <Badge variant="success" theme="dark">Confirmed</Badge>
  <Badge variant="warning" theme="dark">Pending</Badge>
  <Badge variant="danger" theme="dark">Cancelled</Badge>
  <Badge variant="info" theme="dark">In Progress</Badge>
  <Badge variant="default" theme="dark">Draft</Badge>
</div>
```

### Custom Styling

```tsx
<Badge variant="info" className="uppercase tracking-wide">
  Custom Badge
</Badge>
```

---

## ✅ Best Practices

* Use `success`, `warning`, `danger`, `info` consistently across the app for predictable UX.
* Keep badge text short (1–2 words max).
* Combine with **cards, tables, and lists** to display appointment statuses, doctor availability, etc.
