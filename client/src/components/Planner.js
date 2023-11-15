import React, { useState } from "react";

const Planner = () => {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [activityType, setActivityType] = useState("");
  const [tripPlan, setTripPlan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call your AI function here to generate the trip plan
    setTripPlan("AI generated trip plan goes here");
  };

  return (
    <div className="planner-container">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-box">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destination">Destination Country</label>
              <br />
              <input
                type="text"
                className="form-destination"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter destination country"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="budget">Budget (USD)</label>
              <br />
              <input
                type="number"
                className="form-budget"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter budget"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Trip duration (days)</label>
              <br />
              <input
                type="number"
                className="form-duration"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter trip duration"
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="travelStyle">Travel Style</label>
              <br />
              <select
                className="form-travel-style"
                id="travelStyle"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                required
              >
                <option value="">Select travel style</option>
                <option value="Cultural">Cultural</option>
                <option value="Adventure">Adventure</option>
                <option value="Relaxation">Relaxation</option>
                <option value="Beach">Beach</option>
                <option value="City Break">City Break</option>
                <option value="Road Trip">Road Trip</option>
                <option value="Wildlife Safari">Wildlife Safari</option>
                <option value="Ski">Ski</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="activityType">Activity Type</label>
              <br />
              <select
                className="form-activity-type"
                id="activityType"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                required
              >
                <option value="">Select activity type</option>
                <option value="Outdoors">Outdoors</option>
                <option value="Sightseeing">Sightseeing</option>
                <option value="Shopping">Shopping</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Museums">Museums</option>
                <option value="Theme Parks">Theme Parks</option>
                <option value="Water Sports">Water Sports</option>
                <option value="Yoga and Wellness">Yoga and Wellness</option>
              </select>
            </div>
          </div>
          <div
            className="form-row"
            style={{ paddingTop: "10px", paddingBottom: "20px" }}
          >
            <button type="submit" className="btn btn-primary">
              Generate trip plan
            </button>
          </div>
        </div>
      </form>
      <div className="mt-3">
        <label htmlFor="tripPlan">Trip Plan</label>
        <textarea
          className="form-trip-plan"
          id="tripPlan"
          rows="5"
          value={tripPlan}
          readOnly
        />
      </div>
    </div>
  );
};

export default Planner;
