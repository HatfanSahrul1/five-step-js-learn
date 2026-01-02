const inputEl = document.getElementById("input");
let question="";

function display(params) {
    question += params;
    inputEl.value += params;
}

function alterDisplay(val){
    inputEl.value = val;
}

const buttons = document.querySelectorAll('input[type="button"]');
buttons.forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e)
{
    let key = e.target.value;

    if('+-/*'.includes(key))
    {
        insertOperation(key);
    }
    else if(key === 'C')
    {
        clr();
    }
    else if(key === '=')
    {
        solve();
    }
    else
    {
        display(key)
    }
}

function insertOperation(_ops){
    let x = inputEl.value;
    
    if (x.length > 0 &&
        (x[x.length - 1] === '+' ||
        x[x.length - 1] === '-' ||
        x[x.length - 1] === '/' ||
        x[x.length - 1] === '*')
    )
    {
        question = question.replace(question[question.length - 2], _ops);
        alterDisplay(x.replace(x[x.length - 1], _ops));
    }
    else
    {
        question += '|';
        display(_ops);
        question += '|';
    }
}

const operations = {
    "+":(a, b) => Number(a) + Number(b),
    "-":(a, b) => Number(a) - Number(b),
    "*":(a, b) => Number(a) * Number(b),
    "/":(a, b) => Number(a) / Number(b)
}

function solve()
{
    console.log(question);

    let x = question.split('|');
    
    const upperOpsId = (q)=>{
        for(let i = 1; i < q.length;i+=2)
        {
            if(q[i] == '*' || q[i] == '/') {
                return i;
            }
        }
    };

    const sequenceOps = (q, curr, prev, next)=>{
        let tempResult = operations[q[curr]](q[prev], q[next]);
        q[curr] = tempResult;
        return q.filter((value, index) => (index !== prev) && (index !== next));
    };

    while(x.includes('*') || x.includes('/'))
    {
        id = upperOpsId(x);
        x = sequenceOps(x, id, id-1, id+1);
    }

    while(x.length > 1)
    {
        id = 1;
        x = sequenceOps(x, id, id-1, id+1);
    }
    

    question = `${x[0]}`
    alterDisplay(x[0]);
}

function clr()
{
    alterDisplay("");
    question ="";
}