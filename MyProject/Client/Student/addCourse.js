let token = localStorage.getItem("token");
let courseId = localStorage.getItem("courseId");
async function fun() {
  let responsee = await fetch("http://localhost:5000/addToTraining", {
    method: "post",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ courseId: courseId }),
  });
  let data = await responsee.json();
  console.log(data);
  document.getElementById("category").innerHTML = data.courseDetails.category;
  document.getElementById("title").innerHTML = data.courseDetails.title;
  document.getElementById("description").innerHTML =
    data.courseDetails.description;
  document.getElementById("author").innerHTML = data.ownerDetails.name;
  document.getElementById("runningTime").innerHTML =
    data.courseDetails.runningTime + " hours";
  document.getElementById("rating").innerHTML =
    data.courseDetails.rating + " Star";
  for (let i = 0; i < data.enrollDetails.length; i++) {
    if (data.enrollDetails[i].cid === data.courseDetails.id) {
      document.getElementById("btn").innerHTML = "Added to Training";
      document.getElementById("btn").style.backgroundColor = "lightgray";
      document.getElementById("btn").style.color = "black";
      break;
    }
  }

  document.getElementById("btn").onclick = async (e) => {
    let state = 0;
    e.preventDefault();
    for (let i = 0; i < data.enrollDetails.length; i++) {
      if (data.enrollDetails[i].cid === data.courseDetails.id) {
        state = 1;
        break;
      }
    }
    console.log(state);
    if (state == 0) {
      document.getElementById("alert-1").style.display = "flex";
      let responsee = await fetch("http://localhost:5000/addedToTraining", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          sid: data.userDetails.id,
          cid: data.courseDetails.id,
        }),
      });
      let datae = await responsee.json();
      if ((datae.message = "success")) {
        fun();
      }
    }
  };
}
fun();
