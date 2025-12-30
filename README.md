# Webhooks Monorepo

This project is a monorepo demonstration of a Webhook architecture using a **Learning Management System (LMS)** and an **Automator** service. The LMS service emits webhooks upon events like product purchases, which the Automator service consumes to trigger downstream actions (like sending invites).

## 📁 Project Structure

This repository is managed as a monorepo using `pnpm` workspaces.

* **`apps/lms`**: The core service where users register webhooks and trigger purchase events.
* **`apps/automator`**: A worker/consumer service that receives webhook payloads and executes automated tasks.
* **`tsconfig.json`**: Base TypeScript configuration shared across the monorepo.

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* pnpm (v10.26.2 or higher)

### Installation

Install dependencies for all projects from the root:

```bash
pnpm install

```

### Running the Services

You can run both services simultaneously or individually using the root scripts:

```bash
# Run all apps in parallel (dev mode)
pnpm dev

# Run only the LMS
pnpm dev:lms

# Run only the Automator
pnpm dev:automator

```

## 🛠 Services Overview

### 1. LMS Service (`apps/lms`)

Acts as the **Webhook Provider**. It runs on port `3001` by default.

* **Register Webhook**: `POST /api/register-webhook`
* Registers a URL and token to listen for specific events (e.g., `purchase`).


* **Trigger Purchase**: `POST /api/purchase`
* Simulates a course purchase and broadcasts the payload to all registered "purchase" webhooks.



### 2. Automator Service (`apps/automator`)

Acts as the **Webhook Consumer**. It runs on port `3000` by default.

* **Webhook Endpoint**: `POST /webhook`
* Receives data from the LMS.
* **Security**: Requires a Bearer token matching the `secret` defined in `.env`.
* **Action**: Currently logs the receipt of the payload (intended for Discord invites or email automation).



## 🔐 Environment Variables

Each app requires its own `.env` file within its respective directory.

