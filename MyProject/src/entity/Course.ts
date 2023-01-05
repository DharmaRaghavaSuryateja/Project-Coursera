import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { EnrolledCourse } from "./EnrolledCourse"

@Entity()
export class Course {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable:false})
    createdBy: string

    @Column({nullable:false})
    title: string

    @Column({nullable:false})
    category: string

    @Column({nullable:false,type:"varchar",length:500})
    description:string

    @Column({nullable:false})
    runningTime:number

    @Column()
    image:string

    @Column({default:5})
    rating:number
}