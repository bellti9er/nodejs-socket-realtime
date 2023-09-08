import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender   : string;
  content  : string;
  chatRoom : Schema.Types.ObjectId;
}

const MessageSchema: Schema = new Schema({
  sender : { 
    type     : String,
    required : true
  },
  content : { 
    type     : String,
    required : true
  },
  chatRoom : { 
    type : Schema.Types.ObjectId,
    ref  : 'ChatRoom'
  }    
})

export default mongoose.model<IMessage>('Message', MessageSchema);
