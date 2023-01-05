document.getElementById("btn").onclick = async (e) => {
  if (
    document.getElementById("name").validity.valid &&
    document.getElementById("email").validity.valid &&
    document.getElementById("password").validity.valid
  ) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let occupation = document.getElementById("occ").value;
    let response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        occupation: occupation,
      }),
    });
    let data = await response.json();
    if (data.data == "User already exists!") {
      document.getElementById("alert").innerHTML = "User Exists!";
    } else {
      localStorage.setItem("token", data.token);
      console.log(data);
      if (occupation === "teacher") {
        window.location.assign("../Teacher/teacherCourse.html");
      }
      if (occupation === "student") {
        window.location.assign("../Student/studentCourse.html");
      }
    }
  }
};
