const readline = require("readline");

const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout,
});

const operation = ([...numbers], opsType) => {
    [first, ...rest] = numbers;
    switch (opsType) {
        case "tambah": return rest.reduce((acc, curr) => acc + curr, first); break;
        case "kurang": return rest.reduce((acc, curr) => acc - curr, first); break;
        case "kali": return rest.reduce((acc, curr) => acc * curr, first); break;
        case "bagi": return rest.reduce((acc, curr) => acc / curr, first); break;
        default: break;
    }
};

function ask(question){
    console.log(`Command List : \n- 'tambah'\n- 'kurang'\n- 'kali'\n- 'bagi'\n`);
    console.log(`contoh : tambah 2 4 5 2 3 22 4.6\n`);

    const opsList = ["tambah", "kurang", "kali", "bagi"];
    
    rl.question(question, (answer)=>{
        let [opsType, ...list]= answer.split(" ");
        let total;

        opsType = opsType.toString().toLowerCase();
        list = list.map((number) => Number(number));
        
        if(opsList.includes(opsType)){
            total = operation(list, opsType);
            console.log(`==================================`);
            console.log(`Hasilnya adalah : ${total}\n`);
            console.log(`==================================`);
        }else{
            console.log(`Command Salah [${opsType}]\n`);
        }
    });

    ask(question);
}

console.log("SELAMAT DATANG DI KALKULATOR CLI\n");
ask("Masukkan perintah : ");