import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const GeneratedTrip = () => {
  const [tripPlan, setTripPlan] = useState("");

  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        const response = await fetch("/api/trips/generate");
        const data = await response.json();
        setTripPlan(data.tripPlan);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTripPlan();
  }, []);

  return (
    <div className="form-plan-container">
      <label htmlFor="tripPlan" style={{ marginBottom: "1px" }}>
        Trip Plan
      </label>
      <br />
      <div className="form-trip-plan">
        <ReactMarkdown>{tripPlan}</ReactMarkdown>
      </div>
    </div>
  );
};

export default GeneratedTrip;
