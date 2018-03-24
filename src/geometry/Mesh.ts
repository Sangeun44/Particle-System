import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import Flower from './Flower';
import Wahoo from './Wahoo';

class Mesh extends Drawable {
    indices: Uint32Array;
    positions: Float32Array;
    normals: Float32Array;
    center: vec4;

    ind : Array<number>;
    pos : Array<number>;
    norm : Array<number>;
  
  constructor(center : vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.indices = new Uint32Array([]);
    this.positions = new Float32Array([]);
    this.normals = new Float32Array([]);

    this.ind = new Array<number>();
    this.pos = new Array<number>();
    this.norm = new Array<number>(); 
  }

  indexOfMax = function(arr : Array<number>) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

  addFlower(chim: Flower) {
    var objInd = new Array<number>();
    objInd = chim.getInd();
    var objNorm = new Array<number>();
    objNorm = chim.getNorm();
    var objPos = new Array<number>();
    objPos = chim.getPos();

    for(var i = 0; i < objPos.length; ++i) {
      this.pos.push(objPos[i]);
      // console.log("pos:" + objPos[i]);
    } 
    for(var i = 0; i < objNorm.length; ++i) {
      this.norm.push(objNorm[i]);
      // console.log("norms:" + objNorm[i]);
    } 
    var lastInd = 0;
    if(this.ind.length > 0) {
     var max = this.indexOfMax(this.ind);
     var maxE = this.ind[max];
      lastInd = maxE + 1;
      //console.log("maxInd:" + maxE);

    } 
    for(var i = 0; i < objInd.length; ++i) {
      // console.log("index: " + lastInd);
      // console.log("index num: " + objInd.length);
      this.ind.push(objInd[i] + lastInd);
      // console.log("ind:" + objInd[i]);
    }
  }

  addWahoo(chim: Wahoo) {
    var objInd = new Array<number>();
    objInd = chim.getInd();
    var objNorm = new Array<number>();
    objNorm = chim.getNorm();
    var objPos = new Array<number>();
    objPos = chim.getPos();

    for(var i = 0; i < objPos.length; ++i) {
      this.pos.push(objPos[i]);
      // console.log("pos:" + objPos[i]);
    } 
    for(var i = 0; i < objNorm.length; ++i) {
      this.norm.push(objNorm[i]);
      // console.log("norms:" + objNorm[i]);
    } 
    var lastInd = 0;
    if(this.ind.length > 0) {
     var max = this.indexOfMax(this.ind);
     var maxE = this.ind[max];
      lastInd = maxE + 1;
      //console.log("maxInd:" + maxE);

    } 
    for(var i = 0; i < objInd.length; ++i) {
      // console.log("index: " + lastInd);
      // console.log("index num: " + objInd.length);
      this.ind.push(objInd[i] + lastInd);
      // console.log("ind:" + objInd[i]);
    }
  }
//   addGrass(chim: Grass) {
//     var objInd = new Array<number>();
//     objInd = chim.getInd();
//     var objNorm = new Array<number>();
//     objNorm = chim.getNorm();
//     var objPos = new Array<number>();
//     objPos = chim.getPos();

//     for(var i = 0; i < objPos.length; ++i) {
//       this.pos.push(objPos[i]);
//       // console.log("pos:" + objPos[i]);
//     } 
//     for(var i = 0; i < objNorm.length; ++i) {
//       this.norm.push(objNorm[i]);
//       // console.log("norms:" + objNorm[i]);
//     } 
//     var lastInd = 0;
//     if(this.ind.length > 0) {
//      // var max = Math.max.apply(null, this.ind);
//      var max = this.indexOfMax(this.ind);
//      var maxE = this.ind[max];
//      // var ind2 = this.ind;
//      // ind2.sort(function(a, b){return b - a});
//       lastInd = maxE + 1;
//       //console.log("maxInd:" + maxE);

//     } 
//     // if(this.ind.length > 0) {
//     //   var lastInd = this.ind[this.ind.length - 1] + 4;
//     // } else {
//     //   var lastInd = 0;
//     // }
//     // console.log("beg Ind: " + lastInd);
//     for(var i = 0; i < objInd.length; ++i) {
//       // console.log("index: " + lastInd);
//       // console.log("index num: " + objInd.length);
//       this.ind.push(objInd[i] + lastInd);
//       // console.log("ind:" + objInd[i]);
//     }

// }

  create() {
    this.indices = Uint32Array.from(this.ind);
    this.positions = Float32Array.from(this.pos);
    this.normals = Float32Array.from(this.norm);

    this.generateIdx();
    this.generatePos();
    this.generateNor();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created Mesh`);
  }
};

export default Mesh;
