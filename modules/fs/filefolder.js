const fs = require('fs');

// fs.mkdir('file2.txt', (err)=>{
//     if(!err){
//         console.log("file created");
//     }
// })

fs.mkdir('./sectionE/E1', { recursive: true }, (err) => {
  if (err) {
    console.log('Error creating folder:', err);
  } else {
    console.log('E1 folder created inside sectionE');
  }
});
