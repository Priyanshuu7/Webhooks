import express from 'express';
import cors from 'cors';
import "dotenv/config";

const app = express();
const PORT = process.env.LMS_PORT || 3002;

app.use(cors());
app.use(express.json());



type Event = 'purchase' | 'refund' | 'signup';

 type webhook
  = {
    id :string;
    url: string; 
    token: string; 
    event: Event; 
  };

  type Payload = {
    id: string; 
    email: string;
    name: string;
    course: string;
  };



 const db :webhook[] = [];


app.get('/', (req, res) => {
  return res.json({ message: 'LMS OK' });
});


app.post("/api/register-webhook", async (req, res) => {
   
  const {url , token , event} = req.body;

  db.push({
    id: Date.now().toString(),
    url, 
    token,  
    event 
  })

  console.log("DB", db);
  return res.json({ message: 'Webhook Registered' });
});
  
app.post("/api/purchase",(req,res)=>{
  const {email,name , course} = req.body;

  const payload :Payload = {
    id: Date.now().toString(),
    email,
    name,
    course
  };

 const webhooks = db.filter((webhook) => webhook.event === 'purchase');

 //ashync 
 sendWebhook(webhooks, payload).then(() => {
   return res.json({ message: 'Purchase event processed and webhooks sent' });
 });
})
async function sendWebhook(webhooks:webhook[], payload:Payload){

  for (const webhook of webhooks){
    try {
      await fetch(webhook.url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${webhook.token}`
        },
        body: JSON.stringify(payload)
      });
      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Webhook failed to send:', error);
    }
  }

}


app.listen(PORT, () => {
  console.log(`LMS server is running on port ${PORT}`);
});
