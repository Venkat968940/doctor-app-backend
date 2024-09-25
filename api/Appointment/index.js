const { Schema } = require('mongoose');
const { dbConn } = require('../../system/db/mongo');

const appointmentSchema = new Schema({
    doctorId: {
        type:Schema.ObjectId,
        required: true
    },
    patientId: {
        type: Schema.ObjectId,
        required: false
    },

    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    doctor_name:{
        type: String,
    },
    rating: {
        type: Number,
    },
    specialization :{
        type : String,
    },
    patient_name:{
        type : String, 
    }

}, {
    timestamps: true
});



const Appointment = dbConn.model('hmsAppointment', appointmentSchema);

module.exports = Appointment;
