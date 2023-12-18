const API_BASE_URL = "https://www.reddit.com";

function fetchMemesFromReddit(subreddit, count) {
  const url = `${API_BASE_URL}/r/${subreddit}/top.json?limit=${count}&t=day`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.data.children.map(child => child.data))
    .catch(error => {
      console.error("Error fetching memes from Reddit:", error);
      return []; // Return an empty array in case of an error
    });
}

function isMemePost(post) {
  return post.post_hint === 'image';
}

export { fetchMemesFromReddit, isMemePost };
