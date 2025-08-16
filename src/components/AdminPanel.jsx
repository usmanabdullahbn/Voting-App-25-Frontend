"use client"

import { useState } from "react"

const AdminPanel = ({ votes, setVotes, showNotification }) => {
  const [newOption, setNewOption] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Sports")
  const [selectedPosition, setSelectedPosition] = useState("Head")

  const handleAddOption = async () => {
    if (!newOption?.trim()) return

    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          option: newOption,
          category: selectedCategory,
          position: selectedPosition,
        }),
      })

      if (!response.ok) throw new Error("Failed to add option")

      const data = await response.json()
      setVotes([...votes, data])
      setNewOption("")
      showNotification("Candidate added successfully", "success")
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  const handleDeleteOption = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/vote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to delete option")

      setVotes(votes?.filter((vote) => vote._id !== id))
      showNotification("Candidate deleted successfully", "success")
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  const groupedVotes = votes.reduce((acc, vote) => {
    const key = `${vote.category} ${vote.position}`
    if (!acc[key]) acc[key] = []
    acc[key].push(vote)
    return acc
  }, {})

  return (
    <div className="admin-panel">
      <h2>Club Elections Admin Panel</h2>

      <div className="add-option-form">
        <h3>Add New Candidate</h3>
        <div className="form-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="Sports">Sports Club</option>
            <option value="Literary">Literary Club</option>
            <option value="STEM">STEM Club</option>
          </select>

          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="position-select"
          >
            <option value="Head">Head</option>
            <option value="Deputy Head">Deputy Head</option>
          </select>
        </div>

        <div className="form-row">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder="Candidate name"
            className="candidate-input"
          />
          <button onClick={handleAddOption} className="add-btn">
            Add Candidate
          </button>
        </div>
      </div>

      <div className="current-options">
        <h3>Current Candidates</h3>
        {Object.entries(groupedVotes).map(([position, candidates]) => (
          <div key={position} className="position-group">
            <h4>{position}</h4>
            <div className="candidates-list">
              {candidates.map((vote) => (
                <div className="option-item" key={vote._id}>
                  <span className="candidate-name">{vote.option}</span>
                  <span className="vote-count">Votes: {vote.votes}</span>
                  <button onClick={() => handleDeleteOption(vote._id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminPanel
