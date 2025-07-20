const input1 = document.getElementById('hostn');
const input2 = document.getElementById('visitorn');
const output1 = document.getElementById('hostna');
const output2 = document.getElementById('visitna');
const start = document.getElementById('start-match');

input1.addEventListener('input', function () {
    output1.textContent = input1.value;
    document.getElementById('host').value = input1.value;
});

input2.addEventListener('input', function () {
    output2.textContent = input2.value;
    document.getElementById('visitor').value = input2.value;
});

showPopup = (message) => {
    document.getElementById('popupMsg').textContent = message;
    document.getElementById('popup').style.display = 'block';
}

closePopup = () => {
    document.getElementById('popup').style.display = 'none';
}

startGame = () => {
    const host = input1.value.trim();
    const visitor = input2.value.trim();
    const overs = parseInt(document.getElementById('overs').value);
    const tossWinner = document.querySelector('input[name="toss-winner"]:checked');
    const tossChoice = document.querySelector('input[name="toss-choice"]:checked');

    if (host === "" || visitor === "") {
        showPopup("Team name cannot be empty");
    } else if (host.toLowerCase() === visitor.toLowerCase()) {
        showPopup("Host and visitor teams must be different");
    } else if (isNaN(overs) || overs <= 0) {
        showPopup("Overs must be positive number");
    } else {

        //Store values in localStorage
        localStorage.setItem("hostTeam" , host);
        localStorage.setItem("visitorTeam" , visitor);
        localStorage.setItem("overs" , overs);
        localStorage.setItem("tossWinner", tossWinner.value);
        localStorage.setItem("tossChoice", tossChoice.value);

        //console.log(host, visitor, overs, tossChoice, tossWinner);
        window.location.href = "page2.html"
    }
};
