'use strict';

angular.module('angularApp')
    .directive('force', function ($state, Uris) {
        var LINK_DISTANCE = 100;
        var CHARGE = -1500;
        var HEIGHT = 750;


        return {
            template: '<div></div>',
            restrict: 'E',
            scope: {
                data: '=',
                selected: '&'
            },
            replace: true,
            link: function postLink($scope, element) {

                // Setup the height and width
                var forceWidth = element.width(),
                    forceHeight = HEIGHT;

                // Setup the SVG
                var svg = d3.select(element.get(0))
                    .append('svg')
                    .attr('width', forceWidth)
                    .attr('height', forceHeight)
                    .on('click', function () {
                        d3.selectAll('.node').classed('selected', false);
                        $scope.$apply(function () {
                            $scope.selected({
                                node: null
                            });
                        });
                    });

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
                        console.log('d', d);
                        if (d.type === 'architect' && !d[Uris.QA_PRACTICED_IN_QUEENSLAND]) {
                            classes += ' node-architect-nonqueensland';
                        }
                        return classes;
                        // })
                        // .on('mouseover', function (d) {
                        //     // d3.selectAll('.node').classed('selected', false);
                        //     // d3.select(this).classed('selected', true);
                        //     $scope.$apply(function () {
                        //         $scope.selected({
                        //             node: d
                        //         });
                        //     });
                        // }).on('mouseout', function (d) {
                        //     // d3.selectAll('.node').classed('selected', false);
                        //     $scope.$apply(function () {
                        //         $scope.selected({
                        //             node: null
                        //         });
                        //     });
                    }).on('click', function (d) {
                        console.log('selected', d.$selected);
                        d3.selectAll('.node').classed('selected', false);
                        d3.select(this).classed('selected', true);
                        $scope.$apply(function () {
                            $scope.selected({
                                node: d
                            });
                        });
                        d3.event.stopPropagation();
                    }).on('dblclick', function (d) {
                        if (d.type) {
                            var params = {};
                            params[d.type + 'Id'] = d.encodedUri;
                            console.log('going to', d.type + '.relationships', params);
                            $state.go(d.type + '.relationships', params);
                        }
                        d3.event.stopPropagation();
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
                        return 10 * referenceCount.clamp(1, 5);
                    });

                    newNodesElements.append('text')
                        .attr('x', function (d) {
                            var referenceCount = 0;
                            angular.forEach($scope.data.links, function (link) {
                                if (link.source === d || link.target === d) {
                                    referenceCount++;
                                }
                            });
                            return 10 * referenceCount.clamp(1, 5) + 5;
                        })
                        .attr('dy', '.35em')
                        .attr('fill', 'black')
                        .text(function (d) {
                            return d.name;
                        });

                    // Exit Nodes
                    node.exit().remove();
                }
            }
        };
    });