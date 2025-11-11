
function makePrism(w, h, d, red, green, blue) {
  w = w / 2;
  h = h / 2;
  d = d / 2;
  const positions = new Float32Array([
    -w, -h,  d,  w, -h,  d,  w,  h,  d,  -w,  h,  d,
    w, -h, -d,  -w, -h, -d,  -w,  h, -d,  w,  h, -d,
    -w, h, d,  w, h, d, w, h,  -d,  -w, h,  -d,
    -w, -h, -d,  w, -h, -d, w, -h,  d,  -w, -h,  d,
    w, -h, d, w, -h, -d, w, h, -d, w,h, d,
    -w, -h, -d, -w,  -h, d, -w, h, d, -w, h, -d
  ]);

  const color = [red, green, blue];
  const colors = new Float32Array([
    ...color, ...color, ...color, ...color,
    ...color, ...color, ...color, ...color,
    ...color, ...color, ...color, ...color,
    ...color, ...color, ...color, ...color,
    ...color, ...color, ...color, ...color,
    ...color, ...color, ...color, ...color
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,       
    4, 5, 6, 4, 6, 7,       
    8, 9, 10, 8, 10, 11,    
    12, 13, 14, 12, 14, 15, 
    16, 17, 18, 16, 18, 19, 
    20, 21, 22, 20, 22, 23  
  ]);
  const normals = new Float32Array([
    0,0,1, 0,0,1, 0,0,1, 0,0,1,
    0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
    0,1,0, 0,1,0, 0,1,0, 0,1,0, 
    0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 
    1,0,0, 1,0,0, 1,0,0, 1,0,0, 
    -1,0,0, -1,0,0, -1,0,0, -1,0,0
   
    ]);
  const texCoords = new Float32Array([
    0, 1,  1, 1, 1, 0, 0, 0,
    0, 1,  1, 1, 1, 0, 0, 0,
    0, 1,  1, 1, 1, 0, 0, 0,
    0, 1,  1, 1, 1, 0, 0, 0,
    0, 1,  1, 1, 1, 0, 0, 0,
    0, 1,  1, 1, 1, 0, 0, 0,
  ]);

  return { positions, colors, indices, normals, texCoords };
}

//=============Table========================================================
const table = makePrism(10.5, 5.5, 0.5, 0.345, 0.2, 0.121)
//=============Smoke========================================================
const smoke = makePrism(0.2, 0.2, 0.2, 0.25, 0.35, 0.35)

function makePlane(w, h, red, green, blue) {
  w = w / 2;
  h = h / 2;
  
  const positions = new Float32Array([
    -w, -h, 0,  
     w, -h, 0, 
     w,  h, 0, 
    -w,  h, 0   
  ]);

  const color = [red, green, blue];
  const colors = new Float32Array([
    ...color,
    ...color,
    ...color,
    ...color
  ]);

  const indices = new Uint16Array([
    0, 1, 2, 
    0, 2, 3  
  ]);

  const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ]);

  const texCoords = new Float32Array([
    0, 0, 
    1, 0,
    1, 1, 
    0, 1 
  ]);

  return { positions, colors, indices, normals, texCoords };
}
const wall = makePlane(15,15,1,1,1);
const steam = makePlane(8,8,1,1,1);
//=============Donut==========================================================
function generateDonut(R, r, uStep, vStep) {
  let positions = [];
  let colors = [];
  let normals = [];
  let texCoords = [];
  let indices = [];
  
  for (let i = 0; i <= uStep; i++) {
    let u = i * 2 * Math.PI / uStep;
    for (let j = 0; j <= vStep; j++) {
      let v = j * 2 * Math.PI / vStep;
      let cosu = Math.cos(u), sinu = Math.sin(u);
      let cosv = Math.cos(v), sinv = Math.sin(v);

      let x = (R + r * cosv) * cosu;
      let y = (R + r * cosv) * sinu;
      let z = r * sinv;
      positions.push(x, y, z);

      let s = i / uStep; 
      let t = j / vStep;  
      texCoords.push(s,t);

      let rux = - (R + r * cosv) * sinu;
      let ruy =   (R + r * cosv) * cosu;
      let ruz = 0.0;

      let rvx = - r * sinv * cosu;
      let rvy = - r * sinv * sinu;
      let rvz =   r * cosv;

      let nx = ruy * rvz - ruz * rvy;
      let ny = ruz * rvx - rux * rvz;
      let nzn = rux * rvy - ruy * rvx;

      let len = Math.hypot(nx, ny, nzn);
      if (len === 0) len = 1.0;
      nx /= len; ny /= len; nzn /= len;
      normals.push(nx, ny, nzn);
      colors.push(0.5 * (nx + 1.0), 0.5 * (ny + 1.0), 0.5 * (nzn + 1.0));
    }
  }

  for (let i = 0; i < uStep; i++) {
    for (let j = 0; j < vStep; j++) {
      const k1 = (i * (vStep + 1)) + j;
      const k2 = k1 + vStep + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords), // ADD THIS
    indices: new Uint16Array(indices)
  };
}

