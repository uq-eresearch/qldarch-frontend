'use strict';

angular.module('angularApp')
    .controller('ExploreCtrl', function ($scope, Uris, Entity, Relationship, $location, GraphHelper, $q, Ontology, $filter) {


        console.log("RELOADED");
        $scope.Uris = Uris;
        $scope.searchType = "entities";
        var uri = GraphHelper.decodeUriString($location.search().uri);

        // Load the entity

        var links = [],
            nodes = [];

        var width = $('.graph').width(),
            height = $('.graph').width() / 2;

        // Creates the force graph
        var force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([width, height])
            .linkDistance(200)
            .charge(-1000)
            .on("tick", function () {
                link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

                node
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            });

        var first = true;

        // Appends it to the body
        var svg = d3.select('.graph').append('svg')
            .attr('width', $('.graph').width())
            .attr('height', $('.graph').width());


        loadDataIntoForce(uri).then(function () {
            start();
        })
        var node = svg.selectAll(".node"),
            link = svg.selectAll(".link");


        function loadDataIntoForce(uri) {
            // Stop the graph.
            force.stop();

            // Load the entity we are looking at
            return Entity.load(uri, false).then(function (entity) {
                $scope.entity = entity;

                // Load the relationships
                return Relationship.findByEntityUri(uri).then(function (relationships) {

                    $scope.relationships = relationships;
                    // Get all the unique entities
                    var entityUris = GraphHelper.getAttributeValuesUnique(relationships, [Uris.QA_SUBJECT, Uris.QA_OBJECT]);
                    var relatedRequests = [Entity.loadList(entityUris), Ontology.loadAllProperties()];

                    return $q.all(relatedRequests).then(function (relatedData) {
                        var entities = relatedData[0];
                        var properties = relatedData[1];

                        $scope.entities = entities;
                        $scope.types = GraphHelper.getAttributeValuesUnique(entities, 'type');

                        // Store the nodes in the node graph
                        nodes.length = 0;
                        links.length = 0;

                        angular.forEach(entities, function (entity) {
                            nodes.push(entity);
                        })

                        // Setup relationships and links
                        angular.forEach(relationships, function (relationship) {
                            if (relationship[Uris.RDF_TYPE] == Uris.QA_REFERENCE_TYPE) {
                                return;
                            }

                            relationship.subject = entities[relationship[Uris.QA_SUBJECT]];
                            relationship.object = entities[relationship[Uris.QA_OBJECT]];
                            relationship.predicate = properties[relationship[Uris.QA_PREDICATE]];

                            var found = false;

                            // Check if we already have the link (different type)
                            angular.forEach(links, function (link) {
                                if ((link.source.uri == relationship.subject.uri &&
                                        link.target.uri == relationship.object.uri) ||
                                    (link.source.uri == relationship.object.uri &&
                                        link.target.uri == relationship.subject.uri)) {

                                    //									// Link between same ends, count it, and add the type to an array
                                    link.count++;
                                    link.relationships.push(relationship);
                                    found = true;
                                }
                            });

                            if (!found) {
                                console.log("doesnt exist");
                                links.push({
                                    source: relationship.subject,
                                    target: relationship.object,
                                    note: relationship[Uris.QA_TEXTUAL_NOTE],
                                    relationships: [relationship],
                                    count: 1
                                });
                            }
                        });
                    });
                });

            });
        }

        function start() {
            // Update links
            link = link
                .data(force.links())
            // Enter links
            link.enter().append("line")
                .attr("class", "link").attr("stroke-width", function (d) {
                    return d.count * 2;
                });

            link.exit().remove();
            // Exit links?

            // Update nodes
            node = svg.selectAll(".node")
                .data(force.nodes(), function (d) {
                    return d.uri;
                }).attr('opacity', function (d) {
                    if (d.new) {
                        return 1;
                    } else {
                        return 0.1;
                    }
                });
            // Enter
            var newDots = node.enter().append("g")
                .attr("class", function (d) {
                    var classes = "node " + "node-" + d.type;
                    if (d.uri == $scope.entity.uri) {
                        $scope.selected = d;
                        $scope.selectedType = "node";
                        classes += " selected";
                    }
                    return classes;
                })
                .on("mouseover", function (d) {

                })
                .on("mouseout", mouseout)
                .on("click", nodeClicked)
                .call(force.drag);


            newDots.append("circle")
                .attr("r", 15)
            newDots.append("text")
            //				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            //				.attr("dy", ".35em")
            //				.attr("text-anchor", "middle")
            .attr("dx", "2em")
                .attr("dy", ".35em")
                .text(function (d) {
                    return d.name;
                });

            //					Exit
            node.exit().remove();

            force.start();
        }



        function mouseover(d) {
            //			d3.select(this).select("circle").transition()
            //				.duration(50)
            //				.attr("r", 16);
        }

        function mouseout() {
            //			d3.select(this).select("circle").transition()
            //				.duration(50)
            //				.attr("r", 8);
        }


        function nodeClicked(d) {
            console.log("node clicked", d);
            d3.selectAll(".node").classed("selected", false);
            d3.select(this).classed("selected", true);

            var links = force.links().filter(function (link) {
                return link.source.uri == d.uri || link.target.uri == d.uri
            });

            $scope.$apply(function () {
                $scope.selectedType = "node";
                $scope.selected = d;
                $scope.relationships = links[0].relationships;
                console.log("relationships", $scope.relationships);
            })
        }

        function linkClicked(d) {
            console.log("link clicked", d);
            $scope.$apply(function () {
                $scope.selectedType = "link";
                $scope.selected = d;
            })
        }


    });