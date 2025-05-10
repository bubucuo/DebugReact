"use server";

export async function updateName(prevState, formData) {
  const name = formData.get("name")?.toString() || "";
  return { success: true, name };
}

// fakeAPI
export function fetchData() {
  return {
    user: wrapPromise(fetchUser()),
    num: wrapPromise(fetchNum()),
  };
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

export function fetchUser() {
  return fetch("https://randomuser.me/api")
    .then((x) => x.json())
    .then((x) => x.results[0]);
}

export const fetchUser2 = async (txt = Math.random().toString()) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(txt);
    }, 1000);
  });
};

function fetchNum() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random());
    }, 3000);
  });
}

export function updateSomething(option) {
  return fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(option),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      return { error: { ...error, msg: "error" || error?.msg } };
    });
}
