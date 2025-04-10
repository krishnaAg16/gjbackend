import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import registerRoute from './routes/register.js';
import paymentRoute from './routes/verifyPayment.js';
import transactionRoute from './routes/txnId.js';
import updateEventsRoute from './routes/updateEvents.js';
import testDBRoute from './routes/testdb.js';
import adminRoutes from './routes/admin/admin.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/register', registerRoute);
app.use('/api/txnid', transactionRoute);
app.use('/api/verifyPayment', paymentRoute);
app.use('/api/update-events', updateEventsRoute);
app.use('/api/testdb', testDBRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});



export default app;