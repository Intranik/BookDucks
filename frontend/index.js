// const API_URL = 'http://localhost:1337/api/books?pagination[page]=1&pagination[pageSize]=10&sort=titel:asc&populate=*';

// document.addEventListener('DOMContentLoaded', () => {
//   fetchBooks();
// });

// async function fetchBooks() {
//   try {
//     const response = await fetch(API_URL);
//     const data = await response.json();
//     const books = data.data;

//     const bookList = document.getElementById('book-list');
//     bookList.innerHTML = ''; // töm innan

//     books.forEach(book => {
//       const { titel, forfattare, antal_sidor, utgivningsdatum, bokomslag } = book.attributes;

//       const imageUrl = bokomslag?.data?.attributes?.url 
//         ? `http://localhost:1337${bokomslag.data.attributes.url}` 
//         : 'https://via.placeholder.com/150';

//       const col = document.createElement('div');
//       col.className = 'col-md-4';

//       col.innerHTML = `
//         <div class="card mb-4 shadow-sm">
//           <img src="${imageUrl}" class="card-img-top" alt="Omslag för ${titel}">
//           <div class="card-body">
//             <h5 class="card-title">${titel}</h5>
//             <p class="card-text"><strong>Författare:</strong> ${forfattare}</p>
//             <p class="card-text"><strong>Sidor:</strong> ${antal_sidor}</p>
//             <p class="card-text"><strong>Utgivning:</strong> ${utgivningsdatum}</p>
//           </div>
//         </div>
//       `;
//       bookList.appendChild(col);
//     });
//   } catch (err) {
//     console.error('Fel vid hämtning av böcker:', err);
//   }
// }

