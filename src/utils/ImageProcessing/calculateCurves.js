export default function calculateCurves(arrData, inA, outA, inB, outB) {
    const slope = (outB - outA) / (inB - inA);
    const intercept = (inB * outA - inA * outB) / (inB - inA);
    const newData = new Uint8ClampedArray(arrData);
    for (let i = 0; i < newData.length; i += 4) {
        const r = newData[i];
        const g = newData[i + 1];
        const b = newData[i + 2];

        if (r < inA) {
            newData[i] = outA;
        } else if (r > inB) {
            newData[i] = outB;
        } else {
            newData[i] = Math.round(r*slope + intercept);
        }

        if (g < inA) {
            newData[i + 1] = outA;
        } else if (g > inB) {
            newData[i + 1] = outB;
        } else {
            newData[i + 1] = Math.round(g*slope + intercept);
        }

        if (b < inA) {
            newData[i + 2] = outA;
        } else if (b > inB) {
            newData[i + 2] = outB;
        } else {
            newData[i + 2] = Math.round(b*slope + intercept);
        }
    }
    return newData
}