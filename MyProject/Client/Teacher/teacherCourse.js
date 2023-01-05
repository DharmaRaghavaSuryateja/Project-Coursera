window.onload = async () => {
  let token = localStorage.getItem("token");
  //0 is default for Grid View
  let globalView = 0;
  //Filtering via Category global variable
  let globalFilter = {};
  //Global Variable for Pagination
  let globalPage = 0;
  //Different Page
  let diffPage = 0;
  class display {
    totalData;
    async removeChilds() {
      let div = document.getElementById("layout");
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
    }
    navbar() {
      for (let i = 0; i < this.totalData.categoryData.length; i++) {
        let option = document.createElement("input");
        option.className = "filter";
        option.name = "category";
        let span = document.createElement("span");
        let div = document.createElement("div");
        div.id = "dive";
        span.id = "span";
        option.type = "checkbox";
        option.value = this.totalData.categoryData[i].category;
        option.innerHTML = this.totalData.categoryData[i].category;
        span.innerHTML = this.totalData.categoryData[i].category;
        div.appendChild(option);
        div.appendChild(span);
        document.getElementById("category").appendChild(div);
      }
    }
    async fetch(searchValue, sortValue) {
      let response = await fetch("http://localhost:5000/teacherCourses", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          search: searchValue,
          sort: sortValue,
          filter: globalFilter,
          page: globalPage,
          diffPage: diffPage,
        }),
      });
      this.totalData = await response.json();
      console.log(this.totalData);
      if (searchValue !== "undefined") {
        this.removeChilds();
      }
    }

    render() {
      let datae = JSON.parse(JSON.stringify(this.totalData));
      if (datae.confirm === false) {
        for (let j = 0; j < datae.categoryData.length; j++) {
          let structure = document.createElement("div");
          structure.className = "flex flex-wrap -m-4";
          structure.setAttribute("name", "cardClass");
          let heading = document.createElement("div");
          let subHeading = document.createElement("div");
          let state = 0;
          for (let i = 0; i < datae.data.length; i++) {
            let card = document.createElement("div");
            if (globalView == 0) {
              card.className = "lg:w-1/4 md:w-1/2 p-4 w-full";
            } else {
              card.className = "lg:w-full md:w-full p-4 w-full";
            }
            card.id = "view";
            let a = document.createElement("a");
            a.className = "block relative h-48 rounded overflow-hidden";
            let img = document.createElement("img");
            img.className = "object-cover object-center w-full h-full block";
            img.src = datae.data[i].image;
            let cardbody = document.createElement("div");
            cardbody.className = "mt-4";
            let category = document.createElement("h3");
            category.className =
              "text-gray-500 text-xs tracking-widest title-font mb-1";
            if (datae.data[i].createdBy === datae.user.id) {
              category.innerHTML =
                datae.data[i].category +
                " " +
                '<i class="fa-solid fa-user-pen"></i>';
            } else {
              category.innerHTML = datae.data[i].category;
            }
            let title = document.createElement("h2");
            title.className = "text-gray-900 title-font text-lg font-medium";
            title.innerHTML = datae.data[i].title;
            let runningTime = document.createElement("p");
            runningTime.className = "mt-1";
            runningTime.innerHTML = datae.data[i].runningTime + " hours";
            let rating = document.createElement("p");
            rating.className = "mt-1";
            for (let k = 0; k < datae.data[i].rating; k++) {
              let icon = document.createElement("span");
              icon.innerHTML = '<i class="fa-regular fa-star"></i>';
              rating.appendChild(icon);
            }
            if (datae.data[i].rating == 0) {
              rating.innerHTML = "No ratings";
            }
            cardbody.appendChild(category);
            cardbody.appendChild(title);
            cardbody.appendChild(runningTime);
            cardbody.appendChild(rating);
            a.appendChild(img);
            card.appendChild(a);
            card.appendChild(cardbody);
            if (datae.categoryData[j].category == datae.data[i].category) {
              subHeading.className = "subCardHeading";
              subHeading.innerHTML = datae.categoryData[j].category;
              structure.appendChild(card);
              state = 1;
            }
            card.onclick = () => {
              localStorage.setItem("courseId", datae.data[i].id);
              window.location.assign("./viewCourse.html");
            };
          }
          //if courses are available for category, then append to layout,otherwise donot append...structure damages
          if (state == 1) {
            heading.appendChild(subHeading);
            heading.appendChild(structure);
            document.getElementById("layout").appendChild(heading);
          }
        }
      } else if (datae.confirm === true) {
        let structure = document.createElement("div");
        structure.className = "flex flex-wrap -m-4";
        structure.setAttribute("name", "cardClass");
        let state = 0;
        for (let i = 0; i < datae.data.length; i++) {
          let card = document.createElement("div");
          if (globalView == 0) {
            card.className = "lg:w-1/4 md:w-1/2 p-4 w-full";
          } else {
            card.className = "lg:w-full md:w-full p-4 w-full";
          }
          card.id = "view";
          let a = document.createElement("a");
          a.className = "block relative h-48 rounded overflow-hidden";
          let img = document.createElement("img");
          img.className = "object-cover object-center w-full h-full block";
          img.src = datae.data[i].image;

          let cardbody = document.createElement("div");
          cardbody.className = "mt-4";
          let category = document.createElement("h3");
          category.className =
            "text-gray-500 text-xs tracking-widest title-font mb-1";
          if (datae.data[i].createdBy === datae.user.id) {
            category.innerHTML =
              datae.data[i].category +
              " " +
              '<i class="fa-solid fa-user-pen"></i>';
          } else {
            category.innerHTML = datae.data[i].category;
          }
          let title = document.createElement("h2");
          title.className = "text-gray-900 title-font text-lg font-medium";
          title.innerHTML = datae.data[i].title;
          let runningTime = document.createElement("p");
          runningTime.className = "mt-1";
          runningTime.innerHTML = datae.data[i].runningTime + " hours";
          let rating = document.createElement("p");
          rating.className = "mt-1";
          for (let k = 0; k < datae.data[i].rating; k++) {
            let icon = document.createElement("span");
            icon.innerHTML = '<i class="fa-regular fa-star"></i>';
            rating.appendChild(icon);
          }
          if (datae.data[i].rating == 0) {
            rating.innerHTML = "No ratings";
          }
          cardbody.appendChild(category);
          cardbody.appendChild(title);
          cardbody.appendChild(runningTime);
          cardbody.appendChild(rating);
          a.appendChild(img);
          card.appendChild(a);
          card.appendChild(cardbody);
          structure.appendChild(card);
          card.onclick = () => {
            localStorage.setItem("courseId", datae.data[i].id);
            window.location.assign("./viewCourse.html");
          };
        }

        document.getElementById("layout").appendChild(structure);
      }

      if (this.totalData.confirm === false) {
        let nav = document.createElement("nav");
        nav.className = "mt-10 mb-10 flex justify-center";
        nav.id = "pagination";
        let ul = document.createElement("ul");
        ul.className = "inline-flex -space-x-px";
        for (let i = 0; i < this.totalData.pages; i++) {
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.id = `${i}`;
          a.className =
            "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
          a.innerHTML = i + 1;
          a.value = i;
          li.appendChild(a);
          ul.appendChild(li);
          li.onclick = async () => {
            globalPage = i;
            await this.fetch(
              document.getElementById("site-search").value,
              document.getElementById("sorting").value
            );
            this.render();
          };
        }
        nav.appendChild(ul);
        document.getElementById("layout").appendChild(nav);
        if (typeof globalPage !== "undefined") {
          document.getElementById(`${globalPage}`).style.backgroundColor =
            "lightgray";
        }
      } else {
        console.log("inner");
        let nav = document.createElement("nav");
        nav.className = "mt-10 mb-10 flex justify-center";
        nav.id = "pagination";
        let ul = document.createElement("ul");
        ul.className = "inline-flex -space-x-px";
        for (let i = 0; i < this.totalData.diffpage; i++) {
          let li = document.createElement("li");
          let a = document.createElement("a");
          a.id = `${i}`;
          a.className =
            "py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
          a.innerHTML = i + 1;
          a.value = i;
          li.appendChild(a);
          ul.appendChild(li);
          li.onclick = async () => {
            diffPage = i;
            await this.fetch(
              document.getElementById("site-search").value,
              document.getElementById("sorting").value
            );
            this.render();
          };
        }
        nav.appendChild(ul);
        document.getElementById("layout").appendChild(nav);
        if (typeof globalPage !== "undefined") {
          document.getElementById(`${diffPage}`).style.backgroundColor =
            "lightgray";
        }
      }
    }
  }
  let app = new display();
  await app.fetch();
 
  app.navbar();
  app.render();

  //Logout
  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.assign("../Login/login.html");
  };
  //Search Bar
  document.getElementById("site-search").onkeypress = async (e) => {
    if (e.keyCode === 13) {
      let value = document.getElementById("site-search").value;
      if (value !== "") {
        diffPage = 0;
      } else {
      }
      await app.fetch(value, document.getElementById("sorting").value);
      app.render();
    }
  };
  //Menu Bar
  document.getElementById("cross").onclick = () => {
    document.getElementById("navbar").classList.toggle("active");
    document.getElementById("main").classList.toggle("active");
    document.getElementById("headerbelow").classList.toggle("active");
  };
  document.getElementById("mainIcon").onclick = () => {
    document.getElementById("navbar").classList.toggle("active");
    document.getElementById("main").classList.toggle("active");
    document.getElementById("headerbelow").classList.toggle("active");
  };

  //List view
  document.getElementById("listView").onclick = () => {
    globalView = 1;
    let length = document.getElementsByClassName(
      "lg:w-1/4 md:w-1/2 p-4 w-full"
    ).length;
    while (length) {
      document.getElementsByClassName(
        "lg:w-1/4 md:w-1/2 p-4 w-full"
      )[0].className = "lg:w-full md:w-full p-4 w-full";
      length--;
    }

    let length1 = document.getElementsByClassName(
      "block relative h-48 rounded overflow-hidden"
    ).length;
    while (length1) {
      document.getElementsByClassName(
        "block relative h-48 rounded overflow-hidden"
      )[0].className = "block relative h-auto rounded overflow-hidden";
      length1--;
    }
  };

  //Grid View
  document.getElementById("gridView").onclick = () => {
    globalView = 0;
    let length = document.getElementsByClassName(
      "lg:w-full md:w-full p-4 w-full"
    ).length;
    while (length) {
      document.getElementsByClassName(
        "lg:w-full md:w-full p-4 w-full"
      )[0].className = "lg:w-1/4 md:w-1/2 p-4 w-full";
      length--;
    }

    let length1 = document.getElementsByClassName(
      "block relative h-auto rounded overflow-hidden"
    ).length;
    while (length1) {
      document.getElementsByClassName(
        "block relative h-auto rounded overflow-hidden"
      )[0].className = "block relative h-48 rounded overflow-hidden";
      length1--;
    }
  };

  //Sorting
  document.getElementById("apply").onclick = async () => {
    await app.fetch(
      document.getElementById("site-search").value,
      document.getElementById("sorting").value
    );
    app.render();
  };

  //Filtering Via Category
  document.getElementById("navbarbtn").onclick = async () => {
    console.log(globalFilter);
    var ele = document.getElementsByClassName("filter");
    globalFilter = {};
    let listOfCats = [];
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].checked) {
        if (ele[i].name === "category") {
          listOfCats.push(ele[i].value);
          globalFilter[ele[i].name] = listOfCats;
        } else {
          globalFilter[ele[i].name] = ele[i].value;
        }
        variable = 1;
      }
    }
    await app.fetch(
      document.getElementById("site-search").value,
      document.getElementById("sorting").value
    );
    app.render();
  };

  //Clear Filters Button

  document.getElementById("clear").onclick = async () => {
    globalFilter = {};
    let i = 0;
    while (document.getElementsByClassName("filter")[i]) {
      document.getElementsByClassName("filter")[i].checked = false;
      i++;
    }
    await app.fetch(
      document.getElementById("site-search").value,
      document.getElementById("sorting").value
    );
    app.render();
  };
};
