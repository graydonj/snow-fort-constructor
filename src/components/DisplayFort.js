/* import DisplayFortSection from "./DisplayFortSection"; */

function DisplayFort ({fights, fort, removeFortItem}) {
  const fightText = (fights === 0) ? "No snowball fights yet!"
    : (fights === 1) ? `You have survived ${fights} snowball fight`
    : `You have survived ${fights} snowball fights`;

/*   function DisplayFortSection(type, fortItem, removeFortItem) {
    console.log("type:", type);
    /* fort.map((fortItem) => { */
/*     return ((fortItem.name === type) ?
      (
        <div key={fortItem.id} className="fort-item">
          <h5>{fortItem.name}</h5>
          <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
          <button onClick={() => removeFortItem(fortItem)}>remove</button>
        </div>
      ) : null); */
    /* } */
    /* ) 
  } */

  return (
    <div className="fort-info">
      <h2>My Fort</h2>
      <p>{fightText}</p>
      <div className="my-fort">
        <div className="fort-section"><h4>WALLS</h4>
          {/*fort.forEach((fortItem) => {
          { <DisplayFortSection type="wall" fortItem={fortItem} removeFortItem={removeFortItem}/> }
            DisplayFortSection("wall", fortItem, removeFortItem);
          })*/}
          {fort.map((fortItem) =>
            (fortItem.name === "wall") ? (
              <div key={fortItem.id} className="fort-item">
                <h5>{fortItem.name}</h5>
                <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
                <button onClick={()=>removeFortItem(fortItem)}>remove</button>
              </div>
              ) : null )}
          {/* <DisplayFortSection type="wall" fort={fort} removeFortItem={removeFortItem}/> */}
        </div>
        <div className="fort-section"><h4>FORTIFICATIONS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "fortification") ? (
              <div key={fortItem.id} className="fort-item">
                <h5>{fortItem.name}</h5>
                <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
                <button onClick={() => removeFortItem(fortItem)}>remove</button>
              </div>
            ) : null)}
        </div>
        <div className="fort-section"><h4>TOWERS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "tower") ? (
              <div key={fortItem.id} className="fort-item">
                <h5>{fortItem.name}</h5>
                <p>{fortItem.health}🤍 | {fortItem.defence}🛡️</p>
                <button onClick={() => removeFortItem(fortItem)}>remove</button>
              </div>
            ) : null)}
        </div>
        <div className="fort-section"><h4>KEEPS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "keep") ? (
              <div key={fortItem.id} className="fort-item-keep">
                <h5>{fortItem.name}</h5>
                <button onClick={() => removeFortItem(fortItem)}>remove</button>
              </div>
            ) : null)}
        </div>
      </div>
    </div>
  )
}

export default DisplayFort;