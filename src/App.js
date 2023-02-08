import firebase from './firebase';
import { useState, useEffect } from 'react';
import { getDatabase, push, ref, set, get, remove, onValue } from 'firebase/database';
import Swal from 'sweetalert2';
import './styles.css';

// import our components
import DisplayTools from './components/DisplayTools';
import DisplayFortPieces from './components/DisplayFortPieces';
import DisplayBank from './components/DisplayBank';
import DisplayFort from './components/DisplayFort';
import DisplayPlayer from './components/DisplayPlayer';
import UserLogin from './components/UserLogin';

// set some global variables
const pennyChance = 0.5; // chance to find pennies is ~50% for each unit of snow you shovel
const initHealth = 100; // player's initial health amount
let userKey = ""; // player's location in the database

// our database
const database = getDatabase(firebase);

function App() {
  // userID input state
  const [input, setInput] = useState("");

  // our fort pieces state for the app
  const [fortPieces, setFortPieces] = useState([]);

  // state values for this user: ID, snow, pennies, their tools, their fort, health, and # of snowball fights they have been in!
  const [userID, setUserID] = useState("");
  // const [userKey, setUserKey] = useState("");
  const [snow, setSnow] = useState(0);
  const [pennies, setPennies] = useState(0);
  const [myTools, setMyTools] = useState([]);
  const [myFort, setMyFort] = useState([]);
  const [health, setHealth] = useState(0);
  const [fights, setFights] = useState(0);

  // initialize our tools, fort pieces, and user info
  useEffect( () => {

    // first, a quick check to get session data
    const sessionUser = sessionStorage.getItem("userID");
    const sessionUserKey = sessionStorage.getItem("userKey");
    if (sessionUser) {
      setInput(sessionUser);
      userKey = sessionUserKey;
      getUser(sessionUser);
    } else {

      // initialize an empty array to load default tools
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
        setMyTools(toolsArray);
      });
    }

    // get fort pieces from database
    const dbRef = ref(database);
    get(dbRef)
      .then((result) => {

        const dataObj = result.val();
        const fortPiecesArray = [];
        for (let fortPiece in dataObj.fortPieces) {
          const fortPieceObj = dataObj.fortPieces[fortPiece];
          fortPiecesArray.push({name: fortPiece, cost: fortPieceObj.cost, defence: fortPieceObj.defence, health: fortPieceObj.health});
        }

        // sort the fort pieces into ascending order by cost
        fortPiecesArray.sort((a,b) => a.cost - b.cost);
        setFortPieces(fortPiecesArray);
      });

      // return our unmount function
      // return function cleanup() {
        // frankly not sure what to do here to accurately clean up Firebase listeners (onValue calls)
      // }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInput = (event) => {
    setInput(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getUser(input);
  }

  const getUser = (thisUser) => {

    // presume we have a new user: set up a newUser object and set the userID
    setUserID(thisUser);
    let newUserID = true;
    let newUser = {};

    // initialize database call
    const dbRef = ref(database);
    get(dbRef)
      .then((result) => {

        // put the data into our dataObj
        const dataObj = result.val();

        // is there a user by this name?
        for (let users in dataObj) {
          if (dataObj[users].id === thisUser) {

            // our user exists, so set their database ID in userKey
            userKey = users;

            // set the state for the simple variables
            setHealth(dataObj[users].health);
            setFights(dataObj[users].fights);

            // turns out we didn't have a new user!
            newUserID = false;
          }
        }

        // set up potential new user
        if (newUserID) {

          // create a tools object from our myTools array to put into the new user data
          const userTools = {};
          myTools.forEach((tool) => {
            userTools[tool.name] = {
              cost: tool.cost,
              number: tool.number,
              snow: tool.snow,
            }
          })

          newUser = {
            id: thisUser,
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
          userKey = newUserKey;
          setHealth(initHealth);
          setFights(0);
        }

        // create data listeners for the user
        const snowRef = ref(database, userKey + "/snow");
        const pennyRef = ref(database, userKey + "/pennies");
        const toolsRef = ref(database, userKey + "/tools");
        const fortRef = ref(database, userKey + "/fort")

        // SNOW listener
        onValue(snowRef, (data) => {
          const userSnow = data.val();
          setSnow(userSnow);
        });

        // PENNY listener
        onValue(pennyRef, (data) => {
          const userPennies = data.val();
          setPennies(userPennies);
        });

        // TOOLS listener
        onValue(toolsRef, (data) => {
          const toolsArray = [];
          const toolsObj = data.val();

          // parse the database tools object into an array to put into state
          for (let tool in toolsObj) {
            const toolObj = toolsObj[tool];
            const toolItem = { name: tool, number: toolObj.number, cost: toolObj.cost, snow: toolObj.snow };
            toolsArray.push(toolItem);
          }

          // sort the array into ascending order by cost of tool
          toolsArray.sort((a, b) => a.cost - b.cost);
          setMyTools(toolsArray);
        });

        // FORT listener
        onValue(fortRef, (data) => {
          const newFortArray = [];
          const fortObj = data.val();
          for (let item in fortObj) {
            const fortItemObj = fortObj[item];
            const {name, defence, health, cost} = fortItemObj;
            const fortItem = { id: item, name: name, defence: defence, health: health, cost: cost };
            newFortArray.push(fortItem);
          }
          setMyFort(newFortArray);
        });

        // and the userKey is set
        sessionStorage.setItem("userKey", userKey);
      })
      .catch((error)=>{
        Swal.fire({
          icon: "error",
          title: "Database Error",
          text: `Error: ${error} received when calling database`,
        });
      });

    // set our userID in session data, then reset the input
    sessionStorage.setItem("userID", thisUser);
    setInput("");
  }

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
        Swal.fire({
          icon: "error",
          title: "Zoinks!",
          text: `You don't have any ${tool}`,
          footer: "TIP: When you dig snow, you may find pennies. Use pennies to buy more tools by clicking the COST button under the tool!"
        });

      } else {

        // otherwise, increment the snow by the amount of snow for each tool of the clicked type
        const newSnow = snow + (numTools * numSnow);
        set(snowRef, newSnow)
          .catch(()=>{
            Swal.fire({
              icon: "error",
              title: "Database Error",
              text: "We encountered an issue updating the Snow value in the database.",
            })
          });

        // ...and see if we don't find a penny or two
        const pennyFound = (Math.random() * (1 + Math.floor((numTools / 10) * (numSnow / 10))));
        if (pennyFound > pennyChance) {
          const newPennies = pennies + Math.ceil(pennyFound);
          set(pennyRef, newPennies)
            .catch(() => {
              Swal.fire({
                icon: "error",
                title: "Database Error",
                text: "We encountered an issue updating the Pennies value in the database.",
              })
            });
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
        Swal.fire({
          icon: "error",
          title: "Gasp!",
          text: `You cannot afford to buy any ${tool}`,
          footer: "TIP: When you dig snow, you may find pennies. Use pennies to buy more tools by clicking the COST button under the tool!"
        });

      } else {

        // if so, decrement the pennies
        const numPennies = pennies - curCost;
        set(penniesRef, numPennies)
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Database Error",
              text: "We encountered an issue updating the Pennies value in the database.",
            })
          });

        // increment the number of tools in the database
        curNumber = curNumber + 1;
        set(toolNumberRef, curNumber)
          .catch(() => {
            Swal.fire({
              icon: "error",
              title: "Database Error",
              text: "We encountered an issue updating the number of tools in the database.",
            })
          });
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
      Swal.fire({
        icon: "error",
        title: "Ding Dang It!",
        text: `You don't have enough SNOW to build any ${fortPiece.name}s`,
        footer: "TIP: Dig snow by clicking the TOOL buttons. You dig snow for each tool you own, so if you have 3 Mittens, you'll dig 3 Snow with each click. Buy more tools -- get more snow!"
      });
    } else {

      // if so, decrement the snow
      const numSnow = snow - fortPiece.cost;
      set(snowRef, numSnow)
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Database Error",
            text: "We encountered an issue updating the Snow value in the database.",
          })
        });

      // add the fort piece to our fort
      const newFortPiece = {...fortPiece};
      newFortPiece.id = push(userFortRef, fortPiece).key;
    }
  }

  const removeFortItem = (item) => {

    // access the user's snow and the fort piece we are removing in the database
    const snowRef = ref(database, userKey + "/snow");
    const itemRef = ref(database, userKey + "/fort/" + item.id);

    // return some snow to the player
    const curSnow = snow + Math.floor((item.cost / 5));
    set(snowRef, curSnow)
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Database Error",
          text: "We encountered an issue updating the Snow value in the database.",
        })
      });;

    // remove the item from our database
    remove(itemRef);
  }

  const handleLogout = () => {

    // reset our myTools to the initial tools from the database
    // we do this because there is no database update on logout, so we set ourselves up for a new user to potentially log in...
    const toolsArray = [];

    // initialize database call
    const dbRef = ref(database);
    get(dbRef)
      .then((result) => {

        // get initial set of tools from database
        const dataObj = result.val();
        for (let tool in dataObj.tools) {
          const toolObj = dataObj.tools[tool];
          toolsArray.push({ name: tool, number: toolObj.number, cost: toolObj.cost, snow: toolObj.snow });
        }

        // sort the array into ascending order by cost of tool
        toolsArray.sort((a, b) => a.cost - b.cost);
        setMyTools(toolsArray);
      });

    sessionStorage.setItem("userID", "");
    setInput("");
    setUserID("");
  }

  // our main site!
  return (
    <main>
      <h1>Snow Fort Constructor</h1>
      <div className="wrapper">
        <p>You start with 1 pair of mittens...and build an empire!</p>
        <p>Click on a tool (mittens, trowel, shovel) to collect that amount of snow. You have a small chance to find pennies. Use the pennies to buy more tools. Use the snow you collect to buy parts for your fort!</p>

        { userID ? (
          <>
          <button className="logout" onClick={handleLogout}>Logout</button>
          <DisplayBank snow={snow} pennies={pennies}/>
          <div className="buttons-wrapper">
            <DisplayTools tools={myTools} toolClick={handleToolClick} toolBuy={handleBuyTool}/>
            <DisplayFortPieces fortPieces={fortPieces} fortBuy={handleBuyFortPiece}/>
          </div>
          <DisplayFort fights={fights} fort={myFort} removeFortItem={removeFortItem}
          />
          <DisplayPlayer player={userID} health={health} fort={myFort}/>
          </>)
        : (
            <UserLogin input={input} handleInput={handleInput} handleSubmit={handleSubmit}/>
        ) }
      <span className="snowflake-one">❄️</span>
      <span className="snowflake-two">❄️</span>
      <span className="snowflake-three">❄️</span>
      <span className="snowflake-four">❄️</span>
      </div>
    </main>
  );
}

export default App;