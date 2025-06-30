document.getElementById('requestForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const request = {
    software: 'MATLAB',
    version: this.version.value,
    staffCode: this.staffCode.value,
    contact: this.contact.value,
    ip: this.ip.value,
    os: this.os.value,
    department: this.department.value,
    team: this.team.value,
    message: this.message.value || ''
  };

  fetch('http://localhost:5000/requests', {  // Adjust URL if needed
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    window.location.href = 'tracking.html';
  })
  .catch(err => {
    console.error('Error:', err);
    alert('Failed to submit request');
  });
});
