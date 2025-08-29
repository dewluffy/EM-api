import createError from "../utils/create-error.util.js";
import * as attendanceService from "../services/attendance.service.js";
import { getThaiNow, getThaiToday } from "../utils/time.util.js";

export async function checkIn(req, res, next) {
  try {
    const employeeId = req.user.id;
    const now = getThaiNow();      // JS Date
    const today = getThaiToday();  // YYYY-MM-DD string

    let attendance = await attendanceService.findTodayAttendance(employeeId, today);

    if (!attendance) {
      attendance = await attendanceService.createEmptyAttendance(employeeId, today);
    }

    if (attendance.checkIn)
      throw createError(400, "You have already checked in today");

    const lateThreshold = new Date();
    lateThreshold.setHours(8, 0, 0, 0);

    const updated = await attendanceService.updateCheckIn(
      attendance.id,
      now,
      now > lateThreshold,
      req.body.location || null
    );

    res.json({ message: "Checked in successfully", attendance: updated });
  } catch (err) {
    next(err);
  }
}

export async function checkOut(req, res, next) {
  try {
    const employeeId = req.user.id;
    const now = getThaiNow();
    const today = getThaiToday();

    let attendance = await attendanceService.findTodayAttendance(
      employeeId,
      today
    );
    if (!attendance) {
      attendance = await attendanceService.createEmptyAttendance(
        employeeId,
        today
      );
    }

    if (!attendance.checkIn) throw createError(400, "Please check in first");
    if (attendance.checkOut)
      throw createError(400, "You have already checked out today");

    const updated = await attendanceService.updateCheckOut(attendance.id, now);
    res.json({ message: "Checked out successfully", attendance: updated });
  } catch (err) {
    next(err);
  }
}

export async function getAttendance(req, res, next) {
  try {
    const employeeId = req.user.id;
    const records = await attendanceService.getAttendanceByEmployeeId(
      employeeId
    );
    res.json({ attendance: records });
  } catch (err) {
    next(err);
  }
}

export async function getAttendanceByEmployeeId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw createError(400, "Invalid employee ID");

    const records = await attendanceService.getAttendanceByEmployeeId(id);
    if (!records || records.length === 0)
      throw createError(404, "No attendance records found");

    res.json({ attendance: records });
  } catch (err) {
    next(err);
  }
}

export async function updateAttendanceById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const allowedFields = ["checkIn", "checkOut", "location", "isLate"];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0)
      throw createError(400, "No valid fields to update");

    const updated = await attendanceService.updateAttendanceById(id, updates);
    res.json({
      message: "Attendance updated successfully",
      attendance: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAttendanceById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const deleted = await attendanceService.deleteAttendanceById(id);
    if (!deleted) throw createError(404, "Attendance record not found");
    res.json({ message: "Attendance record deleted successfully" });
  } catch (err) {
    next(err);
  }
}
