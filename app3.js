window.onload = function () {
    const host = localStorage.getItem("hostTeam");
    const visitor = localStorage.getItem("visitorTeam");
    const overs = localStorage.getItem("overs");
    const tossWinner = localStorage.getItem("tossWinner");
    const tossChoice = localStorage.getItem("tossChoice");
    const striker = localStorage.getItem("striker");
    const nonStriker = localStorage.getItem("nonStriker");
    const bowler = localStorage.getItem("bowler");

    // if (!host || !visitor) {
    //     alert("Match data missing. Please go back to seteup.");
    //     window.location.href = "cricket.html";
    //     return;
    // }

    document.getElementById('matchInfo').textContent = `${host} vs ${visitor} - ${tossWinner} won the toss and chose to ${tossChoice}. (${overs} overs match)`
    document.getElementById('first-inn').textContent = `${host}, 1st innings`
    console.log(striker, nonStriker, bowler);
    document.getElementById('head2').innerText = striker;
    document.getElementById('head3').innerText = nonStriker;
    document.getElementById('head5').innerText = bowler;
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

let currentBowler = {
    name: localStorage.getItem("bowler"),
    overs: 0,
    balls: 0,
    runs: 0,
    wickets: 0
};

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
        currentBowler.wickets += 1;
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

    //Over complete
    if (ballsInOver === 6) {
        ballsInOver = 0;
        swapstrike();
        setTimeout(() => {
            thisOverDiv.innerHTML = "<p>This Over:</p>";
        }, 4000);
        //change bowler
    }

    if (!isWide && !isNoBall) {
        currentBowler.balls += 1;
        if (currentBowler.balls === 6) {
            currentBowler.overs += 1;
            currentBowler.balls =0;
        }
    }

    if (!isBye && !isLegByes) {
        currentBowler.runs += runs;
    }
    if (isWide || isNoBall) {
        currentBowler.runs += (1 + runs);
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

    document.getElementById("crr").textContent = `${getCRR(totalRuns, balls)}`;
    document.getElementById("run-calc").textContent = `${totalRuns}-${wickets}`;
    document.getElementById("over-calc").textContent = `(${over}.${ball})`;
    document.getElementById("head2").textContent = striker.name;
    document.getElementById("head3").textContent = nonStriker.name;
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
    document.getElementById("bOver").textContent = `${currentBowler.overs}.${currentBowler.balls}`;
    document.getElementById("bRuns").textContent = currentBowler.runs;
    document.getElementById("bW").textContent = currentBowler.wickets;
    document.getElementById("bEco").textContent = `${getEco(currentBowler.runs, currentBowler.overs * 6 + currentBowler.balls)}`;   
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