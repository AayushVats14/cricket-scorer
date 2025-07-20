const input1 = document.getElementById("striker");
const input2 = document.getElementById("non-striker");
const input3 = document.getElementById("bowler");

showPopup = (message) => {
    document.getElementById('popupMsg').textContent = message;
    document.getElementById('popup').style.display = 'block';
}

closePopup = () => {
    document.getElementById('popup').style.display = 'none';
}

startGame = () => {
    const striker = input1.value.trim();
    const nonStriker = input2.value.trim();
    const bowler = input3.value.trim();


    if (striker === "" || nonStriker === "" || bowler === "") {
        showPopup("Player name cannot be empty");
    } else {

        //Store values in localStorage
        localStorage.setItem("striker" , striker);
        localStorage.setItem("nonStriker" , nonStriker);
        localStorage.setItem("bowler" , bowler);

        //console.log(host, visitor, overs, tossChoice, tossWinner);
        window.location.href = "page3.html"
    }
};
