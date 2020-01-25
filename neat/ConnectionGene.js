class ConnectionGene {
    constructor(inp, out, weight, enabled, inno) {
        this.in = inp;
        this.out = out;
        this.weight = weight;
        this.enabled = enabled;
        this.innovation = inno;
    }

    toggle() {
        this.enabled = !this.enabled;
    }

    clone() {
        return new this.constructor(this.in.clone(), this.out.clone(), this.weight, this.enabled, this.innovation);
    }
}