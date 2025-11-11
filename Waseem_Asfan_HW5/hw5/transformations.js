// Matrix functions
// Perspective matrix
function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2);
    const nf = 1 / (near - far);
    return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}

// Orthographic matrix
function ortho(left, right, bottom, top, near, far) {
    const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
    return [-2*lr,0,0,0, 0,-2*bt,0,0, 0,0,2*nf,0, (left+right)*lr,(top+bottom)*bt,(far+near)*nf,1];
}

// Identity matrix
function mat4Identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
}

// Matrix translation
function mat4Translate(matrix, translation) {
    const result = new Float32Array(matrix);
    result[12] = matrix[0] * translation[0] + matrix[4] * translation[1] + matrix[8] * translation[2] + matrix[12];
    result[13] = matrix[1] * translation[0] + matrix[5] * translation[1] + matrix[9] * translation[2] + matrix[13];
    result[14] = matrix[2] * translation[0] + matrix[6] * translation[1] + matrix[10] * translation[2] + matrix[14];
    result[15] = matrix[3] * translation[0] + matrix[7] * translation[1] + matrix[11] * translation[2] + matrix[15];
    return result;
}

// Matrix rotation around X axis
function mat4RotateX(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv1 = matrix[4], mv5 = matrix[5], mv9 = matrix[6], mv13 = matrix[7];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[4] = mv1 * c + mv2 * s;
    result[5] = mv5 * c + mv6 * s;
    result[6] = mv9 * c + mv10 * s;
    result[7] = mv13 * c + mv14 * s;
    result[8] = mv2 * c - mv1 * s;
    result[9] = mv6 * c - mv5 * s;
    result[10] = mv10 * c - mv9 * s;
    result[11] = mv14 * c - mv13 * s;

    return result;
}
// Added matrix rotation for z axis
function mat4RotateZ(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const m0 = matrix[0], m4 = matrix[1], m8 = matrix[2], m12 = matrix[3];
    const m1 = matrix[4], m5 = matrix[5], m9 = matrix[6], m13 = matrix[7];

    result[0] = m0 * c + m1 * s;
    result[1] = m4 * c + m5 * s;
    result[2] = m8 * c + m9 * s;
    result[3] = m12 * c + m13 * s;
    result[4] = m1 * c - m0 * s;
    result[5] = m5 * c - m4 * s;
    result[6] = m9 * c - m8 * s;
    result[7] = m13 * c - m12 * s;

    return result;
}
// Matrix rotation around Y axis
function mat4RotateY(matrix, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const result = new Float32Array(matrix);

    const mv0 = matrix[0], mv4 = matrix[1], mv8 = matrix[2], mv12 = matrix[3];
    const mv2 = matrix[8], mv6 = matrix[9], mv10 = matrix[10], mv14 = matrix[11];

    result[0] = mv0 * c - mv2 * s;
    result[1] = mv4 * c - mv6 * s;
    result[2] = mv8 * c - mv10 * s;
    result[3] = mv12 * c - mv14 * s;
    result[8] = mv0 * s + mv2 * c;
    result[9] = mv4 * s + mv6 * c;
    result[10] = mv8 * s + mv10 * c;
    result[11] = mv12 * s + mv14 * c;

    return result;
}

// Matrix multiplication
function multiplyMat4(a, b) {
    let r = new Float32Array(16);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
            sum += a[k * 4 + i] * b[j * 4 + k]; 
        }
        r[j * 4 + i] = sum;
    }
    return r;
}
//added a scale function
function mat4Scale(matrix, sx, sy, sz) {
    const result = new Float32Array(matrix);

    result[0] *= sx;

    result[5] *= sy;

    result[10] *= sz;
   

    return result;
}

function translationMatrix(t) {
  let m = mat4Identity();
  m[12] = t[0];
  m[13] = t[1];
  m[14] = t[2];
  return m;
}

// Scale matrix from [sx, sy, sz]
function scaleMatrix(s) {
  let m = mat4Identity();
  m[0] = s[0];
  m[5] = s[1];
  m[10] = s[2];
  return m;
}

// Rotation matrix from [rx, ry, rz] in radians
function rotationMatrix(r) {
  let cx = Math.cos(r[0]), sx = Math.sin(r[0]);
  let cy = Math.cos(r[1]), sy = Math.sin(r[1]);
  let cz = Math.cos(r[2]), sz = Math.sin(r[2]);

  // Rotation X
  let Rx = mat4Identity();
  Rx[5] = cx; Rx[6] = sx;
  Rx[9] = -sx; Rx[10] = cx;

  // Rotation Y
  let Ry = mat4Identity();
  Ry[0] = cy; Ry[2] = -sy;
  Ry[8] = sy; Ry[10] = cy;

  // Rotation Z
  let Rz = mat4Identity();
  Rz[0] = cz; Rz[1] = sz;
  Rz[4] = -sz; Rz[5] = cz;

  // Combined rotation: Rz * Ry * Rx
  return multiplyMat4(multiplyMat4(Rz, Ry), Rx);
}