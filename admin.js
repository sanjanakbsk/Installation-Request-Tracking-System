if (window.location.pathname.includes('tracking.html')) {
  const tbody = document.querySelector('#requestTable tbody');
  let requests = [];

  function renderTable(filteredRequests) {
    tbody.innerHTML = '';
    filteredRequests.forEach(req => {
      const row = `
        <tr>
          <td>${req.software}</td>
          <td>${req.version}</td>
          <td>${req.os}</td>
          <td>${req.department}</td>
          <td>${req.team}</td>
          <td>${req.status}</td>
          <td>${new Date(req.date).toLocaleString()}</td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }

  // Fetch requests from backend instead of localStorage
  fetch('http://localhost:5000/requests')
    .then(res => res.json())
    .then(data => {
      requests = data;
      renderTable(requests);
    })
    .catch(err => {
      console.error('Error fetching requests:', err);
      tbody.innerHTML = '<tr><td colspan="7">Failed to load requests.</td></tr>';
    });

  document.getElementById('searchInput')?.addEventListener('input', function () {
    const val = this.value.toLowerCase();
    const filtered = requests.filter(req =>
      req.staffCode.toLowerCase().includes(val) ||
      req.team.toLowerCase().includes(val) ||
      req.department.toLowerCase().includes(val)
    );
    renderTable(filtered);
  });
}
