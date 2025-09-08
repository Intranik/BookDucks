// document.addEventListener("DOMContentLoaded", () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const jwt = localStorage.getItem("jwt");

//   // --- Om inte inloggad → redirect ---
//   if (!user || !jwt) {
//     window.location.href = "logIn.html";
//     return;
//   }

//   // --- Navbar ---
//   const userSection = document.getElementById("user-section");
//   userSection.innerHTML = `
//     <div class="dropdown">
//       <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
//         👤 ${user.username}
//       </button>
//       <ul class="dropdown-menu dropdown-menu-end">
//         <li><a class="dropdown-item" href="profile.html">Profil</a></li>
//         <li><hr class="dropdown-divider"></li>
//         <li><a class="dropdown-item text-danger" href="#" id="logoutBtn">Logga ut</a></li>
//       </ul>
//     </div>
//   `;
//   document.getElementById("logoutBtn").addEventListener("click", () => {
//     localStorage.clear();
//     window.location.href = "logIn.html";
//   });

//   const usernameEl = document.getElementById("username");
//   const emailEl = document.getElementById("email");
//   const bookListEl = document.getElementById("bookList");

//   usernameEl.textContent = user.username;
//   emailEl.textContent = user.email;

//   function renderProfileList() {
//     const readingList = JSON.parse(localStorage.getItem("readingList")) || [];
//     bookListEl.innerHTML = '';

//     readingList.forEach(book => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${book.title}</td>
//         <td>${book.author}</td>
//         <td>
//           <button class="btn btn-sm btn-danger remove-btn" data-id="${book.id}">Ta bort</button>
//         </td>
//       `;
//       bookListEl.appendChild(row);
//     });

//     // Ta bort-knappar
//     document.querySelectorAll(".remove-btn").forEach(btn => {
//       btn.addEventListener("click", async (e) => {
//         const bookId = e.target.dataset.id;
//         let readingList = JSON.parse(localStorage.getItem("readingList")) || [];
//         readingList = readingList.filter(b => b.id !== bookId);
//         localStorage.setItem("readingList", JSON.stringify(readingList));
//         renderProfileList();

//         // Ta även bort i Strapi
//         try {
//           const res = await axios.get(
//             `http://localhost:1337/api/toreadlists?filters[user_permissions_user][id][$eq]=${user.id}&filters[book][id][$eq]=${bookId}`,
//             { headers: { Authorization: `Bearer ${jwt}` } }
//           );
//           if (res.data.data.length > 0) {
//             await axios.delete(`http://localhost:1337/api/toreadlists/${res.data.data[0].id}`, {
//               headers: { Authorization: `Bearer ${jwt}` }
//             });
//           }
//         } catch (err) {
//           console.error("❌ Kunde inte ta bort bok i Strapi:", err);
//         }
//       });
//     });
//   }

//   renderProfileList();
// });



// let toReadLists = [];

// // Din JWT-token (hämta från localStorage eller sätt här för test)
// const jwt = localStorage.getItem("jwt"); // t.ex. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// async function fetchToreadlists() {
//   const url = "http://localhost:1337/api/toreadlists?populate=*";

//   try {
//     const res = await fetch(url, {
//       headers: {
//         "Authorization": `Bearer ${jwt}`,
//         "Content-Type": "application/json"
//       }
//     });

//     const data = await res.json();

//     if (res.ok) {
//       // Spara i array
//       toReadLists = data.data;
//       console.log("✅ Toreadlists med användare:", toReadLists);
//     } else {
//       console.error("❌ Fel vid hämtning:", data);
//     }
//   } catch (err) {
//     console.error("❌ Kunde inte hämta toreadlists:", err);
//   }
// }
// fetchToreadlists();


document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");
  const bookList = document.getElementById("bookList");
  const sortSelect = document.getElementById("sortSelect");

  if (!user || !jwt) {
    alert("Du måste logga in för att se din profil.");
    window.location.href = "logIn.html";
    return;
  }

  document.getElementById("username").textContent = user.username;
  document.getElementById("email").textContent = user.email;

  let toReadLists = [];

  // Hämta listan
  // async function fetchToReadLists() {
  //   try {
  //     const res = await fetch("http://localhost:1337/api/toreadlists?populate=*", {
  //       headers: {
  //         "Authorization": `Bearer ${jwt}`,
  //         "Content-Type": "application/json"
  //       }
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       // Filtrera för inloggad användare
  //       toReadLists = data.data;
  //       console.log(toReadLists);
        
  //       renderToReadList();
  //     } else {
  //       console.error("Fel vid hämtning:", data);
  //     }
  //   } catch (err) {
  //     console.error("Kunde inte hämta toreadlists:", err);
  //   }
  // }
  async function fetchToReadLists() {
    try {
      const url = "http://localhost:1337/api/toreadlists?populate=*";

      const res = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (res.ok) {
        // Filtrera för att endast visa de poster som tillhör den inloggade användaren
        toReadLists = data.data.filter(item => item.users_permissions_user.username === user.username);
        renderToReadList();
      } else {
        console.error("Fel vid hämtning:", data);
      }
    } catch (err) {
      console.error("Kunde inte hämta toreadlists:", err);
    }
  
  }
  // Rendera listan
  function renderToReadList() {
    bookList.innerHTML = "";

    toReadLists.forEach(item => {
      const book = item.book;
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${book.titel}</td>
        <td>${book.author}</td>
        <td>
          <button class="btn btn-danger btn-sm remove-btn" data-docid="${item.documentId}">Ta bort</button>
        </td>
      `;

      bookList.appendChild(tr);
    });

    // Lägg till event listeners för ta bort
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const docId = e.target.dataset.docid; // nu använder vi documentId
        if (!confirm("Vill du ta bort denna bok från din lista?")) return;

        try {
          const res = await fetch(`http://localhost:1337/api/toreadlists/${docId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${jwt}`,
              "Content-Type": "application/json"
            }
          });

          if (res.ok) {
            // Uppdatera listan lokalt
            toReadLists = toReadLists.filter(item => item.documentId !== docId);
            console.log(toReadLists);
            
            renderToReadList();
          } else {
            const data = await res.json();
            console.error("Fel från servern:", data);
            alert("Kunde inte ta bort boken.");
          }
        } catch (err) {
          console.error("Fel vid borttagning:", err);
          alert("Kunde inte ta bort boken.");
        }
      });
    });
  }

  // Sortering
  sortSelect.addEventListener("change", (e) => {
    const sortBy = e.target.value;
    toReadLists.sort((a, b) => {
      const bookA = a.book;
      const bookB = b.book;

      if (sortBy === "title") return bookA.titel.localeCompare(bookB.titel);
      if (sortBy === "author") return bookA.author.localeCompare(bookB.author);

      return 0;
    });
    renderToReadList();
  });

  // Starta
  fetchToReadLists();
});
