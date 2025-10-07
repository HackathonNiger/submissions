const router = require("express").Router();
const AccessTokenValidator = require("../../../../middlewares/access_token_validator");
const TaskController = require("../controller/task_controller");

router.post("/new-task", AccessTokenValidator, TaskController.createTask);
router.get(
  "/single-task/:taskID",
  AccessTokenValidator,
  TaskController.getSingleTask
);
router.get("/search-task", AccessTokenValidator, TaskController.searchTasks);
router.delete("/delete-task", AccessTokenValidator, TaskController.deleteTask);
router.put("/update-task", AccessTokenValidator, TaskController.updateTask);
router.post(
  "/task-status/toggle",
  AccessTokenValidator,
  TaskController.markTaskCompleted
);

module.exports = router;
