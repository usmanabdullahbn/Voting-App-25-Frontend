"use client"

import { useState, useEffect } from "react"

const ClubVotingPage = ({ user, showNotification }) => {
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/positions`)
      if (!response.ok) throw new Error("Failed to fetch positions")
      const data = await response.json()
      setPositions(data)
    } catch (error) {
      showNotification(error.message, "error")
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (positionId, candidateIndex) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/positions/${positionId}/vote/${candidateIndex}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const data = await response.json()
      setPositions((prev) => prev.map((p) => (p._id === positionId ? data.position : p)))

      showNotification("Vote cast successfully!", "success")
    } catch (error) {
      showNotification(error.message, "error")
    }
  }

  const hasVotedForPosition = (positionId) => {
    return user?.votes?.some((vote) => vote.position === positionId)
  }
// console.log(hasVotedForPosition)
  const filteredPositions =
    selectedCategory === "All" ? positions : positions.filter((p) => p.category === selectedCategory)

  const categories = ["All", "Sports", "Literary", "STEM"]

  if (loading) return <div className="loading">Loading positions...</div>

  return (
    <div className="club-voting-page">
      <div className="voting-header">
        <h1>Club Elections 2024</h1>
        <p>Vote for your preferred candidates for each position</p>
      </div>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="positions-grid">
        {filteredPositions.map((position) => (
          <div key={position._id} className="position-card">
            <div className="position-header">
              <h2>
                {position.category} Club {position.type}
              </h2>
              {/* <span className="position-badge">{position.category}</span> */}
            </div>

            <div className="votes-grid">
              {position.candidates.map((candidate, index) => (
                <div key={index} className="vote-card">
                  <div className="">
                    <h3>{candidate.name}</h3>
                    {candidate.description && <p className="candidate-description">{candidate.description}</p>}
                    {/* <span className="vote-count">{candidate.votes} votes</span> */}
                  </div>

                  <button
                    className={`vote-btn ${!user || hasVotedForPosition(position._id) ? "disabled" : ""}`}
                    onClick={() => handleVote(position._id, index)}
                    disabled={!user || hasVotedForPosition(position._id)}
                  >
                    {hasVotedForPosition(position._id) ? "Voted" : "Vote"}
                  </button>
                </div>
              ))}

              {position.candidates.length === 0 && <p className="no-candidates">No candidates yet</p>}
            </div>
          </div>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="no-positions">
          <p>No positions available for {selectedCategory === "All" ? "voting" : selectedCategory}</p>
        </div>
      )}
    </div>
  )
}

export default ClubVotingPage
