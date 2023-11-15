import React, { useState } from "react";
import axios from "axios";
import Markdown from 'react-markdown'

const Planner = () => {
  const [destination, setDestination] = useState("California");
  const [budget, setBudget] = useState("1000");
  const [duration, setDuration] = useState("5");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [activityType, setActivityType] = useState("Sightseeing");
  const [tripPlan, setTripPlan] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const prompt = `Generate a personalized travel itinerary for a trip to ${destination} with a budget of ${budget}. The traveler is interested in a ${travelStyle} vacation and enjoys ${activityType}. The itinerary should include ${activityType} activities and dining options. Please provide a detailed itinerary for ${duration} days.`;
      console.log(prompt)
      const response = await axios.post("api/trips/generate", {
        prompt,
      });
      setTripPlan(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="planner-container">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-box">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destination">Destination</label>
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
              Generate trip plan!
            </button>
          </div>
        </div>
      </form>
      {/* <div className="form-box-plan"> */}
        <div className="form-plan-container">
          <label htmlFor="tripPlan">Trip Plan</label>
          <br />
          <Markdown>
          {/* <textarea
            className="form-trip-plan"
            id="tripPlan"
            rows="5"
            value={tripPlan}
            readOnly
          /> */}
          {tripPlan}
          </Markdown>
        </div>
      </div>
    // </div>
  );
};

export default Planner;
