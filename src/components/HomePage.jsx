"use client"

const HomePage = ({ votes, error, user, setUser, setVotes, showNotification }) => {
  const handleVote = async (voteId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/api/vote/${voteId}`, {
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
      setVotes((prev) => prev.map((v) => (v?._id == data?.vote?._id ? data?.vote : v)))

      setUser(data?.user)
      showNotification("Voted Successfully", "success")
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
    <div className="votes-page">
      <h1>Club Elections 2025</h1>
      {error && <div className="error-message">{error}</div>}

      {Object.entries(groupedVotes).map(([position, candidates]) => (
        <div key={position} className="voting-section">
          <h2>{position}</h2>
          <div className="votes-grid">
            {candidates.map((vote) => (
              <div className="vote-card" key={vote._id}>
                <h3>{vote.option}</h3>
                <p className="vote-count">Votes: {vote.votes}</p>
                <p className="createdBy">Added by: {vote.createdBy?.email}</p>
                <button
                  // className={`vote-btn ${!user || user?.votedFor ? "disabled" : ""}`}
                  className="vote-btn"
                  onClick={() => handleVote(vote?._id)}
                  // disabled={!user || user?.votedFor}
                >
                  {vote?._id === user?.votedFor ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!user && (
        <div className="login-prompt">
          <p>Please log in to participate in the voting.</p>
        </div>
      )}
    </div>
  )
}

export default HomePage
