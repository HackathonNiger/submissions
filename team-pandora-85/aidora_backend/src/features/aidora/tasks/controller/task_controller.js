const { v4 } = require("uuid");
const Tasks = require("../model/task_model");
const cron = require("node-cron");
const User = require("../../../user/profile/model/user_model");
const EmailService = require("../../../../config/email_services/utility/mail_sender");

const createTask = async (req, res) => {
  try {
    const {
      content,
      dueTime,
      isRecurring,
      recurrenceDays,
      recurrenceEndDate,
      title,
    } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const newTask = new Tasks({
        taskID: v4(),
        userID: user.userID,
        title: title,
        content: content,
        isRecurring: isRecurring,
        dueTime: dueTime,
        recurrenceDays: recurrenceDays,
        recurrenceEndDate: recurrenceEndDate,
      });
      const saveNewTask = await newTask.save();
      if (saveNewTask) {
        res.status(201).json({
          title: "Success",
          message: "Your task has been created successfully",
        });
      } else {
        res.status(201).json({
          title: "Failed",
          message:
            "Sorry, but we could ot create this task at the moment, please try again later. Thank You",
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const task = await Tasks.findOne({ taskID: taskID, userID: user.userID });
      if (!task) {
        res.status(404).json({
          title: "Task Not Found",
          message: "We could not find the task you are loking for",
        });
      } else {
        task.content = req.body.content || task.content;
        task.dueTime = req.body.dueTime
          ? new Date(req.body.dueTime)
          : task.dueTime;
        task.isRecurring =
          req.body.isRecurring !== undefined
            ? req.body.isRecurring
            : task.isRecurring;
        task.recurrenceDays = req.body.recurrenceDays || task.recurrenceDays;
        task.recurrenceEndDate = req.body.isRecurring
          ? new Date(req.body.recurrenceEndDate)
          : task.recurrenceEndDate;
        await task.save();
        const updateData = await Tasks.findOneAndUpdate({
          taskID: task.taskID,
        });
        if (!updateData) {
          res.status(400).json({
            title: "Failed",
            message:
              "Sorry, but we could not update this task at the moment, please try again later. Thank You",
          });
        } else {
          res.status(400).json({
            title: "Success",
            message: "Task data updated successfully",
          });
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskID } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const task = await Tasks.findOne({ taskID: taskID, userID: user.userID });
      if (!task) {
        res.status(404).json({
          title: "Task Not Found",
          message: "We could not find the task you are loking for",
        });
      } else {
        const deleteData = await Tasks.findOneAndDelete({
          taskID: task.taskID,
        });
        if (!deleteData) {
          res.status(404).json({
            title: "Failed",
            message:
              "Sorry, we could not delete this task at the moment, please try again later. Thank You",
          });
        }
        res.status(200).json({
          title: "Sucess",
          message: "Task deleted successfully",
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const markTaskCompleted = async (req, res) => {
  try {
    const { taskID } = req.body;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const task = await Tasks.findOne({ taskID: taskID, userID: user.userID });
      if (!task) {
        res.status(404).json({
          title: "Task Not Found",
          message: "We could not find the task you are loking for",
        });
      } else {
        task.isCompleted = true;
        const saveUpdate = await task.save();
        if (!saveUpdate) {
          res.status(400).json({
            title: "Update Failed",
            message:
              "Sorry, but we are unable to update this task at the moment, please try again later. Thank You",
          });
        } else {
          if (task.isRecurring && task.recurrenceEndDate > new Date()) {
            const nextDueTime = new Date(task.dueTime);
            nextDueTime.setDate(nextDueTime.getDate() + task.recurrenceDays);
            if (nextDueTime <= task.recurrenceEndDate) {
              const newTask = await Tasks.create({
                ...task.toObject(),
                taskID: v4(),
                isCompleted: false,
                dueTime: nextDueTime,
              });
              res.status(200).json({
                title: "Success",
                completedTask: task,
                nextTask: newTask,
              });
            } else {
              res.status(200).json({
                title: "Success",
                data: task,
              });
            }
          } else {
            res.status(200).json({
              title: "Success",
              data: task,
            });
          }
        }
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const searchTasks = async (req, res) => {
  try {
    const query = {};
    if (req.query.userID) query.userID = req.query.userID;
    if (req.query.isCompleted !== undefined)
      query.isCompleted = req.query.isCompleted === "true";
    if (req.query.dueTimeStart && req.query.dueTimeEnd) {
      query.dueTime = {
        $gte: new Date(req.query.dueTimeStart),
        $lte: new Date(req.query.dueTimeEnd),
      };
    }
    const tasks = await Tasks.find(query);
    res.status(200).json({
      title: "Success",
      data: tasks,
    });
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const getSingleTask = async (req, res) => {
  try {
    const { taskID } = req.params;
    const user = await User.findOne({ userID: req.user.userID });
    if (!user) {
      res.status(400).json({
        title: "Login Required",
        message: "You are expected to login before proceeding",
      });
    } else {
      const task = await Tasks.findOne({ taskID: taskID, userID: user.userID });
      if (!task) {
        res.status(404).json({
          title: "Task Not Found",
          message: "The task you are looking for was not found",
        });
      } else {
        res.status(200).json({
          title: "Success",
          data: task,
        });
      }
    }
  } catch (e) {
    res.status(500).json({
      title: "Server Error",
      message: `Server Error: ${e}`,
    });
  }
};

const sendTaskReminders = async () => {
  try {
    const now = new Date();
    const timeWindow = new Date(now.getTime() + 5 * 60 * 1000);
    const tasks = await Tasks.find({
      dueTime: {
        $gte: now,
        $lte: timeWindow,
      },
      isCompleted: false,
    });
    for (const task of tasks) {
      const user = await User.findOne({ userID: task.userID });
      if (user) {
        await EmailService.sendTaskReminderEmail(user.email, user.name, task);
        console.log(
          `Reminder email sent for task ${task.taskID} to ${user.email}`
        );
      } else {
        console.log(`User not found for task ${task.taskID}`);
      }
    }
  } catch (error) {
    console.error(`Error in task reminder job: ${error}`);
  }
};

const startTaskReminderJob = () => {
  cron.schedule("* * * * *", () => {
    console.log("Running task reminder job...");
    sendTaskReminders();
  });
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  markTaskCompleted,
  searchTasks,
  getSingleTask,
  startTaskReminderJob,
};
