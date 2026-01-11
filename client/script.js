const fileInput = document.getElementById("file");
const fileText = document.getElementById("fileText");
const uploadBtn = document.getElementById("uploadBtn");
const spinner = document.getElementById("spinner");
const btnText = document.getElementById("btnText");
const resultBox = document.getElementById("result");

// Show selected file name
fileInput.addEventListener("change", () => {
  fileText.innerText = fileInput.files[0]
    ? fileInput.files[0].name
    : "Select File";
});

async function uploadFile() {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file");
    return;
  }

  // Loading state
  uploadBtn.disabled = true;
  spinner.style.display = "inline-block";
  btnText.innerText = "Uploading...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password.value);
  formData.append("expiry", expiry.value);

  try {
    const res = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    resultBox.innerHTML = `
      <strong>Shareable Link:</strong><br>
      <a id="shareLink" href="${data.link}" target="_blank">${data.link}</a>
      <br>
      <button class="copy-btn" onclick="copyLink()">Copy Link</button>
    `;
  } catch (err) {
    alert("Upload failed. Please try again.");
  }

  // Reset UI
  spinner.style.display = "none";
  btnText.innerText = "Upload & Generate Link";
  uploadBtn.disabled = false;
}

// Copy link
function copyLink() {
  const link = document.getElementById("shareLink").innerText;
  navigator.clipboard.writeText(link);
  alert("Link copied to clipboard!");
}
