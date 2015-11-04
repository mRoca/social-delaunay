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

    function random(start, end) {
        var n0 = typeof start === 'number',
            n1 = typeof end === 'number';

        if (n0 && !n1) {
            end = start;
            start = 0
        } else if (!n0 && !n1) {
            start = 0;
            end = 1
        }
        return start + Math.random() * (end - start)
    }

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

    function triangleColor(triangle, pixels, width, height, returnAsString) {
        //centroid of triangle
        var cx = (triangle[0][0] + triangle[1][0] + triangle[2][0]) / 3;
        var cy = (triangle[0][1] + triangle[1][1] + triangle[2][1]) / 3;
        var color = sample(pixels, cx, cy, width, height);

        if (returnAsString) {
            color[3] /= 255;
            return 'rgba(' + color.join(',') + ')';
        }

        return color;
    }

    function randomPoints(opt) {
        opt = opt || {};
        var min = opt.min || [0, 0];
        var max = opt.max || [1, 1];
        var n = opt.count || 0;

        var out = [];
        for (var i = 0; i < n; i++) {
            var x = random(min[0], max[0]),
                y = random(min[1], max[1]);
            out.push([x, y])
        }
        return out
    }

    DelaunayImage = {
        process: function(img, opt) {
            if(! img.width) {
                return;
            }

            var width = img.width,
                height = img.height;

            opt = opt || {};
            opt.count = opt.count || 50;
            opt.max = opt.max || [width, height];

            var canvas = opt.canvas || document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            var vertices = opt.points || randomPoints(opt).concat(contour(img));
            var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            var triangles = Delaunay.triangulate(vertices);

            for (var i = triangles.length; i; i -= 3) {
                var triangle = [];
                for (var j = 1; j <= 3; j++) {
                    triangle.push(vertices[triangles[i - j]]);
                }

                ctx.beginPath();
                ctx.moveTo(triangle[0][0], triangle[0][1]);
                ctx.lineTo(triangle[1][0], triangle[1][1]);
                ctx.lineTo(triangle[2][0], triangle[2][1]);

                var color = triangleColor(triangle, pixels, width, height, true);
                ctx.strokeStyle = color;
                ctx.fillStyle = color;

                if (opt.fill !== false) ctx.fill();
                if (opt.stroke !== false) ctx.stroke();
                ctx.closePath();
            }

            return canvas
        }
    };
})();