let donut = generateDonut(1.0, 0.4, 40, 30);

//=============Frosting========================================================
function generateFrosting(R, r, uStep, vStep) {
  let positions = [];
  let normals = [];
  let colors = [];
  let indices = [];
  let texCoords = [];
  let bumps = true;

  for (let i = 0; i <= uStep; i++) {
    let u = i * 2 * Math.PI / uStep;
    for (let j = 0; j <= vStep; j++) {
      let v = j * Math.PI / vStep;

      let cosu = Math.cos(u);
      let sinu = Math.sin(u);
      let cosv = Math.cos(v);
      let sinv = Math.sin(v);

      
      let x = (R + r * cosv) * cosu;
      let y = (R + r * cosv) * sinu;
      let z = r * sinv + 0.1; 

      // --- bump distortion ---
      let bump = 0.0;
      if (z === 0.1) { 
        if (bumps) {
          bump = -0.1;
          z += bump;
        }
        bumps = !bumps;
      }

      positions.push(x, y, z);

      let s = i / uStep; 
      let t = j / vStep;
      texCoords.push(s,t);

      let nx = cosu * cosv;
      let ny = sinu * cosv;
      let nz = sinv;

      let len = Math.hypot(nx, ny, nz);
      nx /= len; ny /= len; nz /= len;

      if (bump !== 0.0) {
        nz -= 0.2;
        let l = Math.hypot(nx, ny, nz);
        nx /= l; ny /= l; nz /= l;
      }

      normals.push(nx, ny, nz);
      colors.push(0.5 * (nx + 1.0), 0.5 * (ny + 1.0), 0.5 * (nz + 1.0));
    }
  }

  for (let i = 0; i < uStep; i++) {
    for (let j = 0; j < vStep; j++) {
      const k1 = (i * (vStep + 1)) + j;
      const k2 = k1 + vStep + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices),
  };
}
let frosting = generateFrosting(1.0, 0.40, 40, 30);


////=============Sprinkle======================================================

