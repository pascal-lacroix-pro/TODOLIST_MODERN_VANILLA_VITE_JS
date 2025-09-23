import getTemplate from "./template";
import Todo from "../todo/Todo";
import DB from "../../DB";

export default class Todolist {
  constructor(data) {
    this.domElt = document.querySelector(data.elt);
    this.newTodo = null;
    DB.setApiURL(data.apiURL);
    this.todos = [];
    this.loadTodos();
  }
  async loadTodos() {
    // Je mets dans this.todos des objets de type Todo
    const todos = await DB.findAll();
    this.todos = todos.map((todo) => new Todo(todo));
    this.render();
  }
  render() {
    this.domElt.innerHTML = getTemplate(this);
  }

  getItemsLeftCount() {
    return this.todos.filter((todo) => !todo.completed).length;
  }

  addItemInTodos(data) {
    this.newTodo = new Todo(data);
    this.todos.push(this.newTodo);
  }

  addItemInDOM() {
    const todoListElt = this.domElt.querySelector('[role="todo-list"]');
    const newLi = document.createElement("div");
    todoListElt.append(newLi);
    newLi.outerHTML = this.newTodo.render();
  }

  renderItemsLeftCount() {
    this.domElt.querySelector('[role="todo-count"] span').innerText =
      this.getItemsLeftCount();
  }

  async addTodo(input) {
    const todo = await DB.create(input.value);

    this.addItemInTodos(todo);
    this.addItemInDOM();
    this.renderItemsLeftCount();

    input.value = "";
  }

  deleteOneByIdFromTodos(id) {
    const index = this.todos.findIndex((todo) => todo.id === id);
    this.todos.splice(index, 1);
  }

  deleteOneByIdFromDOM(id) {
    this.domElt.querySelector(`[data-id="${id}"]`).remove();
  }

  async deleteOneById(id) {
    // Je supprime de la DB
    const resp = await DB.deleteOneById(id);

    if (resp.ok) {
      // Je supprime des todos
      this.deleteOneByIdFromTodos(id);
      // Je supprime du DOM
      this.deleteOneByIdFromDOM(id);
      // Rerenderer le itemsLeftCount
      this.renderItemsLeftCount();
    }
  }

  async toggleCompletedOneById(id) {
    const todo = this.todos.find((todo) => todo.id == id);
    todo.completed = !todo.completed;

    // Je modifie dans la DB
    const resp = await DB.updateOne(todo);

    // Je modifie le DOM
    this.domElt
      .querySelector(`[data-id="${id}"]`)
      .classList.toggle("completed");

    // Rerender de l'itemsLeftCount
    this.renderItemsLeftCount();
  }
}
