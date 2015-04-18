var WishItem = React.createClass({displayName: "WishItem",
  getInitialState: function() {
    return {
      voteUpCount: this.props.item.get('voteup') || 0,
      voteUpAlready: this.props.item.voteUpAlready || false,
    };
  },
  handleVoteUp: function(e) {
    if (!dataService.getUser() || this.state.voteUpAlready) {
      return;
    }

    dataService.voteUpItem(this.props.item, function(err, voteUpAlready) {
      if (err) {
        return;
      }

      this.setState({
        voteUpCount: voteUpAlready ? this.state.voteUpCount : this.state.voteUpCount + 1,
        voteUpAlready: true,
      });
    }.bind(this));
  },
  render: function() {
    var isAuthor = dataService.getUser() && (this.props.item.author.getUsername() === dataService.getUser().getUsername());
    return (
      React.createElement("div", {className: "well wish-item row"}, 
        React.createElement("div", {className: "col-md-1 wish-item-voteup"}, 
          React.createElement("a", {href: "javascript:void(0)", onClick: this.handleVoteUp, 
             className:  "btn btn-flat" + (!dataService.getUser() || this.state.voteUpAlready ? " disabled" : " btn-primary") }, 
            React.createElement("i", {className: "mdi-navigation-arrow-drop-up"}), 
            React.createElement("p", {className: "text-center"}, this.state.voteUpCount)
          )
        ), 
        React.createElement("div", {className: "col-md-9 wish-item-description"}, 
          React.createElement("p", null, this.props.item.get('description'))
        ), 
        React.createElement("div", {className: "col-md-2 wish-item-metadata"}, 
          React.createElement("div", null, 
            React.createElement("i", {className: "mdi-action-today"}), 
            React.createElement("span", {className: "text-muted"}, this.props.item.createdAt.toDateString())
          ), 
          React.createElement("div", null, 
            React.createElement("i", {className: "mdi-social-person"}), 
            React.createElement("span", {className: "text-muted"}, this.props.item.author.getUsername())
          ), 
          React.createElement("div", null, 
             !isAuthor ? null : React.createElement("a", {className: "btn btn-flat mdi-content-create btn-edit-wish", onClick: this.props.onEditWish.bind(null, this.props.item)}), 
             !isAuthor ? null : React.createElement("a", {className: "btn btn-flat mdi-content-clear btn-del-wish", onClick: this.props.onDelWish.bind(null, this.props.item)})
          )
        )
      )
    );
  },
});

var WishList = React.createClass({displayName: "WishList",
  render: function() {
    var wishItem = this.props.wishlist.map(function(item) {
      return (
        React.createElement(WishItem, {key: item.id, item: item, onEditWish: this.props.onEditWish, onDelWish: this.props.onDelWish})
      );
    }.bind(this));

    return (
      React.createElement("div", {className: "wish-list"}, 
        wishItem
      )
    );
  },
});

var NavBar = React.createClass({displayName: "NavBar",
  render: function() {
    var user = dataService.getUser();
    return (
      React.createElement("nav", {className: "navbar navbar-default"}, 
        React.createElement("div", {className: "container-fluid"}, 
          React.createElement("div", {className: "navbar-header"}, 
            React.createElement("a", {href: "javascript:void(0)", className: "navbar-brand"}, 
              React.createElement("h3", {id: "label-brand"}, "Yet Another Wishlist")
            )
          ), 
          React.createElement("ul", {className: "nav navbar-nav navbar-right"}, 
           user ? null : React.createElement("li", null, React.createElement("button", {type: "button", className: "btn btn-primary", "data-toggle": "modal", "data-target": "#dlg-register"}, "Register")), 
           user ? null : React.createElement("li", null, React.createElement("button", {type: "button", className: "btn btn-primary", "data-toggle": "modal", "data-target": "#dlg-login"}, "Login")), 
           !user ? null : React.createElement("li", null, React.createElement("button", {type: "button", className: "btn btn-primary", "data-toggle": "modal", "data-target": "#dlg-new-wish"}, "New Wish")), 
           !user ? null : React.createElement("li", null, React.createElement("button", {type: "button", className: "btn btn-primary", onClick: this.props.onLogout}, "Logout")), 
           !user ? null : React.createElement("li", null, React.createElement("div", {id: "box-user"}, React.createElement("i", {className: "mdi-social-person"}), React.createElement("span", null, user.getUsername())))
          )
        )
      )
    );
  }
});

