import { initServer } from "./config/app.js";
import { config } from "dotenv";
import { createAdminDefault } from "./src/admin/admin.controller.js"
import { connect } from "./config/mongo.js";

config()
connect()
createAdminDefault()
initServer()