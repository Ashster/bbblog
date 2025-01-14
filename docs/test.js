new Promise((resolve, reject) => {
    throw "error";
  }).catch(err => {
      console.log(err) // <-- .catch 显示这个 error
    }).then(() => {
      console.log("done"); // <-- 
    });
