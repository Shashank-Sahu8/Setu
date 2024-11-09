const app=require('./app');
const port=process.env.PORT || 8080;
const db=require('./db/db');
require('dotenv').config();

db().then(()=>{
app.get('/',(req,res)=>{
    res.send(" ☠︎︎☠︎︎ Sanket Backend Services ☠︎︎☠︎︎ ")
});

app.listen(port,()=>console.log("server live"));
}).catch((err)=>{console.log("connection to database failed:",err);})

