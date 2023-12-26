function onStart() {
    console.log('hello world');
}

// ! Handle Functions
function handleWriteBtn() {
    // console.log(' in handleWriteBtn ');
    // Get the button, and container that the form will be populated in 
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')
    const form = `<form onsubmit="" class="mb-5">
    <label for="add-title" class="form-label">Blog Title</label>
    <input type="text" class="form-control" id="add-title" placeholder="Enter Blog Title" name="add-title">
    <label for="blog-body" class="form-label">New Post</label>
    <textarea class="form-control mb-3" rows="5" id="blog-body" name="blog-body" placeholder="Enter your thoughts . . . ☁️"></textarea>
    <button type="submit" class="btn btn-outline-success">Post</button>
  </form>`
    if (writeMode === false) {
        writeMode = true
        container.innerHTML = form
        btn.innerText = 'Cancel'
        btn.classList.remove('btn-outline-success')
        btn.classList.add('btn-outline-danger')
    }
    else if (writeMode === true) {
        // Todo Triggers the pop-up to make sure that you want to cancel
        writeMode = false
        container.innerHTML = ''
        btn.innerText = 'Write'
        btn.classList.remove('btn-outline-danger')
        btn.classList.add('btn-outline-success')
    }
}

onStart()
let writeMode = false
