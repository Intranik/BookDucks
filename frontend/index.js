 let booksData = [];

async function fetchBooksFromStrapi() {
  const apiUrl = 'http://localhost:1337/api/books?populate=*';

  try {
    const res = await axios.get(apiUrl);
    booksData = res.data.data;
    console.log('✅ Hämtade böcker:', booksData);
    renderBooks();
  } catch (err) {
    console.error('❌ Fel vid hämtning:', err);
  }
}

// let toreadlistData = []; // Global array

// async function fetchToreadlist() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const jwt = localStorage.getItem("jwt");

//   if (!user || !jwt) {
//     console.log("⚠️ Du måste vara inloggad för att se toreadlist.");
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:1337/api/toreadlists?populate[users_permissions_user]=*&populate[book]=*", {
//       headers: {
//         "Authorization": `Bearer ${jwt}`
//       }
//     });
//     const data = await res.json();
//     console.log(data);
//     // Spara i array
//     toreadlistData = result.data || [];

//     // Logga arrayen
//     console.log("Toreadlist för inloggad användare:", toreadlistData);
//   } catch (err) {
//     console.error("❌ Fel vid hämtning av toreadlist:", err);
//   }
// }

// // Kör funktionen
// fetchToreadlist();

// Array för att spara toreadlists
let toReadLists = [];

// Din JWT-token (hämta från localStorage eller sätt här för test)
const jwt = localStorage.getItem("jwt"); // t.ex. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

async function fetchToreadlists() {
  const url = "http://localhost:1337/api/toreadlists?populate[user][fields][0]=id&populate[user][fields][1]=username&populate[user][fields][2]=email";

  try {
    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (res.ok) {
      // Spara i array
      toReadLists = data.data;
      console.log("✅ Toreadlists med användare:", toReadLists);
    } else {
      console.error("❌ Fel vid hämtning:", data);
    }
  } catch (err) {
    console.error("❌ Kunde inte hämta toreadlists:", err);
  }
}

// Kör funktionen
fetchToreadlists();




function renderBooks() {
  const bookList = document.getElementById('book-container');
  bookList.innerHTML = '';

  const user = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");

  booksData.forEach(book => {
    if (!book) {
      console.warn('⚠️ Saknar bok:', book);
      return;
    }

    const { id, titel, author, pages, Rating ,cover } = book;

    // Bild-url (anpassa om du har media-url från Strapi)
    let imageUrl = '';
    if (cover && cover.url) {
      imageUrl = 'http://localhost:1337' + cover.url;
    }

    const card = document.createElement('div');
    card.className = 'col-md-4';

    // Visa knappen endast om användaren är inloggad
    const addButton = user ? `<button class="btn btn-primary add-to-list-btn mt-2" data-id="${id}">Add to My List</button>` : '';

    card.innerHTML = `
      <div class="card md-4 shadow-sm" style="width: 18rem;">
        ${imageUrl ? `<img src="${imageUrl}" class="card-img-top" alt="${titel}" style="height: 500px;">` : ''}
        <div class="card-body">
          <h5 class="card-title">${titel}</h5>
          <p class="card-text">${pages || 'Ingen beskrivning.'}</p> 
          <p class="card-text"><strong>Author:</strong> ${author || 'Okänd'}</p>
          <p class="card-text"><strong>Rating:</strong> ${Rating}</p>
          ${addButton}
        </div>
      </div>
    `;

    bookList.appendChild(card);
  });

  // Event listener för knapparna
  document.querySelectorAll('.add-to-list-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
  const bookId = e.target.dataset.id;

  if (!jwt || !user) {
    alert("Du måste logga in för att spara böcker.");
    return;
  }

  try {
    // Kolla först om boken redan finns i listan
    const existing = await axios.get(
     `http://localhost:1337/api/toreadlists?filters[users_permissions_user][id][$eq]=${user.id}&filters[book][id][$eq]=${bookId}`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    if (existing.data.data.length > 0) {
      return alert("⚠️ Boken finns redan i din lista!");
    }

    // Lägg till i Strapi
     await axios.post("http://localhost:1337/api/toreadlists",
    {
      data: {
        users_permissions_user: user.id,  // rätt namn på relationen
        book: bookId                      // relation till boken
      }
    },
    { headers: { Authorization: `Bearer ${jwt}` } }
    );


    alert("📚 Bok sparad i din lista!");
  } catch (err) {
    console.error("❌ Kunde inte spara bok:", err.response?.data || err);
    alert("Fel vid sparande.");
  }
});
  });
}



fetchBooksFromStrapi();


