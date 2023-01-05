window.onload = async () => {
  let token = localStorage.getItem("token");

  let response = await fetch("http://localhost:5000/viewStudents", {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  let data = await response.json();
  console.log(data);
  document.getElementById(
    "profileHeading"
  ).innerHTML = `Welcome Back, ${data.user.name}`;
  async function fun(value, sort) {
    console.log(value);
    let info = Object.values(data.datae);
    console.log(info);
    if (typeof value !== "undefined") {
      let layout = document.getElementById("layout");
      while (layout.firstChild) {
        layout.removeChild(layout.firstChild);
      }
      info = info.filter((item) => {
        return item[0].name.includes(value) === true;
      });
    }
    if (typeof sort !== "undefined") {
      if (sort === "low") {
        info.sort(function (a, b) {
          return a.length - b.length;
        });
      } else if (sort === "high") {
        info.sort(function (a, b) {
          return b.length - a.length;
        });
      }
    }
    console.log(info);
    for (let i = 0; i < info.length; i++) {
      let count = 0;
      let structure = document.createElement("div");
      structure.className = "flow-root";
      let ul = document.createElement("ul");
      ul.role = "list";
      ul.className = "divide-y divide-gray-200 dark:divide-gray-700 border-b-2";
      let li = document.createElement("li");
      li.className = "py-3 sm:py-4";
      let outerdiv = document.createElement("div");
      outerdiv.className = "flex items-center space-x-4";
      let innerdiv1 = document.createElement("div");
      innerdiv1.className = "flex-1 min-w-0";
      let p1 = document.createElement("p");
      p1.innerHTML = info[i][0].name;
      let p2 = document.createElement("p");
      p2.innerHTML = info[i][0].email;
      let innerdiv2 = document.createElement("div");
      innerdiv2.className =
        " text-base font-semibold text-gray-900 dark:text-white block";
      innerdiv2.innerHTML = info[i].length + "";
      innerdiv1.appendChild(p1);
      innerdiv1.appendChild(p2);
      outerdiv.appendChild(innerdiv1);
      outerdiv.appendChild(innerdiv2);
      li.appendChild(outerdiv);
      ul.appendChild(li);
      structure.appendChild(ul);
      let section = document.createElement("section");
      section.className = "text-gray-600 body-font";
      let container = document.createElement("div");
      container.className = "container px-5 py-14 mx-auto";
      container.id = "container";
      let inncontainer = document.createElement("div");
      inncontainer.className = "flex flex-wrap -m-4";
      for (let j = 0; j < info[i].length; j++) {
        let courseStructure = document.createElement("div");
        courseStructure.className = "p-4 lg:w-1/3";
        let courseBody = document.createElement("div");
        courseBody.className =
          "h-full bg-gray-100 bg-opacity-75 px-8 pt-8 pb-10 rounded-lg overflow-hidden text-center relative";
        let difficon = document.createElement("div");
        difficon.innerHTML = '<i class="fa-solid fa-user"></i>';
        difficon.className =
          "text-xs title-font font-medium text-gray-400 mb-1";
        let h2 = document.createElement("h2");
        h2.className =
          "tracking-widest text-xs title-font font-medium text-gray-400 mb-1";
        h2.innerHTML = info[i][j].category;
        let h1 = document.createElement("h1");
        h1.className =
          "title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3";
        h1.innerHTML = info[i][j].title;
        let p = document.createElement("p");
        p.className = "leading-relaxed mb-3";
        if (info[i][j].isCompleted == 1) {
          p.innerHTML = "Course Status : Completed ";
        } else {
          p.innerHTML = "Course Status : Pending ";
        }
        let a = document.createElement("a");
        a.className = "text-indigo-500 inline-flex items-center";
        a.innerHTML = "View Course ";
        let icon = document.createElement("span");
        icon.classList = "ml-2";
        icon.innerHTML = '<i class="fa-sharp fa-solid fa-right-long"></i>';
        a.appendChild(icon);
        if (info[i][j].createdBy === data.user.id) {
          courseBody.appendChild(difficon);
        }
        courseBody.appendChild(h2);
        courseBody.appendChild(h1);
        courseBody.appendChild(p);
        courseBody.appendChild(a);
        courseStructure.appendChild(courseBody);
        inncontainer.appendChild(courseStructure);
        a.onclick = () => {
          localStorage.setItem("courseId", info[i][j].cid);
          window.location.assign("./viewCourse.html");
        };
      }
      container.appendChild(inncontainer);
      section.appendChild(container);
      structure.appendChild(container);
      document.getElementById("layout").appendChild(structure);
      ul.onclick = () => {
        container.classList.toggle("active");
      };
    }
  }
  fun();

  document.getElementById("site-search").onkeypress = (e) => {
    if (e.keyCode === 13) {
      fun(
        document.getElementById("site-search").value,
        document.getElementById("sorting").value
      );
    }
  };
  document.getElementById("apply").onclick = (e) => {
    fun(
      document.getElementById("site-search").value,
      document.getElementById("sorting").value
    );
  };
};
