import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({    //define the structure of your documents within a MongoDB collection
email: {type : String, required: true, unique: true},
password : {type : String, required:true},
username : String  //optional
},{timestamps:true})  //store the timestamps of when the document was created and last updated.

const UserModel = mongoose.model('user', userSchema) //creates a model from the schema. Name should be singularized.  
//A model is a class with which you construct documents. 

export default UserModel;