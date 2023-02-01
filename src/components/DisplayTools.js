function DisplayTools ({tools}) {
  return (
    <div className="buttons-tools">
      <h2>TOOLS</h2>
      <section className="tools">
        {tools.map((tool) => {
          return (
            <div key={tool.name} className="item-div">
              <button className="tool-button">{tool.name}</button>
              <p>❄️snow: {tool.snow}</p>
              <button className="buy-tool-button">cost: {tool.cost}🪙</button>
              <p>amount: {tool.number}</p>
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default DisplayTools;