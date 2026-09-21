const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter filename: ", function(filename) {

    rl.question("Enter initial content: ", function(content) {

        // 1. Create and write the file
        fs.writeFile(filename, content, function(err) {

            if (err) {
                console.log("Error:", err);
                rl.close();
                return;
            }

            console.log("\nFile created and written successfully.");

            // 2. Read the file
            fs.readFile(filename, "utf8", function(err, data) {

                if (err) {
                    console.log("Error:", err);
                    rl.close();
                    return;
                }

                console.log("\nFile content:");
                console.log(data);

                rl.question("\nEnter additional content: ", function(additionalContent) {

                    // 3. Append content
                    fs.appendFile(
                        filename,
                        "\n" + additionalContent,
                        function(err) {

                            if (err) {
                                console.log("Error:", err);
                                rl.close();
                                return;
                            }

                            console.log("\nContent appended successfully.");

                            // 4. Read and display final content
                            fs.readFile(
                                filename,
                                "utf8",
                                function(err, finalContent) {

                                    if (err) {
                                        console.log("Error:", err);
                                        rl.close();
                                        return;
                                    }

                                    console.log("\nFinal file content:");
                                    console.log(finalContent);

                                    rl.close();
                                }
                            );
                        }
                    );
                });
            });
        });
    });
});