# Moderation Chatbot with GPT-3 and Hasura

This directory contains a Node.js application for moderating user-generated content using ChatGPT. The application can
be deployed to various services that support Node.js applications. Before deploying, you will need to set up three
environment variables and obtain an OpenAI API key. This README provides detailed instructions on how to set up and
deploy the application.

You can read a
[step-by-step guide in our docs](https://hasura.io/docs/latest/event-triggers/recipes/moderate-user-content-with-gpt/overview)
or watch a [video tutorial on YouTube](#).

## Prerequisites

Before you begin, make sure you have the following prerequisites:

1. Node.js and npm (Node Package Manager) installed on your local machine.
2. An OpenAI API key. You can obtain one from the [OpenAI website](https://openai.com/blog/openai-api).
3. Access to a [Hasura instance](https://cloud.hasura.io), including the Hasura URL and admin secret.
4. Basic familiarity with deploying Node.js applications.

## Getting Started

Follow these steps to set up and deploy the handler:

1. Clone the repository to your local machine:

   ```shell
   git clone https://github.com/hasura/docs-sample-app.git
   ```

2. Navigate to the project directory:

   ```shell
   cd docs/sample-app/recipes/event-triggers/gpt-review-moderation
   ```

3. Install the required Node.js dependencies:

   ```shell
   npm install
   ```

4. Create a `.env` file in the project root directory:

   ```shell
   touch .env
   ```

5. Edit the `.env` file to add the following environment variables:

   ```dotenv
   # Hasura Configuration
   HASURA_URL=https://<YOUR-PROJECT-NAME>.hasura.app/v1/graphql
   HASURA_ADMIN_SECRET=your-hasura-admin-secret

   # OpenAI API Key
   OPENAI_KEY=your-openai-api-key
   ```

   Replace these values with your own Hasura URL, admin secret, and OpenAI API key.

6. Save and close the `.env` file.

## Deploying the Application

You can deploy this Node.js application to various cloud services or platforms that support Node.js deployments, such as
Render, AWS, or Azure. The specific deployment steps may vary depending on your chosen platform. Here's a general
outline of the deployment process:

1. **Choose a deployment platform**: Select a cloud service or hosting platform for your Node.js application. Heroku is
   a popular option for quick deployments.

2. **Create an account**: Sign up for an account on your chosen deployment platform if you don't already have one.

3. **Set up the deployment environment**: Follow the platform-specific instructions to configure your deployment
   environment. This may involve creating a new app or project and connecting it to your repository.

4. **Configure environment variables**: In the deployment platform's settings or configuration, add the same environment
   variables (HASURA_URL, HASURA_ADMIN_SECRET, OPENAI_KEY) as you did in the `.env` file on your local machine. Refer to
   your platform's documentation for guidance.

5. **Deploy the application**: Deploy your application to the chosen platform using the provided deployment commands or
   tools. Ensure that your application starts correctly.

## Usage

Once the application is deployed, it will be accessible via a URL provided by your deployment platform. You can pass
this to Hasura as an Event Trigger webhook.

## Troubleshooting

If you encounter any issues during deployment or usage, please refer to the platform-specific documentation and error
logs for troubleshooting guidance. Additionally, feel free to reach out to the us for assistance.

Happy moderating with ChatGPT and Hasura! If you have any questions or feedback, please don't hesitate to reach out to
the us.
