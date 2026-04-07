import { Router } from "express";
import { AddSchool, GetAllSchools } from "../controllers/school.controller.js";



const schoolrouter = Router();

schoolrouter.post("/add", AddSchool);
schoolrouter.get("/getall", GetAllSchools);


export default schoolrouter;