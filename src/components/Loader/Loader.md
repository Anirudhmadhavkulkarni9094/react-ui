# 🔄 Loader Component

## 📌 Description

The `Loader` component is a lightweight, animated spinner used to indicate loading states.
It supports multiple sizes and works in both **light** and **dark** themes.
It can be placed inline (inside buttons, inputs) or standalone (centered loaders).

---

## ⚙️ Props

| Prop        | Type                   | Default     | Description                                                          |
| ----------- | ---------------------- | ----------- | -------------------------------------------------------------------- |
| `size`      | `"sm" \| "md" \| "lg"` | `"md"`      | Size of the loader (`sm` = 16px, `md` = 24px, `lg` = 40px approx).   |
| `theme`     | `"light" \| "dark"`    | `"light"`   | Color theme (light = gray/blue, dark = gray/white).                  |
| `className` | `string`               | `undefined` | Additional Tailwind/custom classes for positioning or customization. |

---

## 🎨 Features

* **Animated spinner** using Tailwind’s `animate-spin`.
* **Sizes**: small (button loaders), medium (general use), large (page loaders).
* **Theme-aware**: different colors in light and dark modes.
* Can be placed **inline** or centered in containers.

---

## 🖼️ Usage Examples

### Inline Loader (Button)

```tsx
<Button variant="primary" disabled icon={<Loader size="sm" />}>
  Loading...
</Button>
```

### Centered Loader

```tsx
<div className="flex justify-center items-center h-40">
  <Loader size="lg" />
</div>
```

### Dark Theme Loader

```tsx
<div className="flex justify-center items-center h-40 bg-gray-900">
  <Loader size="lg" theme="dark" />
</div>
```

### Custom Styling

```tsx
<Loader size="md" className="mx-auto my-10" />
```

---

## ✅ Best Practices

* Use `sm` loaders for **buttons** and inline elements.
* Use `lg` loaders for **full page** or section loading.
* Pair loaders with **disabled states** to prevent double submission.
* For longer waits, combine with a **message or skeleton loader**.
