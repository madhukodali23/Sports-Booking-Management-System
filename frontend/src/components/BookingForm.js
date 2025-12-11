import React, { useEffect, useState } from "react";
import { fetchJson, postJson } from "../services/api";
import "../App.css";

export default function BookingForm({ courtId }) {
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [userName, setUserName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchJson("/coaches").then(setCoaches);
    fetchJson("/equipment").then(setEquipment);
  }, []);

  function toggleEquip(id) {
    const exists = selectedEquipment.find((e) => e.equipment === id);
    if (exists) {
      setSelectedEquipment(selectedEquipment.filter((e) => e.equipment !== id));
    } else {
      setSelectedEquipment([
        ...selectedEquipment,
        { equipment: id, qty: 1 },
      ]);
    }
  }

  function changeQty(id, qty) {
    setSelectedEquipment(
      selectedEquipment.map((e) =>
        e.equipment === id ? { ...e, qty: qty } : e
      )
    );
  }

  async function previewPrice() {
    if (!startTime || !endTime || !courtId)
      return alert("Please select start, end & court");

    const body = {
      courtId,
      startTime,
      endTime,
      equipmentItems: selectedEquipment,
      coachId: selectedCoach || null,
    };

    const resp = await postJson("/bookings/calc", body);
    if (resp?.pricingBreakdown) {
      setPreview(resp);
    } else {
      alert(resp.message || "Price calculation failed");
    }
  }

  async function bookNow() {
    if (!userName) return alert("Enter your name");

    const body = {
      userName,
      courtId,
      coachId: selectedCoach || null,
      equipmentItems: selectedEquipment,
      startTime,
      endTime,
    };

    const resp = await postJson("/bookings", body);
    if (resp?.booking) {
      alert("Booking successful!");
      setPreview(null);
      setUserName("");
      setStartTime("");
      setEndTime("");
      setSelectedCoach("");
      setSelectedEquipment([]);
    } else {
      alert(resp.message || "Booking failed");
    }
  }

  return (
    <div className="card">
      <label>Your Name:</label>
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Enter your name"
      />

      <label>Start Time:</label>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />

      <label>End Time:</label>
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

      <label>Choose Coach (Optional):</label>
      <select value={selectedCoach} onChange={(e) => setSelectedCoach(e.target.value)}>
        <option value="">No coach</option>
        {coaches.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} — ₹{c.hourlyRate}/hr
          </option>
        ))}
      </select>

      <label>Equipment:</label>
      <div className="equipment-list">
        {equipment.map((eq) => {
          const isSelected = selectedEquipment.find((e) => e.equipment === eq._id);
          return (
            <div key={eq._id} className="equipment-card">
              <h4>{eq.name}</h4>
              <p>Stock: {eq.totalStock}</p>
              <p>₹{eq.pricePerUnit}</p>
              <button onClick={() => toggleEquip(eq._id)}>
                {isSelected ? "Remove" : "Add"}
              </button>
              {isSelected && (
                <div style={{ marginTop: "6px" }}>
                  Qty:
                  <input
                    type="number"
                    min="1"
                    value={isSelected.qty}
                    onChange={(e) => changeQty(eq._id, Number(e.target.value))}
                    style={{ width: "60px", marginLeft: "6px" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={previewPrice}>Preview Price</button>
        <button onClick={bookNow}>Confirm Booking</button>
      </div>

      {preview && (
        <div className="price-box">
          <h3>Pricing Breakdown</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(preview.pricingBreakdown, null, 2)}
          </pre>
          <div className="total-text">Total: ₹{preview.total}</div>
        </div>
      )}
    </div>
  );
}
