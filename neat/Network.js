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
					if(outconn.enabled) {
						let out = this.neurons[outconn.out.id];
						console.log("adding: ", out);
						out.in.push(neuron.result * outconn.weight);
						stack.unshift(out);
					}
                }
            }

            if((neuron.type == 0 || neuron.type == 1) && neuron.done == true) {
                for(let i = 0; i < neuron.out.length; i++) {
					let outconn = neuron.out[i];
					if(outconn.enabled) {
						let out = this.neurons[outconn.out.id];
						console.log("adding: ", out);
						out.in.push(neuron.result * outconn.weight);
						stack.unshift(out);
					}
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
	
	mutate() {
		if(Math.random() < 0.2) {
			let rand = Math.floor(Math.random()*4);
			
			if(rand == 0) {
				// Toggle connection
				let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
				randConn.toggle();
			}
			else if(rand == 1) {
				// Shift weight
				let direction = Math.random() > 0.5 ? 0.1 : -0.1;
				let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
				randConn.weight *= (1 + direction);
			}
			else if(rand == 2) {
				// New node
				let randConn = this.connections[Math.floor(Math.random() * this.connections.length)];
				randConn.disable();

				let nnode = new Node(this.nodes[this.nodes.length - 1].id + 1, 2);
				this.addNode(nnode);
				let maxInno = this.connections[this.connections.length - 1].innovation;
				let conn1 = new ConnectionGene(randConn.in, nnode, 1, true, maxInno + 1);
				let conn2 = new ConnectionGene(nnode, randConn.out, randConn.weight, true, maxInno + 2);
				this.addConnection(conn1);
				this.addConnection(conn2);
			}
			else if(rand == 3) {
				let maxTries = 10;

				while(maxTries-- > 0) {
					let pFrom = this.nodes.filter(x => (x.type == 0 || x.type == 2));
					let from = pFrom[Math.floor(Math.random() * pFrom.length)];
					let pTo = this.nodes.filter(x => (x.id != from.id && (x.type == 2 || x.type == 3)));
					let to = pTo[Math.floor(Math.random() * pTo.length)];

					if(this.validateConnection(from, to.id)) {
						let newConn = new ConnectionGene(from, to, Math.random()*2 - 1, true, this.connections[this.connections.length - 1].innovation + 1);
						this.addConnection(newConn);
						break;
					}
				}
			}
		}
	}

	validateConnection(node, id) {
		let connections = this.connections.filter(x => (x.in.id == node.id));
		for(let i = 0; i < connections.length; i++) {
			let conn = connections[i];

			if(conn.out.id == id)
				return false;
			
			if(!this.validateConnection(conn.out, id)) 
				return false;
		}

		return true;
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

        if(ia < a.connections.length) {
            for(let i = ia; i < a.connections.length; i++) {
                genome.addConnection(a.connections[i].clone());
            }
        }

        return genome;
    }
}