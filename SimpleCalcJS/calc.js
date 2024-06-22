// calculator.js

const input_element = document.querySelector(".input");
const output_operation_element = document.querySelector(".operation .value");
const output_result_element = document.querySelector(".result .value");

let data = {
    operation : [],
    result : [],
}

function createCalculatorButtons(){
    const btns_per_row = 4;
    let added_btns = 0;
    calculator_buttons.forEach( (button, index) => {
        if( added_btns % btns_per_row == 0 ){
            input_element.innerHTML += `<div class="row"></div>`;
        }
        const row = document.querySelector(".row:last-child");
        row.innerHTML += `<button id="${button.name}">
                            ${button.symbol}
                          </button>`;
        added_btns++;
    });
}

input_element.addEventListener("click", event => { 
    const target_btn = event.target;
    calculator_buttons.forEach( button => {
        if( button.name == target_btn.id ) calculator(button);
    });
});

let lastButtonType = "";

function calculator( button ){
    if( button.type == "key" ){
        if( button.name == "clear" ){
            data.operation = [];
            data.result = [];
            updateOutputResult(0);
        }
        else if( button.name == "delete" ){
            data.result.pop();
            data.operation.pop();            
        }
    }else if( button.type == "operator" ){
        if (lastButtonType == "operator"){
            data.result.pop();
            data.operation.pop();             
        }
        data.operation.push(button.symbol);
        data.result.push(button.formula);
    }
    else if( button.type == "number" ){
        if (lastButtonType == "calculate"){
            data.operation = [];
            data.result = [];
            updateOutputResult(0);
        }
        data.operation.push(button.symbol);
        data.result.push(button.formula);
    } 
    else if( button.type == "calculate" ){
        
        let result_joined = data.result.join('');

        if (result_joined === ''){
            updateOutputResult( 0 );
            return;
        }

        data.operation = [];
        data.result = [];

        let result_final;
        try {
            result_final = eval(result_joined); 
        } catch (error) {
            if (error instanceof SyntaxError) {
                result_final = "Syntax Error!"
                updateOutputResult( result_final );
                return;
            }
        }

        result_final = formatResult(result_final);

        data.operation.push(result_final);
        data.result.push(result_final);
        
        updateOutputResult( result_final );

    }

    updateOutputOperation( data.operation.join('') );

    lastButtonType = button.type;
}

function updateOutputOperation(operation){
    output_operation_element.innerHTML = operation;
}

function updateOutputResult(result){
    output_result_element.innerHTML = result;
}

function digitCounter(number){
    return number.toString().length;
}

function isFloat(number){
    return number % 1 != 0;
}

const max_output_number_length = 10;
const output_precision = 5;

function formatResult( result ){
    if( digitCounter(result) > max_output_number_length){
        if( isFloat(result) ){
            const result_int = parseInt(result);
            const result_int_length = digitCounter(result_int);

            if( result_int_length > max_output_number_length ){
                return result.toPrecision(output_precision);
            }else{
                const num_digits_after_point = max_output_number_length - result_int_length;
                return result.toFixed(num_digits_after_point);
            }
        }else{
            return result.toPrecision(output_precision);
        }
    }else{
        return result;
    }
}

createCalculatorButtons();
