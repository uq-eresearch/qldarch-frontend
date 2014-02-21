'use strict';

angular.module('angularApp')
    .directive('force', function ($state, GraphHelper) {
        var LINK_DISTANCE = 100;
        var CHARGE = -1500;
        var HEIGHT = 600;


        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                data: '=',
                selected: '&'
            },
            replace: true,
            link: function postLink($scope, element, attrs) {

                // Setup the height and width
                var forceWidth = element.width(),
                    forceHeight = HEIGHT;

                // $scope.$watch(function () {
                //     return element.width();
                // }, function (width, oldWidth) {
                //     if (oldWidth && width && oldWidth !== width) {
                //         console.log('width changed', oldWidth, width);
                //         forceWidth = width;
                //         forceHeight = 200;
                //         d3.select(element.get(0)).html('').append('svg')
                //             .attr('width', forceWidth);
                //         // .attr('height', forceHeight);
                //         start();
                //     }
                // });

                // Setup the SVG
                var svg = d3.select(element.get(0))
                    .append('svg')
                    .attr('width', forceWidth)
                    .attr('height', forceHeight);

                // SVG elements
                var node = svg.selectAll('.node'),
                    link = svg.selectAll('.link');



                // Watches the data for changes
                $scope.$watch('data', function (data) {
                    console.log('data is', data);
                    if (data) {
                        start();
                    }
                });

                function start() {
                    // Creates the force graph
                    var force = d3.layout.force()
                        .nodes($scope.data.nodes)
                        .links($scope.data.links)
                        .size([forceWidth, forceHeight])
                        .linkDistance(LINK_DISTANCE)
                        .charge(CHARGE)
                        .on('tick', function () {
                            link
                                .attr('x1', function (d) {
                                    return d.source.x;
                                })
                                .attr('y1', function (d) {
                                    return d.source.y;
                                })
                                .attr('x2', function (d) {
                                    return d.target.x;
                                })
                                .attr('y2', function (d) {
                                    return d.target.y;
                                });
                            node
                                .attr('transform', function (d) {
                                    return 'translate(' + d.x + ',' + d.y + ')';
                                });
                        });

                    linksGui();
                    nodesGui(force);
                    force.start();
                }

                function linksGui() {
                    // Update links
                    link = link
                        .data($scope.data.links);

                    // Enter links
                    link.enter().append('line')
                        .attr('class', 'link');

                    // Exit links
                    link.exit().remove();
                }

                function nodesGui(force) {
                    // Update nodes
                    node = svg.selectAll('.node')
                        .data($scope.data.nodes, function (d) {
                            return d.uri;
                        });

                    // Enter Nodes
                    var newNodesElements = node.enter().append('g');
                    newNodesElements.attr('class', function (d) {
                        var classes = 'node ' + 'node-' + d.type;
                        return classes;
                    }).on('click', function (d) {
                        d3.selectAll('.node').classed('selected', false);
                        d3.select(this).classed('selected', true);
                        $scope.$apply(function () {
                            $scope.selected({
                                node: d
                            });
                        });
                    }).on('dblclick', function (d) {
                        var params = {};
                        params[d.type + 'Id'] = d.encodedUri;
                        console.log('going to', d.type + '.relationships', params);
                        $state.go(d.type + '.relationships', params);

                    }).call(force.drag);

                    newNodesElements.append('circle').attr('r', function (d) {
                        // Calculate the size of the cirlce
                        // based on the number of links
                        var referenceCount = 0;
                        angular.forEach($scope.data.links, function (link) {
                            if (link.source === d || link.target === d) {
                                referenceCount++;
                            }
                        });
                        return 15 * d.count.clamp(1, 3);
                    });
                    newNodesElements.append('text')
                        .attr('dx', '0')
                        .attr('dy', '.35em')
                        .text(function (d) {
                            return d.name;
                        });

                    // Exit Nodes
                    node.exit().remove();
                }
            }
        };
    });