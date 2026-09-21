const defaultSchedule = {
    Monday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Team", start: "16:00", end: "18:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Tuesday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Team", start: "16:00", end: "18:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Wednesday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Team", start: "16:00", end: "18:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Thursday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Team", start: "16:00", end: "18:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Friday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Team", start: "16:00", end: "18:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Saturday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ],

    Sunday: [
        { type: "Individual", start: "06:00", end: "07:00" },
        { type: "Choice", start: "20:00", end: "21:00" },
        { type: "Recovery", start: "21:00", end: "21:15" }
    ]
};


let schedule;

try {
    schedule = JSON.parse(localStorage.getItem("playerSchedule"));
} catch (error) {
    schedule = null;
}

if (!schedule) {
    schedule = JSON.parse(JSON.stringify(defaultSchedule));
}


function saveScheduleToStorage() {
    localStorage.setItem(
        "playerSchedule",
        JSON.stringify(schedule)
    );
}


function getHours(start, end) {

    const startParts = start.split(":");
    const endParts = end.split(":");

    const startMinutes =
        Number(startParts[0]) * 60 +
        Number(startParts[1]);

    const endMinutes =
        Number(endParts[0]) * 60 +
        Number(endParts[1]);

    let difference = endMinutes - startMinutes;

    if (difference < 0) {
        difference += 24 * 60;
    }

    return difference / 60;
}


function calculateWeeklyHours() {

    let total = 0;
    let team = 0;
    let individual = 0;
    let recovery = 0;

    for (const day in schedule) {

        schedule[day].forEach(session => {

            const hours = getHours(
                session.start,
                session.end
            );

            if (session.type === "Recovery") {
                recovery += hours;
            } else {
                total += hours;
            }

            if (session.type === "Team") {
                team += hours;
            }

            if (
                session.type === "Individual" ||
                session.type === "Choice"
            ) {
                individual += hours;
            }

        });

    }

    return {
        total,
        team,
        individual,
        recovery
    };
}


function updateDashboard() {

    const weekly = calculateWeeklyHours();

    document.getElementById("totalHours").textContent =
        weekly.total.toFixed(1);

    document.getElementById("teamHours").textContent =
        weekly.team.toFixed(1);

    document.getElementById("individualHours").textContent =
        weekly.individual.toFixed(1);

    document.getElementById("recoveryHours").textContent =
        weekly.recovery.toFixed(1);
}


function setupNavigation() {

    const buttons =
        document.querySelectorAll(".nav-button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const pageId =
                button.getAttribute("data-page");

            document
                .querySelectorAll(".page")
                .forEach(page => {
                    page.classList.add("hidden");
                });

            const selectedPage =
                document.getElementById(pageId);

            if (selectedPage) {
                selectedPage.classList.remove("hidden");
            }

            buttons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            if (pageId === "schedulePage") {
                renderScheduleEditor();
            }

        });

    });

}


function renderScheduleEditor() {

    const editor =
        document.getElementById("scheduleEditor");

    if (!editor) {
        return;
    }

    editor.innerHTML = "";

    Object.keys(schedule).forEach(day => {

        const dayContainer =
            document.createElement("div");

        dayContainer.className = "schedule-day";

        const heading =
            document.createElement("h3");

        heading.textContent = day;

        dayContainer.appendChild(heading);


        schedule[day].forEach((session, index) => {

            const row =
                document.createElement("div");

            row.className = "schedule-row";


            const name =
                document.createElement("div");

            name.className =
                "schedule-session-name";

            name.innerHTML =
                `<strong>${session.type}</strong>`;


            const startContainer =
                document.createElement("div");

            const startLabel =
                document.createElement("label");

            startLabel.textContent = "Start";


          const startInput =
              document.createElement("input");

          startInput.type = "text";
          startInput.placeholder = "06:00";
          startInput.value = session.start;

            startInput.addEventListener(
                "change",
                () => {

                    schedule[day][index].start =
                        startInput.value;

                }
            );


            startContainer.appendChild(startLabel);
            startContainer.appendChild(startInput);


            const endContainer =
                document.createElement("div");

            const endLabel =
                document.createElement("label");

            endLabel.textContent = "End";


          const endInput =
              document.createElement("input");

          endInput.type = "text";
          endInput.placeholder = "07:00";
          endInput.value = session.end;


            endInput.addEventListener(
                "change",
                () => {

                    schedule[day][index].end =
                        endInput.value;

                }
            );


            endContainer.appendChild(endLabel);
            endContainer.appendChild(endInput);


            row.appendChild(name);
            row.appendChild(startContainer);
            row.appendChild(endContainer);

            dayContainer.appendChild(row);

        });


        editor.appendChild(dayContainer);

    });

}


function setupScheduleButtons() {

    const saveButton =
        document.getElementById("saveSchedule");

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            () => {

                saveScheduleToStorage();

                updateDashboard();

                const message =
                    document.getElementById("saveMessage");

                message.textContent =
                    "Schedule saved!";

                setTimeout(() => {
                    message.textContent = "";
                }, 2000);

            }
        );

    }


    const resetButton =
        document.getElementById("resetSchedule");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                schedule =
                    JSON.parse(
                        JSON.stringify(defaultSchedule)
                    );

                saveScheduleToStorage();

                renderScheduleEditor();

                updateDashboard();

                const message =
                    document.getElementById("saveMessage");

                message.textContent =
                    "Schedule reset!";

            }
        );

    }

}


function startApp() {

    setupNavigation();

    setupScheduleButtons();

    renderScheduleEditor();

    updateDashboard();

}


startApp();