// document.addEventListener("DOMContentLoaded", async () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const jwt = localStorage.getItem("jwt");

//   const usernameEl = document.getElementById("username");
//   const emailEl = document.getElementById("email");
//   const bookListEl = document.getElementById("bookList");
//   const sortSelect = document.getElementById("sortSelect");
//   const userSection = document.getElementById("user-section");

//   // --- Om inte inloggad → redirect ---
//   if (!user || !jwt) {
//     window.location.href = "logIn.html";
//     return;
//   }

//   // Visa användarinfo
//   usernameEl.textContent = user.username;
//   emailEl.textContent = user.email;

//   // --- Navbar user section ---
//   function renderUserSection() {
//     userSection.innerHTML = `
//       <div class="dropdown">
//         <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
//           👤 ${user.username}
//         </button>
//         <ul class="dropdown-menu dropdown-menu-end">
//           <li><a class="dropdown-item" href="profile.html">Profil</a></li>
//           <li><hr class="dropdown-divider"></li>
//           <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logga ut</a></li>
//         </ul>
//       </div>
//     `;

//     document.getElementById("logoutBtn").addEventListener("click", () => {
//       localStorage.clear();
//       window.location.href = "logIn.html";
//     });
//   }
//   renderUserSection();

//   // --- Hämta reading list från Strapi ---
//   async function fetchReadingList() {
//       try {
//         const res = await fetch(
//           `http://localhost:1337/api/toreadlists?populate=book&filters[user][id][$eq]=${user.id}`,
//           { headers: { Authorization: `Bearer ${jwt}` } }
//         );

//         if (!res.ok) throw new Error("Fel vid hämtning från Strapi");

//         const data = await res.json();

//         return data.data.map(entry => ({
//           id: entry.id,
//           title: entry.attributes.book.data?.attributes?.titel || "Okänd titel",
//           author: entry.attributes.book.data?.attributes?.author || "Okänd författare"
//         }));

//       } catch (err) {
//         console.error("❌ Fel vid hämtning av reading list:", err);
//         return [];
//       }
//     }


//   // --- Rendera listan ---
//   async function renderList() {
//     const readingList = await fetchReadingList();

//     bookListEl.innerHTML = "";

//     readingList.forEach((book) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${book.title}</td>
//         <td>${book.author}</td>
//         <td>
//           <button class="btn btn-sm btn-danger remove-btn" data-id="${book.id}">
//             <i class="fa fa-trash"></i> Ta bort
//           </button>
//         </td>
//       `;
//       bookListEl.appendChild(row);
//     });

//     // --- Ta bort från Strapi ---
//     document.querySelectorAll(".remove-btn").forEach(btn => {
//       btn.addEventListener("click", async () => {
//         const id = btn.getAttribute("data-id");

//         try {
//           const res = await fetch(`http://localhost:1337/api/toreadlists/${id}`, {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${jwt}` }
//           });

//           if (!res.ok) throw new Error("Kunde inte ta bort boken från Strapi");

//           renderList(); // Uppdatera listan efter borttagning
//         } catch (err) {
//           console.error("❌ Fel vid borttagning:", err);
//           alert("Kunde inte ta bort bok från Strapi.");
//         }
//       });
//     });
//   }

//   // --- Sortering ---
//   sortSelect.addEventListener("change", async () => {
//     const readingList = await fetchReadingList();
//     const sortBy = sortSelect.value;
//     readingList.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

//     bookListEl.innerHTML = "";
//     readingList.forEach((book) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${book.title}</td>
//         <td>${book.author}</td>
//         <td>
//           <button class="btn btn-sm btn-danger remove-btn" data-id="${book.id}">
//             <i class="fa fa-trash"></i> Ta bort
//           </button>
//         </td>
//       `;
//       bookListEl.appendChild(row);
//     });
//   });

//   // Första render
//   renderList();
// });
  
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");

  // --- Om inte inloggad → redirect ---
  if (!user || !jwt) {
    window.location.href = "logIn.html";
    return;
  }

  // --- Navbar ---
  const userSection = document.getElementById("user-section");
  userSection.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
        👤 ${user.username}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li><a class="dropdown-item" href="profile.html">Profil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logga ut</a></li>
      </ul>
    </div>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "logIn.html";
  });

  const usernameEl = document.getElementById("username");
  const emailEl = document.getElementById("email");
  const bookListEl = document.getElementById("bookList");

  usernameEl.textContent = user.username;
  emailEl.textContent = user.email;

  function renderProfileList() {
    const readingList = JSON.parse(localStorage.getItem("readingList")) || [];
    bookListEl.innerHTML = '';

    readingList.forEach(book => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
          <button class="btn btn-sm btn-danger remove-btn" data-id="${book.id}">Ta bort</button>
        </td>
      `;
      bookListEl.appendChild(row);
    });

    // Ta bort-knappar
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const bookId = e.target.dataset.id;
        let readingList = JSON.parse(localStorage.getItem("readingList")) || [];
        readingList = readingList.filter(b => b.id !== bookId);
        localStorage.setItem("readingList", JSON.stringify(readingList));
        renderProfileList();

        // Ta även bort i Strapi
        try {
          const res = await axios.get(
            `http://localhost:1337/api/toreadlists?filters[user_permissions_user][id][$eq]=${user.id}&filters[book][id][$eq]=${bookId}`,
            { headers: { Authorization: `Bearer ${jwt}` } }
          );
          if (res.data.data.length > 0) {
            await axios.delete(`http://localhost:1337/api/toreadlists/${res.data.data[0].id}`, {
              headers: { Authorization: `Bearer ${jwt}` }
            });
          }
        } catch (err) {
          console.error("❌ Kunde inte ta bort bok i Strapi:", err);
        }
      });
    });
  }

  renderProfileList();
});
   