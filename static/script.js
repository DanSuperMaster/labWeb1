

var print = document.getElementById("draw");
var button = document.getElementById("button");
var ctx = print.getContext("2d");
button.addEventListener("click", pressed);
ctx.lineWidth = 1;
drawCoordinates();
drawAreas();

function getCheckedCheckBoxes() {
  var checkboxes = document.getElementsByClassName('checkbox');
  var checkboxesChecked = []; // можно в массиве их хранить, если нужно использовать
  for (var index = 0; index < checkboxes.length; index++) {
     if (checkboxes[index].checked) {
        checkboxesChecked.push(checkboxes[index].value); // положим в массив выбранный
     }
  }
  return checkboxesChecked; // для использования в нужном месте
}

function drawCoordinates() {
    ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.moveTo(23 * 8, 0);
        ctx.lineTo(23 * 8, 400);
        ctx.moveTo(0, 23 * 9);
        ctx.lineTo(400, 23 * 9);
    drawArrowX();
    drawArrowY();
    drawSmallLines();
    drawLetters();
    ctx.stroke();

}

function drawArrowX() {
    ctx.moveTo(400 - 6, 23 * 9 - 6);
    ctx.lineTo(400, 23 * 9);
    ctx.moveTo(400 - 6, 23 * 9 + 6);
    ctx.lineTo(400, 23 * 9);
}

function drawArrowY() {
    ctx.moveTo(23 * 8 - 6, 0 + 6);
    ctx.lineTo(23 * 8, 0);
    ctx.moveTo(23 * 8 + 6, 0 + 6);
    ctx.lineTo(23 * 8, 0);
}

function drawSmallLines() {
    ctx.moveTo(23 * 8 - 3, 120);
    ctx.lineTo(23 * 8 + 3, 120);

    ctx.moveTo(23 * 8 - 3, 30);
    ctx.lineTo(23 * 8 + 3, 30);

    ctx.moveTo(23 * 8 - 3, 300);
    ctx.lineTo(23 * 8 + 3, 300);

    ctx.moveTo(23 * 8 - 3, 390);
    ctx.lineTo(23 * 8 + 3, 390);

    ctx.moveTo(361, 23 * 9 - 3);
    ctx.lineTo(361, 23 * 9 + 3);

    ctx.moveTo(280, 23 * 9 - 3);
    ctx.lineTo(280, 23 * 9 + 3);

    ctx.moveTo(110, 23 * 9 - 3);
    ctx.lineTo(110, 23 * 9 + 3);

    ctx.moveTo(30, 23 * 9 - 3);
    ctx.lineTo(30, 23 * 9 + 3);
}

function drawLetters() {
    ctx.fillText("R/2", 23 * 8 - 22, 110);

    ctx.fillText("R", 23 * 8 - 12, 30);

    ctx.fillText("-R/2", 23 * 8 + 6, 300);

    ctx.fillText("-R", 23 * 8 + 6, 390);

    ctx.fillText("R", 358, 23 * 9 + 12);

    ctx.fillText("R/2", 280, 23 * 9 + 12);

    ctx.fillText("-R/2", 110, 23 * 9 + 12);
    ctx.fillText("-R", 30, 23 * 9 + 12);
}

function drawAreas() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.moveTo(184, 207);
    ctx.arc(184, 207, 177, 1.5 * Math.PI, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.moveTo(23 * 8, 120);
    ctx.lineTo(30, 23 * 9);
    ctx.lineTo(184, 23 * 9);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
    ctx.rect(30, 23 * 9, 154, 183);
    ctx.fill();
    ctx.closePath();

}

function pressed() {
    var listOfX = getCheckedCheckBoxes();
    var yCoordinateElement = document.getElementById("Y");
    var RCoordinateList = document.querySelector('input[name="drone"]:checked');
    var RCoordinate = -10;
    var YCoordinate = -10;

    if ((listOfX.length != 0) && (yCoordinateElement) && (RCoordinateList != null)) {
        RCoordinate = RCoordinateList.value;
        YCoordinate = parseFloat(yCoordinateElement.value);


        if (!isNaN(YCoordinate) && (YCoordinate >= -3) && (YCoordinate <= 5)) {
        console.log("sending ... ")
            fetch('/calculate', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                                  x: listOfX,
                                  y: String(YCoordinate),
                                  r: String(RCoordinate)}),
                      }).then(response => {
                      console.log(response)
                            if (!response.ok) {
                                throw new Error('Ошибка сети: ' + response.status);
                            }
                            return response.json();
                      })
            document.getElementById("demo").innerHTML = "You pro!";
        }
        else {
            document.getElementById("demo").innerHTML = "You noob! Y должен быть числом от -3 до 5";
        }
    }
    else {
        var errorMessage = "Ошибка: ";
        if (listOfX.length === 0) errorMessage += "выберите X, ";
        if (!yCoordinateElement) errorMessage += "элемент Y не найден, ";
        if (RCoordinateList == null) errorMessage += "выберите R";

        document.getElementById("demo").innerHTML = errorMessage;
    }
}



