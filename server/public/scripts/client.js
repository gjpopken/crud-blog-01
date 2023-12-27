
function onStart() {
    console.log('hello world');
    renderPostList()
    renderFeatured()
    // the button will check if there are any posts.
    // const deleteBtn = document.getElementById('delete-btn')
    // const currentPost = document.getElementById('current-post')
    // if (currentPost.innerHTML === '') {
    //     deleteBtn.setAttribute('disabled', '')
    // }
}

// ! Handle Functions
function handleWriteBtn() {
    // console.log(' in handleWriteBtn ');
    // Get the button, and container that the form will be populated in 
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')
    const form = `<form onsubmit="handleNewPost(event)" class="mb-5">
    <label for="add-title" class="form-label">Blog Title</label>
    <input required type="text" class="form-control" id="add-title" placeholder="Enter Blog Title" name="add-title">
    <label for="blog-body" class="form-label">New Post</label>
    <textarea required class="form-control mb-3" rows="5" id="blog-body" name="blog-body" placeholder="Enter your thoughts . . . ☁️"></textarea>
    <button type="submit" class="btn btn-outline-success">Post</button>
  </form>`
    if (writeMode === false) {
        writeMode = true
        container.innerHTML = form
        btn.innerText = 'Cancel'
        btn.classList.remove('btn-outline-success')
        btn.classList.add('btn-outline-danger')
        btn.setAttribute('data-bs-toggle', 'modal')
        btn.setAttribute('data-bs-target', '#exampleModal')
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
    const nBody = document.getElementById('blog-body')
    let btn = document.getElementById('write-btn')
    const container = document.getElementById('new-blog-container')

    axios({
        method: "POST",
        url: '/blog',
        data: {
            title: nTitle.value,
            body: nBody.value
        }
    }).then((response) => {
        console.log('successfully POSTed');
        nTitle.value = ''
        nBody.value = ''
        writeMode = false
        container.innerHTML = ''
        btn.innerText = 'Write'
        btn.classList.remove('btn-outline-danger')
        btn.classList.add('btn-outline-success')
        btn.setAttribute('data-bs-toggle', '')
        btn.setAttribute('data-bs-target', '')
        renderPostList()
        renderFeatured()
    }).catch((err) => {
        console.log(err);
    })
}

function handleShowPost(id) {
    console.log('in show post', id);
    axios({
        method: "GET",
        url: `/blog/now/${id}`
    }).then((response) => {
        const showing = document.getElementById('showing')
        const container = document.getElementById('current-post')
        const post = response.data[0]
        const deleteBtn = document.getElementById('delete-btn')
        showing.innerText = post.inserted_at
        container.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        `
        // deleteBtn.removeEventListener()
        deleteBtn.addEventListener("click", handleDelete)
        deleteBtn.param = post.id
    })
}

function handleDelete(event) {
    console.log('in handleDelete', event.target.param);
    axios({
        method: "DELETE",
        url: `/blog/${event.target.param}`
    }).then((response) => {
        renderFeatured()
        renderPostList()
    })
}

// ! Render

function renderPostList() {
    // to render the post titles to the side bar to be nagivated to
    axios({
        method: "GET",
        url: "/blog"
    }).then((response) => {
        console.log(response.data);
        const container = document.getElementById('post-list')
        let blogPosts = response.data
        container.innerHTML = ''
        if (blogPosts.length === 0) {
            container.innerHTML = `Nothing here, yet! ✏️`
        }
        for (post of blogPosts) {
            container.innerHTML += `
            <div class="row"
                <div class="col">
                 <button class="btn" onclick="handleShowPost(${post.id})">${post.title}<span> ${post.inserted_at}</span></button>
                </div>
            </div>
            <div class="line"></div>
            `
        }
    }).catch((err) => {
        console.log(err);
    })
}

function renderFeatured() {
    const container = document.getElementById('current-post')
    const deleteBtn = document.getElementById('delete-btn')

    axios({
        method: "GET",
        url: "blog/featured"
    }).then((response) => {
        if (response.data.length === 0) {
            container.innerHTML = 'What will you write about? ☁️'
            deleteBtn.setAttribute('disabled', '')
        } else {

            console.log('GOT for /featured', response.data);
            const featured = response.data[0]
            console.log(featured);
            const header = document.getElementById('showing')
            header.innerText = 'Featured Post'
            container.innerHTML = `
        <h2>${featured.title}</h2>
        <small>${featured.inserted_at}</small>
        <p>${featured.body}</p>
        `
            deleteBtn.removeAttribute('disabled')
            deleteBtn.addEventListener("click", handleDelete)
            deleteBtn.param = featured.id
        }
    })
}

// ! State
onStart()
let writeMode = false