var RegisterDialog = React.createClass({displayName: "RegisterDialog",
  handleSubmit: function(e) {
    e.preventDefault();
    if (dataService.getUser()) {
      $('#dlg-register').modal('hide');
      return;
    }

    var email = React.findDOMNode(this.refs.email).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    var password_confirm = React.findDOMNode(this.refs.password_confirm).value.trim();
    if (!email || !password || !password_confirm) {
      alert('Neither email or password is allowed to be empty.');
      return;
    }

    if (password != password_confirm) {
      alert('Passwords are not equal.');
      return;
    }

    dataService.register(email, password, function(err, user) {
      if (err || !user) {
        return;
      }

      this.props.onRegister();
    }.bind(this));

    React.findDOMNode(this.refs.email).value = '';
    React.findDOMNode(this.refs.password).value = '';
    React.findDOMNode(this.refs.password_confirm).value = '';

    $('#dlg-register').modal('hide');
  },
  render: function() {
    return (
      React.createElement("div", {className: "modal fade", id: "dlg-register", role: "dialog", "aria-hidden": "true"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("form", {className: "form", onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title"}, "Register")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("label", {className: "control-label"}, "Email"), 
                  React.createElement("input", {type: "email", className: "form-control", placeholder: "Email", ref: "email"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("label", {className: "control-label"}, "Password"), 
                  React.createElement("input", {type: "password", className: "form-control", placeholder: "Password", ref: "password"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("label", {className: "control-label"}, "Password Confirm"), 
                  React.createElement("input", {type: "password", className: "form-control", placeholder: "Password Confirm", ref: "password_confirm"})
                )
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Register")
              )
            )
          )
        )
      )
    );
  }
});

var LoginDialog = React.createClass({displayName: "LoginDialog",
  handleSubmit: function(e) {
    e.preventDefault();
    if (dataService.getUser()) {
      $('#dlg-login').modal('hide');
      return;
    }

    var email = React.findDOMNode(this.refs.email).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if (!email || !password) {
      return;
    }

    dataService.login(email, password, function(err, user) {
      if (err || !user) {
        return;
      }

      this.props.onLogin();

    }.bind(this));

    React.findDOMNode(this.refs.email).value = '';
    React.findDOMNode(this.refs.password).value = '';
    $('#dlg-login').modal('hide');
  },
  render: function() {
    return (
      React.createElement("div", {className: "modal fade", id: "dlg-login", role: "dialog", "aria-hidden": "true"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("form", {className: "form", onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title"}, "Login")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("label", {className: "control-label"}, "Email"), 
                  React.createElement("input", {type: "email", className: "form-control", placeholder: "Email", ref: "email"})
                ), 
                React.createElement("div", {className: "form-group"}, 
                  React.createElement("label", {className: "control-label"}, "Password"), 
                  React.createElement("input", {type: "password", className: "form-control", placeholder: "Password", ref: "password"})
                )
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Login")
              )
            )
          )
        )
      )
    );
  }
});

var NewWishDialog = React.createClass({displayName: "NewWishDialog",
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser()) {
      $('#dlg-new-wish').modal('hide');
      return;
    }

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      alert('Empty description is not allowed');
      return;
    }

    dataService.postNewWishItem({
      author: dataService.getUser(),
      description: description,
    }, function(err, item) {
      if (err) {
        return;
      }

      this.props.onNewWish(item);
    }.bind(this));

    React.findDOMNode(this.refs.description).value = '';
    $('#dlg-new-wish').modal('hide');
  },
  render: function() {
    return (
      React.createElement("div", {className: "modal fade", id: "dlg-new-wish", role: "dialog", "aria-hidden": "true"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("form", {className: "form", onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title"}, "New Wish")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("textarea", {className: "form-control", rows: "10", ref: "description", placeholder: "Enter your wish here"})
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Submit")
              )
            )
          )
        )
      )
    );
  }
});

var EditWishDialog = React.createClass({displayName: "EditWishDialog",
  getInitialState: function() {
    return {
      item: null,
      description: '',
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser() || !this.state.item) {
      $('#dlg-edit-wish').modal('hide');
      return;
    }

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      alert('Empty description is not allowed');
      return;
    }

    dataService.updateWishItem(this.state.item, description, function(err) {
      if (err) {
        return;
      }

      this.props.onEditWish();
    }.bind(this));

    React.findDOMNode(this.refs.description).value = '';
    $('#dlg-edit-wish').modal('hide');
  },
  handleChangeDescription: function(event) {
    this.setState({description: event.target.value});
  },
  render: function() {
    return (
      React.createElement("div", {className: "modal fade", id: "dlg-edit-wish", role: "dialog", "aria-hidden": "true"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("form", {className: "form", onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title"}, "Edit Wish")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("textarea", {className: "form-control", rows: "10", ref: "description", placeholder: "Enter your wish here", value: this.state.description, onChange: this.handleChangeDescription})
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Submit")
              )
            )
          )
        )
      )
    );
  }
});

