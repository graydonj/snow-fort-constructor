function DisplayBank ({snow, pennies}) {
  return (
    <section className="current-amounts">
      <h3>❄️Snow:</h3>
      <span className="current-snow">
        {snow}
      </span>
      <h3>🪙Pennies:</h3>
      <span className="current-pennies">
        {pennies}
      </span>
    </section>
  )
}

export default DisplayBank;