const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

cron.schedule(" 44 21 * * *",async ()=>{
    // send email to all people who got request the previous day
    try{
        const yesterday = subDays(new Date(),0);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status:"interested",
            createdAt:{
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("toUserId");

        const listOfEmails = [
            ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
          ];
      
      
          for (const email of listOfEmails) {
            // Send Emails
            try {
              const res = await sendEmail.run(
                "New Friend Requests pending for " + email,
                "Ther are so many frined reuests pending, please login to Devexplore and accept or reject the reqyests."
              );
            //   console.log(res);
            } catch (err) {
              console.log(err);
            }
          }
          
        } catch (err) {
          console.error(err);
        }

})