const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* =======================
   STATE DEFINITIONS
======================= */

const CLI_STATE = {
  RUNNING: "RUNNING",
  EXIT: "EXIT",
};

const TASK_STATE = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  DONE: "DONE",
  FAILED: "FAILED",
};

/* =======================
   GLOBAL STATE
======================= */

const state = {
  cli: CLI_STATE.RUNNING,
  tasks: [],
  nextTaskId: 1,
};

/* =======================
   TASK LOGIC
======================= */

function createTask(name) {
  const task = {
    id: state.nextTaskId++,
    name,
    status: TASK_STATE.IDLE,
  };
  state.tasks.push(task);
  console.log(`Task created: [${task.id}] ${task.name}`);
}

async function runTask(task) {
  if (task.status !== TASK_STATE.IDLE) {
    console.log(`Task ${task.id} cannot be run`);
    return;
  }

  task.status = TASK_STATE.RUNNING;
  console.log(`Task ${task.id} started`);

  try {
    await fakeAsyncWork();
    task.status = TASK_STATE.DONE;
  } catch {
    task.status = TASK_STATE.FAILED;
  }
}

function fakeAsyncWork() {
  return new Promise((resolve) => {
    const delay = 2000 + Math.random() * 3000;
    setTimeout(resolve, delay);
  });
}

/* =======================
   COMMAND PROCESSOR
======================= */

function handleCommand(input) {
  const [cmd, ...args] = input.trim().split(" ");

  switch (cmd) {
    case "help":
      showHelp();
      break;

    case "task":
      handleTaskCommand(args);
      break;

    case "exit":
      state.cli = CLI_STATE.EXIT;
      console.log("Bye.");
      rl.close();
      break;

    default:
      console.log(`Unknown command: ${cmd}`);
  }
}

function handleTaskCommand(args) {
  const [sub, ...rest] = args;

  switch (sub) {
    case "add":
      createTask(rest.join(" "));
      break;

    case "list":
      listTasks();
      break;

    case "run":
      runTaskById(rest[0]);
      break;

    case "status":
      showTaskStatus(rest[0]);
      break;

    default:
      console.log("Unknown task command");
  }
}

/* =======================
   HELPERS
======================= */

function listTasks() {
  state.tasks.forEach((t) => {
    console.log(`[${t.id}] ${t.name} - ${t.status}`);
  });
}

function runTaskById(id) {
  const task = state.tasks.find((t) => t.id === Number(id));
  if (!task) {
    console.log("Task not found");
    return;
  }
  runTask(task); // async but NOT awaited
}

function showTaskStatus(id) {
  const task = state.tasks.find((t) => t.id === Number(id));
  if (!task) {
    console.log("Task not found");
    return;
  }
  console.log(`Task ${task.id} is ${task.status}`);
}

function showHelp() {
  console.log(`
Commands:
- help
- task add <name>
- task list
- task run <id>
- task status <id>
- exit
`);
}

/* =======================
   MAIN LOOP (EVENT-DRIVEN)
======================= */

function prompt() {
  if (state.cli === CLI_STATE.EXIT) return;
  rl.question("> ", (answer) => {
    handleCommand(answer);
    prompt();
  });
}

console.log("Async Task CLI");
prompt();
