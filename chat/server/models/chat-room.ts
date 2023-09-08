import mongoose, { Schema, Document } from 'mongoose';

export interface IChatRoom extends Document {
  roomNumber : number;
  messages   : Schema.Types.ObjectId[];
}

const ChatRoomSchema: Schema = new Schema({
  roomNumber : { 
    type     : Number,
    required : true
  },
  messages : [{
    type : Schema.Types.ObjectId,
    ref  : 'Message'
  }]
})

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
