// TODO for next time :
// //finish refactoring renderFeaturedPost, this is why the app is breaking.

function onStart() {
    // GETs and Renders post list to DOM
    getPostList()
    getFeatured()
}

// ! Handle Functions
/**
 * Function called when the 'Write' button is clicked.
 * Causes the form with Quill bloc to appear. 
 */
function handleWriteBtn() {
    // Get the button and container that the form will be populated in 
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')
    const form = `<form onsubmit="handleNewPost(event)" class="mb-5">
    <label for="add-title" class="form-label">Blog Title</label>
    <input required type="text" class="form-control mb-5" id="add-title" placeholder="Enter Blog Title" name="add-title">
    <label for="editor" class="form-label">New Post</label>
    <div id="editor"></div>
    <p id="chars"></p>
    <button id="subbtn" type="submit" class="btn btn-outline-success">Post</button>
  </form>`
    if (writeMode === false) {
        // Toggles writeMode
        writeMode = true
        // Sets the container to the form
        container.innerHTML = form
        // Sets up button so it reads Cancel, and will pull up the modal
        // for cancelling
        btn.innerText = 'Cancel'
        btn.classList.remove('btn-outline-success')
        btn.classList.add('btn-outline-danger')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#exampleModal')
        // initializes the Quill editor
        quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: "Enter your thoughts . . . ☁️"
        });

        // Adds listener for edit to update a typecount. 
        quill.on('editor-change', handleNumberOfChars)
    }
}
// id names: 'chars', 'subbtn'
function handleNumberOfChars(event, source) {
    // console.log(event, source);
    // console.log(quillObj, containerId, btnId);

    let charCount = quill.getLength()
    console.log(charCount);
    const chars = document.getElementById('chars')
    const btn = document.getElementById('subbtn')
    chars.innerText = charCount
    if (charCount >= 1500) {
        chars.classList.add('red')
        btn.setAttribute('disabled', true)
    } else {
        chars.classList.remove('red')
        btn.removeAttribute('disabled')
    }
}
// TODO Make this and the other number of Chars one function
function handleNumberOfCharsEdit() {
    let charCount = editQuill.getLength()
    const pChar = document.getElementById('edit-char-count')
    pChar.innerText = charCount
    const btn = document.getElementById('update-btn')
    if (charCount >= 1500) {
        pChar.classList.add('red')
        btn.setAttribute('disabled', true)
    } else {
        pChar.classList.remove('red')
        btn.removeAttribute('disabled')
    }
}

function handleDiscardPost() {
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')
    if (writeMode === true) {
        writeMode = false
        container.innerHTML = ''
        btn.innerText = 'Write'
        btn.classList.remove('btn-outline-danger')
        btn.classList.add('btn-outline-success')
        btn.setAttribute('data-bs-toggle', '')
        btn.setAttribute('data-bs-target', '')
    }
}

function handleNewPost(event) {
    event.preventDefault()
    const nTitle = document.getElementById('add-title')
    const nBody = document.getElementById('editor')
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')

    // This gets the content of the editor with all its formatting information, both as raw HTML and as the Delta object so that I can use it to edit later.
    const content = quill.root.innerHTML
    const delta = quill.getContents()



    axios({
        method: "POST",
        url: '/blog',
        data: {
            title: nTitle.value,
            body: content,
            delta: delta
        }
    }).then((response) => {
        // console.log('successfully POSTed');
        nTitle.value = ''
        nBody.value = ''
        writeMode = false
        container.innerHTML = ''
        btn.innerText = 'Write'
        btn.classList.remove('btn-outline-danger')
        btn.classList.add('btn-outline-success')
        btn.setAttribute('data-bs-toggle', '')
        btn.setAttribute('data-bs-target', '')
        getPostList()
        getFeatured()
    }).catch((err) => {
        console.log(err);
        alert('Your post is too long, sorry!')
    })
}

function handleShowPost(id) {
    // console.log('in show post', id);
    axios({
        method: "GET",
        url: `/blog/now/${id}`
    }).then((response) => {
        const showing = document.getElementById('showing')
        const container = document.getElementById('current-post')
        const post = response.data[0]
        const deleteBtn = document.getElementById('delete-btn')
        showing.innerText = post.updated_at
        container.innerHTML = `
        <h2 id="current-post-title">${post.title}</h2>
        <p id="current-post-body">${post.body}</p>
        `
        currentPost = post
        deleteBtn.addEventListener("click", handleDelete)
        deleteBtn.param = post.id
    }).catch((err) => {
        console.log(err);
    })
}

function handleDelete(event) {
    // console.log('in handleDelete', event.target.param);
    axios({
        method: "DELETE",
        url: `/blog/${event.target.param}`
    }).then((response) => {
        getFeatured()
        getPostList()
    })
}

function handleEdit() {
    // This set the contents of the editor, and has to be parse from when it comes back from the DB
    editQuill.setContents(JSON.parse(currentPost.delta).ops)
    editQuill.on('text-change', handleNumberOfCharsEdit)

    const editTitle = document.getElementById('edit-title')
    editTitle.value = currentPost.title

    const updateBtn = document.getElementById('update-btn')
    updateBtn.addEventListener('click', handleUpdate)
    updateBtn.param = currentPost.id
}

function handleUpdate(event) {
    // console.log('in handUpdate,', event.target.id);
    const nTitle = document.getElementById('edit-title')
    // const nBody = document.getElementById('blog-body-edit')
    const nContent = editQuill.getContents()
    const nBody = document.getElementById('edit-editor')

    axios({
        method: "PUT",
        url: `/blog/${event.target.param}`,
        data: {
            title: nTitle.value,
            body: editQuill.root.innerHTML,
            delta: nContent
        }
    }).then((response) => {
        handleShowPost(event.target.param)
        getPostList()
    }).catch((err) => {
        console.log(err);
    })

}

// ! State
let writeMode = false
let currentPost
let quill
let editQuill = new Quill('#edit-editor', {
    theme: 'snow'
})

onStart()


