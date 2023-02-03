import { get, ref } from 'firebase/database';

function DisplayFort ({fights, fort, removeFortItem, database, user}) {
  const fightText = (fights === 0) ? "No snowball fights yet!"
    : (fights === 1) ? `You have survived ${fights} snowball fight`
    : `You have survived ${fights} snowball fights`;

  console.log("fort:", fort);

  const loadInfo = async (dbRef) => {
    const data = await get(dbRef).then((result) => {return result.val()})
    return data;
    // const dataReturn = data.val();
    // return dataReturn;
  }

  return (
    <>
      <h2>My Fort</h2>
      <p>{fightText}</p>
      <div className="my-fort">
        {
          fort.map((fortItem) => {
            const myFortRef = ref(database, user + "/fort/" + fortItem.name);
            const curFortItem = loadInfo(myFortRef);
            console.log("curFortItem: ", curFortItem);
            return (
              <div key={fortItem.name} className="fort-item">
                <h5>{curFortItem.name}</h5>
                <p>{curFortItem.health}🤍 | {curFortItem.defence}🛡️</p>
                <button onClick={()=>removeFortItem(curFortItem)}>remove</button>
              </div>
            )
            // get(myFortRef)
            // .then((result) => {
            //   const curFortItem = result.val();
            //   console.log("curFortItem:", curFortItem);
            //   return (
            //     <div className="fort-item">
            //       <h5>{curFortItem.name}</h5>
            //       <p>{curFortItem.health}🤍 | {curFortItem.defence}🛡️</p>
            //       <button onClick={()=>removeFortItem(curFortItem)}>remove</button>
            //     </div>
            //   )
            // })
          })
        }
      </div>
    </>
  )
}

export default DisplayFort;