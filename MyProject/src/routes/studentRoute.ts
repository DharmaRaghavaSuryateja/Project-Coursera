var express = require("express");
const router = express.Router();
import { authentication } from "../middleware/tokenauthentication"
import AppDataSource from "../data-source"
import { User } from "../entity/User"
import { Course } from "../entity/Course"
import { Category } from "../entity/Category"
import { EnrolledCourse } from "../entity/EnrolledCourse"
import { type } from "os";

//Display all courses in Student Page
router.post("/studentCourses", authentication, async (req, res) => {
    console.log(req.body)
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    try{
    var categoryData = await queryRunner.query("select distinct(category) from course")
    var result = await queryRunner.query("select count(category) as count from course group by category order by count desc LIMIT 1;")
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
    let maxRepeatedCategory = (result[0].count);
    let skip = (req.body.page) * 4
    let array = (req.body.filter).category;
    let skip1 = (req.body.diffPage) * 8;
    let confirm = false;
    let query = ''
    let filter = ''
    let query1 = ''
    if (typeof req.body.search === "undefined") {
        for (let i = 0; i < categoryData.length; i++) {
            if (i == categoryData.length - 1) {
                query = query.concat(`(select * from course where category = '${categoryData[i].category}' limit 4 offset ${skip})`)
            }
            else {
                query = query.concat(`(select * from course where category = '${categoryData[i].category}' limit 4 offset ${skip}) Union `)
            }
        }
    }
    else {
        if (typeof array === "undefined") {
            if ((req.body.search) === "") {
                if (typeof ((req.body.filter).rating) === "undefined" && typeof ((req.body.filter).runningTime) === "undefined") {
                    for (let i = 0; i < categoryData.length; i++) {
                        if (i == categoryData.length - 1) {
                            query = query.concat(`(select * from course where category = '${categoryData[i].category}' order by ${req.body.sort} limit 4 offset ${skip})`)
                        }
                        else {
                            query = query.concat(`(select * from course where category = '${categoryData[i].category}' order by ${req.body.sort} limit 4 offset ${skip}) Union `)
                        }
                    }
                }
                else {
                    query = `select * from course where title like '%${req.body.search}%'`
                    if (typeof ((req.body.filter).rating) !== "undefined") {
                        query = query.concat(` and rating>${(req.body.filter).rating} `)
                    }
                    if (typeof ((req.body.filter).runningTime) !== "undefined") {
                        query = query.concat(` and runningTime>${(req.body.filter).runningTime} `)
                    }
                    if (typeof (req.body.sort) !== "undefined") {
                        query = query.concat(`order by ${(req.body.sort)}`)
                    }
                    confirm = true;
                    query1 = query
                    query = query.concat(` limit 8 offset ${skip1}`)
                }
            }
            else {
                query = `select * from course where title like '%${req.body.search}%'`
                if (typeof ((req.body.filter).rating) !== "undefined") {
                    query = query.concat(` and rating>${(req.body.filter).rating}`)
                }
                if (typeof ((req.body.filter).runningTime) !== "undefined") {
                    query = query.concat(` and runningTime>${(req.body.filter).runningTime}`)
                }
                if (typeof (req.body.sort) !== "undefined") {
                    query = query.concat(` order by ${(req.body.sort)}`)
                }
                confirm = true;
                query1 = query;
                console.log(skip1)
                query = query.concat(` limit 8 offset ${skip1}`)
            }
        }
        else {
            for (let i = 0; i < array.length; i++) {
                if (i == array.length - 1) {
                    filter = filter.concat("'").concat(`${array[i]}`).concat("'")
                }
                else {
                    filter = filter.concat("'").concat(`${array[i]}`).concat("',")
                }
            }
            query = `select * from course where category in (${filter})`
            if (typeof (req.body.search) !== "undefined") {
                query = query.concat(` and title like '%${req.body.search}%'`)
            }
            if (typeof ((req.body.filter).rating) !== "undefined") {
                query = query.concat(` and rating>${(req.body.filter).rating} `)
            }
            if (typeof ((req.body.filter).runningTime) !== "undefined") {
                query = query.concat(` and runningTime>${(req.body.filter).runningTime} `)
            }
            if (typeof (req.body.sort) !== "undefined") {
                query = query.concat(`order by ${(req.body.sort)}`)
            }
            confirm = true;
            query1 = query
            query = query.concat(` limit 8 offset ${skip1}`)
        }
    }
    try{
    var data = await queryRunner.query(query)
    }catch (error) {
    return res.json({ error: "Internal Server Error" })
     }
    if (confirm == true) {
        try{
        var data1 = await queryRunner.query(query1)
        }catch (error) {
        return res.json({ error: "Internal Server Error" })
        }
        queryRunner.release();
        return res.json({ data: data, categoryData: categoryData, user: req.user, pages: Math.ceil((maxRepeatedCategory) / 4), diffpage: Math.ceil((data1.length) / 8), confirm: confirm })
    }
    queryRunner.release();
    res.json({ data: data, categoryData: categoryData, user: req.user, pages: Math.ceil((maxRepeatedCategory) / 4), confirm: confirm })
});

//View Each Page
router.post("/addToTraining", authentication, async (req, res) => {
    let courseRepository = AppDataSource.getRepository(Course)
    let userRepository = AppDataSource.getRepository(User)
    let enrolledRepository = AppDataSource.getRepository(EnrolledCourse)
    try{
    var courseDetails = await courseRepository.findBy({ id: req.body.courseId })  
    var userDetails = await userRepository.findBy({ id: courseDetails[0].createdBy })
    var enrollDetails = await enrolledRepository.findBy({ sid: req.user.id })
    }catch(error)
    {
        return res.json({error:"Internal Server Error"})
    }
    res.json({ courseDetails: courseDetails[0], ownerDetails: userDetails[0], userDetails: req.user, enrollDetails: enrollDetails })
})

//Add to Training
router.post("/addedToTraining", authentication, async (req, res) => {
    let enrolledRepository = AppDataSource.getRepository(EnrolledCourse)
    let enroll = new EnrolledCourse();
    enroll.sid = req.body.sid
    enroll.cid = req.body.cid
    try{
    await enrolledRepository.save(enroll);
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
    res.json({ message: "success" })
})

//My Profile Page
router.get("/myProfile", authentication, async (req, res) => {
    try{
    var enrollCourseDetails = await AppDataSource.getRepository(EnrolledCourse).findBy({ sid: req.user.id })
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
    let array = [];
    for (let i = 0; i < enrollCourseDetails.length; i++) {
        array.push(enrollCourseDetails[i].cid)
    }
    console.log(array)
    const courseRepository = AppDataSource.getRepository(Course)
    //If My Profile is empty then array is empty then the below code throws an error.So using try and catch block
    try {
        var enrollDetails = await courseRepository.createQueryBuilder("course").where("course.id IN :ides", { ides: [array] }).getMany()
    } catch (error) {
        return res.json({ user: req.user,error: "Internal Server Error" })
    }
    res.json({ enrollDetails: enrollDetails, enrollTable: enrollCourseDetails, user: req.user })
})

//Mark as Completed
router.post("/markAsCompleted", authentication, async (req, res) => {
    let enrolledRepository = AppDataSource.getRepository(EnrolledCourse)
    try{
    await enrolledRepository.update({ sid: req.body.sid, cid: req.body.cid }, {
        isCompleted: req.body.isCompleted
    })
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
    res.json({ message: "success" })
})

//Delete from Training Path
router.post("/deleteFromTraining", authentication, async (req, res) => {
    let enrolledRepository = AppDataSource.getRepository(EnrolledCourse)
    try{
    await enrolledRepository.delete({ sid: req.body.sid, cid: req.body.cid })
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
    res.json({ message: "success" })
})

//Rate a Course
router.post("/rateCourse", authentication, async (req, res) => {
    console.log(req.body)
    let courseRepository = AppDataSource.getRepository(Course)
    await courseRepository.update({ id: req.body.courseId }, { rating: req.body.rating })
    let enrolledRepository = AppDataSource.getRepository(EnrolledCourse)
    try{
    await enrolledRepository.update({ sid: req.body.sid, cid: req.body.courseId }, {
        isRated: req.body.isRated
    })
    res.json({ message: 'success' })
    } catch (error) {
        return res.json({ error: "Internal Server Error" })
    }
})
module.exports = router
