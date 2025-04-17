// auth.js - Handles registration and login functionality

// Form validation patterns
const patterns = {
  name: /^[a-zA-Z\s]{2,30}$/,
  mobile: /^[6-9]\d{9}$/, // Indian mobile number format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  vehicleNumber: /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, // Format: KA01AB1234
  password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, // Min 8 chars, at least one letter, one number, one special char
};

// Validate a field based on pattern
function validateField(field, pattern, errorElement) {
  if (!pattern.test(field.value)) {
    errorElement.style.display = "block";
    field.classList.add("error");
    return false;
  } else {
    errorElement.style.display = "none";
    field.classList.remove("error");
    return true;
  }
}

// Display error message
function showError(message, containerElement) {
  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  // Clear any existing error messages
  const existingErrors = containerElement.querySelectorAll(".error-message");
  existingErrors.forEach((el) => el.remove());

  containerElement.prepend(errorElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}

// Registration form handling
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registerForm");

  if (registrationForm) {
    // Password strength indicator
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    // const strengthMeter = document.querySelector('.password-strength-meter');
    // const strengthText = document.querySelector('.password-feedback');

    // passwordInput.addEventListener('input', function() {
    //     const password = this.value;
    //     let strength = 0;

    //     // Check password strength
    //     if (password.length >= 8) strength += 1;
    //     if (password.match(/[a-z]+/) && password.match(/[A-Z]+/)) strength += 1;
    //     if (password.match(/[0-9]+/)) strength += 1;
    //     if (password.match(/[^a-zA-Z0-9]+/)) strength += 1;

    //     // Update strength meter
    //     switch (strength) {
    //         case 0:
    //             strengthMeter.class = 'password-strength-meter';
    //             strengthText.textContent = '';
    //             break;
    //         case 1:
    //             strengthMeter.class = 'password-strength-meter strength-weak';
    //             strengthText.textContent = 'Weak password';
    //             break;
    //         case 2:
    //         case 3:
    //             strengthMeter.class = 'password-strength-meter strength-medium';
    //             strengthText.textContent = 'Medium strength password';
    //             break;
    //         case 4:
    //             strengthMeter.class = 'password-strength-meter strength-strong';
    //             strengthText.textContent = 'Strong password';
    //             break;
    //     }
    // });

    // Toggle password visibility
    const togglePassword = document.querySelector(".toggle-icon");
    if (togglePassword) {
      togglePassword.addEventListener("click", function () {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);

        // Toggle icon
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
      });
    }

    // Form submission
    registrationForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("Form submitted");
      // Get form fields
      const nameField = document.getElementById("name");
      const mobileField = document.getElementById("mobile");
      const emailField = document.getElementById("email");
      const vehicleField = document.getElementById("vehicle");
      const passwordField = document.getElementById("password");
      const confirmPasswordField = document.getElementById("confirmPassword");
      const roleField = document.querySelector('#role');
      const termsCheckbox = document.getElementById("terms");
      const formData = {
        name: nameField.value,
        mobile: mobileField.value,
        email: emailField.value,
        vehicleNumber: vehicleField.value.toUpperCase(),
        role: roleField.value,
        password: passwordField.value,
      };

      console.log(formData);
      // Get error elements (assuming they exist in the HTML)
      const nameError = document.getElementById("nameError") || { style: {} };
      const mobileError = document.getElementById("mobileError") || {
        style: {},
      };
      const emailError = document.getElementById("emailError") || { style: {} };
      const vehicleError = document.getElementById("vehicleError") || {
        style: {},
      };
      const passwordError = document.getElementById("passwordError") || {
        style: {},
      };
      const confirmError = document.getElementById("confirmError") || {
        style: {},
      };
      const roleError = document.getElementById("roleError") || { style: {} };
      const termsError = document.getElementById("termsError") || { style: {} };

      // Validate all fields
      let isValid = true;

      // Name validation
      if (!validateField(nameField, patterns.name, nameError)) {
        isValid = false;
      }

      // Mobile validation
      if (!validateField(mobileField, patterns.mobile, mobileError)) {
        isValid = false;
      }

      // Email validation
      if (!validateField(emailField, patterns.email, emailError)) {
        isValid = false;
      }

      // Vehicle number validation
      if (!validateField(vehicleField, patterns.vehicleNumber, vehicleError)) {
        isValid = false;
      }

      // Password validation
      if (!validateField(passwordField, patterns.password, passwordError)) {
        isValid = false;
      }

      // Confirm password
      if (passwordField.value !== confirmPasswordField.value) {
        confirmError.style.display = "block";
        confirmPasswordField.classList.add("error");
        isValid = false;
      } else {
        confirmError.style.display = "none";
        confirmPasswordField.classList.remove("error");
      }

      // Role validation
      if (!roleField) {
        roleError.style.display = "block";
        isValid = false;
      } else {
        roleError.style.display = "none";
      }

      // Terms checkbox
      if (!termsCheckbox.checked) {
        termsError.style.display = "block";
        isValid = false;
      } else {
        termsError.style.display = "none";
      }

      if (!isValid) {
        return;
      }

      // Prepare data for sending
      // const formData = {
      //   name: nameField.value,
      //   mobile: mobileField.value,
      //   email: emailField.value,
      //   vehicleNumber: vehicleField.value.toUpperCase(),
      //   role: roleField.value,
      //   password: passwordField.value,
      // };

      console.log(formData);

      try {
        // Send registration request
        const response = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Registration successful
          alert("Registration successful! You can now login.");
          window.location.href = "login.html";
        } else {
          // Registration failed
          showError(
            data.message || "Registration failed. Please try again.",
            registrationForm
          );
        }
      } catch (error) {
        console.error("Error:", error);
        showError(
          "An error occurred during registration. Please try again.",
          registrationForm
        );
      }
    });
  }

  // Login form handling
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    // Toggle password visibility
    const passwordInput = document.getElementById("password");
    const togglePassword = document.querySelector(".toggle-icon");

    if (togglePassword) {
      togglePassword.addEventListener("click", function () {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);

        // Toggle icon
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
      });
    }

    // Form submission
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get login credentials
      const mobileField = document.getElementById("mobile");
      const passwordField = document.getElementById("password");
      const rememberMe =
        document.getElementById("rememberMe")?.checked || false;

      // Basic validation
      if (!mobileField.value || !passwordField.value) {
        showError("Please enter both mobile number and password.", loginForm);
        return;
      }

      const credentials = {
        mobile: mobileField.value,
        password: passwordField.value,
      };

      console.log(credentials);

      try {
        // Send login request
        const response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userData", JSON.stringify(data.user));

          // Redirect to dashboard
          window.location.href = "dashboard.html";
        } else {
          // Login failed
          showError(
            data.message || "Login failed. Please check your credentials.",
            loginForm
          );
        }
      } catch (error) {
        console.error("Error:", error);
        showError(
          "An error occurred during login. Please try again.",
          loginForm
        );
      }
    });
  }

  // Check if already logged in
  function checkAuthStatus() {
    const authToken = localStorage.getItem("authToken");

    // Check if we're on a page that requires login
    const requiresAuth = [
      "dashboard.html",
      "profile.html",
      "booking.html",
    ].some((page) => window.location.href.includes(page));

    // Check if we're on authentication pages
    const isAuthPage = ["login.html", "register.html"].some((page) =>
      window.location.href.includes(page)
    );

    if (authToken && isAuthPage) {
      // Already logged in, redirect to dashboard
      window.location.href = "dashboard.html";
    } else if (!authToken && requiresAuth) {
      // Not logged in but on a protected page, redirect to login
      window.location.href = "login.html";
    }
  }

  // Run auth check
  checkAuthStatus();
});

// abhi add kiya hai//
// document.getElementById("loginForm").addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const mobile = document.getElementById("mobile").value;
//   const password = document.getElementById("password").value;

//   const res = await fetch("http://localhost:5000/api/users/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ mobile, password }),
//   });

//   const data = await res.json();

//   if (data.success) {
//     // Save user info in localStorage
//     localStorage.setItem("user", JSON.stringify(data.user));
//     window.location.href = "dashboard.html";
//   } else {
//     alert("Login failed!");
//   }
// });