//generates all of the sprinkles on the frosting
function generateSprinkles(count, frostingPositions) {
  let positions = [];
  let colors = [];
  let indices = [];
  let normals = [];
  let texCoords = [];
  let vertexOffset = 0;

  for (let i = 0; i < count; i++) {
    //gets the coords of a random frosting vertex
    let randIndex = Math.floor(Math.random() * (frostingPositions.length / 3));
    while(frostingPositions[randIndex*3+2] <= 0.2){
      randIndex = Math.floor(Math.random() * (frostingPositions.length / 3));
    }
    const fx = frostingPositions[randIndex * 3];
    const fy = frostingPositions[randIndex * 3 + 1];
    const fz = frostingPositions[randIndex * 3 + 2];

    // Create a sprinkle
    const sprinkle = makePrism(0.15,0.04, 0.04, Math.random(), Math.random(), Math.random());

    //moves sprinkle to the position of the random frosting vertex with random rotation
    const angle = Math.random() * 2 * Math.PI;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);
    for (let v = 0; v < sprinkle.positions.length; v += 3) {
      let x = sprinkle.positions[v];
      let y = sprinkle.positions[v + 1];
      let z = sprinkle.positions[v + 2];

      ry = y * cosA - z * sinA;
      rz = y * sinA + z * cosA;
      y = ry;
      z = rz;

      rx = x * cosA - y * sinA;
      ry = x * sinA + y * cosA;
      x = rx;
      y = ry;

      rx = x * cosA + z * sinA;
      rz = z * cosA - x * sinA;
      x = rx;
      z = rz;
      positions.push(x + fx, y + fy, z + fz);
    }
    for (let n = 0; n < sprinkle.normals.length; n += 3) {
      let x = sprinkle.normals[n];
      let y = sprinkle.normals[n + 1];
      let z = sprinkle.normals[n + 2];

      const nx = x * cosA - z * sinA;
      const nz = x * sinA + z * cosA;

      normals.push(nx, y, nz);
    }
    colors.push(...sprinkle.colors);
    texCoords.push(...sprinkle.texCoords);

    // Add indices of the new sprinkle to all the sprinkles
    for (let idx of sprinkle.indices) {
      indices.push(idx + vertexOffset);
    }

    vertexOffset += sprinkle.positions.length / 3;
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}
let sprinkleData = generateSprinkles(150, frosting.positions);

