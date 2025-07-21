window.onload = function () {
    const host = localStorage.getItem("hostTeam");
    const visitor = localStorage.getItem("visitorTeam");
    const overs = localStorage.getItem("overs");
    const tossWinner = localStorage.getItem("tossWinner");
    const tossChoice = localStorage.getItem("tossChoice");
    const striker = localStorage.getItem("striker");
    const nonStriker = localStorage.getItem("nonStriker");
    const bowler = localStorage.getItem("bowler");

    document.getElementById('matchInfo').textContent = `${host} vs ${visitor} - ${tossWinner} won the toss and chose to ${tossChoice}. (${overs} overs match)`
    document.getElementById('first-inn').textContent = `${host}, 1st innings`
    console.log(striker, nonStriker, bowler);
    document.getElementById('head2').innerText = toTitleCase(striker);
    document.getElementById('head3').innerText = toTitleCase(nonStriker);
    document.getElementById('head5').innerText = toTitleCase(bowler);
    document.getElementById('match-info').textContent = `${host} v/s ${visitor}`
};

let striker = {
    name: localStorage.getItem("striker"),
    runs: 0,
    balls: 0,
    four: 0,
    six: 0,
    sr: 0
};

let nonStriker = {
    name: localStorage.getItem("nonStriker"),
    runs: 0,
    balls: 0,
    four: 0,
    six: 0,
    sr: 0
};

let bowlers = {}; //key = bowler name, value = their stats
let currentBowlerName = localStorage.getItem("bowler").toLowerCase();
let currentBowlerBalls = 0;


// let currentBowler = {
//     name: localStorage.getItem("bowler"),
//     overs: 0,
//     balls: 0,
//     runs: 0,
//     wickets: 0
// };

let totalRuns = 0;
let wickets = 0;
let balls = 0;
let ballsInOver = 0;
const oversLimit = parseInt(localStorage.getItem("overs"));

function submitBall(runs) {
    let extraRuns = 0;
    let legalDelivery = true;
    let ballResult = "";
    const isWide = document.getElementById("wide").checked;
    const isNoBall = document.getElementById("noBall").checked;
    const isBye = document.getElementById("byes").checked;
    const isLegByes = document.getElementById("legByes").checked;
    const isWicket = document.getElementById("wicket").checked;

    //Extras always add 1 run
    if (isWide || isNoBall) {
        extraRuns += 1;
        legalDelivery = false; //doesn't counted toward 6 balls
    }

    //Runs on extras
    if (isWide || isBye || isLegByes) {
        extraRuns += runs //runs off extras
    } else {
        totalRuns += runs; //regular runs go to team + batter
    }

    totalRuns += extraRuns;

    if (legalDelivery || isNoBall) {
        striker.balls += 1;
    }

    //Boundary count
    if (runs === 4) {
        striker.four += 1;
    } else if (runs === 6) {
        striker.six += 1;
    }

    if (isWicket) {
        wickets += 1;
        legalDelivery = true; //counts ball
        const newBatter = prompt("Enter new batter:");
        striker = {
            name: newBatter,
            runs: 0,
            balls: 0,
            four: 0,
            six: 0,
            sr: 0
        }
    }

    if (legalDelivery) {
        balls += 1;
        ballsInOver += 1;
    }

    if (!isWide && !isBye && !isLegByes && runs>0) {
        striker.runs += runs;
    }

    //SR calculation
    if (striker.balls === 0) {
        striker.sr = 0.00;
    } else {
        striker.sr = ((striker.runs / striker.balls)*100).toFixed(2);
    }
    
    //Strike Rotation
    if (runs % 2 === 1) {
        swapstrike();
    }

    //ball-results
    if (isWicket) {
        ballResult = "W";
    } else if (isWide) {
        ballResult = `${runs}Wd`;
    } else if (isNoBall) {
        ballResult = `${runs}Nb`;
    } else if (isBye) {
        ballResult = `B${runs}`;
    } else if (isLegByes) {
        ballResult = `LB${runs}`;
    } else {
        ballResult = runs.toString();
    }

    const thisOverDiv = document.getElementById("this-over");
    const ballDiv = document.createElement("div");
    ballDiv.textContent = ballResult;
    ballDiv.style.height = "30px";
    ballDiv.style.width = "30px";
    ballDiv.style.border = "1px solid gray";
    ballDiv.style.margin = "12px";
    ballDiv.style.borderRadius = "50%";
    ballDiv.style.textAlign = "center";
    ballDiv.style.display = "flex";
    ballDiv.style.justifyContent = "center";
    ballDiv.style.alignItems = "center";

    thisOverDiv.appendChild(ballDiv);

    if (ballResult === "W") {
        ballDiv.style.background = "#ff4d4d";
        ballDiv.style.color = "#fff";
    } else if (ballResult === "4") {
        ballDiv.style.background = "#dd9f19ff";
        ballDiv.style.color = "#fff";
    } else if (ballResult === "6") {
        ballDiv.style.background = "#00ff00";
        ballDiv.style.color = "#fff";
    }



    //Clear all checkboxes after each delivery
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    //Updating bowler
    ensureBowlerExists(currentBowlerName);
    const b = bowlers[currentBowlerName];

    if (!isWide && !isNoBall) {
        b.balls += 1;
        currentBowlerBalls += 1;

        if (b.balls === 6) {
            b.overs += 1;
            b.balls = 0;
        }
    }

    if (!isBye && !isLegByes) {
        b.runs += runs;
    }

    if (isWide || isNoBall) {
        b.runs += 1 + runs;
    }

    if (isWicket) {
        b.wickets += 1;
    }

    //Over complete
    if (ballsInOver === 6) {
        ballsInOver = 0;
        let previousBowler = currentBowlerName;
        swapstrike();
        setTimeout(() => {
            thisOverDiv.innerHTML = "<p>This Over:</p>";
            let newBowler;
            do {
                newBowler = prompt("Enter new bowler's name:");
                if (!newBowler) return;

                newBowler = newBowler.trim();

                if (newBowler.toLowerCase() === previousBowler.toLowerCase()) {
                    alert("Same bowler cannot bowl consecutive overs. Choose a different bowler.");
                }
            } while (newBowler.toLowerCase() === previousBowler.toLowerCase());

            currentBowlerName = newBowler.toLowerCase();

            ensureBowlerExists(currentBowlerName);
            const b = bowlers[currentBowlerName];
            document.getElementById("bOver").textContent = `${b.overs}.${b.balls}`;
            document.getElementById("bRuns").textContent = b.runs;
            document.getElementById("bW").textContent = b.wickets;
            document.getElementById("bEco").textContent = `${getEco(b.runs, b.overs * 6 + b.balls)}`;
            document.getElementById("head5").textContent = currentBowlerName;
        }, 2000);

    }

    //End of Innings
    if (balls >= oversLimit*6 || wickets >= 10) {
        alert("Innings over!");
        return;
    }

    updateScore();
}

