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
};