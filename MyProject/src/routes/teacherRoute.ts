var express = require("express");
const router = express.Router();
require("core-js/actual/array/group-by");
import { authentication } from "../middleware/tokenauthentication";
import AppDataSource from "../data-source";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { Category } from "../entity/Category";
import { Repository } from "typeorm";
import { EnrolledCourse } from "../entity/EnrolledCourse";
import { group } from "console";

//Display all courses in Teacher Page
router.post("/teacherCourses", authentication, async (req, res) => {
  console.log(req.body);
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    var categoryData = await queryRunner.query(
      "select distinct(category) from course"
    );
    var result = await queryRunner.query(
      "select count(category) as count from course group by category order by count desc LIMIT 1;"
    );
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  //initially no courses
  if (typeof result[0] === "undefined") {
    return res.json({ error: "add courses" });
  }
  let maxRepeatedCategory = result[0].count;
  let skip = req.body.page * 4;
  let array = req.body.filter.category;
  let skip1 = req.body.diffPage * 8;
  let confirm = false;
  let query = "";
  let filter = "";
  let query1 = "";
  if (typeof req.body.search === "undefined") {
    for (let i = 0; i < categoryData.length; i++) {
      if (i == categoryData.length - 1) {
        query = query.concat(
          `(select * from course where category = '${categoryData[i].category}' limit 4 offset ${skip})`
        );
      } else {
        query = query.concat(
          `(select * from course where category = '${categoryData[i].category}' limit 4 offset ${skip}) Union `
        );
      }
    }
  } else {
    if (typeof array === "undefined") {
      if (req.body.search === "") {
        if (
          typeof req.body.filter.rating === "undefined" &&
          typeof req.body.filter.runningTime === "undefined"
        ) {
          for (let i = 0; i < categoryData.length; i++) {
            if (i == categoryData.length - 1) {
              query = query.concat(
                `(select * from course where category = '${categoryData[i].category}' order by ${req.body.sort} limit 4 offset ${skip})`
              );
            } else {
              query = query.concat(
                `(select * from course where category = '${categoryData[i].category}' order by ${req.body.sort} limit 4 offset ${skip}) Union `
              );
            }
          }
        } else {
          query = `select * from course where title like '%${req.body.search}%'`;
          if (typeof req.body.filter.rating !== "undefined") {
            query = query.concat(` and rating>${req.body.filter.rating} `);
          }
          if (typeof req.body.filter.runningTime !== "undefined") {
            query = query.concat(
              ` and runningTime>${req.body.filter.runningTime} `
            );
          }
          if (typeof req.body.sort !== "undefined") {
            query = query.concat(`order by ${req.body.sort}`);
          }
          confirm = true;
          query1 = query;
          query = query.concat(` limit 8 offset ${skip1}`);
        }
      } else {
        query = `select * from course where title like '%${req.body.search}%'`;
        if (typeof req.body.filter.rating !== "undefined") {
          query = query.concat(` and rating>${req.body.filter.rating}`);
        }
        if (typeof req.body.filter.runningTime !== "undefined") {
          query = query.concat(
            ` and runningTime>${req.body.filter.runningTime}`
          );
        }
        if (typeof req.body.sort !== "undefined") {
          query = query.concat(` order by ${req.body.sort}`);
        }
        confirm = true;
        query1 = query;
        console.log(skip1);
        query = query.concat(` limit 8 offset ${skip1}`);
      }
    } else {
      for (let i = 0; i < array.length; i++) {
        if (i == array.length - 1) {
          filter = filter.concat("'").concat(`${array[i]}`).concat("'");
        } else {
          filter = filter.concat("'").concat(`${array[i]}`).concat("',");
        }
      }
      query = `select * from course where category in (${filter})`;
      if (typeof req.body.search !== "undefined") {
        query = query.concat(` and title like '%${req.body.search}%'`);
      }
      if (typeof req.body.filter.rating !== "undefined") {
        query = query.concat(` and rating>${req.body.filter.rating} `);
      }
      if (typeof req.body.filter.runningTime !== "undefined") {
        query = query.concat(
          ` and runningTime>${req.body.filter.runningTime} `
        );
      }
      if (typeof req.body.sort !== "undefined") {
        query = query.concat(`order by ${req.body.sort}`);
      }
      confirm = true;
      query1 = query;
      query = query.concat(` limit 8 offset ${skip1}`);
    }
  }
  try {
    var data = await queryRunner.query(query);
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  if (confirm == true) {
    try {
      var data1 = await queryRunner.query(query1);
    } catch (error) {
      return res.json({ error: "Internal Server Error" });
    }
    queryRunner.release();
    return res.json({
      data: data,
      categoryData: categoryData,
      user: req.user,
      pages: Math.ceil(maxRepeatedCategory / 4),
      diffpage: Math.ceil(data1.length / 8),
      confirm: confirm,
    });
  }
  queryRunner.release();
  res.json({
    data: data,
    categoryData: categoryData,
    user: req.user,
    pages: Math.ceil(maxRepeatedCategory / 4),
    confirm: confirm,
  });
});

//Add a Course
router.post("/addCourse", authentication, async (req, res) => {
  console.log(req.body);
  let courseRepository = AppDataSource.getRepository(Course);
  let course = new Course();
  course.createdBy = req.user.id;
  course.title = req.body.title;
  course.description = req.body.description;
  course.runningTime = req.body.runningTime;
  course.category = req.body.category;
  course.image = req.body.image;
  try {
    await courseRepository.save(course);
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({ data: "success" });
});

//Add a Category
router.post("/addCategory", authentication, async (req, res) => {
  console.log(req.body);
  console.log("kkkkk");
  let categoryRepository = AppDataSource.getRepository(Category);
  let categor = new Category();
  categor.category = req.body.category;
  try {
    await categoryRepository.save(categor);
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({ data: "success" });
});

//Get all Categories
router.get("/getCategories", authentication, async (req, res) => {
  let categoryRepository = AppDataSource.getRepository(Category);
  try {
    var data = await categoryRepository.find();
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({ data: data });
});

//View a Course
router.post("/viewCourse", authentication, async (req, res) => {
  let courseId = req.body.courseId;
  let courseRepository = AppDataSource.getRepository("Course");
  let userRepository = AppDataSource.getRepository(User);
  try {
    var courseDetails = await courseRepository.findBy({ id: courseId });
    let author = courseDetails[0].createdBy;
    var authorDetails = await userRepository.findBy({ id: author });
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({
    courseDetails: courseDetails[0],
    authorDetails: authorDetails[0],
    userDetails: req.user,
  });
});

//Edit a Course
router.post("/editCourse", authentication, async (req, res) => {
  let editCourseId = req.body.editCourseId;
  let courseRepository = AppDataSource.getRepository("Course");
  let categoryRepository = AppDataSource.getRepository("Category");
  try {
    var courseDetails = await courseRepository.findBy({ id: editCourseId });
    var categoryDetails = await categoryRepository.find({});
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({
    courseDetails: courseDetails[0],
    categoryDetails: categoryDetails,
  });
});

//Delete a Course
router.post("/deleteCourse", authentication, async (req, res) => {
  let courseRepository = AppDataSource.getRepository(Course);
  let enrolledRepository = AppDataSource.getRepository(EnrolledCourse);
  try {
    await courseRepository.delete({ id: req.body.cid });
    await enrolledRepository.delete({ cid: req.body.cid });
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({ message: "success" });
});

//Save Edited Course
router.post("/saveEditedCourse", authentication, async (req, res) => {
  let courseRepository = AppDataSource.getRepository(Course);
  try {
    var courseDetails = await courseRepository.findOneBy({
      id: req.body.editCourseId,
    });
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  courseDetails.title = req.body.title;
  courseDetails.category = req.body.category;
  courseDetails.description = req.body.description;
  courseDetails.runningTime = req.body.runningTime;
  courseDetails.image = req.body.image;
  try {
    await courseRepository.save(courseDetails);
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  res.json({ message: "success" });
});

//View Students Page
router.get("/viewStudents", authentication, async (req, res) => {
  let queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    var datae = await queryRunner.query(
      "SELECT * FROM enrolled_course inner join course on enrolled_course.cid=course.id inner join user on enrolled_course.sid=user.id"
    );
  } catch (error) {
    return res.json({ error: "Internal Server Error" });
  }
  let sorted = datae.groupBy((item) => {
    return item.sid;
  });
  console.log(sorted);
  queryRunner.release();
  res.json({ datae: sorted, user: req.user });
});

module.exports = router;
