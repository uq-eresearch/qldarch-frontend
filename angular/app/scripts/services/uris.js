'use strict';

angular.module('angularApp')
	.service('Uris', function Uris() {
		// AngularJS will instantiate a singleton by calling "new" on this function
		this.local = true;

		this.JSON_ROOT = "/ws/rest/";
		this.SOLR_ROOT = "/solr/collection1/";
		this.FILE_ROOT = "http://qldarch-test.metadata.net/omeka/archive/files/";

		this.QA_NS = "http://qldarch.net/ns/rdf/2012-06/terms#";
		this.OWL_NS = "http://www.w3.org/2002/07/owl#";
		this.RDF_NS = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
		this.RDFS_NS = "http://www.w3.org/2000/01/rdf-schema#";
		this.FOAF_NS = "http://xmlns.com/foaf/0.1/";
		this.DCT_NS = "http://purl.org/dc/terms/";
		this.GEO_NS = "http://www.w3.org/2003/01/geo/wgs84_pos#"

		this.QA_DISPLAY = this.QA_NS + "display";
		this.QA_TOPLEVEL = this.QA_NS + "toplevel";
		this.QA_LABEL = this.QA_NS + "label";
		this.QA_PLURAL = this.QA_NS + "plural";
		this.QA_SINGULAR = this.QA_NS + "singular";
		this.QA_EDITABLE = this.QA_NS + "editable";
		this.QA_SUPPRESS_EDITABLE = this.QA_NS + "suppressEditable";
		this.QA_SYSTEM_LOCATION = this.QA_NS + "systemLocation";
		this.QA_EXTERNAL_LOCATION = this.QA_NS + "externalLocation";
		this.QA_HAS_TRANSCRIPT = this.QA_NS + "hasTranscript";
		this.QA_TRANSCRIPT_LOCATION = this.QA_NS + "transcriptLocation";
		this.QA_DISPLAY_PRECEDENCE = this.QA_NS + "displayPrecedence";
		this.QA_PREFERRED_IMAGE = this.QA_NS + "preferredImage";
		this.QA_SUMMARY = this.QA_NS + "summary";
		this.QA_RELATED_TO = this.QA_NS + "relatedTo";
		this.QA_HAS_FILE = this.QA_NS + "hasFile";
		this.QA_BASIC_MIME_TYPE = this.QA_NS + "basicMimeType";
		this.QA_DEFINITE_MAP_ICON = this.QA_NS + "definiteMapIcon";
		this.QA_INDEFINITE_MAP_ICON = this.QA_NS + "indefiniteMapIcon";
		this.QA_REQUIRED_TO_CREATE = this.QA_NS + "requiredToCreate";
		this.QA_ASSERTION_DATE = this.QA_NS + "assertionDate";
		this.QA_TEXTUAL_NOTE = this.QA_NS + "textualNote";
		this.QA_INTERVIEWEE = this.QA_NS + "interviewee";
		this.QA_INTERVIEWER = this.QA_NS + "interviewer";

		this.QA_REFERENCES = this.QA_NS + "references";
		this.QA_REGION_START = this.QA_NS + "regionStart";
		this.QA_REGION_END = this.QA_NS + "regionEnd";
		this.QA_SUBJECT = this.QA_NS + "subject";
		this.QA_PREDICATE = this.QA_NS + "predicate";
		this.QA_OBJECT = this.QA_NS + "object";
		this.QA_IMPLIES_RELATIONSHIP = this.QA_NS + "impliesRelationship";
		this.QA_ENTAILS_RELATIONSHIP = this.QA_NS + "entailsRelationship";
		this.QA_START_DATE = this.QA_NS + "startDate";
		this.QA_END_DATE = this.QA_NS + "endDate";
		this.QA_EVIDENCE = this.QA_NS + "evidence";
		this.QA_EVIDENCE_TYPE = this.QA_NS + "Evidence";
		this.QA_TIME_FROM = this.QA_NS + "timeFrom";
		this.QA_TIME_TO = this.QA_NS + "timeTo";
		this.QA_DOCUMENTED_BY = this.QA_NS + "documentedBy";
		this.QA_DEPICTS_BUILDING = this.QA_NS + "depictsBuilding";

		this.QA_ISSUE = this.QA_NS + "issue";
		this.QA_PERIODICAL_TITLE = this.QA_NS + "periodicalTitle";
		this.QA_PAGES = this.QA_NS + "pages";
		this.QA_AUTHORS = this.QA_NS + "authors";
		this.QA_SOURCE_FILENAME = this.QA_NS + "sourceFilename";

		this.OWL_DATATYPE_PROPERTY = this.OWL_NS + "DatatypeProperty";
		this.OWL_OBJECT_PROPERTY = this.OWL_NS + "ObjectProperty";
		this.RDF_TYPE = this.RDF_NS + "type";
		this.RDF_SUBJECT = this.RDF_NS + "subject";
		this.RDF_PREDICATE = this.RDF_NS + "predicate";
		this.RDF_OBJECT = this.RDF_NS + "object";
		this.RDFS_SUBCLASS_OF = this.RDFS_NS + "subClassOf";
		this.RDFS_DOMAIN = this.RDFS_NS + "domain";
		this.RDFS_RANGE = this.RDFS_NS + "range";
		this.RDFS_LABEL = this.RDFS_NS + "label";

		this.QA_REFERENCE_TYPE = this.QA_NS + "ReferenceRelation";
		this.QA_INTERVIEW_TYPE = this.QA_NS + "Interview";
		this.QA_TRANSCRIPT_TYPE = this.QA_NS + "Transcript";
		this.QA_ARTICLE_TYPE = this.QA_NS + "Article";
		this.QA_PHOTOGRAPH_TYPE = this.QA_NS + "Photograph";
		this.QA_LINEDRAWING_TYPE = this.QA_NS + "LineDrawing";
		this.QA_DIGITAL_THING = this.QA_NS + "DigitalThing";

		this.QA_EDUCATIONAL_INSTITUTION = this.QA_NS + "EducationalInstitution";

		this.QA_ARCHITECT_TYPE = this.QA_NS + "Architect";
		this.QA_FIRM_TYPE = this.QA_NS + "Firm";
		this.QA_STRUCTURE_TYPE = this.QA_NS + "Structure";
		this.FOAF_AGENT_TYPE = this.FOAF_NS + "Agent";
		this.FOAF_PERSON_TYPE = this.FOAF_NS + "Person";

		this.FOAF_FIRST_NAME = this.FOAF_NS + "firstName";
		this.FOAF_LAST_NAME = this.FOAF_NS + "lastName";
		this.FOAF_NAME = this.FOAF_NS + "name";
		this.QA_FIRM_NAME = this.QA_NS + "firmName";
		this.QA_LOCATION = this.QA_NS + "location";
		this.QA_ASSOCIATED_FIRM = this.QA_NS + "associatedFirm";

		this.QA_BUILDING_TYPOLOGY = this.QA_NS + "BuildingTypology";
		this.QA_BUILDING_TYPOLOGY_P = this.QA_NS + "buildingTypology";

		this.QA_TOPIC_TYPE = this.QA_NS + "Topic";
		this.QA_TOPIC_HEADING = this.QA_NS + "topicHeading";

		this.QA_PUBLICATION_TYPE = this.QA_NS + "Publication";
		this.QA_CITATION = this.QA_NS + "citation";

		this.QA_EVENT_TYPE = this.QA_NS + "Event";
		this.QA_EVENT_TITLE = this.QA_NS + "eventTitle";

		this.QA_AWARD_TYPE = this.QA_NS + "Award";
		this.QA_AWARD_TITLE = this.QA_NS + "awardTitle";

		this.DCT_TITLE = this.DCT_NS + "title";
		this.DCT_CREATED = this.DCT_NS + "created";
		this.DCT_FORMAT = this.DCT_NS + "format";
		this.DCT_RIGHTS = this.DCT_NS + "rights";
		this.DCT_CREATOR = this.DCT_NS + "creator";
		this.DCT_IDENTIFIER = this.DCT_NS + "identifier";
		this.DCT_DESCRIPTION = this.DCT_NS + "description";

		this.GEO_LAT = this.GEO_NS + "lat";
		this.GEO_LONG = this.GEO_NS + "long";
	});
