console.log('work')
const $wr = document.querySelector('[data-wr]')
const $openModalBtn = document.querySelector('[data-open_modal]')
const $modalsWr = document.querySelector('[data-modals_wr]')
const $closeModalBtn = document.querySelector('[data-close_modal]')

// baseUrl = 'http://sb-cats.herokuapp.com/api/2/dinarkhusainov'

class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  async getAllCats() {
    try {
      const response = await fetch(`${this.baseUrl}/show`)
      return response.json()
    } catch (error) {
      throw new Error(error)
    }
  }

  async deleteCat(catId) {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${catId}`, {
        method: 'DELETE',
      })
      if (response.status !== 200) {
        throw new Error()
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addCat(data) {
    try {
      const response = await fetch(`${this.baseUrl}/add`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.status !== 200) {
        throw new Error()
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

const generateHTMLTemplateForCat = (cat) => `<div data-card_id=${cat.id} class="col-6 card mb-2" style="width: rem";>
  <img src="${cat.img_link}" class = "card-img-top mt-2" alt="${cat.name}">
  <div class="card-body">
  <h5 class="card-title">${cat.name}</h5>
  <p class="card-text">${cat.description}</p>
  <button data-action="show" class="btn btn-primary">Show</button>
  <button data-action="delete" class="btn btn-danger">Delete</button>
  </div>
</div>`
const api = new API('http://sb-cats.herokuapp.com/api/2/dinarkhusainov')

api.getAllCats().then((responseFromBackend) => {
  responseFromBackend.data.forEach((cat) => $wr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCat(cat)))
}).catch(() => {

})

$wr.addEventListener('click', (event) => {
  console.log(event.target.dataset.action)

  console.dir(event.target)

  switch (event.target.dataset.action) {
    case 'delete': {
      console.log('some action for deleting')
      const $cardWr = event.target.closest('[data-card_id]')
      const catId = $cardWr.dataset.card_id

      console.log($cardWr, catId)

      api.deleteCat(catId).then(() => {
        $cardWr.remove()
      }).catch(alert)

      break
    }
    default:
      break
  }
})

document.forms.add_cat.addEventListener('submit', (event) => {
  event.preventDefault()

  const data = Object.fromEntries(new FormData(event.target).entries())

  data.id = +data.id
  data.rate = +data.rate
  data.favorite = data.favorite === 'on'

  api.addCat(data).then(() => {
    $wr.insertAdjacentHTML('beforeend', generateHTMLTemplateForCat(data))
    $modalsWr.classList.add('hidden')
    event.target.reset()
  }).catch(alert)
})

$openModalBtn.addEventListener('click', () => {
  $modalsWr.classList.remove('hidden')
})

$closeModalBtn.addEventListener('click', () => {
  $modalsWr.classList.add('hidden')
})
