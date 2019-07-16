const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const uniqueValidator = require('mongoose-unique-validator');
const handleUniqueValidator = require('./../utils/handleUniqueValidator');

const NoteMoreTimestampsSchema = Schema(
  {
    note: {
      type: ObjectId,
      ref: 'Notes',
      required: true
    }
  },
  { timestamps: true }
);

const UserSchema = Schema(
  {
    isActive: {
      type: Boolean,
      default: true
    },

    username: {
      type: String,
      unique: true,
      index: true,
      uniqueCaseInsensitive: true,
      required: true
    },

    email: {
      type: String,
      unique: true,
      index: true,
      uniqueCaseInsensitive: true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    urlImg: {
      type: String,
      default: ''
    },

    favorites: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ],

    saved: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ],

    created: [
      {
        type: NoteMoreTimestampsSchema,
        default: []
      }
    ]
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message:
    'Lo siento, {VALUE} ya esta en uso, ¡por favor ingrese otro {PATH} y vuelva a intentarlo!'
});

UserSchema.post('save', handleUniqueValidator);

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;
