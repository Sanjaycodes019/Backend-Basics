const fs = require('fs').promises;

async function copy() {
  try {
    const data1 = await fs.readFile('./file.txt', 'utf-8');
    const data2 = await fs.readFile('./greet.txt', 'utf-8');

    await fs.writeFile('third.txt', data1 + '\n' + data2);

    console.log('Files copied successfully!');
  } catch (error) {
    console.log(error);
  }
}

copy();
