import express  from "express"
import RouterJobs from "./modules/jobs/job-routes.js"
import  {errorHandler} from "./middleware/error-handler.js"
const app = express()



app.use("/api/company-jobs/jobs" , RouterJobs)
app.use(errorHandler)

export default app