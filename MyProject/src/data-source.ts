import "reflect-metadata"
import { DataSource } from "typeorm"
const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "Goldtre9",
  database: "Project_Data",
  synchronize: false,
  logging: false,
  entities: ["./src/entity/*.ts"],
  migrations: [],
  subscribers: [],
})
AppDataSource.initialize().then(() => {
  console.log("Connected to Database")
}).catch((error) => {
  console.log("Unable to Connect to data" + error)
})
export default AppDataSource