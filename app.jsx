var React = require('react')
,   Dispatcher = require('flux').Dispatcher
,   EventEmitter = require('events').EventEmitter
,   assign = require('object-assign')
,   keyMirror = require('keymirror');

var STATE_CHANGE = 'state_change';

var Store = assign({}, EventEmitter.prototype, {

    _isOn: false,

    isOn: function() {
        return this._isOn;
    },

    toggleSwitch: function() {
        this._isOn = !this.isOn();
    },

    emitChange: function() {
        this.emit(STATE_CHANGE);
    },

    addChangeListener: function(callback) {
        this.on(STATE_CHANGE, callback);
    },

    removeChangeListener: function(type) {
        this.removeListener(STATE_CHANGE, callback);
    }

});

var AppDispatcher = assign(new Dispatcher(), {
    handleSwitchAction: function(action) {
        this.dispatch({
            source: 'SERVER_ACTION',
            action: action
        });
    }
});

AppDispatcher.register(function(payload) {

    switch (payload.action.actionType) {
        
        case ActionConstants.SWITCH:
            Store.toggleSwitch();
            break;

        default:
            break;

    }

    Store.emitChange();

    return true;
});

var Actions = {
    toggleSwitch: function() {
        AppDispatcher.handleSwitchAction({
            actionType: ActionConstants.SWITCH
        });
    }

};

var ActionConstants = keyMirror({
    SWITCH: null
});

var UserInterface = React.createClass({
    
    getInitialState: function() {
        return {
            on: Store.isOn()
        };
    },

    componentDidMount: function() {
        Store.addChangeListener(this._updateState);
    },

    _updateState: function() {
        this.setState({
            on: Store.isOn()
        });
    },

    _switchActivated: function() {
        Actions.toggleSwitch();
    },

    render: function() {

        return (<div>
            <button onClick={ this._switchActivated }>
                Switch { this.state.on ? 'ON' : 'OFF' }
            </button>
        </div>);

    }
});

React.render(
    <UserInterface />
,   document.getElementById('app')
);