// baiknya tambah guard, tapi saya ga sempet
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const CLI_STATE = {
    RUNNING : "RUNNING",
    EXIT : "EXIT"
};

const FILE_STATE = {
    IDLE : "IDLE",
    PROCESS : "PROCESS",
    SUCCESS : "SUCCESS",
    FAILED : "FAILED"
};

const state = {
    cli_state : CLI_STATE.RUNNING,
    files : [],
    nextFileId : 1
};

function handleInput(input){
    const [cmd, ...args] = input.trim().split(" ");

    switch (cmd) {
        case "file":
            hanldeFileCommand(args);
            break;
        case "help":
            showHelp();
            break;
        case "exit":
            state.cli_state = CLI_STATE.EXIT;
            console.log("Goodbye:)");
            rl.close();
            break;
        default:
            console.log(`Unknown Command '${cmd}`);
            break;
    }
}

function hanldeFileCommand(args){
    const [arg, ...rest] = args;

    switch (arg) {
        case "add":
            addFile(rest.join(" "));
            break;
        case "list":
            listFiles();
            break;
        case "process":
            processFileById(rest[0]);
            break;
        case "status":
            showFileStatus(rest[0]);
            break;
        default:
            console.log(`'file' does not contain '${arg}'`);
            break;
    }
}

function addFile(name) {
  const file = {
    id: state.nextFileId++,
    name,
    status: FILE_STATE.IDLE,
  };
  state.files.push(file);
  console.log(`File added: [${file.id}] ${file.name}`);
}

async function processFile(file) {
  if (file.status !== FILE_STATE.IDLE) {
    console.log(`File ${file.id} cannot be Proceed`);
    return;
  }

  file.status = FILE_STATE.RUNNING;
  console.log(`file ${file.id} started`);

  try {
    const {time} = await fakeAsyncWork();
    rl.write(`[${time} ms] Success Processing File`)
    file.status = FILE_STATE.SUCCESS;
    return;
  } catch (err){
    file.status = FILE_STATE.FAILED;
    rl.write(err);
  }
}

function fakeAsyncWork() {
  return new Promise((success, failed) => {
    const delay = parseInt(2000 + Math.random() * 1000);
    setTimeout(() =>{
        if((delay) % 2 === 0) success({status : "success", time : delay});
        else failed(`Failed to proceed file. Time consume : ${delay}`);
    }, delay);
  });
}

function processFileById(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    console.log("file not found");
    return;
  }
  processFile(file);
}

function showHelp() {
    console.log(`
Commands:
- help
- file add <name>
- file process <id>
- file list
- file status <id>
- exit
`);
}

function listFiles() {
  state.files.forEach((t) => {
    console.log(`[${t.id}] ${t.name} - ${t.status}`);
  });
}

function showFileStatus(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    console.log("Task not found");
    return;
  }
  console.log(`Task ${file.id} is ${file.status}`);
}

function prompt(){
    if (state.cli_state === CLI_STATE.EXIT) return;
    rl.question("> ", (answer) => {
        handleInput(answer);
        prompt()
    });
}

console.log("Async File Manager CLI");
prompt();