var DelWishDialog = React.createClass({displayName: "DelWishDialog",
  getInitialState: function() {
    return {
      item: null
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser() || !this.state.item) {
      $('#dlg-del-wish').modal('hide');
      return;
    }

    dataService.deleteWishItem(this.state.item, function(err) {
      if (err) {
        return;
      }

      this.props.onDelWish(this.state.item);
    }.bind(this));

    $('#dlg-del-wish').modal('hide');
  },
  render: function() {
    return (
      React.createElement("div", {className: "modal fade", id: "dlg-del-wish", role: "dialog", "aria-hidden": "true"}, 
        React.createElement("div", {className: "modal-dialog"}, 
          React.createElement("div", {className: "modal-content"}, 
            React.createElement("form", {className: "form", onSubmit: this.handleSubmit}, 
              React.createElement("div", {className: "modal-header"}, 
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                React.createElement("h3", {className: "modal-title"}, "Delete Wish")
              ), 
              React.createElement("div", {className: "modal-body"}, 
                React.createElement("p", null, "Delete this wish?")
              ), 
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
                React.createElement("button", {type: "submit", className: "btn btn-primary"}, "Confirm")
              )
            )
          )
        )
      )
    );
  }
});

var MoreBtn = React.createClass({displayName: "MoreBtn",
  render: function() {
    return (
      React.createElement("button", {type: "button", className: "btn btn-default btn-block btn-raised", onClick: this.props.onGetMore}, "More")
    );
  }
});

var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {
      wishlist: [],
      page: 0,
      hasMore: true,
    }
  },
  componentDidMount: function() {
    $.material.init();
    this.getWishItems();
  },
  getWishItems: function() {
    dataService.getWishItems(this.state.page, function(err, items, hasMore) {
      if (err) { return; }

      if (!items || items.length === 0) {
        this.setState({ hasMore: false });
        return;
      }

      this.setState({
        hasMore: hasMore,
        wishlist: this.state.wishlist.concat(items),
      });
    }.bind(this));
  },
  handleNewWish: function(item) {
    this.setState({ wishlist: [item].concat(this.state.wishlist) });
  },
  handleEditWish: function(item) {
    this.refs.dlg_edit_wish.setState({
      item: item,
      description: item.get('description'),
    });

    var dlg = React.findDOMNode(this.refs.dlg_edit_wish);
    $(dlg).modal('show');
  },
  handleDelWish: function(item) {
    this.refs.dlg_del_wish.setState({ item: item });
    var dlg = React.findDOMNode(this.refs.dlg_del_wish);
    $(dlg).modal('show');
  },
  doDelWish: function(item) {
    var index = this.state.wishlist.indexOf(item);
    if (index > -1) {
      this.state.wishlist.splice(index, 1);
      this.forceUpdate();
    }
  },
  handleGetMore: function() {
    this.setState({ page: this.state.page + 1 }, this.getWishItems);
  },
  handleLogout: function() {
    dataService.logout();
    this.forceUpdate();
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(NavBar, {onLogout: this.handleLogout}), 
        React.createElement("div", {className: "container"}, 
          React.createElement(WishList, {wishlist: this.state.wishlist, onEditWish: this.handleEditWish, onDelWish: this.handleDelWish}), 
           this.state.hasMore ? React.createElement(MoreBtn, {onGetMore: this.handleGetMore}) : null
        ), 
        React.createElement(RegisterDialog, {onRegister: this.forceUpdate.bind(this)}), 
        React.createElement(LoginDialog, {onLogin: this.forceUpdate.bind(this)}), 
        React.createElement(NewWishDialog, {onNewWish: this.handleNewWish}), 
        React.createElement(EditWishDialog, {ref: "dlg_edit_wish", onEditWish: this.forceUpdate.bind(this)}), 
        React.createElement(DelWishDialog, {ref: "dlg_del_wish", onDelWish: this.doDelWish})
      )
    );
  },
});

React.render(React.createElement(App, null), document.getElementById('main'));
