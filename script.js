const shareBtn = document.getElementById('shareBtn');
const counterText = document.getElementById('counter');
const form = document.getElementById('registrationForm');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

let clickCount = 0;

// Check localStorage for previous submission
if (localStorage.getItem('submitted')) {
  disableForm();
}

shareBtn.addEventListener('click', () => {
  if (clickCount < 5) {
    clickCount++;
    counterText.textContent = `Click count: ${clickCount}/5`;
    let msg = encodeURIComponent("Hey Buddy, Join Tech For Girls Community!");
    window.open(`https://wa.me/?text=${msg}`, '_blank');

    if (clickCount === 5) {
      counterText.textContent = "Sharing complete. Please continue.";
    }
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (clickCount < 5) {
    alert("Please complete the sharing (5/5) before submitting.");
    return;
  }

  // Get form values
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const college = document.getElementById('college').value;
  const file = document.getElementById('screenshot').files[0];

  if (!file) {
    alert("Please upload a screenshot.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = function() {
    const fileData = reader.result; // base64 string

    // Send data to Google Apps Script Web App URL
    fetch('https://script.google.com/macros/s/AKfycbw0KwYzhTwsn8WO607P-KP_3zO-Yg49g9JsImxvSuw9S-F-CPXHEcRCQ74ua5rOYvzVkQ/exec', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        phone: phone,
        email: email,
        college: college,
        screenshot: fileData
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.text())
    .then(data => {
      messageEl.textContent = "🎉 Your submission has been recorded. Thanks for being part of Tech for Girls!";
      disableForm();
      localStorage.setItem('submitted', 'true');
    })
    .catch(err => {
      alert("Error submitting. Please try again.");
      console.log(err);
    });
  };
  reader.readAsDataURL(file);
});

function disableForm() {
  document.querySelectorAll("input, button").forEach(el => el.disabled = true);
}
