const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("client"));

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: uploadFolder,
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  }
});

const upload = multer({ storage });

const files = {}; // in-memory storage (enough for internship)

// Upload file
app.post("/upload", upload.single("file"), (req, res) => {
  const { password, expiry } = req.body;
  const id = Date.now().toString();

  files[id] = {
    filename: req.file.filename,
    original: req.file.originalname,
    password,
    expiry: expiry ? new Date(expiry) : null
  };

  res.json({ link: `/download/${id}` });
});

// Download file
app.get("/download/:id", (req, res) => {
  const file = files[req.params.id];
  if (!file) return res.send("Invalid or expired link");

  if (file.expiry && new Date() > file.expiry)
    return res.send("Link expired");

  if (file.password && req.query.password !== file.password)
    return res.send("Incorrect password");

  res.download(path.join(uploadFolder, file.filename), file.original);
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
