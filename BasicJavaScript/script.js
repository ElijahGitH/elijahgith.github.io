
var counterValue = 0;


function updateCounter() {
  document.getElementById("counter").innerHTML = counterValue;
}

// tick up 
function tickUp() {
  counterValue = counterValue + 1;
  updateCounter();
}

// tick down counter
function tickDown() {
  counterValue = counterValue - 1;
  updateCounter();
}

// run a simple for loop
function runForLoop() {
  var result = "";
  var i;

  for (i = 0; i <= counterValue; i++) {
    result = result + i + " ";
  }
  document.getElementById("forLoopResult").innerHTML = result;
}

// show odds
function showOddNumbers() {
  var result = ""; var i;
  for (i = 1; i <= counterValue; i++) {
    if (i % 2 != 0) {
      result = result + i + " ";
    }
  }

  document.getElementById("oddNumberResult").innerHTML = result;
}

// add multiples thing
function addMultiplesToArray() {
  var arr = [];
  var i;

  for (i = counterValue; i >= 5; i--) {
    if (i % 5 == 0) {
      arr.push(i);
    }
  }
  console.log(arr);
}

// print car
function printCarObject() {
  var typeValue = document.getElementById("carType").value;
  var mpgValue = document.getElementById("carMPG").value;
  var colorValue = document.getElementById("carColor").value;

  var carObj = {
    cType: typeValue,
    cMPG: mpgValue,
    cColor: colorValue
  };
  console.log(carObj);
}

// loading car into form
function loadCar(num) {
  var car;

  if (num == 1) {
    car = carObject1;
  } else if (num == 2) {
    car = carObject2;
  } else if (num == 3) {
    car = carObject3;
  } else {
    return;
  }

  document.getElementById("carType").value = car.cType;
  document.getElementById("carMPG").value = car.cMPG;
  document.getElementById("carColor").value = car.cColor;
}

// change color
function changeColor(num) {
  var p = document.getElementById("styleParagraph");

  if (num == 1) {
    p.style.color = "red";
  } else if (num == 2) {
    p.style.color = "green";
  } else if (num == 3) {
    p.style.color = "blue";
  }
}
