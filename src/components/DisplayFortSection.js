function DisplayFortSection({ type, fort, removeFortItem }) {
  console.log("type:", type);
  
  fort.map((fortItem) =>
    (fortItem.name === type) ? (
      <div key={fortItem.id} className="fort-item">
        <h5>{fortItem.name}</h5>
        <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
        <button onClick={() => removeFortItem(fortItem)}>remove</button>
      </div>
    ) : console.log(fortItem.name));
}

export default DisplayFortSection;