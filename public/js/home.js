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

      const htmlData = createPost(post)
      messages.insertAdjacentHTML("afterbegin",  htmlData)
      postTextarea.value = "";
      postBtn.disabled = true;

    } else if (xhr.readyState === 4) {
      console.error("Request failed with status: " + xhr.status);
    }
  };
});

function createPost(post) {
  // console.log(post);
  const img = post.postedBy.profilePic;
  let data = `

  <div class="post" data-id='${post._id}'> 
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
          <button><ion-icon name="chatbubble-outline"></ion-icon></button>
          <button><ion-icon name="repeat-outline"></ion-icon></button>
          <button><ion-icon name="heart-outline"></ion-icon></button>
          </div>
      
          
        </div>
    </div>
  </div>
  `;
  return data;
}

function timeFormat(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const diff = current - previous;
  if (diff < msPerMinute) {
    if (diff / 1000 < 30) return "Just Now";
    return Math.round(diff / 1000) + "seconds ago";
  } else if (diff < msPerHour) {
    return Math.round(diff / msPerMinute) + "minutes ago";
  } else if (diff < msPerDay) {
    return Math.round(diff / msPerHour) + "hours ago";
  } else if (diff < msPerMonth) {
    return Math.round(diff / msPerDay) + "days ago";
  } else if (diff < msPerYear) {
    return Math.round(diff / msPerMonth) + "months ago";
  } else {
    return Math.round(diff / msPerYear) + "years ago";
  }
}
