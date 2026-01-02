const readline = require("readline");

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
});

const ops = ([...numbers], opsType) => {

    [first, ...rest] = numbers;

    switch (opsType) {
        case "tambah": return rest.reduce((acc, curr) => acc + curr, first); break;
        case "kurang": return rest.reduce((acc, curr) => acc - curr, first); break;
        case "kali": return rest.reduce((acc, curr) => acc * curr, first); break;
        case "bagi": return rest.reduce((acc, curr) => acc / curr, first); break;

        default:
            break;
    }
};


function ask(question){
    rl.question(question, (answer)=>{
        
    });
}

let test = ops([1, 3, 2, 2], "bagi");

console.log(test);