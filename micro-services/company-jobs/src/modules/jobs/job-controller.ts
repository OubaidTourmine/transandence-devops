import type { Response , Request , NextFunction} from 'express'
import {getPaginatedJobs  , getJobById as getOneJob}   from './job-service.js'

import { WorkMode } from "../../generated/prisma/enums.js";

export async function getJobs(req : Request, res :Response , next :NextFunction)  {
    if (req.query.page !== undefined && typeof req.query.page !== "string") {
        res.status(400).json({ error: "Invalid page parameter" });
        return;
    }
    if (req.query.limit !== undefined && typeof req.query.limit !== "string") {
        res.status(400).json({ error: "Invalid limit parameter" });
        return;
    }
    const rawPage = String(req.query.page ?? 1);
    const rawLimit = String(req.query.limit ?? 10);

    if (!/^[0-9]+$/.test(rawPage)) {
        res.status(400).json({
            error: "Invalid page parameter"
        });
        return;
    }

    if (!/^[0-9]+$/.test(rawLimit)) {
        res.status(400).json({
            error: "Invalid limit parameter"
        });
        return;
    }
    const page   : number = Number(rawPage)
    const limit  : number = Number(rawLimit)
    const search : string = typeof req.query.search === "string" ? req.query.search.trim() : ""
    const location : string = typeof req.query.location === "string" ? req.query.location.trim() : ""
    const workStatus = req.query.workMode
    let workMode : WorkMode | undefined
    if (workStatus !== undefined)
    {
        if (
            workStatus === WorkMode.REMOTE ||
            workStatus === WorkMode.HYBRID ||
            workStatus === WorkMode.ONSITE
        ) 
        {
            workMode = workStatus;
        } else 
        {
            res.status(400).json({
                error: "Invalid work mode"
            });
            return; 
        }
    }
   if (!Number.isSafeInteger(page) || page <= 0) {
        res.status(400).json({
            error: "Invalid page parameter"
        });
        return;
    }

    if (!Number.isSafeInteger(limit) || limit <= 0 || limit > 100) {
        res.status(400).json({
            error: "Invalid limit parameter"
        });
        return;
    }
    try{
        const responseObject = await getPaginatedJobs(page , limit, search , location , workMode)
        res.status(200).json(responseObject)
    }
    catch(error){
     next(error)   
    };
}


export async function getJobById(req: Request, res: Response ,next :NextFunction) {
    const param : string = String(req.params.id)
    if (!(/^[0-9]+$/.test(param)))
    {
        res.status(400).json({error: "Invalid job ID" })
        return
    }
    const id : number = Number(param)
   if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647) {
    res.status(400).json({ error: "Invalid job ID" });
    return;
}
    try {

        const job = await getOneJob(id)
        if (!job){
            res.status(404).json({"error": "Job not found"})
            return
        }
        res.status(200).json(job)
    }
    catch(error){
     next(error)   
    };
}