const cron = require("node-cron");
const employeeModel = require("../models/employeeModel");
const attendanceModel = require("../models/attendanceModel");

function startAutoAbsentJob() {
    // Run every day at 11:59 PM
    cron.schedule("59 23 * * *", async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const employees = await employeeModel.find();

            for (const emp of employees) {
                const exists = await attendanceModel.findOne({ employee: emp._id, date: today });
                if (!exists) {
                    await attendanceModel.create({
                        employee: emp._id,
                        date: today,
                        status: "Absent"
                    });
                }
                console.log(`Checking attendance for ${emp.name} on ${today.toDateString()}`);
                console.log(`Marked Absent for ${emp.name}`);
            }
            console.log("Auto-absent marking done for", today.toDateString());
            
        } catch (err) {
            console.error("Error in auto-absent job:", err);
        }
    });
}

module.exports = startAutoAbsentJob;
