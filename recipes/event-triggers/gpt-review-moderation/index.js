require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const openai = require('openai');

// create a new OpenAI client
const newOpenAI = new openai.OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const prompt = `You are a content moderator for SuperStore.com. A customer has left a review for a product they purchased. Your response should only be a JSON object with two properties: "feedback" and "is_appropriate". The "feedback" property should be a string containing your response to the customer only if the review "is_appropriate" value is false. The feedback should be on why their review was flagged as inappropriate, not a response to their review. The "is_appropriate" property should be a boolean indicating whether or not the review contains inappropriate content. The review is as follows:`;

// get express sorted
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// send the review to gpt from the handler
async function checkReviewWithChatGPT(reviewText) {
  try {
    const moderationReport = await newOpenAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `${prompt} ${reviewText}`,
        },
      ],
    });
    return JSON.parse(moderationReport.choices[0].message.content);
  } catch (err) {
    return err;
  }
}

// if GPT is happy with the review, update it via Hasura to be visible
async function markReviewAsVisible(userReview, reviewId) {
  const response = await fetch(process.env.HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: `
                mutation UpdateReviewToVisible($review_id: uuid!) {
                    update_reviews_by_pk(pk_columns: {id: $review_id}, _set: {is_visible: true}) {
                        id
                    }
                }
            `,
      variables: {
        review_id: reviewId,
      },
    }),
  });
  console.log(`🎉 Review approved: ${userReview}`);
  const { data } = await response.json();
  return data.update_reviews_by_pk;
}

// if GPT isn't happy with the review, new notification for user
async function sendNotification(userReview, userId, reviewFeedback) {
  const response = await fetch(process.env.HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: `
                mutation InsertNotification($user_id: uuid!, $review_feedback: String!) {
                    insert_notifications_one(object: {user_id: $user_id, message: $review_feedback}) {
                        id
                    }
                }
            `,
      variables: {
        user_id: userId,
        review_feedback: reviewFeedback,
      },
    }),
  });
  console.log(
    `🚩 Review flagged. This is not visible to users: ${userReview}\n🔔 The user has received the following notification: ${reviewFeedback}`
  );
  const { data } = await response.json();
  return data.insert_notifications_one;
}

// now we can write the actual handler using these functions
app.post('/check-review', async (req, res) => {
  // check the header for auth
  const authHeader = req.headers['secret-authorization-string'];
  if (authHeader !== 'super_secret_string_123') {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // parse the review from the event payload
  const userReview = req.body.event.data.new.text;
  const userId = req.body.event.data.new.user_id;

  // check the review GPT
  const moderationReport = await checkReviewWithChatGPT(userReview);

  // check results for whether or not appropriate
  if (moderationReport.is_appropriate) {
    await markReviewAsVisible(userReview, req.body.event.data.new.id);
  } else {
    await sendNotification(userReview, userId, moderationReport.feedback);
  }

  // send some JSON to the client
  res.json({
    GPTResponse: moderationReport,
  });
});

// start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});
