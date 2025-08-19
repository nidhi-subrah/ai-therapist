import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMoodCheckin extends Document {
  userId: Types.ObjectId;
  mood: number;
  stress: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const moodCheckinSchema = new Schema<IMoodCheckin>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    mood: {
      type: Number,
      required: [true, 'Mood rating is required'],
      min: [1, 'Mood rating must be at least 1'],
      max: [10, 'Mood rating cannot exceed 10'],
      validate: {
        validator: Number.isInteger,
        message: 'Mood rating must be a whole number',
      },
    },
    stress: {
      type: Number,
      required: [true, 'Stress rating is required'],
      min: [1, 'Stress rating must be at least 1'],
      max: [10, 'Stress rating cannot exceed 10'],
      validate: {
        validator: Number.isInteger,
        message: 'Stress rating must be a whole number',
      },
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
moodCheckinSchema.index({ userId: 1, createdAt: -1 });
moodCheckinSchema.index({ userId: 1, mood: 1 });
moodCheckinSchema.index({ userId: 1, stress: 1 });

// Export the model safely (check if it already exists)
export const MoodCheckin = mongoose.models.MoodCheckin || mongoose.model<IMoodCheckin>('MoodCheckin', moodCheckinSchema);
