let randomNum1 = Math.floor(Math.random() * 6) + 1;
let randomNum2 = Math.floor(Math.random() * 6) + 1;

let randomImage1 = 'images/dice${randomNum1}.png';
let randomImage2 = 'images/dice${randomNum2}.png';

document.querySelector(".img1").setAttribute("src", randomImage1);
document.querySelector(".img2").setAttribute("src", randomImage2);

if (randomNum1 > randomNum2) {
    document.querySelector("h1").innerHTML = "Player 1 wins!";
}
else if (randomNum1 < randomNum2) {
    document.querySelector("h1").innerHTML = "Player 2 wins!";
}
else {
    document.querySelector("h1").innerHTML = "draw";
}