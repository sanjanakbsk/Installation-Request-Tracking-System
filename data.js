// Placeholder for centralized data fetching or backend API simulation
export function getInstallationRequests() {
    return JSON.parse(localStorage.getItem('installationRequests')) || [];
  }
  
  export function saveInstallationRequest(request) {
    const requests = getInstallationRequests();
    requests.push(request);
    localStorage.setItem('installationRequests', JSON.stringify(requests));
  }
  