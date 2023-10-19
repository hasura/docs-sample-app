require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const prompt = `There is change status of order. Changes in status as follow:`;

// get express sorted
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// notification for user about change in status of order
async function sendNotification(userId, orderId, orderStatus) {
  const response = await fetch(process.env.HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: `
                mutation InsertNotification($user_id: uuid!, $order_id: uuid!, $message: String!) {
                    insert_notifications_one(object: {user_id: $user_id, message: $message}) {
                        id
                    }
                }
            `,
      variables: {
        user_id: userId,
        message: `Status of Order:${orderId} has been changed to: ${orderStatus}.`,
      },
    }),
  });
  console.log(
    `Notification sent. The user has received the following notification: Status of Order:${orderId} has been changed to: ${orderStatus}.`
  );
  const { data } = await response.json();
  return data.insert_notifications_one;
}

// now we can write the actual handler using functions
app.post('/status-change', async (req, res) => {
  // check the header for auth
  const authHeader = req.headers['secret-authorization-string'];
  if (authHeader !== 'super_secret_string_123') {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // parse the status from the event payload
  const orderStatus = req.body.event.data.new.order_status;
  const orderId = req.body.event.data.new.order_id;
  const userId = req.body.event.data.new.user_id;
  
  // send notification to user
  await sendNotification(userId, orderId, orderStatus);

  // send some JSON to the client
  res.json({
    orderId: orderId,
    orderStatus: orderStatus
  });
});

// start the server
app.listen(4000, () => {
  console.log('Server started on port 4000');
});
