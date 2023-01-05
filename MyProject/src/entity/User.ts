import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import { EnrolledCourse } from "./EnrolledCourse"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable:false})
    name: string

    @Column({unique:true,nullable:false})
    email: string

    @Column({nullable:false})
    password: string

    @Column()
    occupation:string
}
