const todoApiUrl = "https://jnmpf6-8080.csb.app/todos";
const addTodobtn = document.querySelector("#add-todo");
const formWrapper = document.querySelector(".form-wrapper");
const closeForm = document.querySelector("#close-form");
const showFinishBtn = document.querySelector("#show-finished");
const unfinished = document.querySelector("#un-finished");
const finished = document.querySelector("#finished");

addTodobtn.addEventListener("click", (e) => {
  formWrapper.classList.remove("hidden");
  console.log(e.target.dataset.value);
});
closeForm.addEventListener("click", () => {
  formWrapper.classList.add("hidden");
});
showFinishBtn.addEventListener("click", () => {
  finished.classList.toggle("hidden");
  if (!finished.classList.contains("hidden")) {
    showFinishBtn.classList.replace("btn-secondary", "btn-success");
    showFinishBtn
      .querySelector("i")
      .classList.replace("fa-circle-right", "fa-circle-down");
  } else {
    showFinishBtn.classList.replace("btn-success", "btn-secondary");
    showFinishBtn
      .querySelector("i")
      .classList.replace("fa-circle-down", "fa-circle-right");
  }
});

const getTodo = async (data) => {
  const response = await fetch(todoApiUrl);
  data = await response.json();
  render(data);
};

const addTodo = async (data) => {
  try {
    const response = await fetch(todoApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const deleteTodo = async (id) => {
  try {
    const response = await fetch(todoApiUrl + "/" + id, {
      method: "DELETE",
    });
    return response.ok;
  } catch {
    return false;
  }
};

const updateTodo = async (id, data) => {
  try {
    const response = await fetch(todoApiUrl + "/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch {
    return false;
  }
};
function handleMark(btn) {
  btn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const statusVal = e.target.dataset.status;

      const id = e.target.dataset.id;
      const status = await updateTodo(id, {
        status: statusVal,
      });
      if (status) {
        getTodo();
      }
    });
  });
}
const addEventFormSubmit = () => {
  const form = document.querySelector("#form-add");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries([...new FormData(form)]);
    const status = await addTodo(formData);
    if (status) {
      getTodo();
      form.reset();
      formWrapper.classList.add("hidden");
    } else {
      alert("Thêm thất bại");
    }
  });
};
const render = (todos) => {
  unfinished.innerHTML = todos
    .filter(({ status }) => status === "unfinished")
    .map(
      ({ id, todo }) => `
           <div
            class="d-flex justify-content-between align-items-center p-4 border rounded border-secondary border-opacity-50 bg-white mt-2 mx-auto"
            style="width: 62.4%"
          >
            <span>${todo.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</span>
        <div class="d-flex gap-2">
          <button
            class="d-flex justify-content-center align-items-center btn btn-danger"
            style="width: 40px; height: 40px"
            id="delete"
            data-id=${id}
          >
            <i class="fa-solid fa-trash" data-id=${id}></i>
          </button>
          <button
            class="d-flex justify-content-center align-items-center btn btn-primary"
            style="width: 40px; height: 40px"
            id="change"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="d-flex justify-content-center align-items-center btn btn-secondary mark-finished"
            style="width: 40px; height: 40px"
            data-status="finished"
            data-id=${id}
          >
            <i class="fa-solid fa-check-to-slot" data-status="finished"  data-id=${id}></i>
          </button>
        </div>
          </div>`
    )
    .join("");
  finished.innerHTML = todos
    .filter(({ status }) => status === "finished")
    .map(
      ({ id, todo }) => `
         <div
            class="d-flex justify-content-between align-items-center p-4 border rounded border-secondary border-opacity-50 bg-white mt-2 mx-auto"
            style="width: 62.4%"
          >
            <span>${todo.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</span>
        <div class="d-flex gap-2">
          <button
            class="d-flex justify-content-center align-items-center btn btn-danger"
            style="width: 40px; height: 40px"
            id="delete"
             data-id=${id}
          >
            <i class="fa-solid fa-trash"  data-id=${id}></i>
          </button>
          <button
            class="d-flex justify-content-center align-items-center btn btn-primary"
            style="width: 40px; height: 40px"
            id="change"
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            class="d-flex justify-content-center align-items-center btn btn-success unmark-finished"
            style="width: 40px; height: 40px"          
            data-status="unfinished"
            data-id=${id}
          >
            <i class="fa-solid fa-check-to-slot" data-status="unfinished" data-id=${id}></i>
          </button>
        </div>
          </div>`
    )
    .join("");
  const markFinishedBtns = document.querySelectorAll(".mark-finished");
  const unMarkFinishedBtns = document.querySelectorAll(".unmark-finished");
  handleMark(markFinishedBtns);
  handleMark(unMarkFinishedBtns);
  showFinishBtn.querySelector("span").innerText = todos.filter(
    ({ status }) => status === "finished"
  ).length;
  document.querySelectorAll("#delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const status = await deleteTodo(id);
      if (status) {
        getTodo();
      } else {
        alert("Thêm thất bại");
      }
    });
  });
};
addEventFormSubmit();
getTodo();
