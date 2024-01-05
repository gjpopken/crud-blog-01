// ! GET, POST, PUT, DELETE Methods
/**
 * To render the post titles to the side bar for navigation
 */
function getPostList() {
    axios({
        method: "GET",
        url: "/blog"
    }).then((response) => {
        renderPostList(response);
    }).catch((err) => {
        console.log(err);
    })
}

/**
 * GETs the newest post from the database, and sets it as the currentPost, and calls the renderFeaturedPost function. 
 */
function getFeatured() {

    axios({
        method: "GET",
        url: "blog/featured"
    }).then((response) => {
        setCurrentPost(response.data[0])
        renderFeaturedPost(response)
    }).catch((error) => {
        console.log(error);
    })
}