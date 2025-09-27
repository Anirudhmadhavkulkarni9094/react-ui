# ⏰ TimeSlotGroup Component

## 📌 Description

The `TimeSlotGroup` component generates and displays a **grid of selectable time slots**.
It is primarily used in **appointment booking flows**.
Supports:

* Custom start/end times
* Customizable interval (e.g., 15, 30, 60 minutes)
* 12-hour or 24-hour time formats
* Disabled slots
* Light/Dark themes
* Fixed **3-column grid layout**

---

## ⚙️ Props

| Prop            | Type                        | Default     | Description                                                    |
| --------------- | --------------------------- | ----------- | -------------------------------------------------------------- |
| `startTime`     | `string` (format `"HH:mm"`) | `"09:00"`   | Starting time of slots (inclusive).                            |
| `endTime`       | `string` (format `"HH:mm"`) | `"18:00"`   | Ending time of slots (inclusive).                              |
| `interval`      | `number`                    | `30`        | Interval between slots, in minutes.                            |
| `value`         | `string`                    | `undefined` | Currently selected time slot.                                  |
| `onChange`      | `(time: string) => void`    | `undefined` | Callback fired when a slot is selected.                        |
| `disabledSlots` | `string[]`                  | `[]`        | List of slots (formatted) that should be disabled.             |
| `theme`         | `"light" \| "dark"`         | `"light"`   | Switches styling between light and dark mode.                  |
| `format`        | `"12hr" \| "24hr"`          | `"12hr"`    | Controls time display format (12-hour with AM/PM, or 24-hour). |

---

## 🎨 Features

* Automatically generates slots between `startTime` and `endTime`.
* Highlights the **selected slot** with the primary color (`#018BB5`).
* Disables unavailable slots via `disabledSlots`.
* Supports both **12hr** and **24hr** formats.
* **3-column grid** layout for compact display.

---

## 🖼️ Usage Examples

### Basic Usage

```tsx
<TimeSlotGroup
  startTime="09:00"
  endTime="17:00"
  onChange={(time) => console.log("Selected slot:", time)}
/>
```

### With Disabled Slots

```tsx
<TimeSlotGroup
  startTime="09:00"
  endTime="12:00"
  disabledSlots={["10:00 AM", "11:30 AM"]}
  onChange={setSelectedSlot}
/>
```

### 24-Hour Format

```tsx
<TimeSlotGroup
  startTime="08:00"
  endTime="20:00"
  format="24hr"
  onChange={setSelectedSlot}
/>
```

### Dark Theme

```tsx
<div className="bg-gray-900 p-4 rounded-xl">
  <TimeSlotGroup
    startTime="09:00"
    endTime="15:00"
    theme="dark"
    onChange={setSelectedSlot}
  />
</div>
```

---

## ✅ Best Practices

* Use `interval={30}` for typical **appointment slots** (30 min).
* Pass `disabledSlots` from your **backend availability API** to prevent double-booking.
* Combine with `Calendar` for a complete **date + time picker flow**.
* Use `format="24hr"` for international audiences.

