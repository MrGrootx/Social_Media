document.addEventListener("DOMContentLoaded", async function () {
  const url = `/api/posts/${requested_postid}/single`;
  // console.log(url);
  const response = await fetch(url);
  const postDetails = await response.json();
  //   console.log(postDetails);
  const messages = document.querySelector(".messages");
  messages.innerHTML = createPost(postDetails.post);
  loadComments(postDetails.comments);
});

function createPost(post) {
  // console.log(post);
  const isRetweet = post.retweetData !== undefined;
  const retweetedBy = isRetweet ? post.postedBy.username : null;
  post = isRetweet ? post.retweetData : post;

  let retweetText = "";
  if (isRetweet) {
    retweetText = `
        <span>
        <ion-icon name="repeat-outline"></ion-icon>
          Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
        
        </span>`;
  }

  const img = post.postedBy.profilePic;
  const activeBtn = post.likes.includes(userLoggedIn._id) ? "active" : "";
  const activeretweetBtn = post.retweetUsers.includes(userLoggedIn._id)
    ? "active"
    : "";
  let data = `
  
    <div class="post" data-id='${post._id}'> 
  
      <div class='retweetText'>${retweetText}</div>
  
      <div class='content-container'>
          <div class="user-pic">
            <img src='${img}' alt="user-pic" width="50px" height="50px"  />
          </div>
          <div class="message-container">
            <div class="header">
              <div class="username">
                <a href="#">${post.postedBy.name}</a>
                <span>@${post.postedBy.username}</span>
              </div>
              <span class="time">${timeFormat(
                new Date(),
                new Date(post.createdAt)
              )}</span>
            </div>
            <div class="body">
            ${post.content}
            </div>
  
            <div class="footer"> 
            <button class="trigger">
              <ion-icon name="chatbubble-outline"></ion-icon>
            </button>
            <button class="retweetBtn ${activeretweetBtn}">
            <span class="">${post.retweetUsers.length || ""}</span>
            <ion-icon name="repeat-outline"></ion-icon></button>
            <button class="likeBtn ${activeBtn}" > 
            <ion-icon name="heart-outline"></ion-icon>
            <span class="">${post.likes.length || ""}</span>
            </button>
            </div>
            <!--Comment -->
            <div class="comment-section" data-id='${post._id}'>
            comments
                    <textarea placeholder="Your Comments"
                    class="txtComment"
                    data-id='${post._id}'></textarea>
                <ion-icon name="close-outline" class="clearBtn" ></ion-icon>
                  <button class="btnSend">
                    send
                      <ion-icon name="send-outline"></ion-icon>
                  </button>
                </div>
                <div class="comments"></div>
                
            </div>
            <!--Comment End -->
          </div>
      </div>
    </div>
  
    `;
  return data;
}

function loadComments(comments) {
  const commentContainer = document.querySelector(".comments");

  comments.forEach((comment) => {
    // console.log(comment);
    commentContainer.innerHTML += `
    <div class="comment">
     <div class="user-pic">
       <img src='${
         comment.commentBy.profilePic
       }' alt="user-pic" width="100px"   />
        </div>
        <div class="comment-body">
            <div class="comment-header">
                <div class="username">
                    <a href="#">${comment.commentBy.name}</a>
                    <span>${comment.commentBy.username}</span>
            </div>
                <span class="time">${timeFormat(
                  new Date(),
                  new Date(comment.createdAt)
                )}</span>
        </div>
        <div class="comment-message">
          <p>${comment.comment}</p>
      </div>
    </div>
  </div>
    `;
  });
}
