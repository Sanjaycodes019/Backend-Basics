const express = require('express');
const app = express();

// Route: /blog/:year/:month/:slug
app.get('/blog/:year/:month/:slug', (req, res) => {
  const { year, month, slug } = req.params;

  // Month name mapping (01 → January, etc.)
  const monthNames = {
    '01': 'January', '02': 'February', '03': 'March', '04': 'April',
    '05': 'May', '06': 'June', '07': 'July', '08': 'August',
    '09': 'September', '10': 'October', '11': 'November', '12': 'December'
  };

  const monthName = monthNames[month];

  if (!monthName || year.length !== 4) {
    return res.status(400).send('Invalid year or month format');
  }

  res.send(`
    Viewing blog post: "${slug}"<br>
    Published: ${monthName}, ${year}
  `);
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
