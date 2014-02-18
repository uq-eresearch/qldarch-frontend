'use strict';

angular.module('angularApp')
    .directive('force', function () {
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
                    forceHeight = element.width();

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
                        .linkDistance(150)
                        .charge(-1000)
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
                        .attr('class', 'link')
                        .attr('stroke-width', function (d) {
                            return 1;
                        });

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
                        var classes = "node " + "node-" + d.type;
                        // if (d.uri === $scope.entity.uri) {
                        //     $scope.selected = d;
                        //     $scope.selectedType = 'node';
                        //     classes += ' selected';
                        // }
                        return classes;
                    }).on('click', function (d) {
                        d3.selectAll('.node').classed('selected', false);
                        d3.select(this).classed('selected', true);

                        $scope.$apply(function () {
                            $scope.selected({
                                node: d
                            });
                        });
                    }).call(force.drag);

                    newNodesElements.append('circle').attr('r', 15);
                    newNodesElements.append('text')
                        .attr('dx', '2em')
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