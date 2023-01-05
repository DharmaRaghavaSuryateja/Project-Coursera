document.getElementById("btn").onclick = async (e) => {
  if (document.getElementById("example").validity.valid) {
    e.preventDefault();

    let category = document.getElementById("example").value;
    let token = localStorage.getItem("token");
    let response = await fetch("http://localhost:5000/addCategory", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ category: category }),
    });
    let data = await response.json();
    if (data.data === "success") {
      window.location.assign("./teacherCourse.html");
    }
  }
};
