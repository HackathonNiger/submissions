const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRouter = require("./src/features/user/profile/routers/user_routers");
const aidoraAPIKeyRouter = require("./src/config/aidora_api_key/routes/aidora_api_key_route");
const connectDataBase = require("./src/config/database/database_configuration");
const userAuthRouter = require("./src/features/user/auth/routers/user_auth_router");
const aidoraCustomResponseRouter = require("./src/features/aidora/custom_response/routes/custom_response_router");
const userSettingsRouter = require("./src/features/user/settings/routers/user_settings_router");
const conversationRouter = require("./src/features/aidora/conversations/routers/conversation_router");
const messagesRouter = require("./src/features/aidora/messages/routers/messages_router");
const taskRouter = require("./src/features/aidora/tasks/routes/task_router");
const TaskController = require("./src/features/aidora/tasks/controller/task_controller");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());

app.use(express.json());

app.use("/api/v1/aidora/users", userRouter);
app.use("/api/v1/aidora/users/auth", userAuthRouter);
app.use("/api/v1/aidora/api-key", aidoraAPIKeyRouter);
app.use("/api/v1/aidora/ai/conversations", conversationRouter);
app.use("/api/v1/aidora/ai/messages", messagesRouter);
app.use("/api/v1/aidora/ai/custom-response", aidoraCustomResponseRouter);
app.use("/api/v1/aidora/users/settings", userSettingsRouter);
app.use("/api/v1/aidora/ai/tasks", taskRouter);

connectDataBase()
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`🚀 Server is now live on PORT: ${PORT}`);
      try {
        TaskController.startTaskReminderJob();
        console.log("Task reminder job started successfully");
      } catch (error) {
        console.error("Failed to start task reminder job:", error);
      }
    });
  })
  .catch((e) => {
    console.log(`Something went wrong: ${e}`);
  });
