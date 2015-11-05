/*
 => From https://github.com/Jam3/delaunify

 DelaunayImage.process(img[, opts])

 Triangulates the image. By default, it uses a random distribution of points.

 Options:

 min an [x,y] array for the minimum random value (default [0, 0])
 max an [x,y] array for the maximum random value (default [imgWidth, imgHeight])
 count the number of points to distribute (default 50)
 fill a boolean, whether to apply a fill (default true)
 stroke a boolean, whether to apply a stroke (default true)
 points an array of [x,y] points to use instead of random; this will ignore the min, max and count options

 */

"use strict";

var DelaunayImage;

(function() {

    function sample(data, cx, cy, width, height) {
        cx = ~~cx % width;
        cy = ~~cy % height;
        var i = cx + (cy * width);

        return [
            data[i * 4],
            data[i * 4 + 1],
            data[i * 4 + 2],
            data[i * 4 + 3]
        ];
    }

    function contour(image) {
        return [
            [0, 0],
            [image.width, 0],
            [image.width, image.height],
            [0, image.height]
        ];
    }

    function colorArrayToRgba(color) {
        if (4 !== color.length) {
            console.error('Bad color', color);
            return '';
        }

        return 'rgba(' + color.slice(0, 3).join(',') + ',' + color[3] / 255 + ')';
    }

    function triangleColor(triangle, pixels, width, height) {
        var center = triangleCentroid(triangle);
        return sample(pixels, center[0], center[1], width, height);
    }

    function randomPoints(count, min, max) {
        min = min || [0, 0];
        max = max || [1, 1];
        count = count || 0;

        var out = [];
        for (var i = 0; i < count; i++) {
            var x = random(min[0], max[0]),
                y = random(min[1], max[1]);
            out.push([x, y])
        }
        return out
    }

    /**
     * Transforms a list of dots (2 coordinates) onto an array of triangles (3 dots)
     *
     * @param {Array} vertices
     * @returns {Array}
     */
    function triangulate(vertices) {

        var flattenedTriangles = Delaunay.triangulate(vertices);
        var triangles = [];

        for (var i = flattenedTriangles.length; i; i -= 3) {
            var triangle = [];
            for (var j = 1; j <= 3; j++) {
                triangle.push(vertices[flattenedTriangles[i - j]]);
            }
            triangles.push(triangle);
        }

        return triangles;
    }

    DelaunayImage = {
        getData: function(img, opt) {
            if (!img.width) {
                console.error('Invalid img', img);
                return;
            }

            opt = opt || {};

            var canvas = opt.canvas || document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            opt.count = opt.count || 50;
            opt.min = opt.min || [0, 0];
            opt.max = opt.max || [canvas.width, canvas.height];
            var vertices = opt.points || randomPoints(opt.count, opt.min, opt.max).concat(contour(img));
            var triangles = triangulate(vertices);

            var colors = {};
            for (var i = 0; i < triangles.length; i++) {
                colors[i] = triangleColor(triangles[i], pixels, canvas.width, canvas.height);
            }

            return {canvas: canvas, triangles: triangles, colors: colors};
        },
        process: function(data) {
            if (!data.canvas || !data.triangles || !data.colors) {
                console.error('Invalid draw data', data);
                return;
            }

            var ctx = data.canvas.getContext('2d');

            // clear
            ctx.beginPath();
            ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);

            for (var i = 0; i < data.triangles.length; i++) {
                var triangle = data.triangles[i];

                ctx.beginPath();
                ctx.moveTo(triangle[0][0], triangle[0][1]);
                ctx.lineTo(triangle[1][0], triangle[1][1]);
                ctx.lineTo(triangle[2][0], triangle[2][1]);

                ctx.strokeStyle = colorArrayToRgba(data.colors[i]);
                ctx.fillStyle = colorArrayToRgba(data.colors[i]);

                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
        }
    };
})();
