const myFort = {};

myFort.tools = [
    {
        type: 'Mittens',
        snow: 1,
        cost: 1,
        amount: 1,
    },
    {
        type: 'Trowel',
        snow: 10,
        cost: 10,
        amount: 0,
    },
    {
        type: 'Shovel',
        snow: 100,
        cost: 500,
        amount: 0,
    }
];

const fortPieces = [
    {
        type: 'Wall',
        cost: 10,
        defence: 1,
        health: 10,
        totalHealth: 10,
    },
    {
        type: 'Tower',
        cost: 100,
        defence: 5,
        health: 25,
        totalHealth: 25,
    },
    {
        type: 'Fortification',
        cost: 500,
        defence: 5,
        health: 50,
        totalHealth: 50,
    },
    {
        type: 'Keep',
        cost: 1000,
        defence: 10,
        health: 100,
        totalHealth: 100,
    }
];

// construct buttons for the fort
fortPieces.forEach((item) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('item-div');
    const buttonElem = document.createElement('button');
    const buttonDescrip = document.createElement('p');
    buttonElem.textContent = item.type;
    buttonElem.classList.add('fort-button');
    buttonDescrip.innerText = `cost: ${item.cost} ❄️\ndefence: ${item.defence}\nhealth: ${item.health}`
    buttonDiv.appendChild(buttonElem);
    buttonDiv.appendChild(buttonDescrip);
    //console.log(buttonElem);

    // add in to HTML
    const fortSection = document.querySelector('.fort-pieces');
    fortSection.appendChild(buttonDiv);
});

// construct buttons for tools
myFort.constructToolButtons = () => {
    const toolsSection = document.querySelector('.tools');
    //toolsSection.innerText = '';
    const title = document.createElement('h2');
    title.innerText = 'TOOLS';
    toolsSection.appendChild(title);

    myFort.tools.forEach((item) => {
        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('item-div');
        const buttonElem1 = document.createElement('button');
        const buttonDescrip1 = document.createElement('p');
        buttonElem1.textContent = item.type;
        buttonElem1.classList.add('tool-button');
        buttonDescrip1.innerText = `❄️snow: ${item.snow}`;

        const buttonElem2 = document.createElement('button');
        const buttonDescrip2 = document.createElement('p');
        buttonElem2.textContent = `cost: ${item.cost} 🪙`;
        buttonElem2.classList.add('buy-tool-button');
        buttonDescrip2.innerText = `amount: ${item.amount}`;
        buttonDiv.appendChild(buttonElem1);
        buttonDiv.appendChild(buttonDescrip1);
        buttonDiv.appendChild(buttonElem2);
        buttonDiv.appendChild(buttonDescrip2);
        //console.log(buttonElem);

        // add in to HTML
        toolsSection.appendChild(buttonDiv);
    });
}

// INITIALIZE
myFort.init = () => {
    // initialize currency (snow & pennies) & assets
    myFort.curSnow = 0;
    myFort.curPennies = 0;
    myFort.assets = [];

    myFort.constructToolButtons();
    myFort.displayCurrency();
    myFort.displayAssets();
    myFort.update();
    //console.log(myFort);
}

// DISPLAY CURRENCY
myFort.displayCurrency = () => {
    const snowElem = document.querySelector('.current-snow');
    const penniesElem = document.querySelector('.current-pennies');
    snowElem.innerText = myFort.curSnow;
    penniesElem.innerText = myFort.curPennies;
}

// UPDATE AMOUNTS
myFort.updateAmount = (index) => {
    const toolsSection = document.querySelector('.tools');
    toolsSection.children[index+1].children[3].innerText = `amount: ${myFort.tools[index].amount}`;
    // console.log(toolsSection);
}

// DISPLAY ASSETS
myFort.displayAssets = () => {
    const myFortDiv = document.querySelector('.my-fort');
    myFortDiv.innerText='';

    myFort.assets.forEach((item) => {
        const newAsset = document.createElement('span');

        // Here we determine current health of the fort item and display it as green (high health), yellow (medium health), or red (low health)
        if (item.health >= (item.totalHealth * 0.9)) {
            newAsset.classList.add('fort-item');
        } else if (item.health >= (item.totalHealth * 0.4)) {
            newAsset.classList.add('fort-item-dmg');
        } else {
            newAsset.classList.add('fort-item-xdmg');
        }

        // The internal text for each fort item
        const itemTitle = document.createElement('h5');
        itemTitle.innerText = item.type;
        newAsset.appendChild(itemTitle);
        const itemHealth = document.createElement('p');
        itemHealth.innerText = `health: ${item.health}`;
        newAsset.appendChild(itemHealth);

        // add it to the HTML
        myFortDiv.appendChild(newAsset);
    });
}

// UPDATE STUFF
myFort.update = () => {
    const toolButtons = document.querySelectorAll('.tool-button');
    const buyToolButtons = document.querySelectorAll('.buy-tool-button');
    const fortButtons = document.querySelectorAll('.fort-button');

    toolButtons.forEach((item) => {
        item.addEventListener('click', function() {
            const selButtonText = this.innerText;
            const selButton = myFort.tools.findIndex((e) => e.type === selButtonText);

            if (myFort.tools[selButton].amount > 0) {
                myFort.curSnow += (myFort.tools[selButton].snow * myFort.tools[selButton].amount);
                const getPenny = Math.random() * 10;
                // console.log(getPenny);
                if (getPenny < 1) {
                    modifier = Math.random() * 0.2;
                    myFort.curPennies = myFort.curPennies + Math.ceil(modifier * myFort.tools[selButton].snow);
                    console.log('modifier:', modifier);
                    console.log('pennies added:', Math.ceil(modifier * myFort.tools[selButton].snow));
                }
                myFort.displayCurrency();
            } else {
                alert(`You don't have any ${myFort.tools[selButton].type}s!`)
            }
        });
    });

    buyToolButtons.forEach((item) => {
        item.addEventListener('click', function () {
            const selButtonText = parseInt(this.innerText.split(' ')[1]);
            const selButton = myFort.tools.findIndex((e) => e.cost === selButtonText);

            if (myFort.curPennies >= myFort.tools[selButton].cost) {
                myFort.curPennies -= myFort.tools[selButton].cost;
                myFort.tools[selButton].amount++;
                myFort.displayCurrency();
                myFort.updateAmount(selButton);
            } else {
                alert(`You can't afford any ${myFort.tools[selButton].type}s!`)
            }
        });
    });

    fortButtons.forEach((item) => {
        item.addEventListener('click', function() {
            const selButtonText = this.innerText;
            const selButton = fortPieces.findIndex((e) => e.type === selButtonText);

            if (myFort.curSnow < fortPieces[selButton].cost) {
                alert(`You don't have enough snow to buy a ${fortPieces[selButton].type}!`);
            } else {
                myFort.curSnow -= fortPieces[selButton].cost;
                myFort.assets.push(fortPieces[selButton]);
                myFort.displayCurrency();
                myFort.displayAssets();
            }
        });
    });
}

myFort.init();