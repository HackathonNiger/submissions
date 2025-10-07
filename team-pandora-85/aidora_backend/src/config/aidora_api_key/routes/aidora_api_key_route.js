const aidoraAPIContrller = require("../controller/aidora_api_key_controller");

const ClobotAPIKeyRoute = require("express").Router();

ClobotAPIKeyRoute.post("/create-api-key", aidoraAPIContrller.postAPIKeys);

ClobotAPIKeyRoute.get("/get-api-key", aidoraAPIContrller.getAPIKeys);

module.exports = ClobotAPIKeyRoute;
