import CalculationEngine from './CalculationEngine';

class TapeEngine {
    setProps(item, outputValue, outputClassName) {
        this.item = item;
        this.output = {
            value: outputValue,
            classList: outputClassName.split(' '),
            focus: true
        }
    }

    handleOutput(output) {
        output.value = this.output.value;
        const classList = this.output.classList;
        output.classList = [];

        for (let i = 0; i < classList.length; i++) {
            output.classList.add(classList[i]);
        }

        if (output.focus) {
            output.blur();
        }

        return output;
    }

    remove(array, item) {
        const index = array.indexOf(item);

        if (index > -1) {
            array.splice(index, 1);
        }

        return array;
    }

    tape() {
        let type = this.item.type;

        switch (type) {
            case 'operation':
                this.tapeOperation(this.item.value);
                break;
            case 'symbol':
                this.tapeSymbol(this.item.value);
                break;
            case 'sign':
                this.tapeSign(this.item.value);
                break;
            default:
                break;
        }
    }

    tapeSign(value) {
        let curValue = value;
        let text = this.output.value;
        let newValue = this.output.value;

        if (text !== 'ERROR' && !this.output.classList.includes('result')) {
            if (text === '0' && value === '-') {
                newValue = curValue;
            } else {
                newValue = text + curValue;
            }
        } else if (text !== 'ERROR') {
            newValue = text + curValue;
            this.output.classList = this.remove(this.output.classList, 'result');
        } else {
            newValue = curValue;
            this.output.classList = this.remove(this.output.classList, 'result');
            this.output.classList = this.remove(this.output.classList, 'blocked');
        }

        this.output.value = newValue;
    }

    tapeSymbol(value) {
        let curValue = value;
        let text = this.output.value;
        let newValue = this.output.value;

        if (text !== 'ERROR' && !this.output.classList.includes('result')) {
            if (value !== '.') {
                newValue = (text === '0' ? '' : text) + curValue;
            } else {
                newValue = text + curValue;
            }
        } else {
            newValue = curValue;
            this.output.classList = this.remove(this.output.classList, 'result');
            this.output.classList = this.remove(this.output.classList, 'blocked');
        }

        this.output.value = newValue;
    }

    tapeOperation(value) {
        let curValue = value;
        let text = this.output.value;
        let newValue = this.output.value;

        if (curValue === 'C') {
            newValue = '';
            this.output.classList = this.remove(this.output.classList, 'result');
            this.output.classList = this.remove(this.output.classList, 'blocked');
        } else if (text !== 'ERROR' && curValue === '=') {
            let engine = new CalculationEngine(text);
            let result = engine.calculateFull(engine.expression);

            if (isNaN(parseFloat((result)))) {
                newValue = 'ERROR';
                this.output.classList.push('blocked');
                this.output.focus = false;
            } else {
                newValue = result;
                this.output.classList.push('result');
            }
        } else if (curValue === 'T') {
            document.body.classList.toggle('dark');
        }
        this.output.value = newValue;
    }
}

export default TapeEngine;