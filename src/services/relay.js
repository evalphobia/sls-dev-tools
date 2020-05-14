import { Loader } from "../components/loader";
import { setupLambdaLayer, resetLambdaLayers } from "./lambdaLayers";
import { addRelayPermissions } from "./relayPermissions";

const WebSocket = require("ws");

async function createRelay(
  apiGateway,
  fullLambda,
  program,
  screen,
  lambda,
  iam,
  application
) {
  const stage = "relay-dev";
  console.log("Setting up Relay...");
  const loader = new Loader(screen, 5, 20);
  loader.load("Please wait");
  try {
    // Store snapshot of layers before adding relay
    application.lambdaLayers[fullLambda.FunctionName] = fullLambda.Layers || [];
    await addRelayPermissions(lambda, iam, fullLambda, stage);
    await setupLambdaLayer(lambda, fullLambda);
    const websocketAddress = await apiGateway.createWebsocket(
      fullLambda,
      program,
      stage
    );
    const relay = new WebSocket(websocketAddress);
    relay.on("open", () => {
      console.log("Warning: Realtime logs will appear faster than CloudWatch");
      application.setRelayActive(true);
      // Clear and reset logs
      application.lambdaLog.generateLog();
    });
    relay.on("message", (data) => {
      application.lambdaLog.log(data);
    });
    relay.on("close", () => {
      console.log("Relay Closed");
    });
    relay.on("error", console.error);
  } catch (e) {
    console.error("Relay Setup Failure");
    console.error(e);
  }
  loader.stop();
  loader.destroy();
}

async function takedownRelay(fullLambda, lambda, screen, application) {
  console.log("Removing relay...");
  const loader = new Loader(screen, 5, 20);
  loader.load("Please wait");
  try {
    resetLambdaLayers(
      lambda,
      application.lambdaLayers[fullLambda.FunctionName],
      fullLambda.FunctionName
    );
    application.setRelayActive(false);
  } catch (e) {
    console.error("Relay Takedown Failure");
    console.error(e);
  }
  loader.stop();
  loader.destroy();
}

module.exports = {
  createRelay,
  takedownRelay,
};