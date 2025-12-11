import React, { useEffect, useState } from "react";
import { fetchJson } from "../services/api";
import BookingForm from "../components/BookingForm";
import "../App.css";

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState("");

  useEffect(() => {
    fetchJson("/courts").then(setCourts).catch(console.error);
  }, []);

  return (
    <div className="card">
      <label>Select Court:</label>
      <select
        value={selectedCourt}
        onChange={(e) => setSelectedCourt(e.target.value)}
      >
        <option value="">-- choose a court --</option>
        {courts.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} — ₹{c.basePrice}/hr
          </option>
        ))}
      </select>

      {selectedCourt && (
        <div style={{ marginTop: "20px" }}>
          <BookingForm courtId={selectedCourt} />
        </div>
      )}
    </div>
  );
}
