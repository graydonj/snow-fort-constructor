import firebase from './firebase';
import { useState, useEffect } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import './styles.css';

// import our components
import DisplayTools from './components/DisplayTools';
import DisplayFortPieces from './components/DisplayFortPieces';
import DisplayBank from './components/DisplayBank';

function App() {
  const [tools, setTools] = useState([]);
  const [fortPieces, setFortPieces] = useState([]);
  const [snow, setSnow] = useState(0);
  const [pennies, setPennies] = useState(0);

  // initialize our tools, fort pieces, and "my fort"
  useEffect( () => {
    // initialize database call
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    onValue(dbRef, (result) => {

      // get tools from database
      const dataObj = result.val();
      const toolsArray = [];
      for (let tool in dataObj.tools) {
        const toolObj = dataObj.tools[tool];
        toolsArray.push({name: tool, number: toolObj.number, cost: toolObj.cost, snow: toolObj.snow});
      }

      // sort the array into ascending order by cost of tool
      toolsArray.sort((a,b) => a.cost - b.cost);
      setTools(toolsArray);

      // get fort pieces from database
      const fortPiecesArray = [];
      for (let fortPiece in dataObj.fortPieces) {
        const fortPieceObj = dataObj.fortPieces[fortPiece];
        fortPiecesArray.push({name: fortPiece, cost: fortPieceObj.cost, defence: fortPieceObj.defence, health: fortPieceObj.health});
      }

      // sort the fort pieces into ascending order by cost
      fortPiecesArray.sort((a,b) => a.cost - b.cost);
      setFortPieces(fortPiecesArray);
    });
  }, [])


  return (
    <main>
      <h1>Snow Fort Constructor</h1>
      <div className="wrapper">
        <p>You start with 1 pair of mittens...and build an empire!</p>
        <p>Click on a tool (mittens, trowel, shovel) to collect that amount of snow. You have a small chance to find pennies. Use the pennies to buy more tools. Use the snow you collect to buy parts for your fort!</p>

        setSnow(0);
        setPennies(0);

        <DisplayBank snow={snow} pennies={pennies}/>
        <div className="buttons-wrapper">
          <DisplayTools tools={tools}/>
          <DisplayFortPieces fortPieces={fortPieces}/>
        </div>
        <div className="fort-info">
          <h2>My Fort</h2>
          <div className="my-fort">
            
          </div>
        </div>
      </div>      
    </main>
  );
}

export default App;
