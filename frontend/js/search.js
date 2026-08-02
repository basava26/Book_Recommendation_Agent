async function searchBooks() {

    const query =
        document.getElementById("searchBox").value;

    const response =
        await fetch(
            `http://127.0.0.1:8000/books/search?query=${query}`
        );

    const data =
        await response.json();

    showBooks(data.items);
}

function showBooks(items){

    const div =
        document.getElementById("results");

    div.innerHTML="";

    items.forEach(book=>{

        const info =
            book.volumeInfo;

        const image =
            info.imageLinks?.thumbnail || "";

        div.innerHTML += `

        <div class="card">

            <img src="${image}">

            <h3>${info.title}</h3>

            <p>${info.authors || ""}</p>

            <button>

                Details

            </button>

        </div>

        `;

    });

}