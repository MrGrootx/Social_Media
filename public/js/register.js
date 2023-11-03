const form = document.getElementById("frm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordconfirm = document.getElementById("confirm");

const name = document.getElementById("name");


String.prototype.isEmail = function () {
    return !!this.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if(!email.value.trim().isEmail()) {
    email.parentElement.classList.add("error");
    return;
  } else {
    email.parentElement.classList.remove("error");
  }

  if (password.value.trim() != passwordconfirm.value.trim()) {
    password.parentElement.classList.add("error");
    passwordconfirm.parentElement.classList.add("error");
    return;
  } else {
    form.submit();
  }
});
