class Student {
    constructor(name, rollNo, department, cgpa) {
        this.name = name;
        this.rollNo = rollNo;
        this.department = department;
        this.cgpa = cgpa;
    }
}

document.getElementById("displayBtn").addEventListener("click", function () {

    const name = document.getElementById("name").value;
    const rollNo = document.getElementById("rollNo").value;
    const department = document.getElementById("department").value;
    const cgpa = document.getElementById("cgpa").value;

    const student = new Student(name, rollNo, department, cgpa);

    const profile = document.createElement("div");
    profile.className = "profile";

    const heading = document.createElement("h2");
    heading.textContent = "Student Profile";

    const nameText = document.createElement("p");
    nameText.textContent = "Name : " + student.name;

    const rollText = document.createElement("p");
    rollText.textContent = "Roll No : " + student.rollNo;

    const deptText = document.createElement("p");
    deptText.textContent = "Department : " + student.department;

    const cgpaText = document.createElement("p");
    cgpaText.textContent = "CGPA : " + student.cgpa;

    profile.appendChild(heading);
    profile.appendChild(nameText);
    profile.appendChild(rollText);
    profile.appendChild(deptText);
    profile.appendChild(cgpaText);

    const output = document.getElementById("studentProfile");
    output.innerHTML = "";
    output.appendChild(profile);
});