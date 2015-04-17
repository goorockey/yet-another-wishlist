var WishItem = React.createClass({
  getInitialState: function() {
    return {
      voteUpCount: this.props.item.get('voteup'),
      voteUpAlready: false,
    };
  },
  handleVoteUp: function(e) {
    if (!dataService.getUser() || this.state.voteUpAlready) {
      return;
    }

    dataService.voteUpItem(this.props.item.id, function(err, voteUpAlready) {
      if (err) {
        return;
      }

      this.setState({
        voteUpCount: voteUpAlready ? this.state.voteUpCount : this.state.voteUpCount + 1,
        voteUpAlready: true,
      });
    }.bind(this));
  },
  handleEditWish: function() {

  },
  render: function() {
    return (
      <div className="well wish-item row">
        <div className="col-md-1 wish-item-voteup">
          <a href="javascript:void(0)" onClick={this.handleVoteUp}
             className={ "btn btn-flat" + (!dataService.getUser() || this.state.voteUpAlready ? " disabled" : " btn-primary") }>
            <i className="mdi-navigation-arrow-drop-up"></i>
            <p className="text-center">{this.state.voteUpCount}</p>
          </a>
        </div>
        <div className="col-md-9 wish-item-description">
          <p>{this.props.item.get('description')}</p>
        </div>
        <div className="col-md-2 wish-item-metadata">
          <div>
            <i className="mdi-action-today"></i>
            <span className="text-muted">{this.props.item.createdAt.toDateString()}</span>
          </div>
          <div>
            <i className="mdi-social-person"></i>
            <span className="text-muted">{this.props.item.author.getUsername()}</span>
          </div>
          <div>
            <a className="btn btn-flat mdi-content-create btn-edit-wish" onClick={this.handleEditWish}></a>
          </div>
        </div>
      </div>
    );
  },
});

var WishList = React.createClass({
  render: function() {
    var wishItem = this.props.wishlist.map(function(item) {
      return (
        <WishItem key={item.id} item={item} />
      );
    }.bind(this));

    return (
      <div className="wish-list">
        {wishItem}
      </div>
    );
  },
});

var NavBar = React.createClass({
  render: function() {
    var user = dataService.getUser();
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="javascript:void(0)" className="navbar-brand">
              <h3 id="label-brand">Yet Another Wishlist</h3>
            </a>
          </div>
          <ul className="nav navbar-nav navbar-right">
          { user ? null : <li><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-register">Register</button></li> }
          { user ? null : <li><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-login">Login</button></li> }
          { !user ? null : <li><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-new-wish">New Wish</button></li> }
          { !user ? null : <li><button type="button" className="btn btn-primary" onClick={this.props.onLogout}>Logout</button></li> }
          </ul>
        </div>
      </nav>
    );
  }
});

var RegisterDialog = React.createClass({
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
      // TODO: alert
      return;
    }

    if (password != password_confirm) {
      // TODO: alert
      return;
    }

    dataService.register(email, password, function(err, user) {
      if (err || !user) {
        // TODO: alert
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
      <div className="modal fade" id="dlg-register" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Register</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <input type="email" className="form-control" placeholder="Email" ref="email" />
                </div>
                <div className="form-group">
                  <label className="control-label">Password</label>
                  <input type="password" className="form-control" placeholder="Password" ref="password" />
                </div>
                <div className="form-group">
                  <label className="control-label">Password Confirm</label>
                  <input type="password" className="form-control" placeholder="Password Confirm" ref="password_confirm" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var LoginDialog = React.createClass({
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
        // TODO: alert
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
      <div className="modal fade" id="dlg-login" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Login</h3>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="control-label">Email</label>
                  <input type="email" className="form-control" placeholder="Email" ref="email" />
                </div>
                <div className="form-group">
                  <label className="control-label">Password</label>
                  <input type="password" className="form-control" placeholder="Password" ref="password" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var NewWishDialog = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser()) {
      $('#dlg-new-wish').modal('hide');
      return;
    }

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      // TODO: alert
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
      <div className="modal fade" id="dlg-new-wish" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">New Wish</h3>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="10" ref="description" placeholder="Enter your wish here"></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});

var EditWishDialog = React.createClass({
  getInitialState: function() {
    return {
      item: null
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser()) {
      $('#dlg-edit-wish').modal('hide');
      return;
    }

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      // TODO: alert
      return;
    }

    dataService.updateWishItem(this.state.item, 
      description, function(err) {
      if (err) {
        return;
      }

      this.props.onEditWish();

    }.bind(this));

    React.findDOMNode(this.refs.description).value = '';
    $('#dlg-edit-wish').modal('hide');
  },
  render: function() {
    return (
      <div className="modal fade" id="dlg-edit-wish" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Eidt Wish</h3>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="10" ref="description" placeholder="Enter your wish here" value={this.state.item ? this.state.item.get('description') : ''}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
});


var MoreBtn = React.createClass({
  render: function() {
    return (
      <button type="button" className="btn btn-default btn-block btn-raised" onClick={this.props.onGetMore}>More</button>
    );
  }
});

var App = React.createClass({
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
    dataService.getWishItems(this.state.page, function(err, items, sum) {
      if (err) { return; }

      if (!items || items.length === 0) {
        this.setState({ hasMore: false });
        return;
      }

      this.setState({
        hasMore: (this.state.page + 1) * itemPerPage < sum,
        wishlist: this.state.wishlist.concat(items),
      });
    }.bind(this));
  },
  handleNewWish: function(item) {
    this.setState({
      wishlist: [item].concat(this.state.wishlist)
    });
  },
  handleEditWish: function() {
    this.forceUpdate();
  },
  handleGetMore: function() {
    this.setState({ page: this.state.page + 1 }, this.getWishItems);
  },
  handleLogout: function() {
    dataService.logout();
    this.forceUpdate();
  },
  handleRegister: function() {
    this.forceUpdate();
  },
  handleLogin: function() {
    this.forceUpdate();
  },
  render: function() {
    return (
      <div>
        <NavBar onLogout={this.handleLogout} />
        <div className="container">
          <WishList wishlist={this.state.wishlist} />
          { this.state.hasMore ? <MoreBtn onGetMore={this.handleGetMore} /> : null }
        </div>
        <RegisterDialog onRegister={this.handleRegister} />
        <LoginDialog onLogin={this.handleLogin} />
        <NewWishDialog onNewWish={this.handleNewWish} />
        <EditWishDialog onEditWish={this.handleEditWish} />
      </div>
    );
  },
});

React.render(<App />, document.getElementById('main'));
