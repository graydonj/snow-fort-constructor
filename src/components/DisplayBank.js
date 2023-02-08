function DisplayBank ({snow, pennies}) {
  return (
    <section className="current-amounts">
      <div className="bank-div">
        <h3>❄️Snow:</h3>
        <span className="current-snow">
          {snow}
        </span>
      </div>
      <div className="bank-div">
        <h3>🪙Pennies:</h3>
        <span className="current-pennies">
          {pennies}
        </span>
      </div>
    </section>
  )
}

export default DisplayBank;