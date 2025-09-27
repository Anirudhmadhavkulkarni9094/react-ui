# 📅 Calendar Component

## 📌 Description

The `Calendar` component is a custom date picker UI for selecting dates.
It supports:

* **Month navigation** (previous/next).
* **Selectable dates** with highlight for *today* and *selected date*.
* **Date range restrictions** (`minDate` and `maxDate`).
* **Light/Dark themes**.
* Works standalone or inside a **Modal**.

---

## ⚙️ Props

| Prop       | Type                                | Default     | Description                                                           |
| ---------- | ----------------------------------- | ----------- | --------------------------------------------------------------------- |
| `value`    | `Date`                              | `undefined` | The currently selected date.                                          |
| `onChange` | `(date: Date \| undefined) => void` | `undefined` | Callback when a date is selected or cleared.                          |
| `onClose`  | `() => void`                        | `undefined` | Optional callback for closing a modal (fired after selecting a date). |
| `minDate`  | `Date`                              | `today`     | Minimum selectable date (past dates are disabled).                    |
| `maxDate`  | `Date`                              | `undefined` | Maximum selectable date (future dates are disabled if set).           |
| `theme`    | `"light" \| "dark"`                 | `"light"`   | Switches between light and dark styling.                              |

---

## 🎨 Features

* **Today highlight** → outlined in primary color (`#018BB5`).
* **Selected date highlight** → filled with primary color.
* **Disabled dates** → grayed out, non-clickable.
* **Month navigation** with `ChevronLeft` and `ChevronRight`.
* **Clear button** → resets selection.

---

## 🖼️ Usage Examples

### Basic Calendar

```tsx
<Calendar
  value={new Date()}
  onChange={(date) => console.log("Selected:", date)}
/>
```

### With Date Range

```tsx
<Calendar
  minDate={new Date()} // today
  maxDate={new Date(new Date().setMonth(new Date().getMonth() + 2))} // +2 months
  onChange={(date) => console.log("Selected:", date)}
/>
```

### Inside a Modal

```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Pick a Date">
  <Calendar
    value={selectedDate}
    onChange={setSelectedDate}
    onClose={() => setOpen(false)}
  />
</Modal>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <Calendar theme="dark" />
</div>
```

---

## ✅ Best Practices

* Use `minDate={new Date()}` for **appointment booking** to prevent past dates.
* Wrap in a **Modal** for mobile-friendly date picking.
* Combine with a **TimeSlot** component for complete appointment scheduling.

