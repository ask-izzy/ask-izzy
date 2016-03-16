/* @flow */

/* eslint-env node, mocha */
/* eslint-disable no-use-before-define, prefer-arrow-callback */

import assert from "assert";
import {
    distance,
    centreOf,
    expandCluster,
    removeOutliers,
    normalizePoint,
    denormalizePoint,
} from "../../../src/components/ResultsMap";

function point(lat: number, lon: number): issPoint {
    return denormalizePoint({lat, lon});
}

function assertEqual(
    expected: Array<issPoint>,
    actual: Array<issPoint>
): void {
    assert.deepEqual(expected.map(normalizePoint), actual.map(normalizePoint))
}

describe("ResultsMap", function() {
    describe("distance", function() {
        it("computes the distance between points", function() {
            assert.equal(distance(point(-2, -2), point(1, 2)), 5);
        });
    });

    describe("centreOf", function() {
        it("computes the centre of a set of points", function() {
            assert.deepEqual(
                centreOf(
                    [point(-2, -2), point(1, 1), point(1, 1)]
                ),
                point(0, 0)
            );
        });
    });

    describe("expandCluster", function() {
        const cluster = [
            point(1, 1),
            point(2, 2),
            point(3, 3),
            point(4, 4),
            point(5, 5),
        ];
        const justInRange = point(11, 11);
        const justOutOfRange = point(12, 12);
        const farOutOfRange = point(40, 40);

        describe("with all points already added", function() {
            it("returns all points", function() {
                assertEqual(
                    expandCluster(cluster, cluster),
                    cluster
                )
            });
        });

        it("adds a point which is in range", function() {
            assertEqual(
                expandCluster(
                    cluster,
                    cluster.concat(justInRange)
                ),
                cluster.concat(justInRange)
            )
        });

        it("does not add a point which is out of range", function() {
            assertEqual(
                expandCluster(
                    cluster,
                    cluster.concat(justOutOfRange)
                ),
                cluster
            )
        });

        it("recursively adds further records", function() {
            assertEqual(
                expandCluster(
                    cluster,
                    cluster.concat(justInRange, justOutOfRange)
                ),
                cluster.concat(justInRange, justOutOfRange)
            )
        });

        it("excludes records far away after adding a nearby one", function() {
            assertEqual(
                expandCluster(
                    cluster,
                    cluster.concat(justInRange, farOutOfRange)
                ),
                cluster.concat(justInRange)
            )
        });
    });

    describe("removeOutliers", function() {
        describe("with no points", function() {
            it("returns no points", function() {
                assertEqual(removeOutliers([]), []);
            });
        });

        describe("with one point", function() {
            it("returns that point", function() {
                assert.deepEqual(
                    removeOutliers([{lat: 1, lon: 1}]),
                    [{lat: 1, lon: 1}]
                );
            });
        });

        describe("with two points", function() {
            const points = [
                {lat: -37.8959444, lon: 145.0534684},
                {lat: -37.8954639, lon: 145.0535556},
            ];

            it("returns both points", function() {
                assert.deepEqual(
                    removeOutliers(points),
                    points
                );
            });
        });

        describe("with points close together", function() {
            const points = [
                {lat: 9, lon: 11},
                {lat: 11, lon: 9},
                {lat: 11, lon: 11},
                {lat: 9, lon: 9},
            ];

            it("returns them all", function() {
                assert.deepEqual(
                    removeOutliers(points),
                    points
                )
            });
        });

        describe("with an odd number of points & some outliers", function() {
            const points = [
                {lat: 1, lon: 1},
                {lat: 1.1, lon: 0.9},
                {lat: 1.2, lon: 1.1},
                {lat: 0.9, lon: 0.9},
                {lat: 8, lon: 8},
            ].map(denormalizePoint);

            it("removes the outlier", function() {
                assert.deepEqual(
                    removeOutliers(points),
                    [
                        {lat: 1, lon: 1},
                        {lat: 1.1, lon: 0.9},
                        {lat: 1.2, lon: 1.1},
                        {lat: 0.9, lon: 0.9},
                    ].map(denormalizePoint)
                );
            });

        });

        describe("realistic example (food near Carnegie)", function() {

            const points = [
                {lat: -37.905352, lon: 145.104373},
                {lat: -37.862611, lon: 144.979909},
                {lat: -37.868154, lon: 145.080613},
                {lat: -37.86844, lon: 144.989821},
                {lat: -37.919243, lon: 145.121501},
                {lat: -37.862611, lon: 144.979909},
                {lat: -37.8403411, lon: 144.9574317},
                {lat: -37.851082, lon: 144.993268},
                {lat: -37.814931, lon: 145.006317},
                {lat: -37.814541, lon: 144.997582},
            ];

            it("finds no outliers", function() {
                assert.deepEqual(
                    removeOutliers(points),
                    points
                );
            });

        });

    });
});
