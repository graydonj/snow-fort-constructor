function DisplayPlayer({player, health}) {
  return (
    <div className="player">
      <p>~{player}~</p>
      HEALTH: {health}🤍
    </div>
  )
}

export default DisplayPlayer;