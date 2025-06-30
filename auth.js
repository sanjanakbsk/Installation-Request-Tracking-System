// User Registration
document.getElementById('userRegisterForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = this.name.value;
    const staffCode = this.staffCode.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
  
    if (users.some(user => user.email === email)) {
      alert("Email already registered.");
      return;
    }
  
    users.push({ name, staffCode, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful!");
    window.location.href = "login.html";
  });
  
  // User Login
  document.getElementById('userLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = this.email.value;
    const password = this.password.value;
  
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);
  
    if (!user) {
      alert("Invalid login credentials.");
      return;
    }
  
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    window.location.href = "dashboard.html";
  });
  
  // Admin Login (hardcoded)
  document.getElementById('adminLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
  
    const adminId = this.adminId.value;
    const adminPassword = this.adminPassword.value;
  
    if (adminId === "admin" && adminPassword === "admin123") {
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid admin credentials.");
    }
  });
if (window.location.pathname.includes('admin/login.html')) {
  document.getElementById('adminLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const adminId = this.adminId.value.trim();
    const adminPassword = this.adminPassword.value.trim();

    const predefinedAdmins = [
      { id: "admin", password: "admin123" }
    ];

    const isValid = predefinedAdmins.some(
      admin => admin.id === adminId && admin.password === adminPassword
    );

    if (isValid) {
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}

  