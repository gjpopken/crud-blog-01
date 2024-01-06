// ! A rendering function doc
/**
 * Renders a response object from a GET request to the DOM
 * @param {object} response GET object
 */
function renderPostList(response) {
    const container = document.getElementById('post-list');
    let postList = response.data;
    container.innerHTML = '';
    if (postList.length === 0) {
        container.innerHTML = `Nothing here, yet! ✏️`;
    }
    for (post of postList) {
        container.innerHTML += `
            <div class="row"
                <div class="col">
                 <button class="btn" onclick="handleGetActivePost(${post.id})">${post.title}<span> ${post.inserted_at}</span></button>
                </div>
            </div>
            <div class="line"></div>
            `;
    }
}

/**
 * This function handles the rendering of the current post to the page.
 * It will check to make sure that there is data to show, then will
 * render the currentPost if there is one.
 * Is called when a new post is added and the page loads, but not when a post is selected from the 
 * sidebar. 
 * @param {Object} response the response from the GET request. 
 */
function renderFeaturedPost(response) {
    if (response.data.length === 0) {
        renderNoFeatured()
    } else {
        const container = document.getElementById('current-post')
        const header = document.getElementById('showing')

        header.innerText = 'Featured Post'
        container.innerHTML = `
            <h2>${currentPost.title}</h2>
            <small>${currentPost.inserted_at}</small>
            ${currentPost.body}
    `
        reactivateButton('edit-btn', handleEdit, currentPost.id)
        reactivateButton('delete-btn', handleDelete, currentPost.id)
    }
}

/**
 * Function that renders a special message and disables delete and 
 * edit buttons if there are no blogs to be shown. 
 */
function renderNoFeatured() {
    const container = document.getElementById('current-post')
    const header = document.getElementById('showing')
    container.innerHTML = 'What will you write about? ☁️'
    header.innerText = 'Featured Post'
    disableButton('delete-btn')
    disableButton('edit-btn')
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