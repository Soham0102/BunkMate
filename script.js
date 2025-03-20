document.addEventListener("DOMContentLoaded", () => {
    loadHistory(); // Load saved attendance history
    loadDarkMode(); // Load saved theme
});

// 🌙 Toggle Dark Mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    let mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", mode);
});

// Load Dark Mode Setting
function loadDarkMode() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

// 📝 Save Attendance History
function calculateAttendance() {
    let totalLectures = parseInt(document.getElementById("totalLectures").value);
    let attendedLectures = parseInt(document.getElementById("attendedLectures").value);
    let desiredAttendance = parseFloat(document.getElementById("desiredAttendance").value);

    if (isNaN(totalLectures) || isNaN(attendedLectures) || isNaN(desiredAttendance)) {
        document.getElementById("result").innerHTML = "Please enter valid numbers!";
        return;
    }

    let currentAttendance = (attendedLectures / totalLectures) * 100;
    let resultText = "";

    if (currentAttendance >= desiredAttendance) {
        let maxBunks = Math.floor((attendedLectures - (desiredAttendance / 100) * totalLectures) / (desiredAttendance / 100));
        resultText = `You can bunk <b>${maxBunks}</b> lectures and still maintain ${desiredAttendance}% attendance.`;
    } else {
        let requiredLectures = Math.ceil(((desiredAttendance / 100) * totalLectures - attendedLectures) / (1 - (desiredAttendance / 100)));
        resultText = `You need to attend <b>${requiredLectures}</b> more lectures to reach ${desiredAttendance}% attendance.`;
    }

    document.getElementById("result").innerHTML = resultText;

    // Save history
    let historyEntry = {
        total: totalLectures,
        attended: attendedLectures,
        desired: desiredAttendance,
        result: resultText,
    };

    let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    history.push(historyEntry);
    localStorage.setItem("attendanceHistory", JSON.stringify(history));

    loadHistory();
}

// 📊 Load Attendance History
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("attendanceHistory")) || [];
    let historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    history.forEach((entry, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${entry.attended}/${entry.total} Lectures</strong> - Desired: ${entry.desired}% <br> ${entry.result}`;
        historyList.appendChild(li);
    });
}
