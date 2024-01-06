// TODO for next time :
// //finish refactoring renderFeaturedPost, this is why the app is breaking.
// refactor handleCharCount for disabling buttons

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
    <p id="char-count-container"></p>
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

        // Handles the updating of the char count in the editor. 
        handleNumberOfChars(quill, 'char-count-container', 'subbtn')
    }
}
/**
 * Tracks the number of characters to keep it within bounds. 
 * @param {object} quillObj the Quill editor object
 * @param {string} containerId id of a container for the charcount to go.
 * @param {string} btnId id of the button that should disable if there are too many characters.
 */
function handleNumberOfChars(quillObj, containerId, btnId) {
    quillObj.on('editor-change', () => {
        let charCount = quillObj.getLength()
        const container = document.getElementById(containerId)
        container.innerText = charCount
        if (charCount >= 1500) {
            container.classList.add('red')
            disableButton(btnId)
        } else {
            container.classList.remove('red')
            reactivateButton(btnId)
        }
    })
}

/**
 * Handles the Discard Button in the Cancelling Post Modal.
 */
function handleDiscardPost() {
    exitWriteMode()
}

/**
 * Handles POSTing to the server
 * @param {object} event 
 */
function handleNewPost(event) {
    event.preventDefault()
    const blogTitle = document.getElementById('add-title')
    // This gets the content of the editor with all its formatting information, both as raw HTML and as the Delta object so that I can use it to edit later.
    const content = quill.root.innerHTML
    const delta = quill.getContents()

    axios({
        method: "POST",
        url: '/blog',
        data: {
            title: blogTitle.value,
            body: content,
            delta: delta
        }
    }).then((response) => {
        exitWriteMode()
        getPostList()
        getFeatured()
    }).catch((err) => {
        console.log(err);
    })
}

/**
 * Switches user out of write mode back to the normal display.
 */
function exitWriteMode() {
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')
    writeMode = false
    container.innerHTML = ''
    btn.innerText = 'Write'
    btn.classList.remove('btn-outline-danger')
    btn.classList.add('btn-outline-success')
    btn.setAttribute('data-bs-toggle', '')
    btn.setAttribute('data-bs-target', '')
}

/**
 * A function that gets one post from the server, the active post. 
 * @param {Number} id number of the post to GET from server
 */
function handleGetActivePost(id) {
    axios({
        method: "GET",
        url: `/blog/now/${id}`
    }).then((response) => {
        renderActivePost(response)
    }).catch((err) => {
        console.log(err);
    })
}

/**
 * Renders an active post to the DOM.
 * @param {Object} response response object from GET request.
 */
function renderActivePost(response) {
    const showing = document.getElementById('showing')
    const container = document.getElementById('current-post')
    setCurrentPost(response.data[0])
    showing.innerText = currentPost.updated_at
    container.innerHTML = `
        <h2 id="current-post-title">${currentPost.title}</h2>
        <p id="current-post-body">${currentPost.body}</p>
        `
    reactivateButton('delete-btn', handleDelete, currentPost.id)
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
    // editQuill.on('text-change', handleNumberOfCharsEdit)
    handleNumberOfChars(editQuill, 'edit-char-count', 'update-btn')

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
        handleGetActivePost(event.target.param)
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


