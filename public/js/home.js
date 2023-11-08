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

