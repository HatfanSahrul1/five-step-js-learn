const inputEl = document.getElementById("input");

const state = {
    expression : "",
    token : []
};

const buttons = document.querySelectorAll('input[type="button"]');
buttons.forEach(btn => {
    btn.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e){
    let key = e.target.value;

    if('+-/*'.includes(key)){
        pushOperator(key);
    }else if(key === 'C'){
        clr();
    }else if(key === '='){
        solve();
    }else{
        pushNumber(key)
    }
}

function pushNumber(params) {
    state.expression += params;

    if(state.token.length === 0){
        state.token.push(state.expression);
    }
    
    if('+-/*'.includes(state.token[state.token.length - 1])){
        state.token.push(state.expression);
    }else{
        state.token[state.token.length - 1] = state.expression;
    }
    render();
}

function alterDisplay(val){
    inputEl.value = val;
}

function pushOperator(_ops){
    if(state.token.length === 0 && _ops === '-'){
        state.expression += _ops;
    }else{
        if(state.token.length !== 0 && '+-/*'.includes(state.token[state.token.length - 1])){
            state.token[state.token.length - 1] = _ops;
        }else{
            state.token.push(_ops);
            state.expression = "";
        }
    }

    render();
}

const operations = {
    "+":(a, b) => Number(a) + Number(b),
    "-":(a, b) => Number(a) - Number(b),
    "*":(a, b) => Number(a) * Number(b),
    "/":(a, b) => Number(a) / Number(b)
}

function solve()
{
    if(state.token.length % 2 === 0) state.token.pop();
    let x = state.token;
    
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
    
    state.token = x;
    state.expression = x[0];
    render();
}

function clr()
{
   inputEl.value = "";
   state.token = [];
   state.expression = "";
}

function render()
{
    inputEl.value = (state.token.length !== 0) ? state.token.join('') : state.expression;
}