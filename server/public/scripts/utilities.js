// ! Utility doc
/**
 * Sets the currentPost to post from the database
 * @param {object} featured an object to be set as the new current post.
 */
function setCurrentPost(featured) {
    currentPost = featured
}

/**
 * Disables a button on the DOM
 * @param {string} id enter ID of button to be disabled.
 */
function disableButton(id) {
    const btn = document.getElementById(id)
    btn.setAttribute('disabled', '')
}

/**
 * A function to get a particular button by ID, removed a disabled attribute from it,
 * add an event listener with a specified callbackFn
 * @param {string} id the 'id' of the button to reference
 * @param {Function} callbackFn the function to attach to the event listener of the button
 * @param {number} param optional number to assign to a param key for the button.
 */
function reactivateButton(id, callbackFn, param) {
    const btn = document.getElementById(id)
    btn.removeAttribute('disabled')
    btn.addEventListener('click', callbackFn)
    if(param) {
        btn.param = param
    }
}