import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username        : string;
  roomNumber      : number;
  nicknameHistory : {
    nickname  : string,
    changedAt : Date
  }[];
}

const UserSchema: Schema = new Schema({
  username : {
    type     : String,
    required : true
  },
  roomNumber : {
    type    : Number,
    default : 1
  },
  nicknameHistory : [{
    nickname : {
      type     : String, 
      required : true
    },
    changedAt : {
      type    : Date,
      default : Date.now
    }
  }]
})

export default mongoose.model<IUser>('User', UserSchema);
