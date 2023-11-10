// Seleção de elementos HTML
const todoForm = document.querySelector("#todo-form"); // Formulário de adição de tarefas
const todoInput = document.querySelector("#todo-input"); // Campo de entrada de tarefas
const todoList = document.querySelector("#todo-list"); // Lista de tarefas
const editForm = document.querySelector("#edit-form"); // Formulário de edição
const editInput = document.querySelector("#edit-input"); // Campo de entrada de edição
const cancelEditBtn = document.querySelector("#cancel-edit-btn"); // Botão de cancelar edição
const searchInput = document.querySelector("#search-input"); // Campo de pesquisa
const eraseBtn = document.querySelector("#erase-button"); // Botão de limpar pesquisa
const filterBtn = document.querySelector("#filter-select"); // Seletor de filtro

let oldInputValue; // Variável para armazenar o valor anterior do campo de entrada de edição

// Funções
// Função para salvar uma nova tarefa
const saveTodo = (text, done = 0, save = 1) => {
  // Cria um elemento <div> para representar a tarefa
  const todo = document.createElement("div");
  todo.classList.add("todo");

  // Cria um título <h3> com o texto da tarefa
  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  // Cria botões para marcar como concluído, editar e excluir a tarefa
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Se a tarefa estiver concluída, adiciona a classe "done"
  if (done) {
    todo.classList.add("done");
  }
  
  // Salva a tarefa na lista e no armazenamento local (localStorage)
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todoList.appendChild(todo); // Adiciona a tarefa à lista
  todoInput.value = ""; // Limpa o campo de entrada de tarefa
};
//Funções
// Função para alternar entre formulários de adição e edição
const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

// Função para atualizar o texto de uma tarefa
const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      // Atualiza o armazenamento local (localStorage)
      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

// Função para filtrar tarefas com base em uma consulta de pesquisa
const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    todo.style.display = "flex";

    if (!todoTitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

// Função para filtrar tarefas com base em um filtro selecionado
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

// Evento de clique na página para interagir com tarefas
document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    // Atualiza o status da tarefa no armazenamento local (localStorage)
    updateTodoStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    // Remove a tarefa do armazenamento local (localStorage)
    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  // Dispara o evento "keyup" no campo de pesquisa para atualizar os resultados
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Armazenamento local
// Função para obter tarefas do armazenamento local (localStorage)
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

// Função para carregar tarefas do armazenamento local (localStorage) ao iniciar
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

// Função para salvar uma tarefa no armazenamento local (localStorage)
const saveTodoLocalStorage = (todo)
