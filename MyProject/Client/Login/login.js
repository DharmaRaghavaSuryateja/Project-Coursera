document.getElementById("btn").onclick = async (e) => {
  if (
    document.getElementById("email").validity.valid &&
    document.getElementById("password").validity.valid
  ) {
    e.preventDefault();
    var state = 0;
    let userEmail = document.getElementById("email").value;
    let userPassword = document.getElementById("password").value;
    let response = await fetch("http://localhost:5000/login", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, password: userPassword }),
    });
    let data = await response.json();
    console.log(data);
    if (data.data === "Invalid Password") {
      document.getElementById("alert").innerHTML = "Password Doesn't Match !";
    } else if (data.data === "User doesn't Exists!") {
      document.getElementById("alert").innerHTML = "User doesn't Exists !";
    } else {
      localStorage.setItem("token", data.data);
      console.log(localStorage.getItem("token"));
      if (data.occupation == "teacher") {
        window.location.assign("../Teacher/teacherCourse.html");
      }
      if (data.occupation == "student") {
        window.location.assign("../Student/studentCourse.html");
      }
    }
  }
};
