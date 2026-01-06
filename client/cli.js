const {api} = require('./route');

const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const CLI_STATE = {
    RUNNING : "RUNNING",
    EXIT : "EXIT"
};

const state = {
    cli_state : CLI_STATE.RUNNING,
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
            api.addFile(rest.join(" "));
            break;
        case "list":
            api.listFiles();
            break;
        case "process":
            api.processFile(rest[0]);
            break;
        case "status":
            api.showFileStatus(rest[0]);
            break;
        default:
            console.log(`'file' does not contain '${arg}'`);
            break;
    }
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

function prompt(){
    if (state.cli_state === CLI_STATE.EXIT) return;
    rl.question("> ", (answer) => {
        handleInput(answer);
        prompt()
    });
}

console.log("Async File Manager CLI");
prompt();