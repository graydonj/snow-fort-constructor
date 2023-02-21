function DisplayFortSection({ fortItem, removeFortItem, baseHealth, repairFortItem }) {
  const {id, name, health, defence} = fortItem;

  return (
    <div key={id} className={
      (health > (0.6 * baseHealth)) ? "fort-item" :
      (health > (0.3 * baseHealth)) ? "fort-item-dmg" :
      "fort-item-xdmg"}>
      <h5>{name}</h5>
      <p>{health}🤍 | {defence}🛡️</p>
      <div className="fort-item-button-wrapper">
        <button onClick={() => removeFortItem(fortItem)}>❌</button>
        {((health < baseHealth) ? <button onClick={() => repairFortItem(fortItem)}>🔧</button> : null)}
      </div>
    </div>
  )
}

export default DisplayFortSection;