import {vec3, vec4} from 'gl-matrix';
import {gl} from './globals';

export default class Particle {

    curr_pos : vec3;
    curr_vel : vec3;
    prev_pos : vec3;
    prev_vel : vec3;

    offset : vec3;
    color : vec4;
    acceleration : vec3;
    mass : number;
    
    click: vec3;

    constructor(curr_pos : vec3, curr_vel : vec3, offset : vec3, color: vec4, acceleration : vec3, mass : number) {
        this.curr_pos = curr_pos
        this.curr_vel = curr_vel;
        this.offset = offset;
        this.color = color;
        this.acceleration = acceleration;
        this.mass = mass;

        this.prev_pos = vec3.create();
        this.prev_vel =vec3.create();
    }

    //update with Verlet
    update(dT: number) {
            var new_Pos = vec3.create();
            var subtract_Pos = vec3.create();
            var first_Term = vec3.create();
            var second_Term = vec3.create();

            var bound = 200;
            //(current - prev)
            vec3.subtract(subtract_Pos, this.curr_pos, this.prev_pos);
            //current + (current - prev)
            vec3.add(first_Term, this.curr_pos, subtract_Pos);

            //calculate acceleration depending on constraints
            if(vec3.length(first_Term) > bound) {
                //randomize the new direction (from -1 to 1)
                var randDir1 = Math.random() * 2 - 1;
                var randDir2 = Math.random() * 2 - 1;
                var randDir3 = Math.random() * 2 - 1;

                let dir = vec3.create();
                vec3.subtract(dir, first_Term, this.curr_pos);
                first_Term = this.curr_pos;
                //get opposite direction
                vec3.normalize(dir, dir); //normalize the direction
                vec3.add(dir, dir, vec3.fromValues(randDir1, randDir1, randDir1)); //add the randomizer
                vec3.scale(dir, dir, -1); //negate the direction
                this.applyForce(dir); //apply the directional force to the acceleration
                //console.log(dir);
            }

            //accel * (time^2)
            var dT2 = dT * dT; 
            vec3.scale(second_Term, this.acceleration, dT2);
            //final position, adding 
            vec3.add(new_Pos, first_Term, second_Term);

            //update prev and current positions
            this.prev_pos = this.curr_pos;
            this.curr_pos = new_Pos;

            var dist = vec3.dist(this.curr_pos, vec3.fromValues(0,100,0));
            var colorVec = this.colorGen(dist);
            this.color = vec4.fromValues(colorVec[0], colorVec[1], colorVec[2], 1.0);
            //further away from center, get darker
            if(vec3.length(this.curr_pos) > 100) {
                var adder = vec4.create();
                adder = vec4.fromValues(0.2,0.2,0.2,0.2);
                vec4.subtract(this.color, this.color, adder);
                this.color[0] = Math.min(Math.max(this.color[0], 0), 1);
                this.color[1] = Math.min(Math.max(this.color[0], 0), 1);
                this.color[2] = Math.min(Math.max(this.color[0], 0), 1);
                //vec4.floor(this.color, vec4.fromValues(1,1,1,1));
            }
    }

    colorGen(t : number) : vec3 {
        //cosine curve
        var a = vec3.fromValues(0.8, 0.5, 0.4);
        var b = vec3.fromValues(0.2, 0.4, 0.2);
        var c = vec3.fromValues(2.0, 1.0, 1.0);
        var d = vec3.fromValues(0.00, 0.25, 0.25);

        var mult1 = vec3.create();
        var add1 = vec3.create();
        var mult2Pi = vec3.create();

        vec3.scale(mult1, c, t);
        vec3.add(add1, mult1, d);
        vec3.scale(mult2Pi, add1, 2.0 * 3.1415);

        var cosVec = vec3.fromValues(Math.cos(mult2Pi[0]), Math.cos(mult2Pi[1]), Math.cos(mult2Pi[2]));
        
        var bCos = vec3.create();
        vec3.mul(bCos, b, cosVec);
        
        var final = vec3.create();
        vec3.add(final, a, bCos);
        
        return final;
    }

    // updates the acceleration
    //for constraints and for mouse movement
   applyForce(force: vec3) {
        var updateAcc = vec3.create();
        vec3.scale(updateAcc, force, 1 / this.mass);
        this.acceleration = updateAcc;
   }
}

