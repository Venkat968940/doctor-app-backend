const Appointment = require("./index");
const mongoose = require('mongoose');


const checkExist = async ({doctorId,startTime,endTime}) => {
    
  const existData = await Appointment.findOne({
    doctorId,
    $or: [
      { startTime: { $gte: startTime, $lte: endTime } },
      { endTime: { $gte: startTime, $lte: endTime } },
    ],
  });
  
  return existData;
};

const create = async ({ patientId, doctorId, startTime, endTime, doctor_name, rating, specialization , patient_name }) => {
console.log(doctor_name,  rating,  specialization)
const appointment = await Appointment.create({
    patientId,
    doctorId,
    startTime,
    endTime,
    doctor_name,
    rating,
    specialization,
    patient_name
  });

  return appointment ;
  console.log(appointment,'Success')
};

const getAppointment = async (params) => {
  const { userId, skip, limit ,page, roleName } = params;  

const matchCondition = roleName==='Patient' ?  { patientId:new mongoose.Types.ObjectId(userId.toString())} : { doctorId:new mongoose.Types.ObjectId(userId.toString())}

  const pipeline = [
    {
        $match: matchCondition,
    },
    {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [{ $skip: parseInt(skip) }, { $limit: parseInt(limit) }],
        },
      },
  ];
  const result = await Appointment.aggregate(pipeline)
  const totalCount = result[0]?.metadata[0]?.totalCount || 0;
  const appointments = result[0]?.data || [];
console.log(result)
  return {
    totalCount,
    page,
    limit,
    data: appointments,
  };
};

module.exports = {
  create,
  getAppointment,
  checkExist
};
