import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Tasks } from "../api/tasks.js";

import Task from "./Task.js";
import AccountsUIWrapper from "./AccountsUIWrapper.js";

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
						Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          {this.props.currentUser ? (
            <form
              className="new-task"
              onSubmit={this.handleSubmit.bind(this)}
            >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form>
          ) : (
            ""
          )}
        </header>

        <ul>{this.renderTasks()}</ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
