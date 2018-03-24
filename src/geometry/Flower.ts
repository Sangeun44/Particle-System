import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

//obj
var OBJ = require('webgl-obj-loader');

class Flower extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  center: vec4;
  
  mesh: any;
  objStr: string;

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
    this.indices = new Uint32Array([]);
    this.positions = new Float32Array([]);
    this.normals = new Float32Array([]);

     //obj loader
    this.objStr = document.getElementById('why_flower.obj').innerHTML;
    this.mesh = new OBJ.Mesh(this.objStr); 

    this.addMeshData();
  }

  getInd = function() {
   return this.indices;
  }
  
  getNorm = function() {
    return this.normals;
  }

  getPos = function() {
    return this.positions;
  }

  setInd = function(ind : Array<number>) {
    this.indices = Uint32Array.from(ind);
   }
   
  setNorm = function(norm : Array<number>) {
    this.normals = Float32Array.from(norm);
   }
 
  setPos = function(pos : Array<number>) {
    this.positions = Float32Array.from(pos);
  }

  addMeshData() {
    var objInd = new Array<number>();
    var objPos = new Array<number>();
    var objNorm = new Array<number>();
    
    objInd = this.mesh.indices;
    
    //normals
    for(var i = 0; i < this.mesh.vertexNormals.length; i = i + 3) {
        objNorm.push(this.mesh.vertexNormals[i] );
        objNorm.push(this.mesh.vertexNormals[i+1]); 
        objNorm.push(this.mesh.vertexNormals[i+2] );
        objNorm.push(0);
    }  

    //vertex positions
    for(var i = 0; i < this.mesh.vertices.length; i = i + 3) {
        objPos.push(this.mesh.vertices[i]);
        objPos.push(this.mesh.vertices[i+1]);
        objPos.push(this.mesh.vertices[i+2]);
        objPos.push(1);
    }  

  this.indices = Uint32Array.from(objInd);
  this.normals = Float32Array.from(objNorm);
  this.positions = Float32Array.from(objPos);
  }

  create() {
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

    console.log(`Created flower`);
  }
};

export default Flower;
