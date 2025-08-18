const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const projects = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  description: `This is the description of project ${i + 1}`
}));

app.get("/get-products", (req, res) => {
  let page = parseInt(req.query.page) || 1;  
  let limit = parseInt(req.query.limit) || 10; 

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  let result = projects.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: projects.length,
    data: result
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
