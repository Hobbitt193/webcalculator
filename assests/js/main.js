const disp = document.getElementById('display');
const exprEl = document.getElementById('expr');
let expr = '0';
let fresh = false;

function updateDisp(v) { disp.value = v; }

function appendNum(v) {
    if (fresh) { expr = v; fresh = false; }
    else if (expr === '0') expr = v;
    else expr += v;
    updateDisp(expr);
    exprEl.textContent = '';
}

function appendDot() {
    if (fresh) { expr = '0.'; fresh = false; updateDisp(expr); return; }
    const parts = expr.split(/[\+\-\*\/\(\)]/);
    const last = parts[parts.length - 1];
    if (last.includes('.')) return;
    expr += '.';
    updateDisp(expr);
    exprEl.textContent = '';
}

function appendOp(op) {
    fresh = false;
    const last = expr.slice(-1);
    if ('+-*/%'.includes(last)) expr = expr.slice(0, -1);
    expr += op;
    updateDisp(expr);
    exprEl.textContent = '';
}

function appendRaw(ch) {
    fresh = false;
    if (ch === '(') {
        expr = (expr === '0') ? '(' : expr + '(';
    } else {
        expr += ')';
    }
    updateDisp(expr);
    exprEl.textContent = '';
}

function squareCurrent() {
    fresh = false;
    expr = '(' + expr + ')^2';
    updateDisp(expr);
    exprEl.textContent = '';
}

function clearAll() {
    expr = '0';
    updateDisp('0');
    exprEl.textContent = '';
    fresh = false;
}

function toggleSign() {
    if (expr.startsWith('-')) expr = expr.slice(1);
    else expr = '-' + expr;
    updateDisp(expr);
}

function calculate() {
    try {
        let raw = expr
            .replace(/\^2/g, '**2')
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/−/g, '-');
        let open  = (raw.match(/\(/g) || []).length;
        let close = (raw.match(/\)/g) || []).length;
        for (let i = 0; i < open - close; i++) raw += ')';
        exprEl.textContent = expr + ' =';
        let result = Function('"use strict"; return (' + raw + ')')();
        expr = parseFloat(result.toFixed(10)).toString();
        updateDisp(expr);
        fresh = true;
    } catch (e) {
        exprEl.textContent = '';
        updateDisp('Алдаа');
        setTimeout(clearAll, 1200);
    }
}

document.addEventListener('keydown', e => {
    if ('0123456789'.includes(e.key)) appendNum(e.key);
    else if (e.key === '+') appendOp('+');
    else if (e.key === '-') appendOp('-');
    else if (e.key === '*') appendOp('*');
    else if (e.key === '/') { e.preventDefault(); appendOp('/'); }
    else if (e.key === '.') appendDot();
    else if (e.key === '(') appendRaw('(');
    else if (e.key === ')') appendRaw(')');
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') {
        if (fresh) { clearAll(); return; }
        expr = expr.length > 1 ? expr.slice(0, -1) : '0';
        updateDisp(expr);
    }
    else if (e.key === 'Escape') clearAll();
});

function backspace() {
    if (fresh) { clearAll(); return; }
    expr = expr.length > 1 ? expr.slice(0, -1) : '0';
    updateDisp(expr);
    exprEl.textContent = '';
}