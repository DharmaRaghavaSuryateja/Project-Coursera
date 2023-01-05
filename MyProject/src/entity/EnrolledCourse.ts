import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinTable, ManyToMany, } from "typeorm"
import {Course} from "./Course"
import {User} from "./User"

@Entity()
export class EnrolledCourse {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({nullable:false})
    sid:string

    @Column({nullable:false})
    cid: string

    @Column({nullable:false,default:false})
    isCompleted:boolean

    @Column({ nullable: false, default: false })
    isRated: boolean
}