////=============Coffee Cup======================================================
function makeCoffeeCup(r, uStep, vStep, height, red, blue, green, heightchange){
  let positions = [];
  let colors = [];
  let normals = [];
  let indices = [];
  let texCoords = [];

  for(let i = 0; i <= uStep; i++){
    let u = i * 2 * Math.PI / uStep;
    let cosu = Math.cos(u);
    let sinu = Math.sin(u);

    for(let j = 0; j <= vStep; j++){
      let v = j / vStep;
      let x = r * cosu;
      let y = r * sinu;
      let z = height * v; 

      // scales x and y after a certain z to get a nice cup shape
      if(z > heightchange){
        x *= 1.25;
        y *= 1.25;
      }

      positions.push(x, y, z);

      let nz = 1;
      colors.push(red * nz, blue * nz, green * nz);

      let texU = i / uStep;
      let texV = v;          
      texCoords.push(texU, texV);

      let nx = cosu;
      let ny = sinu;
      let nzNormal = 0;
      if(z > heightchange){
        nx *= 1.0 / 1.25;
        ny *= 1.0 / 1.25;
      }
      normals.push(nx, ny, nzNormal);
    }
  }

  for(let i = 0; i < uStep; i++){
    for(let j = 0; j < vStep; j++){
      const k1 = (i * (vStep+1)) + j;
      const k2 = k1 + vStep + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }

  const bottomCenterIndex = positions.length / 3;
  positions.push(0, 0, 0);
  colors.push(red, blue, green);
  normals.push(0, 0, -1); 
  texCoords.push(0.5, 0.5);

  for (let i = 0; i < uStep; i++) {
    const k1 = i * (vStep + 1);
    const k2 = ((i + 1) % uStep) * (vStep + 1);
    indices.push(bottomCenterIndex, k2, k1);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  }; 
}

function makeHandle(R, r, uStep, vStep){
  let positions = [];
  let colors = [];
  let normals = [];
  let texCoords = [];
  let indices = [];

  for(let i = 0; i <= uStep; i++){
    let u = i * Math.PI / uStep; // half torus
    let cosu = Math.cos(u);
    let sinu = Math.sin(u);

    for(let j = 0; j <= vStep; j++){
      let v = j * 2 * Math.PI / vStep;
      let cosv = Math.cos(v);
      let sinv = Math.sin(v);

      let x = (R + r * cosv) * cosu + 1.25;
      let y = (R + r * cosv) * sinu + 0.92;
      let z = r * sinv;

      positions.push(y, z, x); // rotated for handle

      // color
      colors.push(0.9, 0.9, 0.9);

      let s = i / uStep; 
      let t = j / vStep; 
      texCoords.push(s,t);

      let nx = cosu * cosv;
      let ny = sinv;
      let nz = sinu * cosv;
      normals.push(nx, ny, nz);
    }
  }

  for(let i = 0; i < uStep; i++){
    for(let j = 0; j < vStep; j++){
      const k1 = (i * (vStep+1)) + j;
      const k2 = k1 + vStep + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  }; 
}

function mergeGeometries(geomA, geomB) {
  let positions = Array.from(geomA.positions);
  let colors = Array.from(geomA.colors);
  let normals = Array.from(geomA.normals);
  let texCoords = Array.from(geomA.texCoords);
  let indices = Array.from(geomA.indices);

  let vertexOffset = geomA.positions.length / 3;

  positions.push(...geomB.positions);
  colors.push(...geomB.colors);
  normals.push(...geomB.normals);
  texCoords.push(...geomB.texCoords);

  for (let idx of geomB.indices) {
    indices.push(idx + vertexOffset);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  };
}

let cup = makeCoffeeCup(0.75, 24, 4, 2, 0.9, 0.9, 0.9, 0.25);
let handle = makeHandle(0.5, 0.2, 20, 15);
cup = mergeGeometries(cup, handle);

// Almost same function as cup buiit also has a top face added
function makeCoffee(r, uStep, vStep, height, red, blue, green, heightchange){
  let positions = [];
  let colors = [];
  let normals = [];
  let texCoords = [];
  let indices = [];

  for(let i = 0; i <= uStep; i++){
    let u = i * 2 * Math.PI / uStep;
    let cosu = Math.cos(u);
    let sinu = Math.sin(u);

    for(let j = 0; j <= vStep; j++){
      let v = j / vStep;

      let x = r * cosu;
      let y = r * sinu;
      let z = height * v; 

      // scale top part
      if(z > heightchange){
        x *= 1.25;
        y *= 1.25;
      }

      positions.push(x, y, z);

      // color
      colors.push(red, blue, green);
      
      let texU = i / uStep; 
      let texV = v;        
      texCoords.push(texU, texV);

      let nx = cosu;
      let ny = sinu;
      let nz = 0;
      if(z > heightchange){ 
        nx *= 1.0 / 1.25;
        ny *= 1.0 / 1.25;
      }
      normals.push(nx, ny, nz);
    }
  }

  for(let i = 0; i < uStep; i++){
    for(let j = 0; j < vStep; j++){
      const k1 = (i * (vStep+1)) + j;
      const k2 = k1 + vStep + 1;
      indices.push(k1, k2, k1 + 1);
      indices.push(k2, k2 + 1, k1 + 1);
    }
  }

  let topCenterIndex = positions.length / 3;
  positions.push(0, 0, height);
  colors.push(red, blue, green);
  normals.push(0, 0, 1); 
  texCoords.push(0.5, 0.5);

  for (let i = 0; i < uStep; i++) {
    let k1 = (i * (vStep + 1)) + vStep;
    let k2 = ((i + 1) % uStep) * (vStep + 1) + vStep;
    indices.push(topCenterIndex, k1, k2);
  }

  const bottomCenterIndex = positions.length / 3;
  positions.push(0, 0, 0);
  colors.push(red, blue, green);
  normals.push(0, 0, -1); 
  texCoords.push(0.5, 0.5);

  for (let i = 0; i < uStep; i++) {
    const k1 = i * (vStep + 1);
    const k2 = ((i + 1) % uStep) * (vStep + 1);
    indices.push(bottomCenterIndex, k2, k1);
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    normals: new Float32Array(normals),
    texCoords: new Float32Array(texCoords),
    indices: new Uint16Array(indices)
  }; 
}

let coffee = makeCoffee(0.73, 24, 12, 1.75, 0.286, 0.204, 0.157, 0.42);



let plate = makeCoffeeCup(1.5, 48, 10, 0.2, 0.9, 0.9, 0.9, 0.1);