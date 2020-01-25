function* entries(obj) {
    for(let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }
}

class Network extends Genome {
    constructor(fitness, generation) {
        super();
        this.fitness = fitness || 0;
        this.generation = generation || 0;
        this.neurons = {};
    }

    buildNetwork() {
        let neurons = {};
        this.connections.map((conn) => {
            let inp = conn.in;
            let out = conn.out;
            let neuron = neurons[inp.id];
            if(!neuron) {
                neuron = new Neuron(inp.id, inp.type);
                neurons[inp.id] = neuron;
            }

            if(neurons[out.id] == undefined) {
                neurons[out.id] = new Neuron(out.id, out.type);
            }

            neuron.out.push(conn);
            neurons[out.id].inpCount++;
        });

        this.neurons = neurons;
    }

    feedForward(inputs) {
        let inputNeurons = [];
        let inpCount = 0;
        for(let [k,v] of entries(this.neurons)) {
            if(v.type == 0) {
                v.activate(inputs[inpCount++]);
                inputNeurons.push(v);
            }
            else if(v.type == 1) {
                v.activate();
                inputNeurons.push(v);
            }
        }

        let stack = [...inputNeurons];
        let kk = 0;
        while(stack.length) {
            let neuron = stack.pop();

            if(neuron.in.length == neuron.inpCount && neuron.type != 1 && neuron.type != 0 && !neuron.done) {
                console.log("calculating sum: ",neuron);
                let weightedSum = 0;
                neuron.in.map((v) => {weightedSum += v;});
                neuron.activate(weightedSum);
                console.log(`Done ${weightedSum} -> ${neuron.result}`);

                for(let i = 0; i < neuron.out.length; i++) {
                    let outconn = neuron.out[i];
                    let out = this.neurons[outconn.out.id];
                    console.log("adding: ", out);
                    out.in.push(neuron.result * outconn.weight);
                    stack.unshift(out);
                }
            }

            if((neuron.type == 0 || neuron.type == 1) && neuron.done == true) {
                for(let i = 0; i < neuron.out.length; i++) {
                    let outconn = neuron.out[i];
                    let out = this.neurons[outconn.out.id];
                    console.log("adding: ", out);
                    out.in.push(neuron.result * outconn.weight);
                    stack.unshift(out);
                }
            }
            else if(!neuron.done) {
                stack.unshift(neuron);
            }
            if(kk++ > 10) {
                throw new Error("ya.");
            }
        }

        let outputs = [];
        for(let [k,v] of entries(this.neurons)) {
            if(v.type == 3)
                outputs.push(v.result);
        }

        return outputs;
    }

    clone() {
        let network = super.clone();   
        network.fitness = this.fitness;
        network.generation = this.generation;
        return network;
    }

    static cross(a,b) {  
        let genome = new Network();
        
        let ia = 0, ib = 0;
        while(ia < a.connections.length && ib < b.connections.length) {
            let ca = a.connections[ia];
            let cb = b.connections[ib];

            if(ca.innovation < cb.innovation) {
                genome.addConnection(ca.clone());
                ia++;
            }
            else if(ca.innovation > cb.innovation) {
                genome.addConnection(cb.clone());
                ib++;
            }
            else {
                if(Math.random() < 0.5) {
                    genome.addConnection(ca.clone());
                } else {
                    genome.addConnection(cb.clone());
                }
                ia++;ib++;
            }
        }

        console.log(ib, ia);
        if(ia < a.connections.length) {
            for(let i = ia; i < a.connections.length; i++) {
                genome.addConnection(a.connections[i].clone());
            }
        }

        return genome;
    }
}