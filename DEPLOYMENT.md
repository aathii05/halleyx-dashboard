# Deployment Guide - Halleyx Dashboard

This guide provides instructions for deploying the Halleyx Dashboard to production.

## 1. Backend (Spring Boot) on Render

1.  **Create a New Web Service**:
    *   Connect your GitHub repository.
    *   Select the `backend/dashborad2` directory as the **Root Directory** (or just use the root and specify the build command).
2.  **Runtime**: Select **Docker**.
3.  **Environment Variables**:
    *   `SPRING_DATASOURCE_URL`: `jdbc:mysql://your-db-host:3306/halleyx_dashboard`
    *   `SPRING_DATASOURCE_USERNAME`: `root`
    *   `SPRING_DATASOURCE_PASSWORD`: `your-db-password`
4.  **Database**: You can use Render's Managed PostreSQL (but you'd need to change the DB driver in `pom.xml`) or a managed MySQL service like **Aiven** or **CloudAMQP** (if they offer MySQL).

## 2. Frontend on Netlify

1.  **Update backend URL**: 
    - Open `frontend/api.js`.
    - Replace `https://halleyx-backend.onrender.com/orders` with your actual Render URL.
2.  **Deploy**:
    - Connect your GitHub repository to Netlify.
    - Set the **Base directory** to `frontend`.
    - Set the **Publish directory** to `.`.
    - (Optional) Use a `netlify.toml` for redirect rules if using a SPA router (not needed here as we use separate `.html` files).

## 3. Local Testing with Docker

If you have Docker installed, you can test the entire stack locally:
```bash
docker-compose up --build
```
This will start:
-   **MySQL** on port `3306`.
-   **Backend** on port `8080`.
-   **Frontend** (Nginx) on port `80`.

Open [http://localhost](http://localhost) to view the app.

## 4. Database Setup

Ensure your production database has a schema named `halleyx_dashboard`. Spring Boot will automatically create tables because of `spring.jpa.hibernate.ddl-auto=update`.
