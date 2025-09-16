import "./styles.css";
import TodoList from "./components/todoList/TodoList";

window.todoList = new TodoList({
  elt: "#app",
  apiURL: "https://68ad9556a0b85b2f2cf3e1b0.mockapi.io/",
});
