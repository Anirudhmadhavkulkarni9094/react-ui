# 🪟 Modal Component

## 📌 Description

The `Modal` component is a responsive dialog overlay used for displaying **content, forms, or confirmations** without leaving the page.
It supports:

* **Light/Dark themes**
* **Responsive design** → full-screen on mobile, centered dialog on desktop
* **Header, body, and optional footer**
* Close button (`X`) and background overlay click handling via `onClose`

---

## ⚙️ Props

| Prop       | Type                | Default     | Description                                                              |
| ---------- | ------------------- | ----------- | ------------------------------------------------------------------------ |
| `isOpen`   | `boolean`           | **(req)**   | Controls whether the modal is visible.                                   |
| `onClose`  | `() => void`        | **(req)**   | Callback fired when modal is closed (via close button or overlay click). |
| `title`    | `string`            | `undefined` | Optional modal header title.                                             |
| `children` | `ReactNode`         | **(req)**   | The main content inside the modal body.                                  |
| `footer`   | `ReactNode`         | `undefined` | Optional footer (e.g., action buttons).                                  |
| `theme`    | `"light" \| "dark"` | `"light"`   | Switches between light and dark mode styling.                            |

---

## 🎨 Features

* **Overlay backdrop** (`bg-black/50`) dims the background.
* **Responsive layout** →

  * Mobile: slides up (`h-[90%]`, bottom-aligned).
  * Desktop: centered (`sm:max-w-md`).
* **Header with title + close button**.
* **Scrollable content** if body overflows.
* **Footer with action buttons** (optional).
* **Light/Dark themes** for seamless UI integration.

---

## 🖼️ Usage Examples

### Basic Modal

```tsx
<Modal isOpen={isOpen} onClose={() => setOpen(false)} title="Confirm Action">
  <p>Are you sure you want to continue?</p>
</Modal>
```

### Modal with Footer Buttons

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setOpen(false)}
  title="Book Appointment"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <Calendar onChange={setSelectedDate} />
</Modal>
```

### Dark Theme Modal

```tsx
<Modal
  isOpen={isDarkOpen}
  onClose={() => setDarkOpen(false)}
  title="Dark Mode Example"
  theme="dark"
>
  <p>This modal uses dark mode styling.</p>
</Modal>
```

---

## ✅ Best Practices

* Use modals for **focused tasks** (forms, confirmations, details), not for complex navigation.
* Provide **clear exit options** → close button + cancel action in footer.
* Keep modal content **short and focused** to avoid scrolling on small screens.
* Use `theme="dark"` for dark layouts or dashboards.

