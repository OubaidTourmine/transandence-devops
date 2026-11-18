import { prisma } from "../../lib/prisma.js";
import { WorkMode } from "../../generated/prisma/enums.js";
import { JobStatus } from "../../generated/prisma/enums.js";


export async function findJobs(skip: number, limit: number, search: string, location: string, workMode:WorkMode | undefined ) {
    return prisma.job.findMany({
        where: {
            title: {
                contains: search,
                mode: "insensitive"
            },
            location: {
                contains: location,
                mode: "insensitive"
            },
            ...(workMode !== undefined ? { workMode } : {}),
            status : JobStatus.PUBLISHED

        },
        skip: skip,
        take: limit,
        orderBy: {
            id: "asc"
        },
        include: {
            company: {
                select: {
                    name: true
                }
            }
        }
    })
}

export async function countJobs(search: string , location : string , workMode:WorkMode | undefined ) {
    return prisma.job.count(
        {
        where: {
            ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
            ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
            ...(workMode !== undefined ? { workMode } : {}),
            status : JobStatus.PUBLISHED,

        }
    });
}

export async function findJobById(id: number) {
    return await prisma.job.findUnique({
        where : {
            id ,
            status : JobStatus.PUBLISHED
        },
        include : {
            company : {
                select : {
                    name : true
                }
            }
        }
    })
}