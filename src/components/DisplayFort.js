function DisplayFort ({fights, fort, removeFortItem}) {
  const fightText = (fights === 0) ? "No snowball fights yet!"
    : (fights === 1) ? `You have survived ${fights} snowball fight`
    : `You have survived ${fights} snowball fights`;

  return (
    <div className="fort-info">
      <h2>My Fort</h2>
      <p>{fightText}</p>
      <div className="my-fort">
        {
          fort.map((fortItem) => {
            return (
              <div key={fortItem.id} className="fort-item">
                <h5>{fortItem.name}</h5>
                <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
                <button onClick={()=>removeFortItem(fortItem)}>remove</button>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default DisplayFort;