// async Node.js function to list all files (including files inside subfolders) from the current directory.

const fs = require("fs").promises;

async function listAllFiles() {
    try {
        // Read all items (files + folders) in current directory
        const files = await fs.readdir(__dirname, { withFileTypes: true });

        const fileList = [];

        for (const file of files) {
            if (file.isFile()) {
                // If item is a file, push its name
                fileList.push(file.name);
            } else if (file.isDirectory()) {
                // If item is a folder, read its contents
                const subFiles = await fs.readdir(`${__dirname}/${file.name}`, { withFileTypes: true });

                for (const subFile of subFiles) {
                    if (subFile.isFile()) {
                        // Add file name with folder prefix
                        fileList.push(`${file.name}/${subFile.name}`);
                    }
                }
            }
        }

        // Print final list of all files
        console.log(fileList);
    } catch (err) {
        console.log(err);
    }
}

listAllFiles();
