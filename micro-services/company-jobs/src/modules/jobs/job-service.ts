import { findJobs , countJobs , findJobById } from "./job-repository.js"
import { WorkMode } from "../../generated/prisma/enums.js";

export async function getPaginatedJobs(page : number , limit : number , search : string , location : string , workMode:WorkMode | undefined) 
{
    const skip = (page - 1) * limit
    const totalJobs = await countJobs(search ,location ,workMode) 
    const jobs = (await findJobs(skip , limit , search , location , workMode )).map(job => ({
            id : job.id,
            title : job.title,
            description : job.description,
            location : job.location, 
            workMode : job.workMode,
            companyName : job.company.name
        }))
    return {
        "page" : page,
        "limit" : limit,
        "skip" : skip,
        "total" : totalJobs ,
        "totalPages" :   Math.ceil(totalJobs / limit) , 
        "jobs" : jobs
    }
}

export async function getJobById(id: number) {

    const job = await findJobById(id)
    if (!job)
        return null
    return {
        id : job.id,
        title : job.title,
        description : job.description,
        location : job.location, 
        workMode : job.workMode,
        companyName : job.company.name
    }
}
