import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import downloadIcon from "../img/downloadIcon.png";

const Planner = () => {
  const [destination, setDestination] = useState("California");
  const [budget, setBudget] = useState("1000");
  const [duration, setDuration] = useState("5");
  const [numTravelers, setNumTravelers] = useState("2");
  const [season, setSeason] = useState("Any season");
  const [detailLevel, setDetailLevel] = useState("balanced");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [travelerType, setTravelerType] = useState("Friends");
  const [activityType, setActivityType] = useState("Sightseeing");
  const [foodPreference, setFoodPreference] = useState("Foodie/Experimental");
  const [optionalPreferences, setOptionalPreferences] = useState("None");
  const [includeFood, setIncludeFood] = useState(true);
  const [includeLodging, setIncludeLodging] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [copyState, setCopyState] = useState("Copy");
  const resultsRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("smarttrip_plans");
    if (stored) {
      try {
        setSavedPlans(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved plans", e);
      }
    }
  }, []);

  const persistPlans = (plans) => {
    setSavedPlans(plans);
    try {
      localStorage.setItem("smarttrip_plans", JSON.stringify(plans.slice(0, 5)));
    } catch (e) {
      console.error("Failed to persist plans", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    setTripPlan(null);

    try {
      const focusItems = [];
      if (includeFood) focusItems.push("food recommendations");
      if (includeLodging) focusItems.push("lodging suggestions");
      const focusText =
        focusItems.length > 0
          ? `Focus on ${focusItems.join(" and ")}.`
          : "No special focus.";

      const prompt = `Generate a personalized travel itinerary for a trip to ${destination} for ${numTravelers} traveler(s) during ${season}, budget of ${budget} USD, lasting ${duration} days. Travel style: ${travelStyle}. Activities preference: ${activityType}. Traveler type: ${travelerType}. Food preferences: ${foodPreference}. Detail level: ${detailLevel}. ${focusText} Additional preferences: ${optionalPreferences}.`;

      const response = await axios.post("/api/trips/generate", {
        prompt,
      });

      setTripPlan(response.data);
      const newEntry = {
        id: Date.now(),
        destination,
        duration,
        travelStyle,
        createdAt: new Date().toISOString(),
        season,
        numTravelers,
        detailLevel,
        content: response.data,
      };
      persistPlans([newEntry, ...savedPlans].slice(0, 5));
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data ||
        error?.message ||
        "Something went wrong while generating the trip.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToLocal = () => {
    if (!tripPlan) return;
    const blob = new Blob([tripPlan], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trip_plan.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!tripPlan) return;
    try {
      await navigator.clipboard.writeText(tripPlan);
      setCopyState("Copied!");
      setTimeout(() => setCopyState("Copy"), 1500);
    } catch (e) {
      setCopyState("Copy failed");
      setTimeout(() => setCopyState("Copy"), 1500);
    }
  };

  const handleLoadSaved = (plan) => {
    setTripPlan(plan.content);
    setDestination(plan.destination);
    setDuration(plan.duration);
    setTravelStyle(plan.travelStyle);
    setSeason(plan.season || "Any season");
    setNumTravelers(plan.numTravelers || "2");
    setDetailLevel(plan.detailLevel || "balanced");
    setErrorMessage("");
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="planner-shell">
      <div className="planner-hero">
        <div>
          <div className="chip chip-primary">AI powered</div>
          <div className="chip chip-soft">Markdown ready</div>
        </div>
        <h1>SmartTrip Planner</h1>
        <p>
          Personalize your itinerary with preferences, see quick previews, copy
          or download, and reuse recent plans instantly.
        </p>
      </div>

      <div className="planner-grid">
        <form onSubmit={handleSubmit} className="card card-form">
          <div className="card-header">
            Plan your trip
            <span className="status-dot">
              {isLoading ? "Generating..." : "Ready"}
            </span>
          </div>

          <div className="input-grid">
            <div className="control full">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                required
              />
            </div>

            <div className="control">
              <label htmlFor="budget">Budget (USD)</label>
              <input
                type="number"
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 1200"
                min="0"
              />
            </div>

            <div className="control">
              <label htmlFor="duration">Trip duration (days)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 5"
                min="1"
                required
              />
            </div>

            <div className="control">
              <label htmlFor="numTravelers">Travelers</label>
              <input
                type="number"
                id="numTravelers"
                value={numTravelers}
                onChange={(e) => setNumTravelers(e.target.value)}
                min="1"
              />
            </div>

            <div className="control">
              <label htmlFor="season">Season</label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
              >
                <option>Any season</option>
                <option>Spring</option>
                <option>Summer</option>
                <option>Autumn</option>
                <option>Winter</option>
              </select>
            </div>

            <div className="control">
              <label htmlFor="travelStyle">Travel Style</label>
              <select
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

            <div className="control">
              <label htmlFor="activityType">Activity Type</label>
              <select
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

            <div className="control">
              <label htmlFor="travelerType">Traveler Type</label>
              <select
                id="travelerType"
                value={travelerType}
                onChange={(e) => setTravelerType(e.target.value)}
                required
              >
                <option value="">Select traveler type</option>
                <option value="Solo">Solo</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
                <option value="Colleagues">Colleagues</option>
                <option value="Couple">Couple</option>
                <option value="Large Group">Large Group</option>
                <option value="Luxury traveler">Luxury traveler</option>
              </select>
            </div>

            <div className="control">
              <label htmlFor="foodPreference">Food Preferences</label>
              <select
                id="foodPreference"
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                required
              >
                <option value="">Select food preferences</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Halal">Halal</option>
                <option value="Kosher">Kosher</option>
                <option value="Lactose-Free">Lactose-Free</option>
                <option value="Nut-Free">Nut-Free</option>
                <option value="Local Cuisine">Local Cuisine</option>
                <option value="International/Global Cuisine">
                  International/Global Cuisine
                </option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="Casual Dining">Casual Dining</option>
                <option value="Foodie/Experimental">Foodie/Experimental</option>
              </select>
            </div>

            <div className="control">
              <label htmlFor="detailLevel">Detail level</label>
              <select
                id="detailLevel"
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
              >
                <option value="concise">Concise</option>
                <option value="balanced">Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>

            <div className="control full toggles">
              <label>Include</label>
              <div className="toggle-row">
                <label>
                  <input
                    type="checkbox"
                    checked={includeFood}
                    onChange={(e) => setIncludeFood(e.target.checked)}
                  />
                  Food spots
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={includeLodging}
                    onChange={(e) => setIncludeLodging(e.target.checked)}
                  />
                  Lodging ideas
                </label>
              </div>
            </div>

            <div className="control full">
              <label htmlFor="optionalPreferences">Optional preferences</label>
              <textarea
                id="optionalPreferences"
                value={optionalPreferences}
                onChange={(e) => setOptionalPreferences(e.target.value)}
                placeholder="Anything special? (e.g. kid-friendly, avoid long hikes, prefer trains)"
                rows={3}
              />
            </div>
          </div>

          <div className="actions-row">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate trip plan"}
            </button>
            <div className="hint">Results include Markdown ready to copy.</div>
          </div>
        </form>

        <div className="card card-results" ref={resultsRef}>
          <div className="card-header">
            Trip plan
            <span
              className={`status-pill ${
                isLoading ? "status-pill-warn" : tripPlan ? "status-pill-ok" : ""
              }`}
            >
              {isLoading ? "Working..." : tripPlan ? "Ready" : "Idle"}
            </span>
          </div>

          {savedPlans.length > 0 && (
            <div className="saved-plans">
              <div className="saved-header">Recent plans</div>
              <ul>
                {savedPlans.map((plan) => (
                  <li key={plan.id}>
                    <div>
                      <div className="saved-title">
                        {plan.destination} • {plan.duration} days
                      </div>
                      <div className="saved-meta">
                        {plan.travelStyle} · {plan.season || "Any season"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => handleLoadSaved(plan)}
                    >
                      Load
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="result-body">
            {isLoading ? (
              <div className="skeleton">
                <div className="skeleton-line wide" />
                <div className="skeleton-line" />
                <div className="skeleton-line" />
                <div className="skeleton-line mid" />
              </div>
            ) : tripPlan ? (
              <>
                <div className="form-trip-plan">
                  <ReactMarkdown>{tripPlan}</ReactMarkdown>
                </div>
                <div className="result-actions">
                  <button
                    type="button"
                    className="download-button"
                    onClick={handleSaveToLocal}
                  >
                    <img
                      src={downloadIcon}
                      alt="Download trip plan"
                      style={{
                        width: "22px",
                        height: "20px",
                        paddingRight: "3px",
                        alignItems: "center",
                      }}
                    />
                    Download
                  </button>
                  <button
                    type="button"
                    className="download-button"
                    onClick={handleCopy}
                  >
                    {copyState}
                  </button>
                </div>
              </>
            ) : errorMessage ? (
              <div className="error-box">{errorMessage}</div>
            ) : (
              <div className="empty-state">
                Generate a trip plan to see results here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