function updateScore() {
    const over = Math.floor(balls / 6);
    const ball = balls % 6;

    function getCRR(runs, balls) {
        const overs = balls / 6;
        return overs === 0 ? "0.00": (runs / overs).toFixed(2);
    }

    const b = bowlers[currentBowlerName];
    document.getElementById("bOver").textContent = `${b.overs}.${b.balls}`;
    document.getElementById("bRuns").textContent = b.runs;
    
    document.getElementById("bW").textContent = b.wickets;
    document.getElementById("bEco").textContent = `${getEco(b.runs, b.overs * 6 + b.balls)}`;
    document.getElementById("head5").textContent = toTitleCase(currentBowlerName);
    document.getElementById("crr").textContent = `${getCRR(totalRuns, balls)}`;
    document.getElementById("run-calc").textContent = `${totalRuns}-${wickets}`;
    document.getElementById("over-calc").textContent = `(${over}.${ball})`;
    document.getElementById("head2").textContent = toTitleCase(striker.name);
    document.getElementById("head3").textContent = toTitleCase(nonStriker.name);
    document.getElementById("stru").textContent = striker.runs;
    document.getElementById('nstru').textContent = nonStriker.runs;
    document.getElementById("stba").textContent = striker.balls;
    document.getElementById("nstba").textContent = nonStriker.balls;
    document.getElementById("nstf").textContent = nonStriker.four;
    document.getElementById("nsts").textContent = nonStriker.six;
    document.getElementById("nstsr").textContent = nonStriker.sr;
    document.getElementById("stf").textContent = striker.four;
    document.getElementById("sts").textContent = striker.six;
    document.getElementById("stsr").textContent = striker.sr;   
}

function swapstrike() {
    const temp = striker;
    striker = nonStriker;
    nonStriker = temp;
}

function getEco(runs, balls) {
    const overs = balls / 6;
    return overs === 0 ? "0.00" : (runs / overs).toFixed(2);
}

function ensureBowlerExists(name) {
    if (!bowlers[name]) {
        bowlers[name] = {
            overs: 0,
            balls: 0,
            runs: 0,
            wickets: 0
        };
    }
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}