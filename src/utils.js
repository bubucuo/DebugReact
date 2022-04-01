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

// function fetchUser() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         name: "Ringo Starr " + Math.random(),
//       });
//     }, 2000);
//   });
// }

function fetchUser() {
  return fetch("https://randomuser.me/api")
    .then((x) => x.json())
    .then((x) => x.results[0]);
}

function fetchNum() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random());
    }, 3000);
  });
}
