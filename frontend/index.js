 // Funktion som hämtar och loggar data från Strapi
    function fetchBooksFromStrapi() {
      const apiUrl = 'http://localhost:1337/api/books?populate=*';

      axios.get(apiUrl)
        .then(res => {
          console.log('✅ Böcker från Strapi:', res.data);
        })
        .catch(err => {
          console.error('❌ Fel vid hämtning:', err);
        });
    }

    // Anropa funktionen
    fetchBooksFromStrapi();
