function DisplayPlayer({player, health, fort, keepHealth}) {

  // dynamically construct the JSX for the keep elements in the fort to wrap the player in a layer for each keep!
  let keepWrapperTop = [];
  let keepWrapperBottom = [];
  fort.forEach((item) => {
    if (item.name === "keep") {
      const keepClass = ((item.health > (0.6 * keepHealth)) ? "keep"
        : (item.health > (0.3 * keepHealth)) ? "keep-dmg"
        : "keep-xdmg");
      keepWrapperTop = keepWrapperTop + `<div class=${keepClass}><h5>${item.name}</h5><p>${item.health}🤍 | ${item.defence}🛡️`;
      keepWrapperBottom = keepWrapperBottom + `</div>`;
    }
  })
  
  // set the HTML that now includes our keep div wrappers
  const allHTML = keepWrapperTop + `<div class="player"><p>${player}</p>HEALTH:${health}🤍</div>` + keepWrapperBottom;

  return (
    <div className="player-info">
      <span dangerouslySetInnerHTML={{__html: allHTML}}></span>
        {/* <div className="player">
          <p>~{player}~</p>
          HEALTH: {health}🤍
        </div>
      {keepWrapperBottom} */}
    </div>
  )
}

export default DisplayPlayer;