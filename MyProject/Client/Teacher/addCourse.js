let token = localStorage.getItem("token");
async function fun() {
  let response = await fetch("http://localhost:5000/getCategories", {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  let data = await response.json();
  console.log(data)
  for (let i = 0; i < data.data.length; i++) {
    let option = document.createElement("option");
    option.value = data.data[i].category;
    option.innerHTML = data.data[i].category;
    document.getElementById("category").appendChild(option);
  }

  document.getElementById("btn").onclick = async (e) => {
    if (
      document.getElementById("title").validity.valid &&
      document.getElementById("category").validity.valid &&
      document.getElementById("description").validity.valid &&
      document.getElementById("runningTime").validity.valid &&
      document.getElementById("image").validity.valid
    ) {
      e.preventDefault();
      let title = document.getElementById("title").value;
      let description = document.getElementById("description").value;
      let category = document.getElementById("category").value;
      let runningTime = document.getElementById("runningTime").value;
      let image = document.getElementById("image").value;
      console.log(category);
      let response1 = await fetch("http://localhost:5000/addCourse", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          runningTime: runningTime,
          category: category,
          image: image,
        }),
      });
      let data1 = await response1.json();
      console.log(data1)
      if (data1.data === "success") {
        window.location.assign("./teacherCourse.html");
      }
    }
  };
}
fun();
