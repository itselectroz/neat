class Neuron {
    constructor(id, type) {
        this.in = [];
        this.inpCount = 0;
        this.out = [];
        this.type = type;
        this.id = id;
        this.done = false;
        this.result = 0;
    }

    reset() {
        this.done = false;
        this.in = [];
        this.result = 0;
    }

    activation(val) {
        return 1/(1+Math.pow(Math.E, -val)); // sigmoid
    }

    activate(val) {
        this.done = true;
        this.result = this.type == 1 ? 1 : this.activation(val);
    }
}