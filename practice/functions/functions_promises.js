// 1. NORMAL FUNCTION
function calculateTotal(mark1, mark2, mark3) {
    return mark1 + mark2 + mark3;
}

console.log("Normal Function:", calculateTotal(75, 80, 85));


// 2. ARROW FUNCTION
const calculatePercentage = (total, subjects) => {
    return total / subjects;
};

console.log("Arrow Function:", calculatePercentage(240, 3));


// 3. ANONYMOUS FUNCTION
const checkResult = function (percentage) {
    if (percentage >= 90)
        return "Excellent";
    else if (percentage >= 60)
        return "Pass";
    else
        return "Fail";
};

console.log("Anonymous Function:", checkResult(80));


// 4. CALLBACK FUNCTION
function showResult(studentName, resultCallback) {
    console.log("Student:", studentName);

    let result = resultCallback(80);

    console.log("Result:", result);
}

showResult("Anjali", checkResult);


// 5. CALLBACK HELL
function getStudentMarks(callback) {
    setTimeout(() => {
        console.log("1. Marks collected");
        callback(240);
    }, 1000);
}

function findPercentage(total, callback) {
    setTimeout(() => {
        let percentage = total / 3;

        console.log("2. Percentage calculated:", percentage);

        callback(percentage);
    }, 1000);
}

function findResult(percentage, callback) {
    setTimeout(() => {
        let result = checkResult(percentage);

        console.log("3. Result calculated:", result);

        callback(result);
    }, 1000);
}

getStudentMarks(function (total) {

    findPercentage(total, function (percentage) {

        findResult(percentage, function (result) {

            console.log("Final Result:", result);

        });

    });

});


// 6. PROMISE
function getExamResult() {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            let totalMarks = 240;

            if (totalMarks > 0) {
                resolve(totalMarks);
            } 
            else {
                reject("Marks are not available");
            }

        }, 1000);

    });
}

getExamResult()

.then((total) => {

    console.log("Promise: Total Marks:", total);

    let percentage = calculatePercentage(total, 3);

    return percentage;

})

.then((percentage) => {

    console.log("Promise: Percentage:", percentage);

    let result = checkResult(percentage);

    return result;

})

.then((result) => {

    console.log("Promise: Final Result:", result);

})

.catch((error) => {

    console.log("Error:", error);

});