const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// const connectDB = async (DATABASE_URL)=>{
//     try {
//         // const DB_OPTIONS={
//         //     dbName:'Aman_Node_Auth_DB'
//         // }
//         // await mongoose.connect(DATABASE_URL,DB_OPTIONS);
//         await mongoose.connect(DATABASE_URL);
//         // console.log("Connected successfully to the database");

//     } catch (error) {
//         // console.log("Error in connecting to the database",error);
//         return;
//     }
// }
// mongoose.connect(process.env.DATABASE_URL)
// .then(() => console.log('Connected! to the DB'));
// module.exports=connectDB

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI);
    console.log("Mongo DB connected Aman", conn.connection.host);
  } catch (error) {
    console.log("Error in connection to Atlas", error);
    process.exit(1);
  }
};

module.exports = connectDB;
