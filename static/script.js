var print = document.getElementById("draw");
var button = document.getElementById("button");
var ctx = print.getContext("2d");
button.addEventListener("click", pressed);
ctx.lineWidth = 1;
drawCoordinates();
drawAreas();

// Загрузка сохраненных данных при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadTableData();
});

function getCheckedCheckBoxes() {
    var checkboxes = document.getElementsByClassName('checkbox');
    var checkboxesChecked = [];
    for (var index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked) {
            checkboxesChecked.push(checkboxes[index].value);
        }
    }
    return checkboxesChecked;
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
    var YCoordinate = "";

    if ((listOfX.length != 0) && (yCoordinateElement) && (RCoordinateList != null)) {
        RCoordinate = RCoordinateList.value;
        YCoordinate = yCoordinateElement.value;
        YCoordinate = YCoordinate.replace(',', '.')

        if (!isNaN(YCoordinate) && (YCoordinate >= -3) && (YCoordinate <= 5)) {
            console.log("sending ... ")
            var answer = fetch('/fcgi-bin/labWeb1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    x: listOfX,
                    y: YCoordinate,
                    r: String(RCoordinate)
                }),
            }).then(response => {
                console.log(response)
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.status);
                }
                return response.json();
            }).then(data => {
                console.log("Получены данные:", data);
                console.log("Количество элементов:", data.length);
                for (let i = 0; i < data.length; i++) {
                    addTableRow(
                        data[i].x,
                        data[i].y,
                        data[i].r,
                        data[i].control,
                        data[i].timeOfProcess,
                        new Date()
                    );
                }
                // Сохраняем таблицу после добавления новых данных
                saveTableData();
            }).catch(error => {
                console.error('Ошибка:', error);
                document.getElementById("demo").innerHTML = "Ошибка: " + error.message;
            });
            document.getElementById("demo").innerHTML = "You pro!";

        } else {
            document.getElementById("demo").innerHTML = "You noob! Y должен быть числом от -3 до 5";
        }
    } else {
        var errorMessage = "Ошибка: ";
        if (listOfX.length === 0) errorMessage += "выберите X, ";
        if (!yCoordinateElement) errorMessage += "элемент Y не найден, ";
        if (RCoordinateList == null) errorMessage += "выберите R";

        document.getElementById("demo").innerHTML = errorMessage;
    }
}

function addTableRow(x, y, r, control, timeScript, localTime) {
    var table = document.getElementById("resultsTable");
    var row = table.insertRow(-1);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);

    cell1.textContent = x;
    cell2.textContent = y;
    cell3.textContent = r;
    if (control == 1) {
        cell4.textContent = "In area";
    } else {
        cell4.textContent = "Out of area";
    }
    cell5.textContent = timeScript;
    cell6.textContent = localTime.toLocaleString();
}

// Функция для сохранения данных таблицы в localStorage
function saveTableData() {
    var table = document.getElementById("resultsTable");
    var rows = table.rows;
    var tableData = [];

    // Начинаем с 1, чтобы пропустить заголовок
    for (var i = 1; i < rows.length; i++) {
        var cells = rows[i].cells;
        tableData.push({
            x: cells[0].textContent,
            y: cells[1].textContent,
            r: cells[2].textContent,
            control: cells[3].textContent === "In area" ? 1 : 0,
            timeScript: cells[4].textContent,
            localTime: cells[5].textContent
        });
    }

    localStorage.setItem('resultsTableData', JSON.stringify(tableData));
}

// Функция для загрузки данных таблицы из localStorage
function loadTableData() {
    var savedData = localStorage.getItem('resultsTableData');
    if (savedData) {
        var tableData = JSON.parse(savedData);
        
        // Очищаем таблицу (кроме заголовка)
        var table = document.getElementById("resultsTable");
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        // Восстанавливаем данные
        tableData.forEach(function(rowData) {
            addTableRow(
                rowData.x,
                rowData.y,
                rowData.r,
                rowData.control,
                rowData.timeScript,
                new Date(rowData.localTime)
            );
        });
    }
}

// Очистка таблицы и localStorage
function clearTable() {
    var table = document.getElementById("resultsTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    localStorage.removeItem('resultsTableData');
}

// Добавьте кнопку для очистки таблицы в ваш HTML:
// <button onclick="clearTable()">Очистить таблицу</button>