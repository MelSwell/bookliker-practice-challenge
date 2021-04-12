document.addEventListener("DOMContentLoaded", function() {
  const booksUrl = 'http://localhost:3000/books'
  const myUserData = {id: 1, username: "Pouros"}
  
  const fetchBookTitles = () => {
    
    const renderBookTitleInList = bookObj => {
      const bookListItem = document.createElement("li")
      bookListItem.dataset.id = bookObj.id
      bookListItem.textContent = bookObj.title
      const bookTitleList = document.getElementById("list")
      bookTitleList.append(bookListItem)
      bookListItem.addEventListener("click", fetchBookDetailsAndRender)
    }
    
    fetch(booksUrl)
    .then(resp => resp.json())
    .then(arrOfBooks => arrOfBooks.forEach(book => {
      renderBookTitleInList(book)
    }))
  }  
  
  fetchBookTitles()
  
  const fetchBookDetailsAndRender = event => {
    const showBookDiv = document.getElementById("show-panel")
    
    const renderUsersInBookDetails = bookObj => {
      const usersList = showBookDiv.querySelector("ul")
      bookObj.users.forEach(user => {
        const userNameListItem = document.createElement("li")
        userNameListItem.textContent = user.username
        usersList.append(userNameListItem)
      })
    }

    const renderBookDetails = bookObj => {
      showBookDiv.innerHTML = `
      <img src=${bookObj.img_url}>
      <h5>${bookObj.title}</h5>
      <h5>${bookObj.subtitle}</h5>
      <h5>${bookObj.author}</h5>
      <p>${bookObj.description}</p>
      <ul class="users-list"></ul>
      <button>LIKE</button>
      ` 
      
      renderUsersInBookDetails(bookObj)
      
      const likeBtn = showBookDiv.querySelector("button")
      likeBtn.dataset.id = bookObj.id
      likeBtn.addEventListener("click", event => {
        updateData = [...bookObj.users, myUserData]
        
        fetch(booksUrl + `/${event.target.dataset.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({users: updateData})
        })
        .then(resp => resp.json())
        .then(renderBookDetails)
      })
    }
   
    fetch(booksUrl + `/${event.target.dataset.id}`)
    .then(resp => resp.json())
    .then(renderBookDetails)
  
  }
  
});
