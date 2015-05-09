var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator'),
	assign = require('object-assign')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectProperty = React.createClass({
	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.options.editing || false,
			properties: assign({}, props.options && props.options.properties || {})
		};
	},

	defaultValue: {},

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open objectAttr compoundAttr' : 'objectAttr compoundAttr',
			openHash = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for( var attr in this.props.value ){
			definition = definitions[ attr ] || {};
			if( !definition.options )
				definition.options = {};
			if( typeof definition.options.editing == 'undefined' && this.state.editing == 'always' )
				definition.options.editing = 'always';

			attrs.push( React.createElement( Property, {
				value: this.props.value[attr],
				key: attr,
				attrkey: attr,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty
			}));
		}

		openHash = React.DOM.div({ className: 'attrChildren'}, [
			attrs,
			React.createElement( PropertyCreator, {
				type: 'attribute',
				onCreate: this.createProperty
			})
		]);

		var header = this.props.options.header || 'Map [' + keys.length + ']';
		return React.DOM.span({className: className}, [
			React.DOM.span({ onClick: this.toggleEditing, className: 'hashToggle' }, header),
			openHash
		]);
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.editing != nextProps.editing )
			this.setState({ editing: nextProps.editing });
	},

	toggleEditing: function(){
		if( this.state.editing != 'always' )
			this.setState({editing: !this.state.editing});
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.remove( key );
	},

	createProperty: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Property ' + key + 'already exists.');

		// Start editing
		definition.options = {editing: this.state.editing == 'always' ? 'always' : true };

		var properties = assign( {}, this.state.properties );
		properties[ key ] = definition;

		this.setState({properties: properties});
		this.props.value.set( key, value );
	}
});

module.exports = ObjectProperty;