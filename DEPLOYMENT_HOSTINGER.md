# Deployment to Hostinger Shared Hosting (notesvault.in)

This document outlines the automated deployment process for the NotesVault application (React frontend + PHP API) to the Hostinger shared hosting environment associated with `notesvault.in`.

## Goal

To establish a reliable, automated workflow for deploying updates from the `master` branch of the GitHub repository (`RSuyash/NotesVault`) to the Hostinger server's `/public_html/` directory.

## Initial Problems Encountered

1.  **Login Errors:** The initial login functionality on the live site was failing with a `SyntaxError: Unexpected token '<'`, indicating the PHP API was returning HTML instead of JSON. This was traced back to incorrect server configuration (initially thought to be Vercel, later confirmed as Hostinger) and potential PHP errors preventing proper JSON responses.
2.  **Configuration Management:** Development database credentials and JWT keys were present in the main `api/config.php`, unsuitable and insecure for production.
3.  **Deployment Issues:** Early attempts to automate deployment using GitHub Actions resulted in accidental deletion of necessary files on the server (like `api/config.prod.php` and the `api` directory itself) due to misconfiguration of the deployment action (`SamKirkland/FTP-Deploy-Action`) and how it handled directory synchronization.

## Solution: Automated Deployment via GitHub Actions

The final solution utilizes a GitHub Actions workflow (`.github/workflows/deploy-hostinger.yml`) to manage the build and deployment process securely and reliably.

### Key Components

1.  **React Frontend:** Located in `notesvault-react-mvp/`. Built using `npm run build` which outputs static files to `notesvault-react-mvp/dist/`.
2.  **PHP API:** Located in `api/`. Handles backend logic and database interaction.
3.  **`.htaccess`:** Located at the project root (`./.htaccess`). This file is crucial for the application to function correctly on the Hostinger Apache server. Its primary roles are:
    *   **SPA Routing:** It rewrites requests for non-existent files/directories (like `/login`, `/dashboard`, etc.) to `/index.html`, allowing the React Router frontend application to handle the routing internally.
    *   **API Exclusion:** It ensures that requests starting with `/api/` are *not* rewritten, allowing them to be correctly processed by the PHP scripts in the `api/` directory.
4.  **Environment Configuration:**
    *   `api/config.php`: Contains default settings (suitable for local development) and logic to load production overrides.
    *   `api/config.prod.php`: **Generated dynamically during the workflow run.** Contains production-specific database credentials and JWT secret key, populated from GitHub Secrets. This file is **not** stored in the repository and is excluded via `.gitignore`.
5.  **GitHub Secrets:** Sensitive credentials required for deployment are stored securely in the repository's settings (**Settings** -> **Secrets and variables** -> **Actions**):
    *   `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`: Hostinger MySQL database credentials.
    *   `JWT_SECRET_KEY`: Production JWT secret key.
    *   `HOSTINGER_FTP_SERVER`, `HOSTINGER_FTP_USERNAME`, `HOSTINGER_FTP_PASSWORD`: Hostinger FTP/SFTP credentials.
6.  **GitHub Actions Workflow (`.github/workflows/deploy-hostinger.yml`):** Defines the automated steps triggered on pushes to the `master` branch.

### Workflow Breakdown (`deploy-hostinger.yml`)

1.  **`on: push: branches: [ master ]`**: Triggers the workflow on every push to the `master` branch.
2.  **`jobs: build-and-deploy: runs-on: ubuntu-latest`**: Defines a job that runs on a standard GitHub-hosted runner.
3.  **`steps:`**:
    *   **Checkout code**: Downloads the repository code.
    *   **Set up Node.js**: Configures the Node.js environment needed for the React build.
    *   **Install Frontend Dependencies**: Runs `npm ci` in `notesvault-react-mvp/` to install necessary packages.
    *   **Build React App**: Runs `npm run build` in `notesvault-react-mvp/` to generate the production build in `notesvault-react-mvp/dist/`.
    *   **Generate Production Config for API**: Uses `echo` commands and GitHub secrets (`${{ secrets.DB_HOST }}`, etc.) to create the `api/config.prod.php` file within the runner's workspace.
    *   **Prepare Staging Directory**: This step builds the complete desired structure of the `/public_html/` directory within the temporary `deploy_staging` folder inside the GitHub Actions runner:
        *   Creates the `deploy_staging` directory.
        *   Copies the entire React build output (`notesvault-react-mvp/dist/*`) into `deploy_staging/`.
        *   Copies the essential root `.htaccess` file into `deploy_staging/`.
        *   Copies the necessary contents of the `api/` directory (using `rsync` to handle exclusions like logs) into `deploy_staging/api/`.
        *   Copies the *dynamically generated* `api/config.prod.php` (containing production secrets) into `deploy_staging/api/`.
        *   **Why this is important:** By assembling the *complete and correct* file structure in `deploy_staging` first, we know exactly what should be on the server.
    *   **Deploy Staging Directory to Hostinger**: This single deployment step uploads the *entire* contents of the prepared `deploy_staging` directory.
        *   Uses `SamKirkland/FTP-Deploy-Action`.
        *   Connects using the `HOSTINGER_FTP_*` secrets.
        *   Sets `local-dir: ./deploy_staging/` (the fully prepared source).
        *   Sets `server-dir: /public_html/` (the destination).
        *   Uses **`dangerous-clean-slate: true`**: This option tells the action to make the `server-dir` (`/public_html/`) an *exact mirror* of the `local-dir` (`./deploy_staging/`). It achieves this by deleting any file or folder present in `/public_html/` that is *not* present in `deploy_staging` before uploading the contents of `deploy_staging`.
        *   **How this prevents deletions:** Unlike previous attempts with multiple deployment steps (where one step might delete files needed by another), this single step ensures that everything needed (including `.htaccess` and the generated `config.prod.php`) is present in the `deploy_staging` source. Therefore, the `dangerous-clean-slate` option will *not* delete these essential files because they exist in the source directory being deployed. It only deletes files left over from previous failed deployments or files not intended to be part of the current deployment.

### Why This Approach Works

*   **Atomicity:** The staging directory ensures all necessary files are prepared *before* deployment begins.
*   **Cleanliness:** Using `dangerous-clean-slate: true` guarantees that the server's `/public_html/` directory reflects the exact state of the intended deployment, removing old or unwanted files automatically.
*   **Security:** Sensitive credentials are never stored in the code; they are injected securely from GitHub Secrets during the workflow run.
*   **Reliability:** Automates the build and deployment process, reducing manual errors.
*   **Correct Configuration:** Dynamically generates the production configuration file (`api/config.prod.php`) ensuring the live site uses the correct database and JWT key.

### Monitoring

Deployments can be monitored via the **Actions** tab in the `RSuyash/NotesVault` GitHub repository. Successful runs will have a green checkmark; failures will have a red X, allowing inspection of logs for troubleshooting.