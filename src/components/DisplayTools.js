function DisplayTools ({tools, toolClick, toolBuy}) {
  return (
    <div className="buttons-tools">
      <h2>TOOLS</h2>
      <section className="tools">

        {/* go through each tool, construct a tool button to display */}
        {tools.map((tool) => {
          return (
            <div key={tool.name} className="item-div">
              <button className="tool-button" onClick={()=>toolClick(tool.name)}><span className="tool-amount">{tool.number}</span>{tool.name}</button>
              <p>❄️snow: {tool.snow}</p>
              <button className="buy-tool-button" onClick={()=>toolBuy(tool.name)}>cost: {tool.cost}🪙</button>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default DisplayTools;