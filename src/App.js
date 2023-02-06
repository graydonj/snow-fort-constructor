import firebase from './firebase';
import { useState, useEffect } from 'react';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import './styles.css';

// import our components
import DisplayTools from './components/DisplayTools';
import DisplayFortPieces from './components/DisplayFortPieces';
import DisplayBank from './components/DisplayBank';
import DisplayFort from './components/DisplayFort';
import DisplayPlayer from './components/DisplayPlayer';

// set some global variables
const pennyChance = 0.5; // chance to find pennies is ~50% for each unit of snow you shovel
const initHealth = 100; // player's initial health amount
const userID = "graydon"; // as a stretch goal, we will query for userID but for now...

// our database
const database = getDatabase(firebase);

function App() {
  // our fort pieces state for the app
  const [fortPieces, setFortPieces] = useState([]);

// state values for this user: key, snow, pennies, their tools, their fort, health, and # of snowball fights they have been in!
  const [userKey, setUserKey] = useState("");
  const [snow, setSnow] = useState(0);
  const [pennies, setPennies] = useState(0);
  const [myTools, setMyTools] = useState([]);
  const [myFort, setMyFort] = useState([]);
  const [health, setHealth] = useState(0);
  const [fights, setFights] = useState(0);

  // initialize our tools, fort pieces, and user info
  useEffect( () => {
    // if this is a new user, we will create their database entry below
    let newUser = {};
    const toolsArray = [];

    // initialize database call
    const dbRef = ref(database);
    get(dbRef)
    .then((result) => {

      // get initial set of tools from database
      const dataObj = result.val();
      for (let tool in dataObj.tools) {
        const toolObj = dataObj.tools[tool];
        toolsArray.push({name: tool, number: toolObj.number, cost: toolObj.cost, snow: toolObj.snow});
      }

      // sort the array into ascending order by cost of tool
      toolsArray.sort((a,b) => a.cost - b.cost);

      // get fort pieces from database
      const fortPiecesArray = [];
      for (let fortPiece in dataObj.fortPieces) {
        const fortPieceObj = dataObj.fortPieces[fortPiece];
        fortPiecesArray.push({name: fortPiece, cost: fortPieceObj.cost, defence: fortPieceObj.defence, health: fortPieceObj.health});
      }

      // sort the fort pieces into ascending order by cost
      fortPiecesArray.sort((a,b) => a.cost - b.cost);
      setFortPieces(fortPiecesArray);

      // is there a user by this name?
      let newUserID = true;
      for (let users in dataObj) {
        if (dataObj[users].id === userID) {
          toolsArray.length = 0;

          // set the state for the simple variables
          setUserKey(users);
          setSnow(dataObj[users].snow);
          setPennies(dataObj[users].pennies);
          setHealth(dataObj[users].health);
          setFights(dataObj[users].fights);

          // parse the database tools object into an array to put into state
          for (let tool in dataObj[users].tools) {
            const toolObj = dataObj[users].tools[tool];
            const toolItem = { name: tool, number: toolObj.number, cost: toolObj.cost, snow: toolObj.snow };
            toolsArray.push(toolItem);
          }

          // sort the array into ascending order by cost of tool
          toolsArray.sort((a, b) => a.cost - b.cost);
          // console.log('User exists and their tools are: ', toolsArray);

          // parse the database fort object into an array to put into state
          let newFortArray = [];
          for (let item in dataObj[users].fort) {
            const fortObj = dataObj[users].fort[item];
            const fortItem = { id: item, name: fortObj.name, defence: fortObj.defence, health: fortObj.health, cost: fortObj.cost };
            newFortArray.push(fortItem);
          }
          setMyFort(newFortArray);
          newUserID = false;
        }
      }
        
      // set up potential new user
      if (newUserID) {
        // create the user
        const userTools = {};
        toolsArray.forEach((tool) => {
          userTools[tool.name] = {
            cost: tool.cost,
            number: tool.number,
            snow: tool.snow
          }
        })

        newUser = {
          id: userID,
          tools: userTools,
          fort: {},
          snow: 0,
          pennies: 0,
          health: initHealth,
          fights: 0,
        }
        // console.log('New user created: ', newUser);

        // set the new user's current state
        const newUserKey = push(dbRef, newUser).key;
        setUserKey(newUserKey);
        setMyFort([]);
        setSnow(newUser.snow);
        setPennies(newUser.pennies);  
      }
    
      // no matter what, toolsArray is the new state of myTools
      setMyTools(toolsArray);
    });
  }, [])

  const handleToolClick = (tool) => {

    // get the database @ our current user
    const snowRef = ref(database, userKey + "/snow");
    const pennyRef = ref(database, userKey + "/pennies");
    const toolRef = ref(database, userKey + "/tools/" + tool);

    // get the tool from our database
    get(toolRef)
    .then ((result) => {
      const toolObj = result.val();

    // determine amount of tools of clicked type we have, and how much snow each one generates
      const numTools = toolObj.number;
      const numSnow = toolObj.snow;

      // if we have 0 tools, give an error message
      if (!numTools) {
        if (tool !== "mittens") tool += "s";
        alert(`You don't have any ${tool}`);

      } else {

        // otherwise, increment the snow by the amount of snow for each tool of the clicked type
        const newSnow = snow + (numTools * numSnow);
        set(snowRef, newSnow);
        setSnow(newSnow);

        // ...and see if we don't find a penny or two
        const pennyFound = (Math.random() * (1 + Math.floor((numTools / 10) * (numSnow / 10))));
        if (pennyFound > pennyChance) {
          const newPennies = pennies + Math.ceil(pennyFound);
          set(pennyRef, newPennies);
          setPennies(newPennies);
        }
      }
    })
  }

  const handleBuyTool = (tool) => {

    // get the database @ our current user
    const penniesRef = ref(database, userKey + "/pennies");
    const toolsRef = ref(database, userKey + "/tools/" + tool);
    const toolNumberRef = ref(database, userKey + "/tools/" + tool + "/number");

    // find cost of tools of the clicked type
    get(toolsRef)
    .then((result) => {
      const toolsObj = result.val();
      const curCost = toolsObj.cost;
      let curNumber = toolsObj.number;

      // can we afford the tool in question?
      if (pennies < curCost) {

        // if not, send error message
        if (tool !== "mittens") tool += "s";
        alert(`You cannot afford to buy any ${tool}`);

      } else {

        // if so, decrement the pennies
        const numPennies = pennies - curCost;
        set(penniesRef, numPennies);
        setPennies(numPennies);

        // increment the number of tools in the database
        curNumber = curNumber + 1;
        set(toolNumberRef, curNumber);

        // and update our myTools state
        const newTools = [...myTools];
        newTools.forEach((item) => {
          if (item.name === tool) {
            item.number = curNumber;
          }
        })
        setMyTools(newTools);
      }
    })
  }

  const handleBuyFortPiece = (fortPiece) => {

    // get the database @ our current user
    const snowRef = ref(database, userKey + "/snow");
    const userFortRef = ref(database, userKey + "/fort");

    // do we have enough snow to buy the fort piece?
    if (snow < fortPiece.cost) {

      // if not, send error message
      alert(`You don't have enough SNOW to build any ${fortPiece.name}s`);
    } else {

      // if so, decrement the snow
      const numSnow = snow - fortPiece.cost;
      set(snowRef, numSnow);
      setSnow(numSnow);

      // add the fort piece to our fort and update our myFort state
      const newFort = [...myFort];
      const newFortPiece = {...fortPiece};
      newFortPiece.id = push(userFortRef, fortPiece).key;
      newFort.push(newFortPiece);
      setMyFort(newFort);
    }
  }

  const removeFortItem = (item) => {

    // access the user's snow and the fort piece we are removing in the database
    const snowRef = ref(database, userKey + "/snow");
    const itemRef = ref(database, userKey + "/fort/" + item.id);

    // return some snow to the player
    const curSnow = snow + Math.floor((item.cost / 5));
    setSnow(curSnow);
    set(snowRef, curSnow);

    // remove the item from our state and our database
    const newFortArray = myFort.filter((fortItem) => fortItem.id !== item.id);
    setMyFort(newFortArray);
    remove(itemRef);
  }

  // our main site!
  return (
    <main>
      <h1>Snow Fort Constructor</h1>
      <div className="wrapper">
        <span className="snowflake-one">❄️</span>
        <span className="snowflake-two">❄️</span>
        <span className="snowflake-three">❄️</span>
        <span className="snowflake-four">❄️</span>
        <p>You start with 1 pair of mittens...and build an empire!</p>
        <p>Click on a tool (mittens, trowel, shovel) to collect that amount of snow. You have a small chance to find pennies. Use the pennies to buy more tools. Use the snow you collect to buy parts for your fort!</p>

        <DisplayBank snow={snow} pennies={pennies}/>
        <div className="buttons-wrapper">
          <DisplayTools tools={myTools} toolClick={handleToolClick} toolBuy={handleBuyTool}/>
          <DisplayFortPieces fortPieces={fortPieces} fortBuy={handleBuyFortPiece}/>
        </div>
        <DisplayFort fights={fights} fort={myFort} removeFortItem={removeFortItem}
        />
        <DisplayPlayer player={userID} health={health} fort={myFort}/>
      </div>      
    </main>
  );
}

export default App;
