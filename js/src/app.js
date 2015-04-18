var WishItem = React.createClass({
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
            {
              !isAuthor ? null :
              [ <a key="btn-edit-wish" className="btn btn-flat mdi-content-create btn-edit-wish" onClick={this.props.onEditWish.bind(null, this.props.item)}></a>
              , <a key="btn-del-wish" className="btn btn-flat mdi-content-clear btn-del-wish" onClick={this.props.onDelWish.bind(null, this.props.item)}></a> ]
            }
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
        <WishItem key={item.id} item={item} onEditWish={this.props.onEditWish} onDelWish={this.props.onDelWish}/>
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
          {
            user ?
            [ <li key="btn-new-wish" ><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-new-wish">New Wish</button></li>
            , <li key="btn-logout" ><button type="button" className="btn btn-primary" onClick={this.props.onLogout}>Logout</button></li>
            , <li key="box-user" ><div id="box-user"><i className="mdi-social-person"></i><span>{user.getUsername()}</span></div></li> ] :
            [ <li key="btn-register" ><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-register">Register</button></li>
            , <li key="btn-login" ><button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-login">Login</button></li> ]
          }
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
      description: '',
    };
  },
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser() || !this.props.item) {
      $('#dlg-edit-wish').modal('hide');
      return;
    }

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      alert('Empty description is not allowed');
      return;
    }

    dataService.updateWishItem(this.props.item, description, function(err) {
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
      <div className="modal fade" id="dlg-edit-wish" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Edit Wish</h3>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="10" ref="description" placeholder="Enter your wish here" value={this.state.description} onChange={this.handleChangeDescription}></textarea>
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

var DelWishDialog = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    if (!dataService.getUser() || !this.props.item) {
      $('#dlg-del-wish').modal('hide');
      return;
    }

    dataService.deleteWishItem(this.props.item, function(err) {
      if (err) {
        return;
      }

      this.props.onDelWish(this.props.item);
    }.bind(this));

    $('#dlg-del-wish').modal('hide');
  },
  render: function() {
    return (
      <div className="modal fade" id="dlg-del-wish" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">Delete Wish</h3>
              </div>
              <div className="modal-body">
                <p>Delete this wish?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Confirm</button>
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
      targetItem: null,
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
    this.setState({ targetItem: item });

    this.refs.dlg_edit_wish.setState({
      description: item.get('description'),
    });

    var dlg = React.findDOMNode(this.refs.dlg_edit_wish);
    $(dlg).modal('show');
  },
  afterEditWish: function() {
    this.setState({ targetItem: null });
  },
  handleDelWish: function(item) {
    this.setState({ targetItem: item });

    var dlg = React.findDOMNode(this.refs.dlg_del_wish);
    $(dlg).modal('show');
  },
  afterDelWish: function() {
    var index = this.state.wishlist.indexOf(this.state.targetItem);
    if (index > -1) {
      this.state.wishlist.splice(index, 1);
      this.forceUpdate();
    }
    this.setState({ targetItem: null });
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
      <div>
        <NavBar onLogout={this.handleLogout} />
        <div className="container">
          <WishList wishlist={this.state.wishlist} onEditWish={this.handleEditWish} onDelWish={this.handleDelWish} />
          { this.state.hasMore ? <MoreBtn onGetMore={this.handleGetMore} /> : null }
        </div>
        <RegisterDialog onRegister={this.forceUpdate.bind(this)} />
        <LoginDialog onLogin={this.forceUpdate.bind(this)} />
        <NewWishDialog onNewWish={this.handleNewWish} />
        <EditWishDialog ref="dlg_edit_wish" onEditWish={this.afterEditWish} item={this.state.targetItem} />
        <DelWishDialog ref="dlg_del_wish" onDelWish={this.afterDelWish} item={this.state.targetItem} />
      </div>
    );
  },
});

React.render(<App />, document.getElementById('main'));
