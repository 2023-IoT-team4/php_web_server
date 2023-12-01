function get_sensor_data() {

    $.ajax({ //jquery ajax
        type: "post", //get방식으로 가져오기
        url: "get.php", //값을 가져올 경로
        dataType: "json", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        success: function (data) {   //요청 성공시 실행될 메서드
            var payload = "";
            var reported = data.state.reported;
            var humid = reported.humid;
            var temp = reported.temp;
            var press = reported.press;
            var left_feed = reported.feed_enough;
            var ip_addr = reported.espcam_ip;

            var feed_given = new Date(data.metadata.reported.feed_given.timestamp * 1000).toLocaleTimeString();

            payload = "온도 : " + temp + "<br>" + "습도 : " + humid + "<br>" + "기압 : " + press;
            payload += "<br>" + "마지막으로 밥 준 시간 : " + feed_given + "<br>";
            payload += "남은 사료량 : " + left_feed;
            document.getElementById("sensor_info").innerHTML = payload;

            // document.getElementById("cctv").addEventListener("click", goto_cam(ip_addr));
        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })
}

function get_saved_alarms() {
    $.ajax({ //jquery ajax
        type: "get", //get방식으로 가져오기
        url: "get_alarms.php", //값을 가져올 경로
        dataType: "json", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        success: function (data) {   //요청 성공시 실행될 메서드
            var payload = "";
            var hour = "00";
            var minute = "00";
            var amount = "00";
            for (var i = 0; i < data.length; i++) {
                hour = (data[i].hour);
                minute = (data[i].minute);
                amount = (data[i].amount);

                // 반복문
                alarmIndex += 1;
                let alarmObj = {};
                alarmObj.id = `${alarmIndex}_${hour}_${minute}_${amount}`;
                alarmObj.alarmHour = hour;
                alarmObj.alarmMinute = minute;
                alarmObj.alarmAmount = amount;
                alarmObj.isActive = true;
                alarmsArray.push(alarmObj);
                createAlarm(alarmObj);
            }

            for (var i = 0; i < activeAlarms.children.length; i++) {
                activeAlarms.children[i].children[1].checked = true;
            }


        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })



}

// POST 요청 함수들
function feed_immediately() {
    var amount = document.getElementById('imm_feed_input').value;
    if (amount == null || amount.trim() == '') {
        amount = 0;
    }
    var msg = "즉시 밥 주기 : " + amount;

    $.ajax({ //jquery ajax
        type: "get", //get방식으로 가져오기
        url: "publish_feed.php?amount=" + amount, //값을 가져올 경로
        dataType: "text", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        success: function (data) {   //요청 성공시 실행될 메서드
            alert(msg);
        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })
}

function request_feed_time(alarmObj) {
    alarmObj.bErase = false;
    console.log("알람 추가 request : ", alarmObj);
    $.ajax({ //jquery ajax
        type: "post", //get방식으로 가져오기
        url: "alarm.php", //값을 가져올 경로
        contentType: 'application/json',
        dataType: "json", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        data: JSON.stringify(alarmObj),
        success: function (data) {   //요청 성공시 실행될 메서드
        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })
}

function request_erase_time(alarmObj) {
    // 삭제한다는 정보 추가
    alarmObj.bErase = true;

    console.log("알람 삭제 request : ", alarmObj);
    $.ajax({ //jquery ajax
        type: "post", //get방식으로 가져오기
        url: "alarm.php", //값을 가져올 경로
        contentType: 'application/json',
        dataType: "json", //html, xml, text, script, json, jsonp 등 다양하게 쓸 수 있음
        data: JSON.stringify(alarmObj),
        success: function (data) {   //요청 성공시 실행될 메서드
        },
        error: function (r, t, error) {		 //요청 실패시 에러 확인을 위함
            console.log("통신에러");
            console.log(error);
        }
    })
}

// esp32 cam의 페이지로 이동
function goto_cam(ip_addr) {
    alert("esp cam 으로 이동!");
    location.href = "http://15.164.12.220:8000/client";

}

//Initial References
var timerRef = document.querySelector(".timer-display");
var hourInput = document.getElementById("hourInput");
var minuteInput = document.getElementById("minuteInput");
var amountInput = document.getElementById("amountInput");
var activeAlarms = document.querySelector(".activeAlarms");
var setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3");

let initialHour = 0,
    initialMinute = 0,
    alarmIndex = 0,
    initialAmount = 0;


//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
    let alarmObject,
        objIndex,
        exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObject, objIndex];
};

//Display Time
function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    //Display time
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    //Alarm
    alarmsArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue);
    }
    return inputValue;
};



//Create alarm div

const createAlarm = (alarmObj) => {
    //Keys from object
    const { id, alarmHour, alarmMinute, alarmAmount } = alarmObj;
    //Alarm div
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute},  ${alarmAmount}번</span>`;

    //checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);
    //Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);

};

//Start Alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;
        // POST 요청 보내기
        request_feed_time(alarmsArray[index]);
    }
};

//Stop alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
        alarmSound.currentTime = 0;
        // POST 요청 보내기
        request_erase_time(alarmsArray[index]);
    }
};

//delete alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();
        alarmSound.currentTime = 0;
        request_erase_time(alarmsArray[index]);
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);
    }
};


window.addEventListener('DOMContentLoaded', function () {
    timerRef = document.querySelector(".timer-display");
    hourInput = document.getElementById("hourInput");
    minuteInput = document.getElementById("minuteInput");
    amountInput = document.getElementById("amountInput");
    activeAlarms = document.querySelector(".activeAlarms");
    setAlarm = document.getElementById("set")
    hourInput.addEventListener("input", () => {
        hourInput.value = inputCheck(hourInput.value);
    });

    minuteInput.addEventListener("input", () => {
        minuteInput.value = inputCheck(minuteInput.value);
    });

    this.document.getElementById('imm_feed_btn').addEventListener("click", feed_immediately);

    this.document.getElementById('cctv').addEventListener("click", goto_cam);

    //Set Alarm
    setAlarm.addEventListener("click", () => {
	console.log("clicked");
        alarmIndex += 1;

        //alarmObject
        let alarmObj = {};
        alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}_${amountInput.value}`;
        alarmObj.alarmHour = hourInput.value;
        alarmObj.alarmMinute = minuteInput.value;
        alarmObj.alarmAmount = amountInput.value;
        alarmObj.isActive = true;
        alarmsArray.push(alarmObj);
        createAlarm(alarmObj);
        hourInput.value = appendZero(initialHour);
        minuteInput.value = appendZero(initialMinute);
        amountInput.value = appendZero(initialAmount);
    })

    get_sensor_data();
    get_saved_alarms();
});
window.onload = () => {
    setInterval(displayTimer);
    initialHour = 0;
    initialMinute = 0;
    initialAmount = 0;
    alarmIndex = 0;
    alarmsArray = [];
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
    amountInput.value = appendZero(initialAmount);
};
