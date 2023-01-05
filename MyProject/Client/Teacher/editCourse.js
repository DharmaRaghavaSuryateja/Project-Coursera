let token = localStorage.getItem("token");
let editCourseId = localStorage.getItem("editCourseId");
async function fun() {
  let response = await fetch("http://localhost:5000/editCourse", {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ editCourseId: editCourseId }),
  });
  let data = await response.json();
  let inputTitle = document.createElement("input");
  inputTitle.type = "text";
  inputTitle.value = data.courseDetails.title;
  inputTitle.className = "form-control";
  inputTitle.name = "title";
  inputTitle.id = "example";
  document.getElementById("lbl1").appendChild(inputTitle);
  let select = document.createElement("select");
  select.className = "form-control";
  select.name = "category";
  for (let i = 0; i < data.categoryDetails.length; i++) {
    let option = document.createElement("option");
    option.value = data.categoryDetails[i].category;
    option.innerHTML = data.categoryDetails[i].category;
    select.appendChild(option);
  }
  document.getElementById("lbl2").appendChild(select);
  let inputDescription = document.createElement("textarea");
  inputDescription.type = "text";
  inputDescription.value = data.courseDetails.description;
  inputDescription.className = "form-control";
  inputDescription.id = "example";
  inputDescription.name = "description";
  document.getElementById("lbl3").appendChild(inputDescription);
  let inputRunningTime = document.createElement("input");
  inputRunningTime.type = "text";
  inputRunningTime.value = data.courseDetails.runningTime;
  inputRunningTime.className = "form-control";
  inputRunningTime.id = "example";
  inputRunningTime.name = "runningTime";
  document.getElementById("lbl4").appendChild(inputRunningTime);
  let imageLink = document.createElement("input");
  imageLink.type = "text";
  imageLink.value = data.courseDetails.image;
  imageLink.name = "image";
  imageLink.className = "form-control";
  imageLink.id = "customFile";
  document.getElementById("lbl5").appendChild(imageLink);
  let button = document.createElement("button");
  button.className = "btn btn-primary";
  button.innerHTML = "Save";
  document.getElementById("btn").appendChild(button);
  button.onclick = async (e) => {
    e.preventDefault();
    let response = await fetch("http://localhost:5000/saveEditedCourse", {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: inputTitle.value,
        description: inputDescription.value,
        runningTime: inputRunningTime.value,
        category: select.value,
        image: imageLink.value,
        editCourseId: editCourseId,
      }),
    });
    let data = await response.json();
    if (data.message == "success") {
      window.location.assign("./teacherCourse.html");
    }
  };
}
fun();
