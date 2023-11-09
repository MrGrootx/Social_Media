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
  console.log(posts);
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
      const jsonObj = JSON.parse(xhr.responseText);
      console.log(jsonObj);
    } else if (xhr.readyState === 4) {
      console.error("Request failed with status: " + xhr.status);
    }
  };
});
