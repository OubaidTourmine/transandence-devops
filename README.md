# Khdima-Link

Khdima-Link is a recruitment platform built as a five-person team project for `ft_transcendence` at 1337 (42 Network).

### Technical Contributions

I was responsible for the infrastructure that brings the frontend, backend services, and databases together. My work focused on making the application easier for the team to run locally, diagnose when a service failed, and recover if data was lost.

- **Containerization and service orchestration** — Configured Docker Compose to run the frontend and five microservices: Identity, Communication, Company Jobs, Hiring, and Notification. Set up service networking, health checks, and persistent volumes.
- **Reverse proxy and routing** — Configured Nginx to serve the frontend and route requests to the appropriate backend service through a single entry point.
- **Monitoring and alerting** — Set up Prometheus, Grafana, Telegraf, and Blackbox Exporter to monitor service availability and collect infrastructure and database metrics. Provisioned dashboards and alerts for service failures and missing metrics.
- **Database integration and recovery** — Configured PostgreSQL and Redis, fixed a database integration issue in the Company Jobs service, automated backups for both databases, and added a PostgreSQL restore test script.

- **Team integration** — Gave the frontend and backend developers a shared environment where they could test their work together and reproduce integration issues.
- **Troubleshooting** — Used health checks and dashboards to identify which service was failing and help narrow down routing, startup, and database issues.
- **Operational readiness** — Made service availability visible to the team and gave them a repeatable way to check whether a PostgreSQL backup could be restored.
