const { error } = require("console");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const state_list = {
    INIT : 0,
    NORMAL : 1,
    CALC : 2,
    EXIT : -1
};

const Command = {
    normalCommands : ["help", "mode", "exit", "echo"],
    calcCommands : ["help", "mode", "exit"],
    operationList : ["add", "sub", "mul", "div"],
}

const CommandValid = {
    isValid : (input) =>  Command.normalCommands.includes(input) || Command.calcCommands.includes(input) || Command.operationList.includes(input),
    checkCommand : (input) => [Command.normalCommands.includes(input), Command.calcCommands.includes(input), Command.operationList.includes(input)]
};


class State {
    constructor(initState=state_list.NORMAL) {
        this._currentState = initState;
    }

    set SetState(newState){
        this._currentState = newState;
    }

    get GetState(){
        return this._currentState;
    }
}

const myState = new State();

const operation = (numbers, opsType) => {
    let [first, ...rest] = numbers;
    switch (opsType) {
        case "add": return rest.reduce((acc, curr) => acc + curr, first); break;
        case "sub": return rest.reduce((acc, curr) => acc - curr, first); break;
        case "mul": return rest.reduce((acc, curr) => acc * curr, first); break;
        case "div": return rest.reduce((acc, curr) => acc / curr, first); break;
        default: break;
    }
};

function showHelp(state){
    switch (state) {
        case state_list.NORMAL:
            console.log("COMMAND LIST : ");
            console.log("- help");
            console.log("- echo");
            console.log("- mode <normal|calc>");
            console.log("- exit");
            break;
        case state_list.CALC:
            console.log("COMMAND LIST : ");
            console.log("- help");
            console.log("- mode <normal|calc>");
            console.log("- exit");
            console.log("- add <number>");
            console.log("- sub <number>");
            console.log("- mul <number>");
            console.log("- div <number>");
            break;
        default:
            break;
    }
}

function ModeHandler(secondArgs = []){
    if(secondArgs.length === 0){
        console.error(`error : 'mode' require argument`);
        showHelp(myState.GetState);
        return;
    }else{
        if(secondArgs[0] === "normal" || secondArgs[0] === "calc"){
            if(secondArgs.length > 1){
                const [, ...args] = secondArgs;
                console.error(`error : 'mode' does not require additional argument. args : '${args.join(" ")}'`);
            }else if(secondArgs.length === 1){
                if(secondArgs[0] === "normal") {
                    myState.SetState = state_list.NORMAL;
                    console.log(`[Normal Mode]\nSee 'help' for info`)
                }
                else if(secondArgs[0] === "calc") {
                    myState.SetState = state_list.CALC;
                    console.log(`[Calc Mode]\nSee 'help' for info`)
                }
            }
        }else{
            console.error(`Unknown arg : '${secondArgs[0]}'. See 'help'`)
        }
    }
}

function NormalProcessor(opsType, secondArgs = []){
    switch (opsType) {
        case "help":
            if(secondArgs.length !== 0){
                console.error(`error : 'help' does not need arguments. args : '${secondArgs.join(" ")}'`);
                break;
            }
            showHelp(myState.GetState);
            break;
        case "echo":
            console.log(secondArgs.join(" "));
            break;
        case "mode":
            ModeHandler(secondArgs);
            break;
        default:
            break;
    }
}

function CalculatorProcessor(opsType, secondArgs = []){
    switch (opsType) {
        case "help":
            if(secondArgs.length !== 0){
                console.error(`error : 'help' does not need arguments. args : '${secondArgs.join(" ")}'`);
                break;
            }
            showHelp(myState.GetState);
            break;
        case "echo":
            console.log(secondArgs.join(" "));
            break;
        case "mode":
            ModeHandler(secondArgs);
            break;
        default:
            if(secondArgs.length === 0){
                console.log(`error : Insert some number`);
            }

            let [...list] = secondArgs.map((number) => Number(number));
            if(!list.every(Number.isFinite)){
                console.log(`error : Not valid number\n`);
            }

            let total = operation(list, opsType);
            console.log(`Result : ${total}`);
            break;
    }
}

function ask(question){
    rl.question(question, (answer)=>{
        let [opsType, ...list]= answer.split(" ");

        opsType = opsType.toString().toLowerCase();

        if(CommandValid.isValid(opsType)){
            let [isNormalValid, isCalcValid, isOpsValid] = CommandValid.checkCommand(opsType);

            if (opsType === "exit"){
                myState.SetState = state_list.EXIT;
            }

            switch (myState.GetState) {
                case state_list.NORMAL:
                    if(isOpsValid){
                        console.log(`error : Command '${opsType}' only exist in calc mode`);
                        break;
                    }
                    NormalProcessor(opsType, list);
                    break;
                case state_list.CALC:
                    if(isNormalValid && !isOpsValid && !isCalcValid){
                        console.log(`error : Command '${opsType}' only exist in normal mode`);
                        break;
                    }
                    CalculatorProcessor(opsType, list);
                    break;
                case state_list.EXIT:
                    console.log("Goodbye :)");
                    process.exit(0);
                    break;
            
                default:
                    break;
            }
        }else{
            console.error(`error : Unknown command '${opsType}'. See 'help'`);
        }

        ask(question);
    });
}

console.log("SELAMAT DATANG DI KALKULATOR CLI\nSee 'help' for info");
ask("> ");