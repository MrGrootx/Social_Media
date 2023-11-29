const postBtn = document.getElementById("btnPost");
const postTextarea = document.getElementById("postTextarea");

postTextarea.addEventListener("keyup", function (e) {
  const textBox = e.target;
  const value = textBox.value.trim();

  if (value == "") {
    postBtn.disabled = true;
    return;
  }
  postBtn.disabled = false;
});

getAllPost();
async function getAllPost() {
  const url = "http://localhost:5000/api/posts";
  const response = await fetch(url);
  const posts = await response.json();

  posts.forEach((post) => {
    const messages = document.querySelector(".messages");
    const content = createPost(post);
    messages.innerHTML = content + messages.innerHTML;
  });
}

// Save User Post Details
postBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const url = "http://localhost:5000/api/posts";
  const data = new URLSearchParams();
  data.append("content", postTextarea.value);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded;charset=UTF-8"
  );
  xhr.send(data);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      //  console.log(xhr.responseText);
      const post = JSON.parse(xhr.responseText);
      const messages = document.querySelector(".messages");

      const htmlData = createPost(post);
      messages.insertAdjacentHTML("afterbegin", htmlData);
      postTextarea.value = "";
      postBtn.disabled = true;
    } else if (xhr.readyState === 4) {
      console.error("Request failed with status: " + xhr.status);
    }
  };
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
              <div class="textareaDiv">
              <textarea placeholder="Your Comments"
              class="txtComment"
              data-id='${post._id}'></textarea>
              <ion-icon name="close-outline" class="clearBtn" ></ion-icon>
                <button class="btnSend">
                  send
                    <ion-icon name="send-outline"></ion-icon>
                </button>
              </div>
              <div class="comment-container">

              <!-- user comment start --> 
                

              <!-- sec -->
                



                <!-- user comment end --> 
              </div>
              
          </div>
          <!--Comment End -->
        </div>
    </div>
  </div>

  `;
  return data;
}

// Like
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("likeBtn")) {
    const likeBtn = target;
    const postId = getpostId(likeBtn);
    // console.log(postId);
    const uri = `/api/posts/${postId}/like`;
    const response = await fetch(uri, { method: "PUT" });
    const posts = await response.json();

    // console.log(posts);
    likeBtn.querySelector("span").textContent = posts.likes.length || "";
    if (posts.likes.includes(userLoggedIn._id)) {
      likeBtn.classList.add("active");
    } else {
      likeBtn.classList.remove("active");
    }
  }
});
//Retweet
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("retweetBtn")) {
    const likeBtn = target;
    const postId = getpostId(likeBtn);
    // console.log(postId);
    const uri = `/api/posts/${postId}/retweetBtn`;
    const response = await fetch(uri, { method: "POST" });
    const posts = await response.json();
    // console.log(posts);
    likeBtn.querySelector("span").textContent = posts.retweetUsers.length || "";
    if (posts.likes.includes(userLoggedIn._id)) {
      likeBtn.classList.add("active");
    } else {
      likeBtn.classList.remove("active");
    }
    location.reload();
  }
});

function getpostId(element) {
  const isRoot = element.classList.contains("post");
  const rootElement = isRoot == "true" ? element : element.closest(".post");
  const postId = rootElement.dataset.id;
  if (postId === undefined) {
    return alert("Post id Undefined");
  }
  return postId;
}
// Comment
document.addEventListener("click", async function (event) {
  const target = event.target;
  if (target.classList.contains("trigger")) {
    const commentBtn = target;
    const postId = getpostId(commentBtn);
    // console.log(postId);

    const commentSection = commentBtn.parentElement.nextElementSibling;
    //console.log(commentSection);
    commentSection.classList.toggle("commentActive");
    if (commentSection.classList.contains("commentActive")) {
      //Fetch User Comments From Db
      const url = `/api/posts/${postId}/usercomment`;
      const response = await fetch(url);
      const comments = await response.json();

      const commentContainer =
        commentSection.querySelector(".comment-container");
      let htmlComment = "";
      comments.forEach((comment) => {
        // console.log(comment);
        htmlComment += `
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
      commentContainer.innerHTML = htmlComment;
    }
  }
  if (target.classList.contains("clearBtn")) {
    // console.log('clearBtn');
    const textArea = target.previousElementSibling;
    textArea.value = "";
    textArea.focus();
  }

  if (target.classList.contains("btnSend")) {
    // console.log('clearBtn');
    const textArea = target.previousElementSibling.previousElementSibling;
    const postId = textArea.dataset.id;
    // console.log(textArea.value, "" + postId);

    if (textArea.value.trim() != "") {
      const uri = `/api/posts/${postId}/comment`;
      const data = new URLSearchParams();
      data.append("comment", textArea.value.trim());
      const response = await fetch(uri, { method: "POST", body: data });
      const comment = await response.json();
      console.log(comment);
      const commentContainer = textArea.parentElement.nextElementSibling;
      commentContainer.innerHTML += `
        <div class="comment">
        <div class="user-pic">
          <img src='${
            userLoggedIn.profilePic
          }' alt="user-pic" width="100px"   />
        </div>
        <div class="comment-body">
          <div class="comment-header">
            <div class="username">
              <a href="#">${userLoggedIn.name}</a>
              <span>@${userLoggedIn.username}</span>
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

      textArea.value = "";
    } else {
      textArea.value = "";
      textArea.focus();
    }
  }
});

// View Post Page
document.addEventListener("click", async function (event) {
  const target = event.target;

  if (target.classList.contains("message-container")) {
    const postID = target.parentElement.parentElement.dataset.id;

    if (postID == undefined) return;
    window.location.href = "/posts/" + postID
  }

  // Last Local 19 Min : 25 sec
});

/*********************************************** */
// function timeFormat(current, previous) {
//   const msPerMinute = 60 * 1000;
//   const msPerHour = msPerMinute * 60;
//   const msPerDay = msPerHour * 24;
//   const msPerMonth = msPerDay * 30;
//   const msPerYear = msPerDay * 365;

//   const diff = current - previous;
//   if (diff < msPerMinute) {
//     if (diff / 1000 < 30) return "Just Now";
//     return Math.round(diff / 1000) + "seconds ago";
//   } else if (diff < msPerHour) {
//     return Math.round(diff / msPerMinute) + "minutes ago";
//   } else if (diff < msPerDay) {
//     return Math.round(diff / msPerHour) + "hours ago";
//   } else if (diff < msPerMonth) {
//     return Math.round(diff / msPerDay) + "days ago";
//   } else if (diff < msPerYear) {
//     return Math.round(diff / msPerMonth) + "months ago";
//   } else {
//     return Math.round(diff / msPerYear) + "years ago";
//   }
// }
