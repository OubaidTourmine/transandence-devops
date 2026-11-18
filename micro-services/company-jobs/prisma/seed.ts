
import { prisma } from "../src/lib/prisma.js";
import { WorkMode, JobStatus } from "../src/generated/prisma/enums.js";

const job = (
    title: string,
    location: string,
    workMode: WorkMode,
    status: JobStatus
) => ({
    title,
    description: `Test job for ${title}.`,
    location,
    workMode,
    status
});

const companies = [
    {
        name: "Atlas Dev Demo",
        jobs: [
            job("Backend Developer", "Casablanca", WorkMode.REMOTE, JobStatus.PUBLISHED),
            job("Frontend Developer", "Casablanca", WorkMode.ONSITE, JobStatus.PUBLISHED),
            job("Full Stack Developer", "Rabat", WorkMode.HYBRID, JobStatus.PUBLISHED),
            job("DevOps Engineer", "Marrakech", WorkMode.REMOTE, JobStatus.PUBLISHED),
            job("Backend Developer", "Casablanca", WorkMode.HYBRID, JobStatus.DRAFT),
            job("QA Engineer", "Casablanca", WorkMode.ONSITE, JobStatus.CLOSED)
        ]
    },
    {
        name: "Maghreb Cloud Demo",
        jobs: [
            job("Backend Developer", "Casablanca", WorkMode.REMOTE, JobStatus.PUBLISHED),
            job("Node.js Developer", "Rabat", WorkMode.HYBRID, JobStatus.PUBLISHED),
            job("Cloud Engineer", "Casablanca", WorkMode.HYBRID, JobStatus.PUBLISHED),
            job("Software Engineer", "Tanger", WorkMode.ONSITE, JobStatus.PUBLISHED),
            job("Data Engineer", "Rabat", WorkMode.REMOTE, JobStatus.DRAFT),
            job("Backend Developer", "Rabat", WorkMode.ONSITE, JobStatus.CLOSED)
        ]
    },
    {
        name: "Sahara Digital Demo",
        jobs: [
            job("Backend Developer", "Casablanca", WorkMode.HYBRID, JobStatus.PUBLISHED),
            job("Frontend Developer", "Marrakech", WorkMode.REMOTE, JobStatus.PUBLISHED),
            job("QA Engineer", "Rabat", WorkMode.HYBRID, JobStatus.PUBLISHED),
            job("Full Stack Developer", "Casablanca", WorkMode.ONSITE, JobStatus.PUBLISHED),
            job("DevOps Engineer", "Fes", WorkMode.REMOTE, JobStatus.DRAFT),
            job("Mobile Developer", "Agadir", WorkMode.HYBRID, JobStatus.CLOSED)
        ]
    }
];

async function main() {
    for (const companyData of companies) {
        const existing = await prisma.company.findFirst({
            where: { name: companyData.name }
        });

        if (existing) {
            console.log(`Skipping existing company: ${companyData.name}`);
            continue;
        }

        await prisma.company.create({
            data: {
                name: companyData.name,
                jobs: {
                    create: companyData.jobs
                }
            }
        });

        console.log(`Created ${companyData.name} with ${companyData.jobs.length} jobs`);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
