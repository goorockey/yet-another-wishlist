var WishItem = React.createClass({
  render: function() {
    return (
      <div className="well wish-item">
        <div className="pull-right">
          <div>
            <i className="mdi-action-today"></i>
            <span className="text-muted">{this.props.item.createdAt.toDateString()}</span>
          </div>
          <div>
            <i className="mdi-social-person"></i>
            <span className="text-muted">author</span>
          </div>
        </div>
        <a href="#">
          <p className="wish-item-description">{this.props.item.get('description')}</p>
        </a>
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
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a href="#" className="navbar-brand">
              <h1>Yet Another Wishlist</h1>
            </a>
          </div>
          <div className="nav navbar-nav navbar-right">
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#dlg-new-wish">New Wish</button>
          </div>
        </div>
      </nav>
    );
  }
});

var NewWishDialog = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var description = React.findDOMNode(this.refs.description).value.trim();
    if (!description) {
      return;
    }

    dataService.postNewWishItem({description: description}, function(err, item) {
      if (err) {
        // TODO: show error toast
        console.log('error');
        return;
      }

      this.props.onNewWish(item);
    }.bind(this));

    React.findDOMNode(this.refs.description).value = '';
    return;
  },
  render: function() {
    return (
      <div className="modal fade" id="dlg-new-wish" role="dialog" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className="form-horizontal" method="POST" action="#" onSubmit={this.handleSubmit}>
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h3 className="modal-title">New Wish</h3>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="10" ref="description" placeholder="Enter your wish"></textarea>
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
    dataService.getWishItems(this.state.page, function(err, items) {
      if (err) { return; }

      if (!items || items.length === 0) {
        this.setState({ hasMore: false });
        return;
      }

      this.setState({
        wishlist: this.state.wishlist.concat(items)
      });
    }.bind(this));
  },
  handleNewWish: function(item) {
    this.setState({
      wishlist: [item].concat(this.state.wishlist)
    });
  },
  handleGetMore: function() {
    this.setState({ page: this.state.page + 1 }, this.getWishItems);
  },
  render: function() {
    return (
      <div>
        <NavBar />
        <div className="container">
          <WishList wishlist={this.state.wishlist} />
          { this.state.hasMore ? <MoreBtn onGetMore={this.handleGetMore} /> : null }
        </div>
        <NewWishDialog onNewWish={this.handleNewWish} />
      </div>
    );
  },
});

React.render(<App />, document.getElementById('main'));
