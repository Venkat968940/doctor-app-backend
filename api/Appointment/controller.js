const service = require("./service");
const boom = require("@hapi/boom");
const moment = require("moment-timezone");
const userService = require("../User/service");

const createAppointment = async (req, res, next) => {
  const { doctorId, startTime, endTime } = req.body;
  const patientId = req.user;

  const existData = await service.checkExist({ doctorId, startTime, endTime });
  if (existData) {
    throw boom.conflict("Time slot already booked.");
  }
  const patient = await userService.findById(patientId)
console.log(patient, 'patient Data')
  const doctor = await userService.findById(doctorId);
 const patient_name = patient?.name;
  const doctor_name = doctor?.name;
  const rating = doctor?.doctorDetails?.rating;
  const specialization = doctor?.doctorDetails?.specialization;
  if (!doctor) {
    throw boom.badRequest("Doctor not found.");
  }

  if (doctor.role !== "Doctor") {
    throw boom.badRequest("User is not a doctor.");
  }

  const appointment = await service.create({
    patientId,
    doctorId,
    startTime,
    endTime,
    doctor_name,
    rating,
    specialization,
    patient_name
  });

  const result = {
    message: "Appointment created successfully",
    data: appointment,
  };
  return result;
};

const getAppointmentbyId = async (req, res, next) => {
  try {
    const { page, limit, userId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointment = await service.getAppointment({
      page,
      limit,
      skip,
      userId,
    });

    const result = {
      message: "Data fetched successfully",
      data: appointment.data,
      total: appointment.totalCount,
      currentPage: appointment.page,
      totalPages: Math.ceil(appointment.totalCount / limit),
    };

    return result;
  } catch (err) {
    if (err.message === "User does not exist") {
      throw boom.badRequest("User does not exist");
    }
    console.error(err.message);
    throw boom.internal("Server error");
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const userId = req.user;
    const role = await userService.findById(userId)
    console.log(userId, "Role", role?.role, "User Data");

    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    console.log(req.query);
const roleName = role?.role
    const appointment = await service.getAppointment({
      page: parseInt(page),
      limit: parseInt(limit),
      skip,
      userId,
      roleName
    });
    console.log(appointment, 'appoint');

    const getUserData = await userService.findById(userId);

    if (!getUserData) {
      throw boom.badRequest("User does not exist");
    }

    const { data: appointments, totalCount } = appointment;

    if (!appointments || appointments.length === 0) {
      throw boom.notFound("Appointments Not Found.");
    }

    const updatedAppointments = appointments.map((appointment) => {
      const doctorTimezone = getUserData.timeZone || "UTC";
      const startTime = moment(appointment.startTime)
        .tz(doctorTimezone)
        .format();
      const endTime = moment(appointment.endTime).tz(doctorTimezone).format();

      return {
        ...appointment,
        startTime,
        endTime,
      };
    });

    const result = {
      message: "Data fetched successfully",
      data: updatedAppointments,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
    return result;
  } catch (error) {
    console.error(error.message);
    throw boom.internal("Server error");
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentbyId,
};
