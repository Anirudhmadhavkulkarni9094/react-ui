// app/components/page.tsx  (Next.js App Router)
// or pages/components.tsx  (if using Pages Router)

"use client";

import { useState } from "react";
import { ChevronRight, Mail } from "lucide-react";

import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Calendar from "@/components/Calendar/Calendar";
import Checkbox from "@/components/Checkbox/Checkbox";
import Dropdown from "@/components/Dropdown/Dropdown";
import Input from "@/components/Input/Input";
import Loader from "@/components/Loader/Loader";
import Modal from "@/components/Modal/Modal";
import RadioButton from "@/components/RadioButton/RadioButton";
import SignupForm from "@/components/SignupForm";
import Textarea from "@/components/Textarea/Textarea";
import TimeSlot from "@/components/TimeSlot/TimeSlot";

export default function ComponentPlayground() {
  const [date, setDate] = useState<Date>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<string>();
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [appointmentType, setAppointmentType] = useState("online");

  const options = [
    { label: "Cardiologist", value: "cardio" },
    { label: "Urologist", value: "uro" },
    { label: "Dermatologist", value: "derma" },
  ];

  return (
    <div className="p-10 space-y-16">
      {/* ========== BUTTONS ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" size="sm" icon={<ChevronRight />} iconPosition="right">
            Small Icon
          </Button>
        </div>
      </section>

      {/* ========== INPUTS ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Inputs</h2>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          iconPosition="left"
          error="Invalid email"
        />
        <Textarea
          label="Patient Notes"
          placeholder="Enter symptoms or remarks..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          className="mt-4"
        />
      </section>

      {/* ========== DROPDOWN ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Dropdown</h2>
        <Dropdown
          label="Speciality"
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Choose speciality"
        />
        <p className="mt-2 text-sm text-gray-600">Selected: {selectedOption || "None"}</p>
      </section>

      {/* ========== CHECKBOX & RADIO ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Checkbox & Radio</h2>
        <Checkbox
          label="I agree to terms & conditions"
          checked={agree}
          onChange={setAgree}
          required
        />

        <div className="mt-4 space-y-2">
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
        </div>
      </section>

      {/* ========== BADGES ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Badges</h2>
        <div className="flex gap-2">
          <Badge variant="success">Confirmed</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Cancelled</Badge>
          <Badge variant="info">In Progress</Badge>
          <Badge variant="default">Draft</Badge>
        </div>
      </section>

      {/* ========== CALENDAR ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Calendar</h2>
        <Calendar value={date} onChange={setDate} />
        <p className="mt-2 text-sm">Selected: {date?.toDateString() || "None"}</p>
      </section>

      {/* ========== TIME SLOTS ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Time Slots</h2>
        <h3 className="font-semibold mb-2">12-Hour Format</h3>
        <TimeSlot
          startTime="09:00"
          endTime="18:00"
          interval={30}
          value={selected}
          onChange={setSelected}
          format="12hr"
        />
        <p className="mt-2 text-sm">Selected Slot: {selected || "None"}</p>

        <h3 className="font-semibold mt-6 mb-2">24-Hour Format</h3>
        <TimeSlot
          startTime="09:00"
          endTime="18:00"
          onChange={setSelected}
          interval={30}
          format="24hr"
        />
      </section>

      {/* ========== MODAL ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Modal</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Welcome"
          footer={<Button variant="primary" onClick={() => setModalOpen(false)}>Close</Button>}
        >
          <p>This is a modal content example.</p>
        </Modal>
      </section>

      {/* ========== LOADERS ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Loader</h2>
        <div className="flex items-center gap-6">
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </div>
      </section>

      {/* ========== FORM EXAMPLE ========== */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Form Example</h2>
        <SignupForm />
      </section>
    </div>
  );
}
