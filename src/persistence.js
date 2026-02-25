import fs from 'fs';
let saveScheduled = false;

function bufferedSave(data) {
    if (saveScheduled) return;

    saveScheduled = true;

    setTimeout(() => {
        fs.writeFileSync(
            "./storage.json",
            JSON.stringify(data, null, 2)
        );
        console.log("Data saved to storage.json");
        saveScheduled = false;
    }, 3000); // Save after 3 second
}

export default bufferedSave;