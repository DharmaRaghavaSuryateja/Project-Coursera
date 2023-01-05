async function fun() {
  let token = localStorage.getItem("token");
  let courseId = localStorage.getItem("courseId");
  let response = await fetch("http://localhost:5000/viewCourse", {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ courseId: courseId }),
  });
  let data = await response.json();
  document.getElementById("category").innerHTML = data.courseDetails.category;
  document.getElementById("title").innerHTML = data.courseDetails.title;
  document.getElementById("rating").innerHTML =
    data.courseDetails.rating + " ratings";
  document.getElementById("runningTime").innerHTML =
    data.courseDetails.runningTime + " hours";
  document.getElementById("description").innerHTML =
    data.courseDetails.description;
  document.getElementById("author").innerHTML = data.authorDetails.name;
  if (data.userDetails.id === data.courseDetails.createdBy) {
    let editBtn = document.createElement("button");
    editBtn.className =
      "flex  text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded";
    editBtn.innerHTML = "Edit";
    editBtn.id = "btn";
    let deleteBtn = document.createElement("button");
    deleteBtn.className =
      "flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded";
    deleteBtn.innerHTML = "Delete";
    deleteBtn.id = "deleteBtn";
    document.getElementById("buttonDiv").appendChild(editBtn);
    document.getElementById("buttonDiv").appendChild(deleteBtn);
    document.getElementById("btn").onclick = async (e) => {
      e.preventDefault();
      localStorage.setItem("editCourseId", data.courseDetails.id);
      window.location.assign("./editCourse.html");
    };
    document.getElementById("deleteBtn").onclick = async (e) => {
      e.preventDefault();
      let response = await fetch("http://localhost:5000/deleteCourse", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ cid: data.courseDetails.id }),
      });
      let datae = await response.json();
      if ((datae.message = "success")) {
        window.location.assign("./teacherCourse.html");
      }
    };
  }
}
fun();
