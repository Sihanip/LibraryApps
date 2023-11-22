const saveBook = document.getElementById("saveBook");
const updateBook = document.getElementById("updateBook");
const searchBookForm = document.getElementById("searchBook");

// web storage requirement
const localStorageKey = "LibraryApp";
let LibraryApp = [];

// check browser support storage
const checkSupportedStorage = () => {
    return typeof Storage !== undefined;
};

if (checkSupportedStorage()) {
    if (localStorage.getItem(localStorageKey) === null) {
        LibraryApp = [];
    } else {
        LibraryApp = JSON.parse(localStorage.getItem(localStorageKey));
    }
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
}

// search book
const searchBook = (cari) => {
    const tampil = LibraryApp.filter(book => book.title.toLowerCase().includes(cari.toLowerCase()));
    renderBooks(tampil);
};

searchBookForm.addEventListener("submit", (e) => {
    const cari = document.getElementById("cariJudul").value;
    e.preventDefault();
    searchBook(cari);
});

// edit book
const editBook = (book, Obj) => {
    const index = LibraryApp.findIndex((buku) => buku.id === book.id);
    LibraryApp[index] = Obj;
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
    renderBooks(LibraryApp);
};

// add book to localStorage
const addBook = (Obj, localStorageKey) => {
    LibraryApp.push(Obj);
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
};

// delete book from localStorage
const deleteBook = (book) => {
    LibraryApp.splice(book, 1);
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
    renderBooks(LibraryApp);
};

// display book to html
const unReadId = "unRead";
const doneReadId = "doneRead";

const renderBooks = (LibraryApp) => {
    const books = LibraryApp;

    const listUnfinished = document.getElementById(unReadId);
    const listFinished = document.getElementById(doneReadId);

    listUnfinished.innerHTML = "";
    listFinished.innerHTML = "";

    for (let book of books.keys()) {
        const listGroupItem = document.createElement("article");
        listGroupItem.classList.add("card");

        // book detail
        const bookDetail = document.createElement("div");
        bookDetail.classList.add("card_body");

        // book detail child
        const bookTitle = document.createElement("h4");
        bookTitle.innerHTML = "Judul: " + books[book].title;

        const bookAuthor = document.createElement("p");
        bookAuthor.innerHTML = "Penulis: " + books[book].author;

        const bookYear = document.createElement("p");
        bookYear.innerHTML = "Tahun: " + books[book].year;

        bookDetail.append(bookTitle, bookAuthor, bookYear);
        // book detail child

        // book action
        const bookAction = document.createElement("div");
        bookAction.classList.add("btn_opsi");

        // book action child
        const buttonAction = document.createElement("button");

        const btnRead = document.createElement("button", "span");
        btnRead.innerHTML = "Sudah Dibaca";
        btnRead.classList.add("btn_unread");

        const btnUnRead = document.createElement("button", "span");
        btnUnRead.innerHTML = "Belum Dibaca";
        btnUnRead.classList.add("btn_read");

        const btnEdit = document.createElement("button", "span");
        btnEdit.innerHTML = "Edit";
        btnEdit.classList.add("btn_edit");

        const btnDelete = document.createElement("button", "span");
        btnDelete.innerHTML = "Hapus";
        btnDelete.classList.add("btn_delete");
        // book action child

        if (books[book].isComplete) {
            buttonAction.append(btnUnRead);
            buttonAction.addEventListener("click", () => {
                unfinishedRead(book);
            });
        } else {
            buttonAction.append(btnRead);
            buttonAction.addEventListener("click", () => {
                finishedRead(book);
            });
        }

        const buttonEdit = document.createElement("button");
        buttonEdit.classList.add("button-edit");
        buttonEdit.append(btnEdit);
        buttonEdit.addEventListener("click", () => {
          saveBook.style.display = "none";
          updateBook.style.display = "block";
          
    
          const title = document.getElementById("title");
          const author = document.getElementById("author");
          const year = document.getElementById("year");
          const isComplete = document.getElementById("isComplete");
    
          title.value = books[book].title;
          author.value = books[book].author;
          year.value = books[book].year;
          isComplete.checked = books[book].isComplete;
          
          updateBook.addEventListener("click", () => {
            updateBook.style.display = "none";
            saveBook.style.display = "block";
          
            const bookObj = {
              id: books[book].id,
              title: title.value,
              author: author.value,
              year: year.value,
              isComplete: isComplete.checked,
            };
            
            if (title.value && author.value && year.value) {
              editBook(books[book], bookObj);
            } 
    
            // clear all input value
            const inputs = document.querySelectorAll("input");
            inputs.forEach((input) => (input.value = ""));
            
            renderBooks(LibraryApp);
            
          });
        });

        const buttonDelete = document.createElement("button");
        buttonDelete.append(btnDelete);
        buttonDelete.addEventListener("click", () => {
            deleteBook(book);
        });

        bookAction.append(buttonAction, buttonDelete, buttonEdit);
        listGroupItem.append(bookDetail, bookAction);

        if (books[book].isComplete) {
            listFinished.append(listGroupItem);
        } else {
            listUnfinished.append(listGroupItem);
        }
    }
};

// move to doneRead
const finishedRead = (book) => {
    LibraryApp[book].isComplete = true;
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
    renderBooks(LibraryApp);
};

// move to unRead
const unfinishedRead = (book) => {
    LibraryApp[book].isComplete = false;
    localStorage.setItem(localStorageKey, JSON.stringify(LibraryApp));
    renderBooks(LibraryApp);
};

// button save book
saveBook.addEventListener("click", function () {
    const title = document.getElementById("title");
    const author = document.getElementById("author");
    const year = document.getElementById("year");
    const isComplete = document.getElementById("isComplete");

    // put to object
    let Obj = {
        id: +new Date(),
        title: title.value,
        author: author.value,
        year: year.value,
        isComplete: isComplete.checked,
    };

    // save data to localStorage
    addBook(Obj, localStorageKey);

    // clear all input value
    const inputField = document.querySelectorAll("input");
    inputField.forEach((input) => (input.value = ""));

    renderBooks(LibraryApp);
});

// show data in localStorage
window.addEventListener("load", function () {
    if (checkSupportedStorage) {
        renderBooks(LibraryApp);
    } else {
        alert("Browser tidak support web storage");
    }
});
