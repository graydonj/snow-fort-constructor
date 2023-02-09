import DisplayFortSection from "./DisplayFortSection";

function DisplayFort ({fights, fort, removeFortItem, baseFort}) {
  const fightText = (fights === 0) ? "No snowball fights yet!"
    : (fights === 1) ? `You have survived ${fights} snowball fight`
    : `You have survived ${fights} snowball fights`;

  return (
    <>
      <h2>My Fort</h2>
      <p>{fightText}</p>
      <div className="my-fort">
        <div className="fort-section"><h4>WALLS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "wall") ? (
              <DisplayFortSection key={fortItem.id} fortItem={fortItem} removeFortItem={removeFortItem} baseHealth={baseFort[0].health}/>
              ) : null )}
        </div>
        <div className="fort-section"><h4>FORTIFICATIONS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "fortification") ? (
              <DisplayFortSection key={fortItem.id} fortItem={fortItem} removeFortItem={removeFortItem} baseHealth={baseFort[2].health} />
            ) : null)}
        </div>
        <div className="fort-section"><h4>TOWERS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "tower") ? (
              <DisplayFortSection key={fortItem.id} fortItem={fortItem} removeFortItem={removeFortItem} baseHealth={baseFort[1].health} />
            ) : null)}
        </div>
        <div className="fort-section"><h4>KEEPS</h4>
          {fort.map((fortItem) =>
            (fortItem.name === "keep") ? (
              <div key={fortItem.id} className={
                (fortItem.health > (0.6 * baseFort[3].health)) ? "fort-item-keep" :
                (fortItem.health > (0.3 * baseFort[3].health)) ? "fort-item-keep fort-item-dmg" :
                "fort-item-keep fort-item-xdmg"}>
                <h5>{fortItem.name}</h5>
                <button onClick={() => removeFortItem(fortItem)}>remove</button>
              </div>
            ) : null)}
        </div>
      </div>
    </>
  )
}

export default DisplayFort;