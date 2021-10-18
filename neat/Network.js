function* entries(obj) {
    for (let key of Object.keys(obj)) {
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

    isDead(neuron) {
        if(!neuron) {
            return true;
        }

        if(neuron.type == 0 || neuron.type == 1) {
            return false;
        }

        const connections = this.connections.filter(v => v.out.id == neuron.id);
        
        // Are all the inputs disabled?
        const allDead = connections.every(v => !v.enabled);
        if(allDead) {
            return true;
        }

        // Are all the input neurons alive?
        const allAlive = connections.every(conn => {
            const inputNeuron = this.neurons[conn.in.id];
            return !this.isDead(inputNeuron);
        });
        if(!allAlive) {
            return true;
        }

        // If all the inputs are enabled and all the input neurons are alive, this neuron is alive
        return false;
    }

    buildNetwork() {
        let neurons = {};
        this.connections.map((conn) => {
            let inp = conn.in;
            let out = conn.out;
            let neuron = neurons[inp.id];
            if (!neuron) {
                neuron = new Neuron(inp.id, inp.type);
                neurons[inp.id] = neuron;
            }

            if (neurons[out.id] == undefined) {
                neurons[out.id] = new Neuron(out.id, out.type);
            }

            neuron.out.push(conn);
            
            // Check if a neuron is dead
            if(conn.enabled && !this.isDead(neuron)) {
                neurons[out.id].inpCount++;
            }
        });

        this.neurons = neurons;
    }

    feedForward(inputs) {
        let inputNeurons = [];
        let inpCount = 0;
        // Find all input neurons, reset done value
        let toEvaluate = [];

        for(const [_, neuron] of entries(this.neurons)) {
            neuron.reset();
        }

        for (let [k, neuron] of entries(this.neurons)) {            
            if(neuron.type != 0 && neuron.type != 1) {
                continue;
            }
            
            if (neuron.type == 0) {
                neuron.activate(inputs[inpCount++]);
            }
            else if (neuron.type == 1) {
                neuron.activate();
            }

            // Evaluate its output neurons
            for(let i = 0; i < neuron.out.length; i++) {
                let outConnection = neuron.out[i];
                if(outConnection.enabled) {
                    let outNeuron = this.neurons[outConnection.out.id];
                    outNeuron.in.push(neuron.result * outConnection.weight);
                    toEvaluate.push(outNeuron);
                }
            }
        }

        let count = 0;
        while(!!toEvaluate.length) {
            if(count++ > 250) {
                console.log(this);
                console.log(toEvaluate);
                throw new Error();
                break;
            }
            const nextToEvaluate = [];
            for(const neuron of toEvaluate) {
                if(neuron.done || neuron.type == 3 || neuron.inpCount == 0) {
                    continue;
                }
                if(neuron.in.length < neuron.inpCount && neuron.type != 1 && neuron.type != 0) {
                    nextToEvaluate.push(neuron);
                    continue;
                }
                
                let weightedSum = neuron.in.reduce((prev, curr) => prev + curr, 0);
                
                neuron.activate(weightedSum);

                // Evaluate its output neurons
                for(let i = 0; i < neuron.out.length; i++) {
                    let outConnection = neuron.out[i];
                    if(outConnection.enabled) {
                        let outNeuron = this.neurons[outConnection.out.id];
                        outNeuron.in.push(neuron.result * outConnection.weight);
                        nextToEvaluate.push(outNeuron);
                    }
                }
            }

            toEvaluate = nextToEvaluate;
        }

        let outputs = [];
        for (let [k, v] of entries(this.neurons)) {
            if (v.type == 3) {
                const weightedSum = v.in.reduce((prev, curr) => prev + curr, 0);
                v.activate(weightedSum);

                outputs.push(v.result);
            }
        }

        return outputs;
    }

    clone() {
        let network = super.clone();
        network.fitness = this.fitness;
        network.generation = this.generation;
        return network;
    }

    mutate(overrideChance) {
        if (Math.random() < 0.2 || !!overrideChance) {
            let rand = Math.floor(Math.random() * 4);

            if (rand == 0) {
                // Toggle connection
                let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
                randConn.toggle();
            }
            else if (rand == 1) {
                // Shift weight
                let direction = Math.random() > 0.5 ? 0.1 : -0.1;
                let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
                randConn.weight *= (1 + direction);
            }
            else if (rand == 2) {
                this.addRandomNode();
            }
            else if (rand == 3) {
                this.addRandomConnection();
            }
        }
    }

    addRandomNode() {
        // New node
        let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
        randConn.disable();

        this.nodes.sort((a,b) => (a.id > b.id));
        let nnode = new Node(this.nodes[this.nodes.length - 1].id + 1, 2);
        this.addNode(nnode);
        let maxInno = this.connections[this.connections.length - 1].innovation;
        let conn1 = new ConnectionGene(randConn.in, nnode, 1, true, maxInno + 1);
        let conn2 = new ConnectionGene(nnode, randConn.out, randConn.weight, true, maxInno + 2);
        this.addConnection(conn1);
        this.addConnection(conn2);
    }

    addRandomConnection() {
        let maxTries = 10;

        while (maxTries-- > 0) {
            let pFrom = this.nodes.filter(x => (x.type == 0 || x.type == 2));
            let iFrom = Math.floor(Math.random() * pFrom.length);
            let from = pFrom[iFrom];
            let pTo = this.nodes.filter(x => (x.id != from.id && (x.type == 2 || x.type == 3)));
            let iTo = Math.floor(Math.random() * pTo.length);
            let to = pTo[iTo];

            if(!from || !to) {
                continue;
            }

            if(from.id == to.id) {
                continue;
            }

            if (this.validateConnection(from, [to.id])) {
                let newConn = new ConnectionGene(from, to, Math.random() * 2 - 1, true, this.connections[this.connections.length - 1].innovation + 1);
                this.addConnection(newConn);
                break;
            }
        }
    }

    validateConnection(node, visited) {
        visited.push(node.id);
        let connections = this.connections.filter(x => (x.in.id == node.id));
        for (let i = 0; i < connections.length; i++) {
            let conn = connections[i];

            if (visited.includes(conn.out.id))
                return false;

            if (!this.validateConnection(conn.out, visited))
                return false;
        }

        return true;
    }

    static cross(a, b) {
        let genome = new Network();

        let ia = 0, ib = 0;
        while (ia < a.connections.length && ib < b.connections.length) {
            let ca = a.connections[ia];
            let cb = b.connections[ib];

            if (ca.innovation < cb.innovation) {
                genome.addConnection(ca.clone());
                ia++;
            }
            else if (ca.innovation > cb.innovation) {
                genome.addConnection(cb.clone());
                ib++;
            }
            else {
                if (Math.random() < 0.5) {
                    genome.addConnection(ca.clone());
                } else {
                    genome.addConnection(cb.clone());
                }
                ia++; ib++;
            }
        }

        if (ia < a.connections.length) {
            for (let i = ia; i < a.connections.length; i++) {
                genome.addConnection(a.connections[i].clone());
            }
        }

        return genome;
    }
}