"use strict";

function random(start, end) {
    start = typeof start === 'number' ? start : null;
    end = typeof end === 'number' ? end : null;

    if (start && !end) {
        end = start;
        start = 0
    }

    return ~~(start + Math.random() * (end - start));
}

function triangleCentroid(triangle) {
    return [
        (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3,
        (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3
    ];
}

function shuffle(array) {
    var random = array.map(Math.random);
    array.sort(function(a, b) {
        return random[a] - random[b];
    });

    return array;
}

function deepClone(item) {
    return JSON.parse(JSON.stringify(item));
}

function affine(point1, point2, x) {
    var a = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    var b = (point2[0] * point1[1] - point1[0] * point2[1]) / (point2[0] - point1[0]);

    return a * x + b;
}
