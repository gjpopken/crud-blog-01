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
 * DELETE request for a post in the database
 * @param {Object} event 
 */
function handleDelete(event) {
    axios({
        method: "DELETE",
        url: `/blog/${event.target.param}`
    }).then((response) => {
        getFeatured()
        getPostList()
    })
}

/**
 * A function to set up the edit modal with the right title and 
 * editor text.
 */
function handleEdit() {
    // This set the contents of the editor, and has to be parsed 
    // from when it comes back from the DB
    editQuill.setContents(JSON.parse(currentPost.delta).ops)
    handleNumberOfChars(editQuill, 'edit-char-count', 'update-btn')
    const editTitle = document.getElementById('edit-title')
    editTitle.value = currentPost.title
    reactivateButton('update-btn', handleUpdate, currentPost.id)
}

/**
 * Sends PUT request to database to update a post with the 
 * contents of the editor.
 * @param {Object} event 
 */
function handleUpdate(event) {
    const editedTitle = document.getElementById('edit-title')
    const editedContent = editQuill.getContents()
    axios({
        method: "PUT",
        url: `/blog/${event.target.param}`,
        data: {
            title: editedTitle.value,
            body: editQuill.root.innerHTML,
            delta: editedContent
        }
    }).then((response) => {
        handleGetActivePost(event.target.param)
        getPostList()
    }).catch((err) => {
        console.log(err);
    })
}