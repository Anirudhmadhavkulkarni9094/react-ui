# 📘 Button Component Documentation

## Overview

`Button` is a **reusable UI component** that supports multiple variants, sizes, and icons.
It follows accessibility best practices with focus states and disabled handling.

---

## ✨ Props

| Prop           | Type                                                | Default      | Description                                            |
| -------------- | --------------------------------------------------- | ------------ | ------------------------------------------------------ |
| `children`     | `React.ReactNode`                                   | **required** | Button text or elements.                               |
| `variant`      | `"primary" \| "secondary" \| "outline" \| "danger"` | `"primary"`  | Visual style of the button.                            |
| `size`         | `"sm" \| "md" \| "lg"`                              | `"md"`       | Controls padding and font size.                        |
| `onClick`      | `() => void`                                        | `undefined`  | Callback fired when clicked.                           |
| `disabled`     | `boolean`                                           | `false`      | Disables button interaction and reduces opacity.       |
| `type`         | `"button" \| "submit" \| "reset"`                   | `"button"`   | HTML button type (use `"submit"` in forms).            |
| `className`    | `string`                                            | `undefined`  | Extend or override Tailwind styles.                    |
| `icon`         | `React.ReactNode`                                   | `undefined`  | Add an icon (e.g. from `lucide-react` or `Heroicons`). |
| `iconPosition` | `"left" \| "right"`                                 | `"left"`     | Position of icon relative to text.                     |

---

## 🎨 Variants

| Variant     | Style                                                              |
| ----------- | ------------------------------------------------------------------ |
| `primary`   | Brand blue (`#018BB5`), white text, darker hover, blue focus ring. |
| `secondary` | Light gray background, dark text.                                  |
| `outline`   | Transparent background, gray border, dark text.                    |
| `danger`    | Red background, white text, darker hover, red focus ring.          |

---

## 📏 Sizes

| Size | Padding / Font size                                  |
| ---- | ---------------------------------------------------- |
| `sm` | Small: compact buttons (px-3, py-1.5, text-sm).      |
| `md` | Default: balanced size (px-4, py-2, text-base).      |
| `lg` | Large: call-to-action buttons (px-6, py-3, text-lg). |

---

## ✅ Usage Examples

### Primary Button

```tsx
<Button variant="primary">Book Appointment</Button>
```

### Secondary Button

```tsx
<Button variant="secondary">Cancel</Button>
```

### With Icon (Left)

```tsx
import { Trash2 } from "lucide-react";

<Button variant="danger" icon={<Trash2 size={18} />}>
  Delete
</Button>
```

### With Icon (Right)

```tsx
import { ArrowRight } from "lucide-react";

<Button variant="primary" icon={<ArrowRight size={18} />} iconPosition="right">
  Next
</Button>
```

### Disabled

```tsx
<Button variant="outline" disabled>
  Loading...
</Button>
```

---

## ⚡ Best Practices

* Use `type="submit"` inside forms for proper submission.
* Use `disabled` for async actions to prevent duplicate submissions.
* Prefer `variant="primary"` for main actions, `secondary`/`outline` for less important ones, and `danger` for destructive actions.
* Use icons sparingly to improve clarity without clutter.
