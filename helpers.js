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
