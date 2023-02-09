function DisplayFortSection({ fortItem, removeFortItem, baseHealth }) {
  const {id, name, health, defence} = fortItem;

  return (
    <div key={id} className={
      (health > (0.6 * baseHealth)) ? "fort-item" :
      (health > (0.3 * baseHealth)) ? "fort-item-dmg" :
      "fort-item-xdmg"}>
      <h5>{name}</h5>
      <p>{health}🤍 | {defence}🛡️</p>
      <button onClick={() => removeFortItem(fortItem)}>remove</button>
    </div>
  )
}

export default DisplayFortSection;