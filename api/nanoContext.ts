import { App, NanoContext } from "../types/aa";

const serverUrl =
  process.env.NEXT_PUBLIC_NANO_SERVER_URL ?? "http://localhost:8080";

export async function fetchNanoContext(): Promise<NanoContext> {
  const res = await fetch(serverUrl + "");
  const data = (await res.json()) as NanoContext;
  data.nanoConfig.globalEnvironment = base64Decode(
    data.nanoConfig.globalEnvironment
  );
  data.apps.map((app) => {
    app.envVal = base64Decode(app.envVal);
    app.buildVal = base64Decode(app.buildVal);
  });
  return data;
}

export async function resetToken(): Promise<string> {
  const res = await fetch(serverUrl + "/reset-token", {
    method: "POST",
  });
  let data = (await res.text()) as string;

  // data comes in format "<token>", so we need to remove the quotes
  data = data.slice(1);
  data = data.slice(0, data.length - 2);

  return data;
}

export async function updateGlobalEnv(updatedEnv: string): Promise<string> {
  const res = await fetch(serverUrl + "/update-global-env", {
    method: "POST",
    headers: {
      "Content-Type": "application/text",
    },
    body: updatedEnv,
  });
  const data = (await res.text()) as string;
  return base64Decode(data);
}

export async function createApp(name: string) {
  const res = await fetch(serverUrl + "/create-app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appName: name,
    }),
  });
  const data = (await res.json()) as App;
  return data;
}

export async function updateApp(app: App) {
  const res = await fetch(serverUrl + "/update-app", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(app),
  });
  const data = (await res.json()) as App;
  return data;
}

export async function deleteApp(appId: number) {
  const res = await fetch(serverUrl + "/delete-app?id=" + appId, {
    method: "DELETE",
  });
  const data = (await res.text()) as string;

  return Number(data);
}

function base64Decode(str: string) {
  return Buffer.from(str, "base64").toString("ascii");
}
