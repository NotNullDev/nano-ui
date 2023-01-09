import toast from "react-hot-toast";
import { AuthStore } from "../pages/login";
import { App, NanoContext } from "../types/aa";

const serverUrl =
  process.env.NEXT_PUBLIC_NANO_SERVER_URL ?? "http://localhost:8080";

export function showEnv() {
  toast("serverUrl: " + serverUrl);
}

export async function fetchNanoContext(): Promise<NanoContext> {
  const res = await nanoFetch("/");
  const data = (await res.json()) as NanoContext;
  data.nanoConfig.globalEnvironment = base64Decode(
    data.nanoConfig.globalEnvironment
  );
  data.apps.map((app) => {
    app.envVal = base64Decode(app.envVal);
    app.buildVal = base64Decode(app.buildVal);
  });
  data.apps.sort((a, b) => b.ID - a.ID);
  return data;
}

export async function resetToken(): Promise<string> {
  const res = await nanoFetch("/reset-token", {
    method: "POST",
  });
  let data = (await res.text()) as string;

  // data comes in format "<token>", so we need to remove the quotes
  data = data.slice(1);
  data = data.slice(0, data.length - 2);

  return data;
}

export async function updateGlobalEnv(updatedEnv: string): Promise<string> {
  const res = await nanoFetch("/update-global-env", {
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
  const res = await nanoFetch("/create-app", {
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
  const res = await nanoFetch("/update-app", {
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
  const res = await nanoFetch("/delete-app?id=" + appId, {
    method: "DELETE",
  });
  const data = (await res.text()) as string;

  return Number(data);
}

export async function runBuild(appName: string) {
  const res = await nanoFetch("/build?appName=" + appName, {
    method: "POST",
  });
  const data = (await res.text()) as string;
  return data;
}

export async function updateUser(username: string, password: string) {
  const res = await nanoFetch("/update-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = (await res.text()) as string;
  return data;
}

export async function login(username: string, password: string) {
  const res = await nanoFetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  let data = (await res.text()) as string;
  // data comes in format "<token>", so we need to remove the quotes
  data = data.slice(1);
  data = data.slice(0, data.length - 2);
  return data;
}

export async function logout() {
  AuthStore.setState((state) => {
    (state.isLoggedIn = false), (state.token = "");
  });
}

function base64Decode(str: string) {
  return Buffer.from(str, "base64").toString("ascii");
}

async function nanoFetch(path: string, options?: RequestInit) {
  if (options) {
    options.headers = {
      ...options.headers,
      "nano-token": AuthStore.getState().token,
    };
  } else {
    options = {
      headers: {
        "nano-token": AuthStore.getState().token,
      },
    };
  }

  const resp = await fetch(serverUrl + path, options);

  if (
    (AuthStore.getState().isLoggedIn && resp.status === 401) ||
    resp.status === 403
  ) {
    AuthStore.setState((state) => {
      (state.isLoggedIn = false), (state.token = "");
    });
  }

  if (!resp.ok) {
    throw new Error(resp.statusText);
  }

  return resp;
}
