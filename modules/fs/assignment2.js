// // async code
// const fs = require('fs');
// fs.readFile('greet.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   fs.readFile('file.txt', 'utf-8', (err, data2) => {
//     if (err) {
//       console.log(err);
//       return;
//     }

//     const finalContent = data1 + '\n' + data2;

//     fs.writeFile('thirdfile.txt', finalContent, (err) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log('Copy successful!');
//       }
//     });
//   });
// });


const fs = require('fs');
fs.writeFileSync('greet.txt', 'hi there, im learning fs module ');
fs.writeFileSync('file.txt', '\nits very easy!');

fs.readFile('greet.txt', 'utf-8', (err, data1) => {
  if (err) return console.error("Error reading greet.txt:", err);

  fs.readFile('file.txt', 'utf-8', (err, data2) => {
    if (err) return console.error("Error reading file.txt:", err);

    const finalContent = data1 + data2;

    fs.writeFile('thirdfile.txt', finalContent, (err) => {
      if (err) return console.error("Error writing thirdfile.txt:", err);
      console.log('Copy successful!');
    });
  });
});
