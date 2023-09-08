import mongoose, { ConnectOptions } from 'mongoose';

export default class Database {
  private uri     : string;
  private options : ConnectOptions;

  constructor(uri: string, options?: ConnectOptions) {
    this.uri     = uri;
    this.options = {
      ...options
    }
  }

  public async connect() {
    try {
      await mongoose.connect(this.uri, this.options);

      console.log("MongoDB Connected");
    } catch (error) {
      console.error("Could not connect to MongoDB:", error);
      
      process.exit(1);
    }
  }
}
