function DisplayFortPieces({ fortPieces }) {
  return (
    <div className="buttons-fort-pieces">
      <h2>FORT PIECES</h2>
      <section className="fort-pieces">
        {fortPieces.map((fortPiece) => {
          return (
            <div key={fortPiece.name} className="item-div">
              <button className="fort-button">{fortPiece.name}</button>
              <p>cost: {fortPiece.cost}❄️</p>
              <p>defence: {fortPiece.defence}🛡️</p>
              <p>health: {fortPiece.health}🤍</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default DisplayFortPieces;