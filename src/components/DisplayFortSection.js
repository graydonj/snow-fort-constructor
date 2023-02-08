function DisplayFortSection({ fortItem, removeFortItem }) {
  const {id, name, health, defence} = fortItem;

  return (
    <div key={id} className="fort-item">
      <h5>{name}</h5>
      <p>{health}🤍 | {defence}🛡️</p>
      <button onClick={() => removeFortItem(fortItem)}>remove</button>
    </div>
  )
}

export default DisplayFortSection;