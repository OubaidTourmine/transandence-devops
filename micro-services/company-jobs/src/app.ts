import express  from "express"
import RouterJobs from "./modules/jobs/job-routes.js"
import  {errorHandler} from "./middleware/error-handler.js"
const app = express()

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "company-jobs"
  });
});


app.use("/api/company-jobs/jobs" , RouterJobs)
app.use(errorHandler)

export default app
