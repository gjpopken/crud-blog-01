// TODO for next time :
// Move functions to new files.
// //finish refactoring renderFeaturedPost, this is why the app is breaking.
// //refactor handleCharCount for disabling buttons


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


