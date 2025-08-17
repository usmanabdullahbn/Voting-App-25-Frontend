"use client";

import { useState, useEffect } from "react";

const AdminPanel = ({ votes, setVotes, showNotification }) => {
  const [newOption, setNewOption] = useState("");
  const [positions, setPositions] = useState([]);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [newPosition, setNewPosition] = useState({
    title: "",
    category: "Sports",
    type: "Head",
  });
  const [selectedPosition, setSelectedPosition] = useState("");
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/positions`
      );
      if (!response.ok) throw new Error("Failed to fetch positions");
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleCreatePosition = async () => {
    if (!newPosition.title.trim()) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/positions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newPosition),
        }
      );

      if (!response.ok) throw new Error("Failed to create position");

      const data = await response.json();
      setPositions([...positions, data]);
      setNewPosition({ title: "", category: "Sports", type: "Head" });
      setShowPositionForm(false);
      showNotification("Position created successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name.trim() || !selectedPosition) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/positions/${selectedPosition}/candidates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newCandidate),
        }
      );

      if (!response.ok) throw new Error("Failed to add candidate");

      const data = await response.json();
      setPositions((prev) =>
        prev.map((p) => (p._id === selectedPosition ? data : p))
      );
      setNewCandidate({ name: "", description: "" });
      showNotification("Candidate added successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/positions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete position");

      setPositions(positions.filter((p) => p._id !== id));
      showNotification("Position deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleAddOption = async () => {
    if (!newOption?.trim()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ option: newOption }),
      });

      if (!response.ok) throw new Error("Failed to add option");

      const data = await response.json();
      setVotes([...votes, data]);
      setNewOption("");
      showNotification("Option added successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeleteOption = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/vote/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete option");

      setVotes(votes?.filter((vote) => vote._id !== id));
      showNotification("Option deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>

      {/* Club Positions Management */}
      <div className="positions-management">
        <div className="section-header">
          <h3>Club Positions Management</h3>
          <button
            className="create-btn"
            onClick={() => setShowPositionForm(!showPositionForm)}
          >
            {showPositionForm ? "Cancel" : "Create Position"}
          </button>
        </div>

        {showPositionForm && (
          <div className="position-form">
            <input
              type="text"
              placeholder="Position Title (e.g., Sports Club Head)"
              value={newPosition.title}
              onChange={(e) =>
                setNewPosition({ ...newPosition, title: e.target.value })
              }
            />
            <select
              value={newPosition.category}
              onChange={(e) =>
                setNewPosition({ ...newPosition, category: e.target.value })
              }
            >
              <option value="Sports">Sports</option>
              <option value="Literary">Literary</option>
              <option value="STEM">STEM</option>
            </select>
            <select
              value={newPosition.type}
              onChange={(e) =>
                setNewPosition({ ...newPosition, type: e.target.value })
              }
            >
              <option value="Head">Head</option>
              <option value="Deputy Head">Deputy Head</option>
            </select>
            <button onClick={handleCreatePosition} className="create-btn">
              Create Position
            </button>
          </div>
        )}

        <div className="add-candidate-form">
          <h4>Add Candidate</h4>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
          >
            <option value="">Select Position</option>
            {positions.map((position) => (
              <option key={position._id} value={position._id}>
                {position.category} Club {position.type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Candidate Name"
            value={newCandidate.name}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, name: e.target.value })
            }
          />
          <textarea
            placeholder="Candidate Description (optional)"
            value={newCandidate.description}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, description: e.target.value })
            }
          />
          <button onClick={handleAddCandidate} className="add-btn">
            Add Candidate
          </button>
        </div>

        <div className="positions-list">
          <h4>Current Positions</h4>
          {positions.map((position) => (
            <div key={position._id} className="position-item">
              <div className="position-info">
                <h5>
                  {position.category} Club {position.type}
                </h5>
                <p>Candidates: {position.candidates.length}</p>
                <div className="candidates-summary">
                  {position.candidates.map((candidate, index) => (
                    <span key={index} className="candidate-tag">
                      {candidate.name} ({candidate.votes} votes)
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleDeletePosition(position._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Legacy Voting Options */}
      {/* <div className="legacy-voting">
        <h3>Legacy Voting Options</h3>
        <div className="add-option-form">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="New voting option"
          />
          <button onClick={handleAddOption}>Add Option</button>
        </div>
        <div className="current-options">
          {votes.map((vote, index) => (
            <div className="option-item" key={index}>
              <span>{vote.option}</span>
              <span>Votes: {vote.votes}</span>
              <button onClick={() => handleDeleteOption(vote._id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AdminPanel;
