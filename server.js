const express = require("express")
const app = express()
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
const paypal = require('@paypal/checkout-server-sdk');

// Creating an environment
let clientId = "seller_client_id";
let clientSecret = "seller_secret_id";

// This sample uses SandboxEnvironment. In production, use LiveEnvironment
let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/pay', async (req, res) => {

    let request = null;

    request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "AUD",
                    "value": "200",
                },
            }
         ]
    });
    client.execute(request).then((createdOrderDetails)=> {
        return res.json(createdOrderDetails.result);
    }).catch((error) => console.log(error)) 
});

app.post('/success', async(req, res) => {
    const { token: orderId } = req.body;

        let request = new paypal.orders.OrdersCaptureRequest(orderId);

        request.requestBody({});
        try {
        let response = await client.execute(request);
        return res.json(response.result);
    } catch(err) {
        console.log('ERROR', err)
    }
});

app.listen(4001, () => console.log('Server Started'));