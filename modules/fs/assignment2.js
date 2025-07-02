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

fs.readFile('greet.txt', 'utf-8', (err, data1) => {
  fs.readFile('file.txt', 'utf-8', (err, data2) => {
    const finalContent = data1 + '\n' + data2;

    fs.writeFile('thirdfile.txt', finalContent, (err) => {
      console.log('Copy successful!');
    });
  });
});
