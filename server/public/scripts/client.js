function onStart() {
    // GETs and Renders post list to DOM
    getPostList()
    getFeatured()
}

// ! State
let writeMode = false
let currentPost
let quill
let editQuill = new Quill('#edit-editor', {
    theme: 'snow'
})

onStart()


