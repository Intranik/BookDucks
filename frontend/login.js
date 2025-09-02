document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.getElementById("user-section");

  // --- Rendera navbar beroende på login-status ---
  function renderUserSection() {
    if (!userSection) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      // Dropdown
      userSection.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-outline-dark dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            👤 ${user.username}
          </button>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-light" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="profile.html">📄 Profil</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">🚪 Logga ut</a></li>
          </ul>
        </div>
      `;

      document.getElementById("logoutBtn").addEventListener("click", () => {
        if (confirm("Vill du logga ut?")) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          renderUserSection();
          window.location.href = "logIn.html";
        }
      });

    } else {
      userSection.innerHTML = `<a href="logIn.html" class="btn btn-outline-dark">Logga in</a>`;
    }
  }

  renderUserSection();

  // --- REGISTER ---
  const registerForm = document.querySelector("#pills-register form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const registerUsername = document.getElementById("registerUsername").value;
      const registerEmail = document.getElementById("registerEmail").value;
      const registerPassword = document.getElementById("registerPassword").value;

      try {
        const response = await fetch("http://localhost:1337/api/auth/local/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword })
        });

        const result = await response.json();
        if (!response.ok) {
          alert("Fel vid registrering: " + JSON.stringify(result));
          return;
        }

        alert("Registrering lyckades! Du kan nu logga in.");
      } catch (error) {
        console.error("Fel vid registrering:", error);
        alert("Något gick fel vid registrering.");
      }
    });
  }

  // --- LOGIN ---
  const loginForm = document.querySelector("#pills-login form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const identifier = document.getElementById("loginName").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch("http://localhost:1337/api/auth/local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password })
        });

        const data = await response.json();
        if (!response.ok) {
          alert(data.error?.message || "Login failed.");
          return;
        }

        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        renderUserSection();
        window.location.href = "popular.html";
      } catch (error) {
        console.error("Fel vid login:", error);
        alert("Något gick fel vid inloggning.");
      }
    });
  }
});