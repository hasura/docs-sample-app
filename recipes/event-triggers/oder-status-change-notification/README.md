# Send a Notification when Order Status Changes

## Introduction
Using Event Triggers allows you to call a webhook with a contextual payload whenever a specific event occurs in your database. 
In this recipe, we'll create an Event Trigger that will fire whenever status of order changes. We'll then send a notification to that user.

> **_NOTE:_** This quickstart/recipe is dependent upon the docs e-commerce sample app. If you haven't already deployed the sample app, you can do so with one click below. 
> If you've already deployed the sample app, simply use [your existing project](https://cloud.hasura.io/).

## Prerequisites
Before getting started, ensure that you have the following in place:
* The docs e-commerce sample app deployed to Hasura Cloud.

## Our model
Event Triggers are designed to run when specific operations occur on a table, such as insertions, updates, and deletions. When architecting your own Event Trigger, you need to consider the following:

* Which table's changes will initiate the Event Trigger?
* Which operation(s) on that table will initiate the Event Trigger?
* What should my webhook do with the data it receives?

# Step 1: Create the Event Trigger

Head to the `Events` tab of the Hasura Console and click `Create`:

![alt text](create-trigger.jpg)

# Step 2: Configure the Event Trigger

First, provide a name for your trigger, e.g., `order_status_change`. Choose the `public` schema and the `orders` table. 
Then, select the `update` operation under Trigger Operations.
Then, select the `status` column under `Listen columns for update`.

Finally, enter a webhook URL that will be called when the event is triggered. This webhook will be responsible for parsing the body of the request and sending the email to the new user; it can be hosted anywhere, and written in any language you like.

The route on our webhook we'll use is /status-update. Below, we'll see what this looks like with a service like ngrok, but the format will follow this template:

`https://<your-webhook-url>/status-update`
![alt text](create-trigger-step-2.jpg)


