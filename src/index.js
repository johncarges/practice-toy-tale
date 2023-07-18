let addToy = false;


// URLS
const baseUrl = "http://localhost:3000"
const toysUrl = baseUrl + "/toys"




document.addEventListener("DOMContentLoaded", () => {
  // Grabbing HTML elements from index.html
  const toyCollection = document.getElementById('toy-collection')
  const addToyForm = document.getElementById('add-toy-form')

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch(toysUrl)
  .then(r => r.json())
  .then((toys) => {
    console.log("attempting render")
    toys.forEach(renderToy)
  })
  .catch(err => console.log(err))


  // RENDER TOY
  function renderToy(toy) {
    //console.log(toy)
    /*
    a div with class = "card" which should have:
    h2 with toy's name
    img with src of toy's image attribute and class-name "toy-avatar"
    p tag with number of likes
    button tag with a class 'like-btn' and id set to toy's id number
    */
    const div = document.createElement('div')
    div.className = "card"

    const h2 = document.createElement('h2')
    h2.textContent = toy.name
    div.append(h2)

    const img = document.createElement('img')
    img.src = toy.image
    img.className = "toy-avatar"
    img.alt = `${toy.name}`
    div.append(img)

    const pLikes = document.createElement('p')
    pLikes.textContent = toy.likes
    div.append(pLikes)

    const likeButton = document.createElement('button')
    likeButton.className = 'like-btn'
    likeButton.id = toy.id
    likeButton.textContent = "like"
    const toyUrl = toysUrl + "/" +toy.id
    
    likeButton.addEventListener("click",  () => {
      console.log("I've been clicked!")
      console.log(toyUrl)
      addLike(toy, pLikes) // addLike function at bottom of the page

    })
    
    div.append(likeButton)



    toyCollection.append(div)
    return div
  }

  // ADD NEW TOY FROM FORM
  addToyForm.addEventListener("submit", e => {
    e.preventDefault()

    const toy = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    }

    const postConfig = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toy)
    }

    fetch(toysUrl, postConfig)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        console.log(response)
      }
    })
    .then((data) => {
      console.log("rendering new toy")
      renderToy(data)
    })

    

  })

  // *Like* a toy


});


// FETCH FUNCTIONS
function addLike(toy, pLikes) {
  
  toy.likes +=1
  let toyUrl = toysUrl + "/" + toy.id
  const patchConfig = {
    method: "PATCH",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      likes: toy.likes 
    })
  }
  fetch(toyUrl, patchConfig)
  .then(r=>r.json())
  .then((data) => {
    pLikes.textContent = data.likes
    console.log("successful patch")
  })
  console.log(toy.likes)

}