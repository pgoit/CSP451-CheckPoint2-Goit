/**
 * Login behavior — feature/user-authentication branch.
 * Adds client-side validation, UI feedback states, and a fetch
 * call to POST /api/auth/login.
 */
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const submitBtn = form.querySelector("button[type='submit']");

function setMessage(text, state) {
  message.textContent = text;
  message.dataset.state = state || "";
}

function clientValidate(email, password) {
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  if (!password) return "Password is required.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "Password must be at least " + MIN_PASSWORD_LENGTH + " characters.";
  }
  return null;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const error = clientValidate(email, password);
  if (error) {
    setMessage(error, "error");
    return;
  }

  setMessage("Signing in...", "loading");
  submitBtn.disabled = true;
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setMessage("Welcome, " + data.user.email + "!", "success");
    } else {
      setMessage(data.error || "Login failed.", "error");
    }
  } catch (err) {
    setMessage("Network error. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});
