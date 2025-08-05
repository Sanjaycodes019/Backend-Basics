// const fs = require('fs').promises;

// async function copy() {
//   try {
//     const data1 = await fs.readFile('./file.txt', 'utf-8');
//     const data2 = await fs.readFile('./greet.txt', 'utf-8');

//     await fs.writeFile('third.txt', data1 + '\n' + data2);

//     console.log('Files copied successfully into third.txt');
//   } catch (error) {
//     console.log('Error:', error);
//   }
// }
// copy();

const fs = require('fs').promises;

async function appendtofile(){
  try{

    await fs.writeFile('file1.txt', 'hi there, im learning fs module ');
    await fs.writeFile('file2.txt', '\nits very easy!');
    const data1 = await fs.readFile('file1.txt', 'utf8')
    const data2 = await fs.readFile('file2.txt', 'utf8')

    await fs.writeFile('thirdfile.txt', data1+data2)
    console.log('file copied sucessfully')
  } catch(error){
    console.log("error: ", error);
  }
}
appendtofile();