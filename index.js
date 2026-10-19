const { Command } = require("commander");
const fs = require("node:fs/promises");


const dataBase = "task.json";

let lastID = 0;

const _loadTodos = async () => {  // gives array in return...
    try {
        let data = await fs.readFile(dataBase, "utf-8");
        if(data.trim() === "") {  // for blank file.
            return [];
        };
        data = JSON.parse(data);
        if(data.length === 0) {
            return data;
        };
        lastID = data[data.length - 1].ID;
        return data;
    } catch(err) {
        if(err.code === "ENOENT") {
            await fs.writeFile (dataBase, "[]", "utf-8");  // if file dont exists 
            return [];
        };
        throw err;
    };
};

const _saveTodos = async (todos) => {
    const data = JSON.stringify(todos, null, 2);
    await fs.writeFile(dataBase, data, "utf-8");
};

const showTodos = async () => {
    try {
        let data = await fs.readFile(dataBase, "utf-8");

        if(data.trim() === "") {  // for blank file.
            console.log("No task to do.");
            return;
        };
        data = JSON.parse(data);
        for(let task of data) {
            console.log(task.ID + "." + " " + task.task);
        };
    } catch(err) {
        if(err.code === "ENOENT") {
              // if file dont exists 
            console.log("No task to do.");
            return;
        };
        throw err;
    };
}


const program = new Command();


program
    .name("Todo CLI")
    .description("A CLI that can save your todos.")
    .version("1.0.0");


program.command("addTodo")
    .description("Simply add todo by giving in commmand.")
    .argument("<todo>", "Enter todo")
    .action(async (todo) => {
        const data = await _loadTodos();
        let todoDetail = {
            ID : lastID + 1,
            task : todo
        };
        data.push(todoDetail);
        await _saveTodos(data);
        console.log("Task added succesfully.");
        console.log();
        await showTodos();
    });


program.command("taskDone")
    .description("It removes task from todo.")
    .argument("<todo>", "Remove todo that you want.")
    .action(async (todo) => {
        todo = todo.toLowerCase();

        let data = await _loadTodos();
        for(const task of data) {
            if(task.task.toLowerCase() === todo.trim()) {
                data.splice(task.ID - 1,1);
            };
        };
        let todoDetail = "";
        if(data.length === 0){
            await _saveTodos(data);
            return;
        }
        for(let task of data){
            todoDetail = {
            ID : data.indexOf(task)+1,
            task : task.task
            };
        };
        data = [];
        data.push(todoDetail);
        await _saveTodos(data);
    });

program.command("showTodos")
    .description("Show todo")
    .action(() => {
        showTodos()
    });


program.parse();