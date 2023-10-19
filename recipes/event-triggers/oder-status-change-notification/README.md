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

![alt text](/resource/img/create-trigger.jpg)
