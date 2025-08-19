import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ISession extends Document {
  userId: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  messages: IMessage[];
  summary?: string;
  crisisFlag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      required: [true, 'Message role is required'],
      enum: {
        values: ['user', 'assistant', 'system'],
        message: 'Role must be user, assistant, or system',
      },
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
  },
  { _id: false }
);

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    startedAt: {
      type: Date,
      required: [true, 'Session start time is required'],
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    messages: {
      type: [messageSchema],
      default: [],
      validate: {
        validator: function(messages: IMessage[]) {
          return messages.length >= 0;
        },
        message: 'Messages array cannot be negative',
      },
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [1000, 'Summary cannot be more than 1000 characters'],
    },
    crisisFlag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
sessionSchema.index({ userId: 1, startedAt: -1 });
sessionSchema.index({ crisisFlag: 1 });

// Export the model safely (check if it already exists)
export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema);
