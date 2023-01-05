let token = localStorage.getItem("token");
async function fun() {
  let response = await fetch("http://localhost:5000/myProfile", {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  let data = await response.json();
  console.log(data);
  if (typeof data.error !== "undefined") {
    let noCourse = document.createElement("div");
    noCourse.innerHTML = "No Courses Found";
    noCourse.style.display = "flex";
    noCourse.style.justifyContent = "center";
    noCourse.style.alignItems = "center";
    document.getElementById("layout").appendChild(noCourse);
  }
  document.getElementById("headingName").innerHTML = data.user.name;
  document.getElementById("headingEmail").innerHTML = data.user.email;
  for (let i = 0; i < data.enrollDetails.length; i++) {
    let card = document.createElement("div");
    card.className = "card";
    let cardHeader = document.createElement("h5");
    cardHeader.className = "card-header";
    cardHeader.style.textAlign = "center";
    cardHeader.style.backgroundColor = "#4299E1";
    cardHeader.innerHTML = data.enrollDetails[i].category;
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    let cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.style.textAlign = "center";
    cardTitle.innerHTML = data.enrollDetails[i].title;
    let cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.style.textAlign = "center";
    cardText.innerHTML = data.enrollDetails[i].description;
    let div = document.createElement("div");
    div.id = "flex";
    let a1 = document.createElement("a");
    a1.className = "btn btn-primary";
    a1.id = "button";
    for (let k = 0; k < data.enrollTable.length; k++) {
      if (data.enrollDetails[i].id == data.enrollTable[k].cid) {
        if (data.enrollTable[k].isCompleted == true) {
          a1.innerHTML = "Mark as Pending";
          cardHeader.style.backgroundColor = "rgb(130, 205, 71)";
        } else {
          a1.innerHTML = "Mark as Completed";
          cardHeader.style.backgroundColor = "rgb(255, 100, 100)";
        }
      }
    }

    let input = document.createElement("input");
    input.type = "number";
    input.id = "rating";
    input.name = "rating";
    input.placeholder = "0 to 5";
    input.style.textAlign = "center";
    let a2 = document.createElement("a");
    a2.className = "btn btn-primary";
    a2.id = "button";
    a2.innerHTML = "Rate";
    let ratingDiv = document.createElement("div");
    ratingDiv.id = "Fakeform";
    for (let m = 0; m < data.enrollTable.length; m++) {
      if (data.enrollDetails[i].id == data.enrollTable[m].cid) {
        if (data.enrollTable[m].isRated == true) {
          let ratedButton = document.createElement("div");
          ratedButton.innerHTML = "Rated";
          ratedButton.className = "btn btn-primary flex m-auto";
          ratingDiv.appendChild(ratedButton);
        } else {
          ratingDiv.appendChild(input);
          ratingDiv.appendChild(a2);
        }
      }
    }
    let a3 = document.createElement("a");
    a3.className = "btn btn-primary";
    a3.id = "button";
    a3.innerHTML = "Remove";
    div.appendChild(a1);
    div.appendChild(ratingDiv);
    div.appendChild(a3);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(div);
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    document.getElementById("layout").appendChild(card);
    a2.onclick = async (e) => {
      if (input.value <= 5 && input.value >= 0 && input.value != "") {
        e.preventDefault();
        let x = parseInt(input.value) + parseInt(data.enrollDetails[i].rating);
        console.log(x);
        let response = await fetch("http://localhost:5000/rateCourse", {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            courseId: data.enrollDetails[i].id,
            rating: Math.floor(x / 2),
            sid: data.user.id,
            isRated: true,
          }),
        });
        let datae = await response.json();
        if (datae.message === "success") {
          window.location.assign("./myProfile.html");
        }
      }
    };

    a3.onclick = async (e) => {
      e.preventDefault();
      let response = await fetch("http://localhost:5000/deleteFromTraining", {
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          sid: data.user.id,
          cid: data.enrollDetails[i].id,
        }),
      });
      let datae = await response.json();
      if (datae.message == "success") {
        window.location.assign("./myProfile.html");
      }
    };
    a1.onclick = async (e) => {
      e.preventDefault();
      for (let j = 0; j < data.enrollTable.length; j++) {
        if (data.enrollDetails[i].id == data.enrollTable[j].cid) {
          let response = await fetch("http://localhost:5000/markAsCompleted", {
            method: "post",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              isCompleted: !data.enrollTable[j].isCompleted,
              sid: data.user.id,
              cid: data.enrollDetails[i].id,
            }),
          });
          let datae = await response.json();
          if ((datae.message = "success")) {
            window.location.assign("./myProfile.html");
          }
        }
      }
    };
  }
}
fun();
