(function () {
    const BASE_URL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e/students';
    const USERNAME = 'guest';
    const PASSWORD = 'guest';
    const BASE64_AUTH = btoa(`${USERNAME}:${PASSWORD}`);
    const AUTH_HEADERS = {
        "Authorization": `Basic ${BASE64_AUTH}`
    };
    const TABLE = $('#results');

    $.ajax({
        method: 'GET',
        url: BASE_URL,
        headers: AUTH_HEADERS
    }).then((students) => {
        let studentsList = [];
        let ids = [];
        let keys = Object.keys(students);
        keys.sort((a, b) => students[a]["ID"] - students[b]["ID"]);
        for (let key of keys) {
            let id = students[key]["ID"];
            let firstName = students[key]["FirstName"];
            let lastName = students[key]["LastName"];
            let facultyNumber = students[key]["FacultyNumber"];
            let grade = students[key]["Grade"];

            if (typeof id !== 'number') {
                continue;
            }
            if (firstName === '' || typeof firstName !== 'string' || firstName.includes(' ')) {
                continue;
            }
            if (lastName === '' || typeof lastName !== 'string' || lastName.includes(' ')) {
                continue;
            }
            if (facultyNumber.length !== 9) {
                continue;
            }
            if (typeof grade !== 'number' || grade < 2.00 || grade > 6.00) {
                continue;
            }
            if (id === Number(facultyNumber)) {
                continue;
            }
            if (ids.includes(id)) {
                continue;
            }

            ids.push(id);
            studentsList.push(students[key]);
        }

        for (let student of studentsList) {
            let tr = $('<tr>');
            let tdID = $(`<td>${student["ID"]}</td>`);
            let tdFirstName = $(`<td>${student["FirstName"]}</td>`);
            let tdLastName = $(`<td>${student['LastName']}</td>`);
            let tdFacultyNumber = (`<td>${student['FacultyNumber']}</td>`);
            let tdGrade = (`<td>${student["Grade"]}</td>`);

            tr
                .append(tdID)
                .append(tdFirstName)
                .append(tdLastName)
                .append(tdFacultyNumber)
                .append(tdGrade);

            TABLE.append(tr);
        }
    }).catch((err) => {
        console.log(err);
    });
})();

