const admin = require('firebase-admin');
// const serviceAccount =require("../sanket-6d5e2-firebase-adminsdk-ytk03-02c03d4646.json")
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) 
});

  module.exports=admin;