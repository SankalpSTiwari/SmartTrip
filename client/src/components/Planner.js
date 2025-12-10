import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import downloadIcon from "../img/downloadIcon.png";

const Planner = () => {
  const [destination, setDestination] = useState("California");
  const [budget, setBudget] = useState("1000");
  const [duration, setDuration] = useState("5");
  const [travelStyle, setTravelStyle] = useState("Adventure");
  const [travelerType, setTravelerType] = useState("Friends");
  const [activityType, setActivityType] = useState("Sightseeing");
  const [foodPreference, setFoodPreference] = useState("Foodie/Experimental");
  const [optionalPreferences, setOptionalPreferences] = useState("None");

  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedPlans, setSavedPlans] = useState([]);
  const [copyState, setCopyState] = useState("Copy");

  // Load any locally saved plans (simple localStorage history)
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

  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    setTripPlan(null);

    try {
      const prompt = `Generate a personalized travel itinerary for a trip to ${destination} with a budget of ${budget}. The traveler is interested in a ${travelStyle} vacation and enjoys ${activityType} type of activities. The traveler type is ${travelerType}. The itinerary should include ${foodPreference} options for food. Please provide a detailed itinerary for ${duration} days. The traveler has also requested these preferences: ${optionalPreferences}`;

      console.log(prompt);
      const response = await axios.post("api/trips/generate", {
        prompt,
      });

      setTripPlan(response.data);
      const newEntry = {
        id: Date.now(),
        destination,
        duration,
        travelStyle,
        createdAt: new Date().toISOString(),
        content: response.data,
      };
      persistPlans([newEntry, ...savedPlans].slice(0, 5));
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
    {
      /* THIS PART FOR NEW PAGE PLAN */
    }
    // try {
    //   const prompt = `Generate a personalized travel itinerary for a trip to ${destination} with a budget of ${budget}. The traveler is interested in a ${travelStyle} vacation and enjoys ${activityType} type of activities. The traveler type is ${travelerType}. The itinerary should include ${foodPreference} options for food. Please provide a detailed itinerary for ${duration} days. The traveler has also requested these preferences: ${optionalPreferences}`;
    //   const response = await axios.post("api/trips/generate", {
    //     prompt,
    //   });
    //   // navigate("/generated-trip"); // Navigate to the GeneratedTrip component
    //   return <Navigate to="/generated-trip" />;
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleGenerateNewPlan = () => {
    setTripPlan(null);
    // setDestination("");
    const formTripPlan = document.querySelector(".form-trip-plan");
    const formBottom = document.querySelector(".form-bottom");
    window.scrollTo({
      top: formBottom.offsetTop,
      behavior: "smooth",
    });
  };

  const handleSaveToLocal = () => {
    console.log("In handleSaveToLocal");
    // Create a Blob containing the trip plan
    const blob = new Blob([tripPlan], { type: "text/plain" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trip_plan.txt";

    // Append the link to the body and trigger the click event
    document.body.appendChild(link);
    link.click();

    // Remove the link from the body
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
    setErrorMessage("");
    window.scrollTo({
      top: document.querySelector(".form-bottom").offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div className="plan-page-container">
      <div className="planner-container">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-box">
            <div className="form-title">
              Customize your experience! Fill in the details, click Generate,
              and let the adventure begin.
            </div>
            <div className="form-content">
              <div className="form-top">
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
                </div>
                <div className="form-row">
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
                </div>
                <div className="form-row">
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
                      <option value="Yoga and Wellness">
                        Yoga and Wellness
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="travelStyle">Traveler Type</label>
                    <br />
                    <select
                      className="form-traveler-type"
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
                  <div className="form-group">
                    <label htmlFor="foodPreference">Food Preferences</label>
                    <br />
                    <select
                      className="form-food-preference"
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
                      <option value="Foodie/Experimental">
                        Foodie/Experimental
                      </option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="optionalPreferences">
                      Optional Preferences
                    </label>
                    <br />
                    <input
                      type="text"
                      className="form-optional-preferences"
                      id="optionalPreferences"
                      value={optionalPreferences}
                      onChange={(e) => setOptionalPreferences(e.target.value)}
                      placeholder="Enter optional preferences"
                    />
                  </div>
                </div>
                <div
                  className="form-row"
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "20px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                    onClick={handleGenerateNewPlan}
                  >
                    {isLoading ? "Generating..." : "Generate trip plan!"}
                  </button>
                </div>
              </div>

              {/* <div className="form-right">
              {isLoading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="form-plan-container">
                  <label htmlFor="tripPlan" style={{ marginBottom: "1px" }}>
                    Trip Plan
                  </label>
                  <br />
                  <div className="form-trip-plan">
                    <ReactMarkdown>{tripPlan}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div> */}
              {/* <div className="form-right">
              {tripPlan ? (
                <div className="form-plan-container">
                  <label htmlFor="tripPlan" style={{ marginBottom: "1px" }}>
                    Trip Plan
                  </label>
                  <br />
                  <div className="form-trip-plan">
                    <ReactMarkdown>{tripPlan}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="loading-spinner">Loading...</div>
              )}
            </div> */}
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </form>
        {/* THIS PART FOR NEW PAGE PLAN */}
        {/* <Routes>
        <Route path="/generated-trip" component={GeneratedTrip} />
      </Routes> */}
      </div>
      <div className="planner-container-2">
        {savedPlans.length > 0 && (
          <div className="form-plan-container" style={{ marginBottom: "16px" }}>
            <div style={{ fontWeight: 600, marginBottom: "6px" }}>
              Recent plans
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {savedPlans.map((plan) => (
                <li
                  key={plan.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {plan.destination} • {plan.duration} days
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {new Date(plan.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="download-button"
                    style={{ width: "96px" }}
                    onClick={() => handleLoadSaved(plan)}
                  >
                    Load
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="form-bottom">
          {isLoading ? (
            // <div className="loading-spinner">Loading...</div>
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          ) : tripPlan ? (
            <div className="form-plan-container">
              {/* <label
                htmlFor="tripPlan"
                style={{ marginBottom: "1px", fontSize: "25px" }}
              >
                Trip Plan
              </label> */}
              {/* <br /> */}
              <div className="form-trip-plan">
                <ReactMarkdown>{tripPlan}</ReactMarkdown>
              </div>

              <button
                type="button"
                className="download-button"
                onClick={handleSaveToLocal}
                style={{
                  fontSize: "13px",
                  width: "130px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                  marginTop: "10px",
                  marginBottom: "15px",
                  // paddingBottom: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <i
                  class="fa-light fa-download"
                  style={{ color: "#000000" }}
                ></i> */}
                <img
                  src={downloadIcon}
                      alt="Download trip plan"
                  style={{
                    width: "22px",
                    height: "20px",
                    paddingRight: "3px",
                    // paddingTop: "7px",
                    alignItems: "center",
                  }}
                />
                Download Plan
              </button>
                  <button
                    type="button"
                    className="download-button"
                    onClick={handleCopy}
                    style={{
                      fontSize: "13px",
                      width: "130px",
                      paddingTop: "2px",
                      paddingBottom: "2px",
                      marginBottom: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {copyState}
                  </button>
              {/* <button
                
              >
                <div className="download-button-contents">
                  <img
                    src={downloadIcon}
                    // alt="Download_Icon"
                    style={{
                      width: "22px",
                      height: "20px",
                      paddingRight: "5px",
                      // paddingTop: "5px",
                    }}
                  />
                  <div>Download Plan</div>
                </div>
              </button> */}
            </div>
          ) : errorMessage ? (
            <div className="form-plan-container">
              <div style={{ color: "red", fontWeight: "600" }}>
                {errorMessage}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Planner;
